# KYC titular — Parte 2: revisão e validação

Condições na UI (`kyc-review-view.tsx`) e no backend antes de aprovar/rejeitar.

```mermaid
flowchart TD
  A[Drawer aberto — item da fila] --> B[GET /kyc/documents/:id]
  B --> C{Status do documento}
  C -->|UPLOADED ou UNDER_REVIEW| D[canDecide = true]
  C -->|Outros| E[Somente leitura — sem botões Aprovar/Rejeitar]

  D --> F[Operador visualiza arquivo]
  F --> G[GET .../download com Bearer]

  D --> H{Ação}
  H -->|Aprovar| I[POST .../approve]
  H -->|Rejeitar| J{Motivo ≥ 10 caracteres?}
  J -->|Não| Z[Botão desabilitado]
  J -->|Sim| K[POST .../reject + reason]

  Z --> J

  style I fill:#dfd,stroke:#333
  style K fill:#fdd,stroke:#333
```

**Regras backend (`ApproveAdminKycDocumentUseCase` / reject)**

- Documento deve existir e estar em `PRODUCER_KYC_QUEUE_STATUSES`; caso contrário **409** `INVALID_STATUS`.
- Rejeição persiste `rejectionReason` visível ao produtor.
