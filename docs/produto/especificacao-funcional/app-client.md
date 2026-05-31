# App Cliente (mobile B2C)

> Escopo: compra, carteira, facial, promoter | Público: `CLIENT`, `PROMOTER` | Plataforma: Expo `app-client/` | Última revisão: 2026-05-27

## Legenda de status

| Tag | Significado |
| --- | --- |
| `[IMPLEMENTADO]` | Entregue e utilizável em produção ou demo estável |
| `[PARCIAL]` | Fluxo existe com lacunas (inclui UI «em breve») |
| `[PENDENTE]` | Não implementado ou apenas planejado |

Fonte de status: código (`app-producer`, `producer-web`, `app-client`, `client-web`, `backend`) + `docs/RBAC.md` + revisão 2026-05-19.


## 1. Visão geral

Aplicativo mobile do comprador final: descoberta, checkout, pagamento, carteira de ingressos, cadastro facial e área do promoter. API canônica: **`/api/client/v1`**.

## 2. Autenticação e acesso

| Fluxo | Status | Regras |
| --- | --- | --- |
| Cadastro / login B2C | [IMPLEMENTADO] | Better Auth; papel base `CLIENT` |
| Compliance gate (HU06) | [IMPLEMENTADO] | Busca documentos dinâmicos e bloqueia rotas autenticadas até aceitar documentos globais pendentes |
| Promoter | [IMPLEMENTADO] | `CLIENT` + membership `PROMOTER`; rotas `/promoter` |

Ver [checkout-compliance.md](../regras-negocio/checkout-compliance.md).

## 3. Módulos / funcionalidades

### 3.1 Descoberta e vitrine — [IMPLEMENTADO]

- Feed, busca e detalhe de evento
- Seleção de lotes com regras de janela de venda
- MUST: vitrine não exige login de produtor
- Feed híbrido público/autenticado: ver [feed-descoberta-client.md](../regras-negocio/feed-descoberta-client.md)

### 3.2 Checkout e pagamento — [PARCIAL]

| Regra | Detalhe |
| --- | --- |
| Reserva | **10 minutos** por pedido |
| Tentativas | Máx. **3** por pedido (cartão) |
| Emissão | Ingresso só após **`PAID`**; `qrCodeHash` UUID na emissão |
| Taxa | **10%** do preço do lote (conveniência ao comprador) |
| Pix | **5%** de desconto sobre a taxa |
| Cartão | Até **4x**; token no cliente (`card_token`) |
| PSP | `PAYMENT_PROVIDER` — Pagar.me (default) ou Stripe |
| Flag demo | `PAYMENTS_ENABLED=false` → UI «Vendas em breve» (sem captura real) |
| Política de Reembolso | Checkbox/gate dinâmico de `REFUND_POLICY` por sessão; Pix/cartão/cortesia bloqueiam sem aceite |

Detalhe técnico: [engenharia/arquitetura/payments/especificacao.md](../../engenharia/arquitetura/payments/especificacao.md).

### 3.3 Carteira, facial e cancelamento — [IMPLEMENTADO]

- Meus ingressos exibem QR quando o modo de entrada permite. O payload do QR é dinâmico/assinado e resolve para o ingresso; o identificador estático interno continua sendo **`qrCodeHash`** (não número TKT)
- Cadastro facial (`FACIAL_ENROLLMENT_V2`, `PULSE_FACE_EXTRACT`); CTA pós-compra se `entryMode` for `BIOMETRY_OPTIONAL` ou `BIOMETRY_ONLY`
- Pós-compra multi-ingresso facial: informar que 1 ingresso fica pronto para o comprador e os demais precisam ser transferidos aos convidados para cadastro facial próprio
- Detalhe do ingresso: `BIOMETRY_ONLY` não mostra QR; `BIOMETRY_OPTIONAL` oculta/bloqueia QR de ingresso extra pendente de transferência; `QR_ONLY` não força transferência por biometria
- Cancelamento: até **24h antes** do início; ticket não `USED` (`GetCancelEligibilityUseCase`)
- Alinhar copy de UI se ainda citar 48h

### 3.4 Área Promoter — [IMPLEMENTADO]

- Rotas `/promoter`: vendas e comissões
- MUST: Dono/Gestor convidam promoter com conta CLIENT existente ([RBAC.md](../RBAC.md))
- Promoter **não** acessa App Produtor nem Producer Web

### 3.5 VIP / Membership — [PENDENTE]

- VIP de lote (`isVip` no batch): [IMPLEMENTADO] no comercial
- Programa de assinatura recorrente: [PENDENTE] — ver [membership-vip.md](../../backlog/membership-vip.md)

## 4. Permissões (RBAC nesta plataforma)

| Capacidade | CLIENT | Promoter |
| --- | --- | --- |
| Comprar / checkout | ✅ | ✅ |
| Carteira / facial | ✅ | ✅ |
| Comissões `/promoter` | ❌ | ✅ |
| Painel produtor | ❌ | ❌ |

## 5. Integrações e dependências

- Backend `/api/client/v1/*`, espelho legado raiz
- Documentos legais dinâmicos via `/api/client/v1/compliance/*` e aceite de reembolso via `/api/client/v1/checkout/:id/refund-policy/accept`
- Pagar.me quando `PAYMENTS_ENABLED=true`
- pulse-face para biometria
- Regras globais: [global-business-rules.md](../regras-negocio/global-business-rules.md)

## 6. Backlog / pendências

| Item | Status |
| --- | --- |
| Pagamentos reais em produção | [PARCIAL] — flag |
| Membership recorrente | [PENDENTE] |
| Paridade copy cancelamento 24h | [PARCIAL] |

## 7. Referências cruzadas

- [client-web.md](./client-web.md) — vitrine web; checkout web [PENDENTE]
- [app-produtor.md](./app-produtor.md) — emissão manual e Access
- Mapa B2C:

| Módulo | Regra-chave | Produtor App | Producer Web | Client App | Client Web |
| --- | --- | --- | --- | --- | --- |
| Eventos (vitrine) | Status e janela de venda | — | — | [IMPLEMENTADO] | [IMPLEMENTADO] |
| Setores e lotes | Máx. 4 ingressos/evento/CPF | — | [IMPLEMENTADO] | [IMPLEMENTADO] | [IMPLEMENTADO] seleção |
| Checkout | Reserva 10 min, 3 tentativas | — | — | [PARCIAL] flag pagamento | [PENDENTE] |
| Pagamentos | Pix 5% desconto taxa; cartão 4x | — | — | [PARCIAL] | [PENDENTE] |
| Ingressos / carteira | Só após PAID | — | — | [IMPLEMENTADO] | [PENDENTE] |
| Facial | Modo obrigatório: QR-only, facial+QR ou facial-only | [IMPLEMENTADO] Access | [PENDENTE] | [IMPLEMENTADO] | [PENDENTE] |
| Cancelamento | 24h antes; sem pós-USD | — | — | [IMPLEMENTADO] | [PENDENTE] |
| Financeiro produtor | Retenção D+1 pós término* | — | [PARCIAL] | — | — |
| VIP assinatura | Plano recorrente | [PENDENTE] | [PARCIAL] stub | [PARCIAL] mock | — |
| Promoter | Comissões no app cliente | — | [IMPLEMENTADO] convite | [IMPLEMENTADO] | — |
