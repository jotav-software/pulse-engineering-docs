# Produtoras — Parte 2: formulário e validação

Schema Zod em `create-producer-drawer.tsx` antes de `POST /producers`.

```mermaid
flowchart TD
  A[Drawer Nova produtora] --> B{Razão social ≥ 2?}
  B -->|Não| Z1[Erro inline]
  B -->|Sim| C{CNPJ 14 dígitos?}
  C -->|Não| Z2[Erro: CNPJ inválido]
  C -->|Sim| D{Responsável ≥ 2?}
  D -->|Não| Z3[Erro inline]
  D -->|Sim| E{E-mail válido?}
  E -->|Não| Z4[Erro e-mail]
  E -->|Sim| F{Taxa Pulse 0–100%?}
  F -->|Não| Z5[Erro taxa]
  F -->|Sim| G[Validação OK — Parte 3]

  Z1 --> A
  Z2 --> A
  Z3 --> A
  Z4 --> A
  Z5 --> A

  subgraph reset["Reset senha — confirmação dupla"]
    R1[Primeiro clique no menu] --> R2[Segundo clique em 4s confirma]
    R2 --> R3[POST /producers/:id/reset-password]
  end

  style G fill:#dfd,stroke:#333
```

**Observações**

- `pulseFeePercent` na UI converte para `pulseFeeBps` (ex.: 10% → 1000 bps) no `adminService.createProducer`.
- Reset de senha não abre modal de motivo — confirmação por duplo clique na tabela.
