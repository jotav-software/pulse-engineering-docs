# Produtoras — Parte 1: entrada e navegação

**Status:** [IMPLEMENTADO] · Espelha `producers-view.tsx`, `producers-table.tsx` e sidebar admin.

```mermaid
flowchart TD
  A[Sessão PULSE_ADMIN em /admin/*] --> B[Sidebar: Produtoras]
  B --> C[/admin/produtoras<br/>ProducersView]

  C --> D[GET /api/admin/v1/producers<br/>GMV 30d, busca, sort]
  D --> E[Tabela ProducersTable]

  E --> F{Ação do operador}
  F -->|Nova produtora| G[Drawer CreateProducerDrawer]
  F -->|Menu ⋯| H[Ver detalhe / Reset senha / Link KYC]
  F -->|Busca| C

  H -->|Ver detalhe| I[ProducerDetailDrawer<br/>GET /producers/:id]
  H -->|Fila KYC| J[/admin/compliance/kyc]

  style C fill:#f9f,stroke:#333
```

**Rotas de referência**

- UI: `producer-web/src/app/(admin)/admin/produtoras/`
- API listagem: `GET /api/admin/v1/producers` (`status`, `search`, `sortBy`, `sortDir`)
- API detalhe seguro: `GET /api/admin/v1/producers/:id` (HU02b)
