# ADR-004: Composição e Injeção de Dependência no Frontend

## Status
Accepted — TD-PADRAO-004. Decisão de **documentação apenas**: nenhum código de app é
migrado agora (não exige relançar app na loja).

## Context
O ecossistema Pulse! tem três frontends que hoje convivem com **duas filosofias** de
composição e injeção de dependência (DI):

- **app-client** — usa **tsyringe** (container de DI) sobre **Clean Architecture**
  (`domain` / `data`), mas no modo **service-locator**: as telas chamam
  `DI_CONTAINER.resolve(...)` para obter repositórios/serviços. Como não há troca real
  de implementação por ambiente (sempre a mesma classe concreta), colhe-se **pouco do
  benefício real de DI** (inversão/substituição) e paga-se o custo de boilerplate,
  `reflect-metadata` e indireção.
- **app-producer** e **producer-web** — **sem DI**. Seguem o padrão mais leve
  **"módulos de serviço + React Query + Zustand"**: `feature/<f>/api.ts` fala com o
  backend via Eden, hooks de React Query orquestram o server-state e Zustand cobre o
  estado global síncrono (ex.: sessão). Documentado em
  [`app-producer/ARCHITECTURE.md`](../../../app-producer/ARCHITECTURE.md).

Os documentos atuais ([`principles.md`](./principles.md) §1.3 e
[`padroes/technical-rules.md`](../padroes/technical-rules.md) §3) tratam DI por container
(`tsyringe`) como **obrigatória**, o que não reflete a prática majoritária nem o melhor
trade-off para o tipo de app que estamos construindo (UI consumindo um backend tipado via
Eden, sem múltiplas implementações concorrentes).

## Decision

### 1. Padrão canônico de composição/DI no front Pulse
O padrão **canônico** para os frontends Pulse! é
**"módulos de serviço + hooks (React Query) + estado global Zustand"**:

- **Módulos de serviço** (`features/<f>/api.ts`): funções simples que falam com o backend
  via Eden client (`pulseClient` / `pulseProducer`). Única fonte de headers/erros.
- **Hooks (React Query)**: orquestram o **server-state** (cache, revalidação, mutações).
  Componentes nunca chamam a API direto — sempre via hook → `api.ts`.
- **Zustand**: apenas para **estado global síncrono** (ex.: sessão/usuário logado).
  Não duplicar server-state em store.

**DI por container (`tsyringe`) deixa de ser obrigatória.** Ela só se justifica quando
houver **troca real de implementação** (ex.: múltiplos gateways/adapters intercambiáveis,
fakes por ambiente, plugins). **Não é o caso hoje** em nenhum frontend Pulse!. Para
testes, prefira injeção manual por parâmetro/props e mocks do módulo, não um container.

### 2. app-client é uma exceção intencional (dívida aceita)
O **app-client** (Clean Architecture + tsyringe em modo service-locator) é uma
**exceção intencional e aceita por ora**. Não há ganho imediato em migrá-lo: a mudança é
**P3 / baixo valor imediato** e a decisão de produto é **não relançar o app na loja** só
por refactor interno.

**Gatilho de migração:** o app-client só migra para o padrão canônico **se/quando**
precisar de **mudanças estruturais grandes** (reescrita de telas, troca de navegação,
revisão da camada de dados). Até lá, fica registrado como **dívida técnica aceita**.

**Caminho de migração gradual (referência futura), em ordem:**
1. **Parar de espalhar `DI_CONTAINER.resolve`** — introduzir um *wrapper* fino (hooks de
   acesso, ex.: `useAuthRepository()`) que centralize o `resolve` num único ponto, de
   modo que as telas dependam do hook e não do container. Reduz a superfície sem reescrever.
2. **Composição manual** — substituir o wrapper pela construção/injeção explícita das
   dependências (factory/props), eliminando o container do caminho de execução.
3. **Remover `tsyringe` / `reflect-metadata`** — retirar decorators, `reflect-metadata` e
   o pacote, simplificando o bundle e o boot.

A migração é **incremental e segura** (cada passo é mergeável isoladamente) e **não deve
ser iniciada** fora do gatilho acima.

### 3. Atualização de referências
Para evitar orientação conflitante, os documentos de padrões passam a apontar para este ADR:
- [`principles.md`](./principles.md) §1.3 (DIP) — DI por container deixa de ser
  "obrigatória"; passa a ser condicional.
- [`padroes/technical-rules.md`](../padroes/technical-rules.md) §3 (Injeção de Dependência)
  — marcado que tsyringe é o padrão **apenas** do app-client (exceção) e condicional.
- [`padroes/frontend.md`](../padroes/frontend.md) — nota apontando para o padrão canônico.

> **Escopo:** este ADR é **documental**. Nenhum código de app é alterado.

## Consequences
- **Positivo:** orientação única e coerente com a prática (2 de 3 frontends já no padrão);
  menos boilerplate e menor barreira para novas features/contribuidores; trade-offs e
  caminho de migração do app-client ficam registrados para uso futuro.
- **Negativo:** convivência temporária de duas filosofias (app-client diverge do canônico)
  enquanto a dívida não é paga; quem mexer no app-client precisa conhecer tsyringe.
- **Neutro:** DI por container continua disponível e recomendada **quando** surgir troca
  real de implementação — a decisão aqui é sobre o *default*, não uma proibição.
