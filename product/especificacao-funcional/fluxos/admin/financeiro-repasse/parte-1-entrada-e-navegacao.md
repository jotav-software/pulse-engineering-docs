# Financeiro repasse — Parte 1: entrada e navegação

**Status:** [IMPLEMENTADO] · `financeiro-view.tsx`, `payouts-table.tsx`.

```mermaid
flowchart TD
  A[Sessão admin] --> B[Sidebar: Financeiro & Repasses]
  B --> C[/admin/financeiro<br/>FinanceiroView]

  C --> D[GET /payouts/stats — KPIs]
  C --> E{Aba ativa}
  E -->|pending| F[Lista repasses pendentes]
  E -->|frozen| G[Lista congelados]
  E -->|released| H[Liberados últimos 30d]

  F --> I[GET /payouts?tab=...]
  G --> I
  H --> I

  C --> J[Exportar extrato — HU04b]
  J --> K[GET /payouts/export → download CSV]

  style C fill:#f9f,stroke:#333
```

**Rotas de referência**

- UI: `producer-web/src/app/(admin)/admin/financeiro/`
- KPI chargeback (proxy): `GET /api/admin/v1/refunds/stats` na mesma view
