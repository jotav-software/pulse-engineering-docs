# Estornos — Parte 3: execução e efeitos

**Status execução:** [IMPLEMENTADO] · **Antifraude auto-freeze:** [PARCIAL]

```mermaid
flowchart TD
  A[POST /refunds — ProcessAdminRefundUseCase] --> B[claimRefundSlot PROCESSING]
  B --> C[gateway.refundPayment Pagar.me]
  C -->|Falha| D[status FAILED]
  C -->|OK| E[finalizeRefund transação DB]

  E --> F[Tickets REFUNDED + estoque lote]
  E --> G[Transação PAID → REFUNDED]
  E --> H[CheckoutSession REFUNDED]
  E --> I[producerPayoutMovement ADJUSTMENT negativo]
  E --> J[reversePromoterCommissionsForTickets]
  E --> K[AuditLogger ADMIN_GATEWAY_REFUND]

  L[Antifraude planejado] --> M{≥3 estornos CHARGEBACK_PREVENTIVO / 7d?}
  M -->|Sim| N[Auto-freeze repasse do evento]
  M -.->|Gatilho automático| O[[PARCIAL — não no ProcessAdminRefund atual]]

  style O fill:#ff9,stroke:#333
```

**Efeitos de negócio**

- Estorno admin é **irreversível** no gateway; QR dos ingressos invalidados (`REFUNDED-{id}-...`).
- KPI chargeback na tela financeiro usa stats agregados (proxy 30d), não disputas do gateway.

**Referências**

- `ProcessAdminRefundUseCase.ts`, motivos em `adminRefund.ts`
- Congelamento manual: [financeiro-repasse](../financeiro-repasse/)
