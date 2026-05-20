# Financeiro repasse — Parte 3: persistência e efeitos

**Status:** [IMPLEMENTADO] · `FreezeEventPayoutUseCase`, `UnfreezeEventPayoutUseCase`.

```mermaid
flowchart TD
  A[POST /payouts/events/:eventId/freeze] --> B[Evento payoutBlocked = true]
  B --> C[payoutBlockedReason persistido]
  C --> D[AuditLogger + systemLog]
  D --> E[Portal produtor: saque bloqueado<br/>PAYOUT_FROZEN_FORBIDDEN_MESSAGE]

  F[POST unfreeze] --> G[payoutBlocked = false]
  G --> H[Motivo de bloqueio limpo]

  I[GET /payouts/export] --> J[CSV pulse-admin-repasses.csv<br/>Content-Disposition]

  K[Job D+1 ReleaseRetainedPayouts] --> L[Repasse AVAILABLE após término<br/>se não congelado]
  B -.->|bloqueia| L
```

**Integrações**

- Bloqueio de estorno em evento congelado: validação em `ValidateAdminRefundUseCase` (ver [estornos](../estornos/)).
- Antifraude auto-freeze por chargeback: [PARCIAL] — documentado em pulse-admin; threshold no código ainda sem gatilho automático pós-estorno.

**Referências**

- `freeze-payout-modal.tsx`, `admin.service.exportFinanceExtract`
