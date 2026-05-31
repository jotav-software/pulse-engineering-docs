# Criação de evento — Parte 1: entrada e navegação

Espelha a navegação em `events/index.tsx`, `events/create.tsx` e abas `(producer)/(tabs)`.

```mermaid
flowchart TD
  subgraph entrada["Área já autenticada"]
    A[App Producer — área do produtor] --> B{Aba atual}
    B -->|"Eventos"| C[Tela Lista de Eventos<br/>EventsScreen]
    B -->|"Outras abas"| D[Financeiro / Check-in / Conta<br/>fluxo paralelo — fora deste diagrama]
  end

  C --> E{Ação do usuário}
  E -->|Toque em Criar| F[navegar: /events/create]
  E -->|Toque num card| G[Ver detalhes do evento<br/>/(producer)/events/:id]
  E -->|Busca ou filtro| C

  F --> H[Tela Criar Evento<br/>create.tsx — header Criar Evento]

  style H fill:#f9f,stroke:#333
```



**Rotas de referência**

- Lista: `app/(producer)/(tabs)/events/index.tsx` → `EventsScreen`.
- Criar: `app/(producer)/(tabs)/events/create.tsx` — `router.push("/events/create")` a partir da lista.

