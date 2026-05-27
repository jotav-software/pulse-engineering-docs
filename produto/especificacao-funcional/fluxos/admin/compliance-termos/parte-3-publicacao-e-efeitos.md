# Compliance documentos legais — Parte 3: publicação e efeitos

**Status:** [IMPLEMENTADO]

```mermaid
flowchart TD
  A[POST /compliance/documents] --> B[Nova versão legal_document]
  B --> C[Versão anterior desativada isActive=false]
  C --> D{Tipo REFUND_POLICY?}
  D -->|Não| E{forceAcceptance?}
  D -->|Sim| R[Aceite contextual<br/>por checkout]
  E -->|true| F[Produtores/clientes sem aceite<br/>bloqueados no próximo request]
  E -->|false| G[Novos aceites sob demanda<br/>sem reset em massa]

  F --> H[Gates de compliance global]
  G --> H

  H --> I[Producer Web: ComplianceGate / onboarding terms]
  H --> J[App/Client Web: TermsComplianceMiddleware]
  R --> K[Checkout: checkbox reembolso]
  K --> L[Pix/cartão/cortesia exigem aceite]

  M[PULSE_ADMIN] --> N[Isento — opera /admin normalmente]

  style F fill:#fdd,stroke:#333
```

**Efeitos de negócio**

- `forceAcceptance` é a alavanca de **reaceite obrigatório** após mudança material em documentos globais.
- `REFUND_POLICY` não bloqueia login; ela é aceita por sessão antes de Pix, cartão ou cortesia.
- Cards na UI mostram `adoptionPercent` e `acceptedCount`; para `REFUND_POLICY`, o KPI usa aceites contextuais.
- Logs granulares ficam em `GET /api/admin/v1/compliance/acceptance-logs` e exportação em `/acceptance-logs/export`.

**Referências**

- `TermsComplianceMiddleware.ts` — bypass `/api/admin/v1`
- [checkout-compliance.md](../../../regras-negocio/checkout-compliance.md)
