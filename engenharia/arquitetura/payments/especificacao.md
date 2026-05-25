# Pagamentos Pulse! — Especificação Técnica (v1.0)

> Definições técnicas de checkout, gateway, custódia e repasse. Complementa [checkout-flows.md](./checkout-flows.md), [payout-policies.md](../../produto/regras-negocio/payout-policies.md) e [global-business-rules.md](../../produto/regras-negocio/global-business-rules.md).

**Última atualização:** 2026-05-20

---

## 1. Decisão de gateway (multi-PSP)

| Item | Decisão |
|------|---------|
| **Provedor default** | **Pagar.me API v5** — produção BR; manter como padrão |
| **Provedor alternativo** | **Stripe** — feature flag `PAYMENT_PROVIDER=stripe` (Payment Intents Pix/cartão) |
| **Seleção** | `PAYMENT_PROVIDER=pagarme\|stripe` (default `pagarme`) em `paymentProvider.ts` |
| **DX** | Integração Stripe via MCP/ferramentas de dev é **somente DX**; não substitui obrigatoriamente Pagar.me em prod |
| **Pagar.me** | Base URL `https://api.pagar.me/core/v5` — pedidos (`POST /orders`) |
| **Stripe** | SDK oficial `stripe` — Pix BR via Payment Intent + webhook dedicado |

---

## 2. Arquitetura no backend

Padrão **Dependency Inversion**: domínio expõe contrato; infraestrutura implementa; **factory única** no provider.

| Camada | Arquivo | Papel |
|--------|---------|------|
| Contrato | `backend/src/domain/gateways/IPaymentGateway.ts` | `createPixPayment`, `createCreditCardPayment`, `refundPayment` |
| Implementação | `PagarmeGateway.ts` / `StripeGateway.ts` | PSP concreto + métricas em `GatewayHealthStore` |
| Config | `shared/config/paymentProvider.ts` | `getPaymentProvider()`, segredos Stripe |
| Provider | `PaymentProvider.ts` | `resolvePaymentGateway()` → export `paymentGateway` |

Use cases de pagamento recebem `IPaymentGateway` por construtor (ex.: `ProcessPixPaymentUseCase`, `ProcessCardPaymentUseCase`, `ProcessAdminRefundUseCase`).

**Troca de PSP:** variável `PAYMENT_PROVIDER` + chaves do provedor; webhooks **separados** por PSP (`/webhooks/pagarme`, `/webhooks/stripe`).

---

## 3. Fases de custódia e repasse

### Fase 1 — Implementado (MVP)

- Cobrança na **conta Pulse** (Pagar.me da plataforma).
- **Ledger interno:** valores do produtor refletidos em tickets/sessões e em `Event.payoutStatus`.
- Ciclo de status do evento (financeiro):

| Status | Significado | Gatilho atual no código |
|--------|-------------|-------------------------|
| `RETAINED` | Saldo retido após venda paga | Default em `Event` após emissão |
| `AVAILABLE` | Elegível a repasse | Job `ReleaseRetainedPayoutsUseCase` — **D+1** após término do evento (`getPayoutEligibleAt`) |
| `PAID_OUT` | Repasse concluído | Fluxos admin/financeiro (fora do job automático) |
| `CANCELLED` | Evento cancelado / saldo zerado | Cancelamento de evento |

- Job: `backend/src/index.ts` → `ReleaseRetainedPayoutsUseCase` (intervalo configurável; ver [job-repasse.md](../job-repasse.md)).
- **Não depende de check-in** (regra legada «10 check-ins» documentada em [payout-policies.md §5](../../produto/regras-negocio/payout-policies.md#5-legado-pré-spec-v10--não-implementado)).

### Fase 2 — Roadmap (não implementado)

- Cadastro de **recebedores** Pagar.me por produtor.
- **Split** de pagamento no gateway (repasse automático conforme regras).
- Reduz dependência de custódia centralizada na conta Pulse.

---

## 4. Checkout (Issue #4 / regras invioláveis)

| Regra | Valor | Onde |
|-------|-------|------|
| Reserva de estoque | **10 minutos** | `InitializeCheckoutUseCase` (`expiresAt = now + 10min`) |
| Tentativas cartão | **3** por sessão | `MAX_CARD_PAYMENT_ATTEMPTS` em `ProcessCardPaymentUseCase.ts` |
| Emissão de ingresso | Somente após **`Transaction` = `PAID`** | `ConfirmPaymentUseCase` |
| Flag apps (demo) | `EXPO_PUBLIC_PAYMENTS_ENABLED=false` | `app-client/src/shared/config/flags.ts` — UI “Vendas em breve”; alinhar com backend |

Fluxos detalhados: [checkout-flows.md](./checkout-flows.md).

### Pix

- Desconto **5% sobre a taxa de conveniência** (não sobre o ingresso): `CalculateCheckoutUseCase` (`feeTotalValue * 0.05`).

### Cartão

- Parcelamento: **até 4x** — `PaymentController` (`maximum: 4`) e `ProcessCardPaymentUseCase`.
- Backend recebe **`card_token`** (tokenização no cliente); não persiste PAN.

### Taxa de conveniência (comprador)

| Contexto | Comportamento |
|----------|----------------|
| **Implementado** | `InitializeCheckoutUseCase` — taxa = **`unitPrice * 0.1` (10%)** por ingresso, gravada em `CheckoutItem.unitFee` |
| **Roadmap** | Centralizar em helper com **6,9% + mín. R$ 2,49** (ainda não no código) |
| **Admin / extrato** | `Producer.pulseFeeBps` (default 1000 bps) permanece separado do checkout do comprador |

`CheckoutItem.unitFee` é gravado na sessão; totais recalculados em `CalculateCheckoutUseCase`.

---

## 5. Webhooks

Ambos respeitam `PAYMENTS_ENABLED` (503 se desabilitado).

### Pagar.me

| Item | Detalhe |
|------|---------|
| **Endpoint** | `POST /webhooks/pagarme` |
| **Assinatura** | `X-Hub-Signature` — HMAC-SHA1 (`PAGARME_WEBHOOK_SECRET` ou fallback `PAGARME_SECRET_KEY`) |
| **Eventos** | `order.paid`, `charge.paid` → confirmação; `charge.refunded` → `REFUNDED`; falhas → `FAILED` |
| **Dev local** | `PAGARME_MOCK_PIX_AUTO_CONFIRM=true` — auto-confirma Pix após 7s no polling |

`PagarmeWebhookController`, `ProcessPagarmeWebhookUseCase`, `verifyPagarmeWebhookSignature`.

### Stripe

| Item | Detalhe |
|------|---------|
| **Endpoint** | `POST /webhooks/stripe` |
| **Assinatura** | `Stripe-Signature` — `stripe.webhooks.constructEvent` + `STRIPE_WEBHOOK_SECRET` |
| **Eventos** | `payment_intent.succeeded` → confirmação; `charge.refunded` → `REFUNDED`; `payment_intent.payment_failed` / `canceled` → `FAILED` |
| **External id** | `Transaction.externalId` = `payment_intent.id` (`pi_…`) |

`StripeWebhookController`, `ProcessStripeWebhookUseCase`, `constructStripeWebhookEvent`.

**Idempotência (ambos):** `ConfirmPaymentUseCase` retorna `alreadyCompleted` se sessão já `COMPLETED`.

---

## 6. Variáveis de ambiente

| Variável | Obrigatório | Uso |
|----------|-------------|-----|
| `PAYMENT_PROVIDER` | Não (default `pagarme`) | `pagarme` \| `stripe` — factory em `PaymentProvider.ts` |
| `PAGARME_SECRET_KEY` | Prod Pagarme | Auth Basic em `PagarmeGateway` |
| `PAGARME_WEBHOOK_SECRET` | Prod (recomendado) | HMAC webhook Pagar.me |
| `STRIPE_SECRET_KEY` | Prod Stripe | SDK Stripe; omitir/`sk_test_mock` = modo mock |
| `STRIPE_WEBHOOK_SECRET` | Prod Stripe (recomendado) | `whsec_…` do dashboard Stripe |
| `STRIPE_PUBLISHABLE_KEY` / `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | App (cartão Stripe) | Tokenização no cliente; não usada no backend de captura |
| `PAYMENTS_ENABLED` | Backend + apps | `false` (default): `/payment/*` e webhooks retornam 503 |
| `PAGARME_MOCK_PIX_AUTO_CONFIRM` | Dev local apenas | `true` = mock 7s no polling (Pagar.me) |
| `ENABLE_PAYOUT_RELEASE_JOB` | Opcional | `"false"` desliga job RETAINED→AVAILABLE |
| `PAYOUT_RELEASE_JOB_INTERVAL_MS` | Opcional | Default 1h |

Referência: `backend/.env.example`, `paymentFlags.ts`, `paymentProvider.ts`.

### Ambientes (go-live gradual)

| Ambiente | `PAYMENTS_ENABLED` | Chaves | Webhook |
|----------|-------------------|--------|---------|
| **Local** | `false` ou `true` + mock | Pagarme: omitir key = mock. Stripe: `PAYMENT_PROVIDER=stripe` + omitir `STRIPE_SECRET_KEY` = mock | ngrok → `/webhooks/pagarme` ou `/webhooks/stripe`; `PAGARME_MOCK_PIX_AUTO_CONFIRM` só com Pagarme |
| **Staging** | `true` | Sandbox do PSP ativo (`PAYMENT_PROVIDER`) | Webhook URL + secret do PSP no dashboard |
| **Produção** | `true` | Chaves **live** do PSP escolhido | Webhook prod; **nunca** mock auto-confirm Pix |

App cliente: rebuild com `EXPO_PUBLIC_PAYMENTS_ENABLED=true` ou consumir `GET /api/client/v1/config` (`paymentsEnabled`, `paymentProvider`, `stripePublishableKey`).

---

## 7. Modelo de dados (Prisma)

### `CheckoutSession`

- `expiresAt`, `status` (`PENDING` | `COMPLETED` | `EXPIRED` | `FAILED`)
- `paymentAttempts` / contagem real em `Transaction.attemptsCount` (cartão)
- Campos financeiros: `subtotal`, `feeTotal`, `discountPix`, `installmentFee`, `total`, `paymentMethod`

### `CheckoutItem`

- `unitPrice`, `unitFee` (taxa por unidade na reserva)

### `Transaction`

- `externalId` (pedido Pagar.me), `status` (`PaymentStatus`)
- Pix: `pixQrCode`, `pixCopyPaste`
- Cartão: `attemptsCount`, `lastError`

### `Event`

- `payoutStatus`, `payoutReleasedAt`, `payoutBlocked`, `payoutBlockedAt`, `payoutBlockedReason`

### `Producer` (User produtor)

- `pulseFeeBps` — taxa Pulse em basis points (default **1000** = 10%); usada em extratos/admin, não substitui ainda o `unitFee` do checkout MVP

---

## 8. Operações admin e estornos

| Capacidade | Use case / notas |
|------------|------------------|
| Estorno admin | `ProcessAdminRefundUseCase` — gateway `refundPayment` + invalidação de tickets |
| Congelar repasse | `FreezeEventPayoutUseCase` — `payoutBlocked=true`; job de liberação ignora evento |
| Liberação automática | `ReleaseRetainedPayoutsUseCase` — RETAINED→AVAILABLE se não bloqueado e D+1 elegível |

---

## 9. Setup Stripe (local + Railway)

Configuração feita no workspace Pulse com **Stripe MCP** (Cursor) + **Stripe CLI** (Homebrew). O MCP **não expõe** `sk_test_` / `pk_test_` — só operações API e link do dashboard.

### 9.1 Conta (MCP)

| Item | Valor |
|------|--------|
| Account ID | `acct_1TZ0LpJPQGP7adRH` |
| Display name | Área restrita de Jota V |
| API keys (dashboard) | https://dashboard.stripe.com/acct_1TZ0LpJPQGP7adRH/apikeys |

Tools MCP úteis: `get_stripe_account_info`, `stripe_api_execute` (+ `stripe_api_search` / `stripe_api_details`). **Não há** tool para criar webhook endpoint na API exposta pelo MCP; use CLI ou dashboard.

### 9.2 Backend local (`backend/.env`)

Já aplicado (não commitar):

```env
PAYMENT_PROVIDER=stripe
PAYMENTS_ENABLED=true
# STRIPE_SECRET_KEY=sk_test_...      # dashboard → Secret key (test)
# STRIPE_PUBLISHABLE_KEY=pk_test_... # dashboard → Publishable key (test)
# STRIPE_WEBHOOK_SECRET=whsec_...    # ver § 9.3
```

- **PORT** no `.env` do projeto: `3333` → webhook local: `http://localhost:3333/webhooks/stripe` (não 3000, salvo se alterar `PORT`).
- Sem `STRIPE_SECRET_KEY` (ou vazio): `StripeGateway` em **modo mock** (Pix/cartão simulados) — útil para testes unitários e smoke sem sandbox.
- Com chave real: Pix BR via Payment Intent (`payment_method_types: ["pix"]`).

### 9.3 Webhook — desenvolvimento local (recomendado: Stripe CLI)

1. Instalar CLI (macOS): `brew install stripe/stripe-cli/stripe`
2. Login (abre browser): `stripe login`
3. Em um terminal, backend: `cd backend && bun run dev`
4. Em outro terminal, encaminhar eventos (ajuste a porta do seu `PORT`):

```bash
stripe listen \
  --events payment_intent.succeeded,payment_intent.payment_failed,charge.refunded \
  --forward-to localhost:3333/webhooks/stripe \
  --print-secret
```

5. Copiar o `whsec_…` exibido para `STRIPE_WEBHOOK_SECRET` no `backend/.env` e reiniciar o backend.

Teste rápido (com listen ativo):

```bash
stripe trigger payment_intent.succeeded
```

**Alternativa (staging/prod):** Developers → Webhooks no dashboard — URL pública `https://<host>/webhooks/stripe`, mesmos eventos, secret `whsec_…` no Railway.

### 9.4 App cliente (`app-client/.env`)

```env
EXPO_PUBLIC_PAYMENTS_ENABLED=true
# EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

`FLAGS.PAYMENTS_ENABLED` lê `EXPO_PUBLIC_PAYMENTS_ENABLED` em `app-client/src/shared/config/flags.ts`. Rebuild/restart Expo após mudar env.

### 9.5 Railway / produção (manual)

| Variável | Valor |
|----------|--------|
| `PAYMENT_PROVIDER` | `stripe` |
| `PAYMENTS_ENABLED` | `true` |
| `STRIPE_SECRET_KEY` | `sk_live_…` ou `sk_test_…` (sandbox) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` do endpoint **prod** |
| `STRIPE_PUBLISHABLE_KEY` | opcional no backend; app usa `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` no EAS |

Webhook produção: `POST https://<backend-railway>/webhooks/stripe` — eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`.

### 9.6 Validação

```bash
cd backend && bun test tests/unit/infrastructure/gateways/StripeGateway.test.ts tests/unit/infrastructure/PaymentProvider.test.ts
```

---

## 10. Próximos passos de implementação

1. ~~Webhook Pagar.me + idempotência + flag mock Pix~~ (feito).
2. **Taxa 6,9% / mín. R$ 2,49** — substituir `unitPrice * 0.1` em `InitializeCheckoutUseCase` quando produto confirmar.
3. Homologação E2E com chaves sandbox Pagar.me (credenciais do time).
4. Aplicar `shouldBlockPayoutUntilKycApproved` nos fluxos de saque (helper já existe).
5. **Fase 2:** recebedores + split Pagar.me (#10).

---

## 11. Referências cruzadas

| Documento | Conteúdo |
|-----------|----------|
| [checkout-flows.md](./checkout-flows.md) | Fluxos Pix, cartão, falha, expiração, cancelamento |
| [payout-policies.md](../../produto/regras-negocio/payout-policies.md) | Cancelamento, check-in, repasse (canônico + legado) |
| [global-business-rules.md](../../produto/regras-negocio/global-business-rules.md) | Regras invioláveis transversais |
| [app-produtor.md](../../produto/especificacao-funcional/app-produtor.md) | Financeiro e Access |
| [job-repasse.md](../job-repasse.md) | Job RETAINED→AVAILABLE |
| [checkout-compliance.md](../../produto/regras-negocio/checkout-compliance.md) | Gate HU06 termos |

---

*Mantido pelo time de produto/engenharia. Alterações de gateway ou custódia exigem ADR ou revisão deste arquivo.*
