# Compliance termos — Parte 1: entrada e navegação

**Status:** [IMPLEMENTADO] · `compliance-view.tsx`.

```mermaid
flowchart TD
  A[Sessão admin] --> B[Sidebar: Compliance & Legal]
  B --> C[/admin/compliance<br/>ComplianceView]

  C --> D[GET /api/admin/v1/compliance]
  D --> E[Cards Termos + Privacidade ativos<br/>% adoção, aceites]

  C --> F[Link: Fila KYC → /admin/compliance/kyc]
  C --> G[Botão: Nova versão de termo]
  G --> H[Drawer publicação]

  E --> I[Nova versão pré-preenche tipo/título do card]

  style C fill:#f9f,stroke:#333
```

**Rotas de referência**

- UI: `producer-web/src/app/(admin)/admin/compliance/`
- `PULSE_ADMIN` isento de `TermsComplianceMiddleware` em `/api/admin/v1`
