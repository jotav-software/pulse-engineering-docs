# Criação de evento — Parte 3: persistência, rascunho e comercial

Após validações (parte 2), `createEvent` grava o rascunho. Botões ao final da tela em `create.tsx`.

```mermaid
flowchart TD
  A[Validação OK — Parte 2] --> B[POST createEvent via EventRepositoryImpl]
  B --> C{Sucesso?}
  C -->|Não| E[Alert: problema ao salvar]
  E --> A

  C -->|Sim e id retornado| F{Escolha do usuário no rodapé}

  F -->|Salvar e Continuar| G["router.replace<br/>/(producer)/events/:id/commercial"]

  F -->|Salvar como Rascunho| H[Alert: rascunho salvo → OK]

  H --> I[router.back]

  F -->|Cancelar| J[router.back<br/>sem salvar novo]

  G --> K[Tela Comercial — commercial.tsx]

  K --> L[Carrega evento/lotes/sectors<br/>useCommercialStructure]

  L --> M{Nenhum lote?}

  M -->|Sim| N[Cartão vazio: configurar comercial]

  M -->|Não| O[Lista BatchCard por lote]

  N --> P[Opcional: Adicionar lote<br/>BatchFormModal se permitido por regras de data/perfil]

  O --> Q[Editar pausar duplicar reordenar — conforme permissões]

  P --> Q

  Q --> R[Voltar ao Evento — router.back quando há lotes e modal fechado]
```



**Referências**

- `handleCreateDraft(continueToCommercial)` em `app/(producer)/(tabs)/events/create.tsx`: `true` → comercial; `false` → alerta + `router.back()`.
- Comercial: `app/(producer)/(tabs)/events/[id]/commercial.tsx`, `BatchFormModal`.

