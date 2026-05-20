# Compliance termos — Parte 3: publicação e efeitos

**Status:** [IMPLEMENTADO]

```mermaid
flowchart TD
  A[POST /compliance/documents] --> B[Nova versão legal_document]
  B --> C[Versão anterior desativada isActive=false]
  C --> D{forceAcceptance?}
  D -->|true| E[Todos produtores/clientes sem aceite<br/>bloqueados no próximo request]
  D -->|false| F[Novos aceites sob demanda<br/>sem reset em massa]

  E --> G[TermsComplianceMiddleware<br/>produtor + client APIs]
  F --> G

  G --> H[Producer Web: ComplianceGate / onboarding terms]
  G --> I[Checkout B2C: gate antes de pagar]

  J[PULSE_ADMIN] --> K[Isento — opera /admin normalmente]

  style E fill:#fdd,stroke:#333
```

**Efeitos de negócio**

- `forceAcceptance` é a alavanca de **reconsentimento obrigatório** após mudança material (LGPD / termos).
- Cards na UI mostram `adoptionPercent` e `acceptedCount` pós-publicação.

**Referências**

- `TermsComplianceMiddleware.ts` — bypass `/api/admin/v1`
- [CHECKOUT_COMPLIANCE.md](../../../policies/checkout-compliance.md) (alias checkout-compliance)
