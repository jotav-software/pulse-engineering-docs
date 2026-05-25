# Produtoras — Parte 3: persistência e efeitos

**Status:** [IMPLEMENTADO]

```mermaid
flowchart TD
  A[Formulário válido] --> B[POST /api/admin/v1/producers]
  B --> C{Sucesso?}
  C -->|Não| E[Toast erro API]
  E --> A
  C -->|Sim| F[Cria user PRODUCER + perfil produtora]
  F --> G[E-mail convite / senha temporária — backend]
  G --> H[Fecha drawer — invalida listagem]

  I[POST reset-password] --> J{Sucesso?}
  J -->|Sim| K[Nova senha enviada — mensagem API]
  J -->|Não| L[Toast erro]

  M[GET /producers/:id no drawer] --> N[Exibe GMV, eventos, status KYC, ações]
```

**Efeitos colaterais**

- Nova produtora inicia com KYC `NOT_STARTED` ou `KYC_PENDING` conforme documentos — publicação bloqueada até aprovação admin ([kyc-aprovacao](../kyc-aprovacao/)).
- Operador não usa portal produtor (`/dashboard`); middleware redireciona `PULSE_ADMIN` para `/admin/visao`.

**Referências**

- `CreateProducerDrawer`, `ProducerDetailDrawer`, `useCreateProducer`, `useResetProducerPassword`
