# KYC titular — Parte 3: persistência e efeitos

Após decisão, o titular recebe status agregado; publicação de evento depende de `KYC_APPROVED`.

```mermaid
flowchart TD
  A[POST approve ou reject] --> B[Atualiza producer_kyc_documents]
  B --> C[recordProducerKycAudit]
  C --> D[syncProducerKycStatus producerId]
  D --> E{computeProducerKycStatus}
  E -->|Obrigatórios + identidade OK| F[users.producer_kyc_status = KYC_APPROVED]
  E -->|Documento rejeitado ou pendente| G[KYC_PENDING ou KYC_REJECTED]

  F --> H[Produtor pode publicar eventos<br/>ChangeProducerEventStatusUseCase]
  G --> I[Bloqueio mantido — ver kyc-blocking-matrix]

  H --> J[Invalida queries React — fila atualizada]
  I --> J
```

**Efeito de negócio**

- `KYC_APPROVED` é o gate para **publicar** evento (não para criar rascunho em todas as superfícies — ver matriz).
- App Produtor envia documentos; admin apenas **decide** na fila (espelho operacional).

**Referências**

- `syncProducerKycStatus`, `producerKycHelpers.ts`
- Produtor: onboarding KYC em [app-produtor.md](../../../app-produtor.md)
