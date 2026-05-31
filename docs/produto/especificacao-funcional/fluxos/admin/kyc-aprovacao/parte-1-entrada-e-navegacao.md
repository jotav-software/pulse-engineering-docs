# KYC titular — Parte 1: entrada e navegação

**Status:** [IMPLEMENTADO] · Espelha `compliance-view.tsx` → link «Fila KYC documental» e `kyc-review-view.tsx`.

```mermaid
flowchart TD
  subgraph auth["Sessão PULSE_ADMIN"]
    A[Login /login + OTP admin] --> B[Middleware: role PULSE_ADMIN]
    B --> C[Redirect /admin/visao se não estiver em /admin/*]
  end

  C --> D{Sidebar admin}
  D -->|Compliance & Legal| E[/admin/compliance]
  E --> F[Link: Fila KYC documental]
  F --> G[/admin/compliance/kyc<br/>KycReviewView]

  G --> H[GET /api/admin/v1/kyc/queue<br/>busca opcional]
  H --> I[Tabela da fila]
  I -->|Clique na linha| J[Abre drawer de detalhe]

  style G fill:#f9f,stroke:#333
```

**Rotas de referência**

- UI: `producer-web/src/app/(admin)/admin/compliance/kyc/`
- API: `GET /api/admin/v1/kyc/queue` (filtros `status`, `type`, `search`, paginação)
- Entrada alternativa: botão na tela `/admin/compliance` após login admin
