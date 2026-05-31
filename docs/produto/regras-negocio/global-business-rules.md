# Regras de negócio globais (Core)

Decisões de negócio transversais ao ecossistema Pulse. Em conflito com requisito pontual, **estas regras prevalecem** — salvo quando o código documentado em [especificacao-funcional](../especificacao-funcional/README.md) ou [engenharia/arquitetura/payments](../../engenharia/arquitetura/payments/especificacao.md) reflete comportamento já entregue (nesse caso, o código + doc técnica são canônicos).

**Última revisão:** 2026-05-20

---

## 1. Objetivo do produto (North Star)

- Descoberta de eventos e compra simples
- Checkout confiável (estoque, antifraude, Pix/cartão)
- Retenção do valor do produtor até elegibilidade de repasse ([payout-policies.md](./payout-policies.md))
- Ingresso digital (QR dinâmico via `qrCodeHash`) e acesso facial
- Operação de check-in ágil; painéis financeiros transparentes
- Fidelização VIP / membership — [PENDENTE](../../backlog/membership-vip.md)

---

## 2. Regras invioláveis (implementadas no backend)

### Taxas e pagamento

| Regra | Detalhe | Código |
| :--- | :--- | :--- |
| Taxa repassada ao comprador | Conveniência na sessão de checkout | `InitializeCheckoutUseCase` (`unitFee` por item) |
| Taxa atual | **10%** do preço do lote por ingresso (`unitPrice * 0.1`) | `InitializeCheckoutUseCase` — *doc antigo citava 6,9%; alinhar produto antes de mudar* |
| Desconto Pix | **5%** sobre a taxa de conveniência (não sobre o ingresso) | `CalculateCheckoutUseCase` |
| Parcelamento | Até **4x** no cartão | `PaymentController`, `ProcessCardPaymentUseCase` |
| Tentativas cartão | Máx. **3** por pedido/sessão | `MAX_CARD_PAYMENT_ATTEMPTS` |
| Reserva checkout | **10 minutos** | `expiresAt` em `InitializeCheckoutUseCase` |
| Política de Reembolso | Aceite obrigatório por sessão antes de Pix/cartão/cortesia | `RefundPolicyAcceptance` |
| Multi-PSP | `PAYMENT_PROVIDER=pagarme\|stripe` (default `pagarme`) | `paymentProvider.ts`, gateways |

### Ingressos e limites

| Regra | Detalhe |
| :--- | :--- |
| Limite por pessoa | Máx. **4 ingressos por evento** por CPF/conta |
| Emissão | Somente após transação **`PAID`** (`ConfirmPaymentUseCase`) |
| Modo de entrada | Obrigatório na criação/configuração do evento: `QR_ONLY`, `BIOMETRY_OPTIONAL` ou `BIOMETRY_ONLY` |
| QR | Identificador operacional estático = **`qrCodeHash`** (UUID), não número TKT; o app pode exibir payload QR dinâmico assinado apontando para o ingresso |
| Transferência | Uma transferência por ingresso (anti-cambismo) |
| Cortesias | Valor cheio + desconto 100% auditável |

### Cancelamentos

| Regra | Detalhe |
| :--- | :--- |
| Comprador | Até **24h antes** do início; ingresso não `USED` |
| Pós-uso | Sem reembolso após check-in |
| Produtor cancela evento | Estorno obrigatório aos compradores — ver [payout-policies.md](./payout-policies.md) |

### Repasse produtor

| Regra | Detalhe |
| :--- | :--- |
| Retenção | `RETAINED` após venda paga |
| Liberação automática | **D+1** (24h após término do evento) — **sem** regra de 10 check-ins no código |
| Publicação | Bloqueada até **KYC_APPROVED** do titular (`ChangeProducerEventStatusUseCase`) |

### Acesso

| Regra | Detalhe |
| :--- | :--- |
| Facial vs QR | `QR_ONLY`: QR normal; `BIOMETRY_OPTIONAL`: facial com QR fallback; `BIOMETRY_ONLY`: sem QR de acesso |
| Múltiplos ingressos faciais | Em compra com mais de um ingresso facial, só 1 ingresso fica pronto para o comprador. Extras ficam pendentes de transferência para cada convidado cadastrar/usar facial na própria conta |
| QR de extras faciais | Em `BIOMETRY_OPTIONAL`, QR dos extras pendentes fica oculto/bloqueado até transferência. Em `BIOMETRY_ONLY`, não há QR |
| Check-in manual | Exige **`cpfLast3`** do titular |

---

## 3. Checklist para PRs (seção histórica §18)

1. Ingresso só após `PAID`
2. Pedido expira em 10 min; estoque devolvido
3. Máx. 4 ingressos/evento/CPF
4. Máx. 3 tentativas de cartão
5. Desconto Pix sobre a taxa
6. Cartão até 4x
7. Aceite de `REFUND_POLICY` por sessão antes de concluir checkout
8. Ingresso `USED` não cancela
9. Cancelamento comprador até 24h antes
10. Repasse: ver [payout-policies.md](./payout-policies.md) (job D+1)
11. Evento cancelado → estorno compradores
12. Cortesia com trilha de valor cheio
13. Modo de entrada obrigatório; facial pode ser opcional com QR, obrigatório sem QR ou inexistente em QR-only
14. Painel financeiro: retido / disponível / repassado

---

## Referências

- [especificacao-funcional/README.md](../especificacao-funcional/README.md)
- [checkout-compliance.md](./checkout-compliance.md)
- [kyc-blocking-matrix.md](./kyc-blocking-matrix.md)
- [engenharia/arquitetura/payments/especificacao.md](../../engenharia/arquitetura/payments/especificacao.md)
