# Estornos — Parte 1: entrada e navegação

**Status:** [IMPLEMENTADO] · Mesma rota `/admin/financeiro` que repasses.

```mermaid
flowchart TD
  A[/admin/financeiro] --> B[Seção Central de Estornos]
  B --> C[GET /refunds + busca q]
  C --> D[RefundsTable]

  D --> E{Operador}
  E -->|Busca pedido/código| C
  E -->|Clique na linha| F[RefundDetailDrawer<br/>GET /refunds/:id — HU05b]
  E -->|Novo Estorno| G[RefundModal — 4 passos]

  A --> H[GET /refunds/stats — KPI chargeback proxy]

  style G fill:#f9f,stroke:#333
```

**Rotas de referência**

- UI: `refunds-table.tsx`, `refund-detail-drawer.tsx`, `refund-modal.tsx`
- API listagem: `GET /api/admin/v1/refunds`
