# Estornos — Parte 2: wizard e validação

Fluxo do modal `RefundModal` (passos 1–4) e `POST /refunds/validate`.

```mermaid
flowchart TD
  G[Novo Estorno] --> S1[Passo 1: escolher produtora]
  S1 --> S2[Passo 2: evento opcional + busca pedido ≥2 chars]
  S2 --> S3[GET search-orders]
  S3 --> S4[Selecionar pedido]
  S4 --> V[POST /refunds/validate]

  V --> W{validation.valid?}
  W -->|Não| Z[Toast blockers[0]<br/>ex.: repasse congelado]
  W -->|Sim| S5[Passo 3: valor e impacto líquido]
  S5 --> S6[Passo 4: motivo ADMIN_REFUND_REASONS]
  S6 --> R{reasonCode OUTRO?}
  R -->|Sim| T{Detalhe ≥ 10 chars?}
  R -->|Não| OK[Confirmar habilitado]
  T -->|Não| Z2[Confirmar desabilitado]
  T -->|Sim| OK

  Z --> S2
  Z2 --> S6

  style OK fill:#dfd,stroke:#333
```

**Blockers comuns (`ValidateAdminRefundUseCase`)**

- Pedido já estornado, ingresso USED sem política, repasse congelado (`PAYOUT_FROZEN_FORBIDDEN_MESSAGE` → **403** na execução).
- Cobertura financeira do produtor (`computeProducerRefundCoverage`).
