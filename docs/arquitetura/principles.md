# 🏛️ Pulse! — Princípios de Arquitetura e Engenharia (Sênior)

Este documento define as diretrizes obrigatórias de arquitetura, qualidade e comportamento para o desenvolvimento do ecossistema Pulse!. Como Arquiteto Sênior, estas regras prevalecem sobre qualquer solução rápida ou amadora.

---

## 🏗️ 1. Princípios Arquiteturais (OBRIGATÓRIO)

1.  **Separação de Camadas**:
    -   `domain`: Regras de negócio puras, entidades e interfaces de repositório. Zero dependência de frameworks.
    -   `application`: Casos de uso (Use Cases) que orquestram a lógica do domínio.
    -   `infrastructure`: Implementações concretas (Prisma, Repositories, Adapters, APIs externas).
    -   `presentation`: Controllers, Routes, Middlewares e UI (Mobile/Frontend).
2.  **Framework Agnostic**: Nunca misturar regra de negócio com detalhes de infraestrutura (Elysia, Expo, etc).
3.  **Rigor SOLID**:
    -   **SRP**: Cada classe/função tem uma única responsabilidade.
    -   **DIP**: Depender de abstrações (interfaces), não de implementações. **No backend**, manter inversão por interfaces de repositório/serviço. **No frontend**, DI por container (`tsyringe`) **não** é obrigatória — o padrão canônico é "módulos de serviço + React Query + Zustand"; container só quando houver troca real de implementação. Ver [ADR-004](ADR-004-frontend-composition-di.md).
    -   **OCP**: Código extensível sem necessidade de modificação no núcleo.
4.  **Qualidade de Código**:
    -   Altamente testável (unitários para use cases e lógica de domínio).
    -   Desacoplado e legível.
    -   Autoexplicativo.
5.  **Workflow de Implementação**:
    1.  Entender o problema.
    2.  Propor arquitetura e explicar trade-offs.
    3.  Definir estrutura de pastas.
    4.  Definir contratos (DTOs) e tipos (Interfaces).
    5.  Gerar o código.

---

## 🔐 2. Tipagem e Contratos (CRÍTICO)

1.  **Sem `any`**: O uso de `any` é proibido sob qualquer circunstância. Use `unknown` ou tipagem genérica se necessário.
2.  **Tipagem Estrita**: Toda tipagem deve ser explícita, consistente e reutilizável.
3.  **End-to-End Type Safety**: Alinhamento Backend ↔ Mobile com **Eden Treaty** (`treaty<App>`). No **app-client**, o `tsconfig` mapeia **`elysia`** para `../backend/node_modules/elysia` (uma identidade de tipos) e o tipo **`App`** vem do shim **`src/shims/pulse-backend-app.ts`** para o `tsc` do mobile **não** compilar o servidor inteiro; em runtime o contrato é o do backend. **`pulseClient` / `pulseProducer`** concentram casts nos namespaces aninhados quando a inferência Eden ainda não cobre o ramo.
4.  **Respostas Padronizadas**:
    -   Sucesso: `{ success: true, data: T }`
    -   Erro: `{ success: false, error: { code: string, message: string, type: string } }`
    -   Erros previsíveis e tipados (evitar `throw new Error()` genérico).

---

## 📱 3. Mobile (Expo + Eden)

1.  **SoC (Separation of Concerns)**:
    -   **UI**: Componentes puros de apresentação.
    -   **Hooks**: Gerenciamento de estado e lógica reativa.
    -   **Services/Repositories**: Camada de dados e chamadas API.
2.  **Eden Treaty**: Uso obrigatório para consumir o backend Elysia com tipagem compartilhada automática.

---

## 🖥️ 4. Backend (Elysia / Node)

1.  **Estrutura**: Controllers finos (apenas orquestração) -> Use Cases -> Repositories.
2.  **Negócio**: Toda a lógica deve residir nas camadas `domain` ou `application`.

---

## 🗄️ 5. Banco de Dados (Nível Profissional)

1.  **Modelagem**: Normalização adequada e integridade referencial (FKs obrigatórias).
2.  **Performance**:
    -   Constraints (`NOT NULL`, `UNIQUE`) obrigatórias.
    -   Índices explícitos para colunas de busca frequente.
    -   Prevenção de queries ineficientes e N+1.
3.  **Escalabilidade**: Modelar pensando em volume e manutenção.

---

## 🤖 6. Comportamento da IA (Código de Conduta)

1.  **Discordância Construtiva**: Se a solicitação do usuário for tecnicamente ruim ou amadora, a IA **DEVE** discordar, explicar o problema e propor uma solução profissional.
2.  **Integridade**: Nunca inventar soluções ou fazer "gambiarras" no `node_modules`. Se o erro persistir, parar e pedir contexto.
3.  **Zero Tolerância a Código "Meia-Boca"**: Priorizar manutenibilidade e arquitetura sobre a velocidade de "apenas funcionar".

---
*Assinado: Arquiteto de Software Sênior (Pulse! Project)*
