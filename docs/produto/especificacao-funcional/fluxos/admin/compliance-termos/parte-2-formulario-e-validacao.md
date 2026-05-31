# Compliance documentos legais — Parte 2: formulário e validação

Drawer «Nova versão legal» antes de publicar.

```mermaid
flowchart TD
  A[Drawer aberto] --> B{Tipo selecionado?}
  B --> C[TERMS_OF_USE, PRIVACY_POLICY,<br/>PRODUCER_TERMS_OF_USE ou REFUND_POLICY]
  C --> D{Versão informada?}
  D --> E{Título preenchido?}
  E --> F{Conteúdo do documento?}
  F --> G[Operador escolhe publicação]

  G --> H[Publicar sem forçar<br/>forceAcceptance = false]
  G --> I[Publicar e forçar aceite<br/>forceAcceptance = true]

  style I fill:#f9f,stroke:#333
```

**Observações**

- Tipos aceitos: `TERMS_OF_USE`, `PRIVACY_POLICY`, `PRODUCER_TERMS_OF_USE`, `REFUND_POLICY`.
- Default no `adminService.publishLegalDocument`: `forceAcceptance ?? true` se omitido na API; a UI oferece os dois botões explicitamente (`handlePublish(force)`).
- Para `REFUND_POLICY`, o backend grava `forceAcceptance = false`, pois o aceite é contextual por sessão de checkout.
- Versão sugerida no card (ex.: incremento manual `2.4`).
