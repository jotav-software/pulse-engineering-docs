# 🚀 Plano de Implementação: Módulo de Eventos & Ingressos (Pulse!)

Este documento detalha o plano de ação para transformar as regras de negócio definitivas em código funcional no backend.

## 🏗️ 1. Checklist de Funcionalidades (Backend)

### A. Fluxo de Eventos (Producer)
- [ ] **Criar Evento (POST /events)**: 
    - [ ] Restringir apenas ao perfil `PRODUCER`.
    - [ ] Validar campos obrigatórios (título, data, categorias EVT-006).
- [ ] **Editar Evento (PUT /events/:id)**:
    - [ ] Validar que apenas o dono (produtor do evento) pode editar.
    - [ ] Proibir edição crítica se já houver ingressos vendidos (ex: mudar data do evento requer regra de aviso antecipado).
- [ ] **Listagem de Eventos (GET /events)**:
    - [ ] Implementar filtro por localização (**EVT-001**).
    - [ ] Ordenação pelo algoritmo de Trending (**EVT-005**).
    - [ ] Exibição de categorias segregadas (**EVT-006**).

### B. Gestão de Lotes (EVT-007)
- [ ] Modelo de Dados: Tabela `Batch` vinculada ao `Event`.
- [ ] Implementar "Lock de 10 minutos" via Redis ou tabela de reserva temporária.
- [ ] Trigger automático de virada por quantidade/data.

### C. Ingressos (Tickets)
- [ ] **Listar Meus Ingressos (GET /tickets/me)**:
    - [ ] Retornar flag `hasFacialBio` conforme perfil do usuário (**EVT-002**).
- [ ] **Transferência (EVT-008)**: 
    - [ ] Validar "Max 1 transferência".
    - [ ] Validar "24h antes do evento".
    - [ ] Validar CPF de destino existente.

### D. Compliance & Reembolso (EVT-009)
- [ ] Endpoint de cancelamento via `PATCH /tickets/:id/cancel`.
- [ ] Validação lógica da regra CDC (7 dias da compra + 48h antes do evento).

---

## 🧪 2. Estratégia de Testes Unitários (1 por RN)

Para cada regra de negócio (RN), criaremos um teste focado:

| RN ID | Test Case |
|:---|:---|
| **EVT-001** | `should prioritize events within 50km if coordinates provided` |
| **EVT-005** | `should calculate trending priority correctly (70% sales/30% views)` |
| **EVT-007 (Lock)** | `should release ticket lock after 10 minutes of inactivity` |
| **EVT-007 (Switch)** | `should automatically switch batch when quantity limit reached` |
| **EVT-008 (Limit)** | `should fail to transfer a ticket that was already transferred once` |
| **EVT-008 (Time)** | `should fail to transfer a ticket less than 24h before event` |
| **EVT-009 (Refund)** | `should refuse refund if requested less than 48h before event` |
| **EVT-010** | `should queue notification tasks for T-48h, T-24h and T-4h correctly` |

---

## 🔧 3. Plano de Ação Técnica

### Fase 1: Atualização do Schema Prisma
1. Adicionar campos: `hasBio` no User (já existe via Better-Auth?).
2. Criar tabelas: `Batch` (Lotes), `Ticket` (Ingressos), `TicketTransfer` (Histórico de Repasses).
3. Adicionar rastreamento de `views` e `sales` para o Trending.

### Fase 2: Implementação de Use Cases
- `CreateEventUseCase`, `UpdateEventUseCase`, `PurchaseTicketUseCase`, `TransferTicketUseCase`, `CancelTicketUseCase`.

### Fase 3: Worker Residencial (Notificações)
- Implementar fila de processamento (ex: Bun.js periodic task ou BullMQ se necessário futuramente) para os alertas de T-48h/24h/4h.

---

## 📋 Checklist de Entrega Final
- [ ] Swagger atualizado com todas as rotas e regras de segurança.
- [ ] Documentação de testes (`bun test`) com cobertura das RNs.
- [ ] Handlers globais de erro para mensagens de Compliance (ex: "Fora do prazo legal").
