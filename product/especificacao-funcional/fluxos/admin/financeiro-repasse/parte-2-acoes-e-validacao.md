# Financeiro repasse — Parte 2: ações e validação

Freeze manual, unfreeze e moderação de evento (menu de ações).

```mermaid
flowchart TD
  A[Linha na PayoutsTable — aba pending] --> B{Repasse já bloqueado?}
  B -->|Não| C[Menu: Congelar repasse]
  C --> D[FreezePayoutModal]
  D --> E{Motivo ≥ 10 caracteres?}
  E -->|Não| Z[Confirmar desabilitado]
  E -->|Sim| F[POST freeze]

  A2[Linha — aba frozen] --> G[Duplo clique Liberar]
  G --> H[POST unfreeze sem motivo]

  A --> I[Menu: Suspender na vitrine]
  I --> J{Motivo ≥ 10?}
  J -->|Sim| K[POST /events/:id/suspend]
  J -->|Não| Z2[Botão desabilitado]

  F --> L[MUST: produtor não saca<br/>mesma regra portal produtor]

  style F fill:#fdd,stroke:#333
  style H fill:#dfd,stroke:#333
```

**Observações**

- Unfreeze na aba `frozen` usa confirmação dupla (4s), sem modal de motivo.
- `PayoutActionsMenu` também oferece suspensão global do evento na vitrine (moderação — [IMPLEMENTADO]).
