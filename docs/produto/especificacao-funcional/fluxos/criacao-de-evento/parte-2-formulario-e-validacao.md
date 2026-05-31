# Criação de evento — Parte 2: formulário e validação

Condições implementadas em `handleCreateDraft` em `events/create.tsx` (antes de chamar a API).

```mermaid
flowchart TD
  A[Formulário Criar Evento preenchido] --> B{Título ≥ 3 caracteres?}
  B -->|Não| Z1[Alert: título mínimo 3 caracteres]
  B -->|Sim| C{Descrição ≥ 20 caracteres?}
  C -->|Não| Z2[Alert: descrição mínima 20 caracteres]
  C -->|Sim| D{Data de início informada?}
  D -->|Não| Z3[Alert: data de início obrigatória]
  D -->|Sim| E{Início ≥ agora + 12 horas?}
  E -->|Não| Z4[Alert: evento deve começar daqui a no mínimo 12h]
  E -->|Sim| F{Se houver data fim: fim > início?}
  F -->|Não| Z5[Alert: término após o início]
  F -->|Sim / sem fim| G{Local: nome do local + endereço + cidade + UF?}
  G -->|Não| Z6[Alert: localização obrigatória]
  G -->|Sim| H[Validação OK — segue para envio na Parte 3]

  Z1 --> A
  Z2 --> A
  Z3 --> A
  Z4 --> A
  Z5 --> A
  Z6 --> A

  style H fill:#dfd,stroke:#333
```



**Observações do código**

- Categoria, banner padrão (`DEFAULT_EVENT_BANNER_URL`), `visibility: PUBLIC` e `facialRequired: true` são definidos no submit, não no diagrama de validação do usuário.

