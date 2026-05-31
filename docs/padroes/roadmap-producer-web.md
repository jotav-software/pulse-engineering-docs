# 🖥️ Roadmap — Producer Web (Painel do Produtor, versão Web)

> Roadmap dedicado para a construção do **Painel Web do Produtor** baseado nos mockups HTML existentes em `~/workspace/pulse/producer-web/`. Mantém o layout/visual dos mockups e **consome o backend Pulse! sem alterações** — gaps de backend são listados como bloqueadores com justificativa.

**Status:** 🟢 Planejado — pré-execução
**Stack:** Next.js 14 (App Router) + Eden Treaty + Better Auth (cliente) + Bun + Biome + Tailwind v3 + FontAwesome + Inter
**Capacidade:** 1 dev (Claude) full-time
**Cadência:** sprints de 2 semanas
**Total estimado:** 8 sprints (~16 semanas) até paridade com mockups
**Princípio inviolável:** **backend é apenas consumido** — qualquer mudança no `backend/` precisa de justificativa explícita e aprovação.

---

## 1. Contexto e Princípios

### O que estamos construindo

A versão web do Painel do Produtor — hoje funcional **apenas no `app-producer` (mobile)**. O `producer-web/` já tem mockups HTML que serão portados pra um app Next.js real, conectado ao backend Pulse! existente. A versão web é estratégica porque:

- **Operação séria de produtor** acontece no laptop (criar evento com 8 lotes, fechar mês financeiro, gerenciar equipe).
- **Day of show** com tablet faz mais sentido em web do que em app mobile.
- **Onboarding e venda** do produto pra novos produtores precisam de um painel "para mostrar".

### Princípios

1. **Backend congelado.** O `backend/` está em produção atendendo dois apps mobile. Nenhuma alteração nele dentro deste roadmap; gaps viram bloqueadores explícitos com PR separado.
2. **Reuso máximo dos tipos.** O Eden Treaty já tipa o backend de ponta a ponta — vamos importar `App` do shim `pulse-backend-app.ts` (mesmo padrão dos apps mobile).
3. **Fidelidade visual aos mockups.** Os HTMLs em `producer-web/` definem o visual; alterações estéticas só após validação.
4. **Mobile-first não é o foco.** O painel é desktop-first; responsivo até tablet (menor portaria/operação), não phone.
5. **DoD sério.** Toda PR tem testes (Vitest), lint Biome zerado, build sem warnings, deploy preview.

---

## 2. Stack confirmada

| Camada | Escolha | Justificativa |
|---|---|---|
| **Framework** | Next.js 14 (App Router, RSC + Server Actions) | SSR pra páginas marketing dentro do mesmo app (futuro), RSC pra performance, App Router é o padrão atual |
| **Runtime/Pkg manager** | Bun | Mesmo do backend e dos apps mobile, evita context switch |
| **Linter/Formatter** | Biome | Já é o padrão do monorepo |
| **Lib HTTP/Tipagem** | Eden Treaty (`@elysiajs/eden`) | Tipagem end-to-end com o backend Elysia. Reusa o mesmo padrão de shim dos apps mobile |
| **Auth (cliente)** | Better Auth + cookies httpOnly | Mesma lib do backend; integra com Better Auth via SDK do cliente. Sessão única do ecossistema |
| **Estilo** | Tailwind CSS v3 (migrar de CDN pra build local) | Mockups já usam, equipe já conhece, classes do mockup viram base |
| **Componentes** | shadcn/ui (alguns) + componentes custom | shadcn pra primitivos (Dialog, Select, DropdownMenu, Toast); custom pro restante |
| **Form** | React Hook Form + Zod | Mesmo padrão dos apps mobile |
| **Estado server** | TanStack Query (React Query v5) | Cache, revalidação, optimistic updates |
| **Estado UI** | Zustand (quando necessário) | Mesmo padrão dos apps mobile |
| **Charts** | Recharts | Boa integração React, leve, suficiente pro dashboard |
| **Tabelas** | TanStack Table | Sort/filter/pagination padronizado |
| **Ícones** | lucide-react (substitui FontAwesome) | Tree-shake nativo, mais moderno; ícones equivalentes 1:1 dos mockups |
| **Deploy** | Vercel ou Railway | Vercel é mais natural pra Next.js; Railway centraliza monorepo |
| **Datas** | date-fns + date-fns-tz | Padrão React, lighter que moment |

### Estrutura de pastas (proposta)

```
producer-web/
├── app/
│   ├── (marketing)/             # landing-page atual migrada (futuro)
│   │   ├── page.tsx
│   │   ├── produtor/page.tsx
│   │   └── cliente/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── set-password/page.tsx        # mandatory change
│   ├── (onboarding)/
│   │   ├── basico/page.tsx
│   │   ├── contato/page.tsx
│   │   ├── endereco/page.tsx
│   │   ├── bancario/page.tsx
│   │   └── termos/page.tsx
│   ├── (producer)/
│   │   ├── layout.tsx                   # Sidebar + Header
│   │   ├── dashboard/page.tsx
│   │   ├── eventos/
│   │   │   ├── page.tsx                 # lista
│   │   │   ├── novo/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx             # detalhe + edit
│   │   │       ├── comercial/page.tsx
│   │   │       ├── participantes/page.tsx
│   │   │       ├── equipe/page.tsx
│   │   │       └── financeiro/page.tsx
│   │   ├── checkin/page.tsx
│   │   ├── financeiro/
│   │   │   ├── page.tsx                 # dashboard
│   │   │   ├── extrato/page.tsx
│   │   │   ├── repasses/page.tsx
│   │   │   ├── comissoes/page.tsx
│   │   │   └── cancelamentos/page.tsx
│   │   ├── equipe/
│   │   │   ├── page.tsx
│   │   │   └── convidar/page.tsx
│   │   ├── vip/                         # ⚠️ depende de backend novo
│   │   │   └── page.tsx
│   │   └── configuracoes/
│   │       ├── page.tsx
│   │       ├── perfil/page.tsx
│   │       ├── bancario/page.tsx
│   │       └── operacional/page.tsx
│   └── api/                             # rotas server-side se precisar
├── src/
│   ├── lib/
│   │   ├── api/                         # cliente Eden Treaty
│   │   │   ├── client.ts
│   │   │   ├── pulse-backend-app.ts     # shim dos tipos do backend
│   │   │   └── hooks/                   # React Query hooks
│   │   ├── auth/
│   │   │   ├── better-auth-client.ts
│   │   │   └── session.ts               # server-side session
│   │   ├── format/                      # formatadores BR (moeda, data, CPF, etc)
│   │   └── utils/
│   ├── components/
│   │   ├── ui/                          # shadcn primitives
│   │   ├── layout/                      # Sidebar, Header, PageTitle
│   │   ├── dashboard/
│   │   ├── events/
│   │   ├── checkin/
│   │   ├── finance/
│   │   ├── team/
│   │   └── shared/
│   └── styles/
│       └── globals.css
├── public/
├── .env.example
├── biome.json
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. Inventário extraído dos mockups

Cada item é uma "feature" identificada nos arquivos `producer-dashboard-mock.html` e `producer-create-vip-mock.html`. Marcação:
- 🟢 = backend pronto (consumível direto)
- 🟡 = backend parcial (consumível com adaptação cliente-side, ex: agregar dados)
- 🔴 = backend faltando (bloqueador — entra em "Pendências de Backend" abaixo)

### 3.1 Sidebar e navegação
- Logo "PULSE!" + selo PRO
- Itens: Dashboard, Eventos, Check-in ao vivo, Memberships VIP, Financeiro
- Avatar do produtor (iniciais geradas) + atalho "Configurações"

### 3.2 Header global
- Título da página dinâmico
- 🟡 Sino de notificações com indicador (sem endpoint dedicado — agregar warnings do dashboard)
- Botão "Criar Evento"

### 3.3 Dashboard
- 🟢 KPI Receita Bruta do mês (`/finance/summary`)
- 🟢 KPI Ingressos Vendidos (`/events/dashboard`)
- 🟡 KPI Cadastros Faciais % adesão (precisa agregação cliente-side dos `BiometricAudit` ou novo endpoint — **usar 0% como fallback no MVP e marcar TODO**)
- 🔴 KPI Assinaturas VIP / MRR (depende de Membership backend — esconder ou mostrar stub no MVP)
- 🟢 Gráfico Vendas Diárias (precisa série temporal — `/finance/insights` retorna; ou agregação cliente-side de `/finance/ledger`)
- 🟢 Próximos Eventos (`/events?status=PUBLISHED&order=date_asc&limit=5`)

### 3.4 Eventos — Lista
- 🟢 Tabela: imagem cover, nome, local, data/hora, status, vendas (X de Y), ações
- 🟢 Busca por nome
- 🟢 Filtro por status (Rascunho, Publicado, Pausado, Encerrado)
- 🟢 Barra de progresso de vendas
- 🟢 Ações: ver métricas (chart), editar, menu (mais)

### 3.5 Eventos — Criar/Editar
- 🟢 Bloco 1 — Informações básicas (nome, datas início/fim, local com geocode, descrição rica)
- 🟢 Bloco 2 — Setores e Lotes
  - Drag & drop (reordenar)
  - Múltiplos setores (Pista, VIP, Camarote)
  - Múltiplos lotes por setor com nome, preço, qty
  - Virada automática: "Quando esgotar Qtd" / "Por Data/Hora" / "Manual"
  - Setor VIP destacado visualmente
- 🟢 Imagem de capa (upload 1920×1080)
- 🟢 "Configurações Pulse"
  - Toggle Biometria Facial Obrigatória
  - 🔴 Toggle "Desconto para Assinantes VIP" (depende de Membership)
- 🟢 Visibilidade (Público / Privado)
- 🟢 Salvar rascunho automático + Publicar

### 3.6 Check-in ao vivo
- 🟢 Seletor de evento (dropdown)
- 🟢 Indicador "AO VIVO" (pulse animado)
- 🟢 KPI Entradas Realizadas (X de Y)
- 🟢 Barra de progresso %
- 🟢 KPI Velocidade de Entrada (pessoas/min) — calculado a partir de `/operation/metrics`
- 🟡 Monitor por Portão (alertas de fila) — backend tem `EventStaff` mas conceito de "portão lógico" agregado precisa ser construído cliente-side a partir do `gateLabel` ou similar (a verificar)
- 🟡 Log das Últimas Entradas em tempo real — polling a cada 5s do `/operation/metrics` (websocket é roadmap futuro)

### 3.7 Financeiro
- 🟢 Saldo Disponível para Saque (`/finance/payouts/overview`)
- 🟢 Saldo a liberar (vendas recentes)
- 🟢 Botão "Sacar Agora" → modal com fluxo de saque (depende de endpoint de payout request — verificar `/finance/advance` é diferente de saque comum; pode precisar uso de `/finance/advance` se o saque é sempre antecipação, ou um endpoint dedicado)
- 🟢 Saúde Financeira: % vendas via PIX vs Cartão (`/finance/insights` deve cobrir)
- 🟢 Taxa de Chargeback (`/finance/insights`)
- Sub-páginas: Extrato (`/finance/ledger`), Repasses (`/finance/payouts/overview`), Comissões (`/finance/promoter-commissions/audit`), Cancelamentos (`/finance/cancellations`)

### 3.8 Memberships VIP — ⚠️ Bloqueador estratégico
- 🔴 Lista de planos
- 🔴 Criar plano (Identidade, Preço/Recorrência, Benefícios nativos + custom, Escassez, Live Preview)
- **Backend não tem nada** — entra em "Pendências de Backend" como decisão estratégica.

### 3.9 Onboarding (não está no producer-dashboard-mock.html mas é pré-requisito)
- 🟢 Status do onboarding (`/onboarding/status`)
- 🟢 Perfil básico (`/onboarding/basic-profile`)
- 🟢 Contato (`/onboarding/contact`)
- 🟢 Endereço (`/onboarding/address`)
- 🟢 Bancário (`/onboarding/bank-data`)
- 🟢 Termos (`/onboarding/terms`, `/onboarding/accept-terms`)
- 🟢 Conclusão (`/onboarding/complete`)

### 3.10 Equipe (mencionado, mas não detalhado nos mockups — usar paridade com app-producer)
- 🟢 Lista de membros
- 🟢 Convidar (`/team/invite`)
- 🟢 Gerenciar permissões e papéis
- 🟢 Toggle ativo/inativo, remoção

### 3.11 Configurações
- 🟢 Perfil produtor
- 🟢 Conta bancária
- 🟢 Configurações operacionais
- 🟢 Termos
- 🟢 Exclusão de conta

---

## 4. Mapeamento Tela → Endpoint (referência rápida)

| Tela | Endpoints consumidos | Método |
|---|---|---|
| Login | `/api/producer/v1/auth/login` | POST |
| Logout | `/api/producer/v1/auth/logout` | POST |
| Esqueci senha | `/api/producer/v1/auth/forgot-password` | POST |
| Reset senha | `/api/producer/v1/auth/reset-password` | POST |
| Set senha (mandatory) | `/api/producer/v1/auth/set-password` | POST |
| Onboarding hub | `/api/producer/v1/onboarding/status` | GET |
| Onb. perfil | `/api/producer/v1/onboarding/basic-profile` | PUT |
| Onb. contato | `/api/producer/v1/onboarding/contact` | PUT |
| Onb. endereço | `/api/producer/v1/onboarding/address` | PUT |
| Onb. bancário | `/api/producer/v1/onboarding/bank-data` | PUT |
| Onb. termos | `/api/producer/v1/onboarding/terms` + `/accept-terms` | GET / POST |
| Onb. complete | `/api/producer/v1/onboarding/complete` | POST |
| Dashboard | `/api/producer/v1/events/dashboard` | GET |
| Eventos lista | `/api/producer/v1/events` | GET |
| Evento criar | `/api/producer/v1/events` | POST |
| Evento editar | `/api/producer/v1/events/:id` | PUT |
| Evento status | `/api/producer/v1/events/:id/status` | PATCH |
| Evento readiness | `/api/producer/v1/events/:id/readiness` | GET |
| Evento cancel | `/api/producer/v1/events/:id/cancel` | POST |
| Estrutura comercial | `/api/producer/v1/events/:id/comercial/structure` | GET |
| Lote criar | `/api/producer/v1/events/:id/batches` | POST |
| Lote editar | `/api/producer/v1/batches/:id` | PUT |
| Lote reorder | `/api/producer/v1/events/:id/batches/reorder` | POST |
| Lote duplicate | `/api/producer/v1/batches/:id/duplicate` | POST |
| Lote toggle | `/api/producer/v1/batches/:id/toggle` | PATCH |
| Cortesia | `/api/producer/v1/events/:id/courtesy` | POST |
| Manual ticket | `/api/producer/v1/events/:id/manual-ticket` | POST |
| Participantes | `/api/producer/v1/events/:id/participants` | GET |
| Equipe lista | `/api/producer/v1/team` | GET |
| Equipe convidar | `/api/producer/v1/team/invite` | POST |
| Equipe atualizar | `/api/producer/v1/team/:id` | PUT/PATCH |
| Equipe remover | `/api/producer/v1/team/:id` | DELETE |
| Search user | `/api/producer/v1/users/search` | GET |
| Perfil | `/api/producer/v1/profile` | GET / PUT |
| Operacional | `/api/producer/v1/profile/operational` | PUT |
| Finance summary | `/api/producer/v1/finance/summary` | GET |
| Finance ledger | `/api/producer/v1/finance/ledger` | GET |
| Finance insights | `/api/producer/v1/finance/insights` | GET |
| Finance cancellations | `/api/producer/v1/finance/cancellations` | GET |
| Finance payouts overview | `/api/producer/v1/finance/payouts/overview` | GET |
| Finance event KPIs | `/api/producer/v1/finance/event/:id/kpis` | GET |
| Promoter commissions audit | `/api/producer/v1/finance/promoter-commissions/audit` | GET |
| Mark commissions paid | `/api/producer/v1/finance/promoter-commissions/mark-paid` | POST |
| Advance eligibility | `/api/producer/v1/finance/advance/eligibility` | GET |
| Advance request | `/api/producer/v1/finance/advance` | POST |
| Reports export | `/api/producer/v1/finance/reports/export` | GET |
| Operation validate (raro web) | `/api/producer/v1/operation/checkin/validate` | POST |
| Operation manual | `/api/producer/v1/operation/checkin/manual` | POST |
| Operation participants | `/api/producer/v1/operation/participants` | GET |
| Operation metrics | `/api/producer/v1/operation/metrics` | GET |
| Operation no-shows | `/api/producer/v1/operation/no-shows` | GET / POST |

---

## 5. Pendências de Backend (com justificativa)

Itens que **não dá pra fazer 100% sem mexer no backend**. Cada um vira uma decisão estratégica.

### 5.1 🔴 Membership / VIP (CRÍTICO)
- **Mockups dependentes:** `producer-create-vip-mock.html` inteiro, KPI "Assinaturas VIP/MRR" no dashboard, toggle "Desconto VIP" em criar evento, aba "Memberships VIP" do sidebar.
- **Estado atual no backend:** zero. Não há `MembershipPlan`, `MembershipSubscription`, `MembershipBenefit` no schema; nenhum use-case ou rota.
- **Justificativa pra mexer no backend:** sem isso, a aba VIP fica permanentemente stub e o produto perde um diferencial competitivo importante.
- **Ação proposta:** PR separado fora deste roadmap, com PRD próprio. Estimativa preliminar: 3-4 sprints só de backend.
- **Mitigação no roadmap atual:** Aba VIP **fica como stub no MVP** (mensagem "Em breve"); KPI MRR é escondido; toggle "Desconto VIP" no criar evento é desabilitado com tooltip.

### 5.2 🟡 Métrica "Cadastros Faciais % adesão"
- **Mockup:** card no dashboard mostra "98% adesão".
- **Estado atual:** dados existem (`BiometricAudit`, `User.biometricStatus`) mas não há endpoint agregado.
- **Ação proposta sem mexer no backend:** calcular cliente-side via `/events/dashboard` se o response já agregar; senão, esconder no MVP e marcar TODO. Confirmar shape do response na sprint 1.
- **Justificativa pra mexer no backend (futuro):** se realmente importante visualizar essa métrica, vale criar `/finance/insights` ou `/dashboard/biometric-adoption`. **Não bloqueia MVP.**

### 5.3 🟡 Monitor por Portão / Alertas de fila
- **Mockup:** check-in ao vivo mostra portões nomeados ("Portão 1 - Facial Express", "Portão 2 - QR/Convencional", "Portão VIP") com status, contagem e alerta ("fila longa 12 min").
- **Estado atual:** `EventStaff` tem vínculo evento→staff mas não há conceito de "portão lógico" nem agregação por portão no `/operation/metrics`.
- **Ação proposta:** versão simplificada cliente-side: agregar entradas por `staffId` e mostrar como "operadores" em vez de "portões". Tag "fila longa" calculada via thresholds locais (>X check-ins/min sem entrada nos últimos Y min).
- **Justificativa pra mexer no backend (futuro):** PR pequeno adicionando `gateLabel` ao `EventStaff` ou criando agregação dedicada. **Não bloqueia MVP** — versão simplificada já entrega valor.

### 5.4 🟡 Sino de notificações
- **Mockup:** ícone de sino com dot vermelho.
- **Estado atual:** dashboard tem `alerts` (inércia, estoque baixo, eventos desconfigurados) que serve como fonte.
- **Ação proposta:** consumir `/events/dashboard` e listar os `alerts` no popup do sino. Sem endpoint dedicado de notificações, sem persistência de "lido/não-lido" — basta agregar.
- **Sem mudança de backend.**

### 5.5 🟡 Saque self-service
- **Mockup:** botão "Sacar Agora" no card de saldo.
- **Estado atual:** `/finance/advance` faz adiantamento (contra saldo retido), `/finance/payouts/overview` mostra repasses agendados; o saque do **saldo já liberado (`AVAILABLE`)** pode ser automático (D+2) ou exigir solicitação. **A confirmar na sprint 1.**
- **Ação proposta:** se saque já é automático, o botão vira informativo ("próximo repasse em D+2"). Se exige solicitação, usar endpoint existente.
- **Possível PR de backend** se nenhum dos casos cobre. Justificável.

---

## 6. Épicos e User Stories

User stories no padrão **Como [persona], quero [ação] para [benefício]** com critérios de aceitação. Estimativas em **Story Points (SP)** Fibonacci: 1, 2, 3, 5, 8, 13. Capacidade média de 1 dev solo full-time em sprint de 2 semanas = **~25 SP** (planejando a 70-80% pra absorver imprevistos = ~20 SP planejados).

### Épico 0 — 🏗️ Setup e Infraestrutura

#### US-0.1 — Projeto Next.js inicializado (3 SP)
**Como** dev, **quero** o projeto Next.js 14 (App Router) iniciado em `producer-web/` com Bun + Biome configurados, **para** ter base limpa pra desenvolver.
- **AC:** `bun install` e `bun dev` funcionam; rota `/` retorna placeholder; Biome configurado igual ao backend; tsconfig strict; `.env.example` documenta variáveis.

#### US-0.2 — Eden Treaty client + shim de tipos (5 SP)
**Como** dev, **quero** o Eden Treaty configurado importando os tipos do backend, **para** ter tipagem end-to-end.
- **AC:** `pulseProducer` exposto em `src/lib/api/client.ts`; shim em `pulse-backend-app.ts` igual aos apps mobile; chamar `pulseProducer.api.producer.v1.auth.login.post(...)` deve tipar o body e a resposta.

#### US-0.3 — Better Auth client + sessão server-side (5 SP)
**Como** produtor, **quero** estar autenticado de forma segura, **para** que minha sessão persista entre páginas.
- **AC:** cookies httpOnly via Better Auth; middleware Next.js verifica sessão; helper `getSession()` server-side; redirect pra `/login` se ausente.

#### US-0.4 — Tailwind v3 + shadcn/ui base + tema Pulse (3 SP)
**Como** dev, **quero** Tailwind compilado (não CDN) com tema Pulse, **para** que os mockups portados rodem com mesma estética.
- **AC:** cores `pulse`, `pulse-light`, `pulse-dark`, `pulse-accent`, `pulse-vip` configuradas em `tailwind.config.ts`; Inter como font; `globals.css` define variáveis; instalação do shadcn-ui validada com Button + Dialog.

#### US-0.5 — Layout shell (Sidebar + Header) (5 SP)
**Como** produtor, **quero** o layout do painel com sidebar e header, **para** navegar consistentemente.
- **AC:** Sidebar fixa 256px com 5 itens (Dashboard, Eventos, Check-in, VIP, Financeiro); avatar do produtor com iniciais; Header sticky com título dinâmico, sino e botão "Criar Evento"; paridade visual com `producer-dashboard-mock.html`.

#### US-0.6 — CI: build + lint + types + test (3 SP)
**Como** dev, **quero** CI passando, **para** não quebrar a main.
- **AC:** GitHub Action: install, biome check, tsc --noEmit, vitest, build. Vermelho bloqueia merge.

**Total Épico 0:** ~24 SP

---

### Épico 1 — 🔐 Autenticação

#### US-1.1 — Tela de Login (3 SP)
**Como** produtor, **quero** logar com e-mail e senha, **para** acessar o painel.
- **AC:** form RHF + Zod; validação de e-mail e senha mínima; estados de loading/erro; bloqueio após 5 tentativas (mensagem amigável); redirect pra `/dashboard` em sucesso ou `/onboarding/...` se incompleto; layout idêntico ao mockup `client-app-mock.html` (versão web/desktop).

#### US-1.2 — Esqueci minha senha (OTP) (3 SP)
**Como** produtor, **quero** recuperar senha por OTP no e-mail, **para** voltar ao painel sem suporte.
- **AC:** fluxo `/forgot-password` → digita e-mail → `/reset-password?email=...` → digita OTP de 6 dígitos + nova senha → redirect pra `/login`; OTP válido por 10 min; mensagem amigável se expirado.

#### US-1.3 — Trocar senha obrigatória (Staff convidado) (3 SP)
**Como** Staff, **quero** trocar a senha temporária no primeiro login, **para** garantir segurança.
- **AC:** após login, se `mustChangePassword=true` → redirect pra `/set-password` (sem opção de pular); validação da política de senha; sucesso libera o painel.

#### US-1.4 — Logout + expiração de sessão (2 SP)
**Como** produtor, **quero** sair do painel ou ser deslogado por inatividade (2h), **para** segurança.
- **AC:** botão de logout no menu do avatar; expiração 2h sem requests; ao expirar, redireciona pra `/login` mantendo o `next` URL.

**Total Épico 1:** ~11 SP

---

### Épico 2 — 🚀 Onboarding do Produtor

#### US-2.1 — Hub de onboarding com progresso (3 SP)
**Como** produtor novo, **quero** ver o status do meu onboarding, **para** saber o que falta.
- **AC:** `/onboarding` mostra checklist com 6 etapas (perfil, contato, endereço, bancário, termos, complete) com badge "Concluído" ou "Pendente"; pré-popula via `/onboarding/status`.

#### US-2.2 — Etapa Perfil Básico (2 SP)
**Como** produtor, **quero** preencher perfil básico (nome fantasia, razão social, CNPJ).
- **AC:** form com validação CNPJ (algoritmo); persiste em `/onboarding/basic-profile`; avança pro próximo passo.

#### US-2.3 — Etapa Contato (WhatsApp) (1 SP)
- **AC:** input de telefone com máscara BR; persiste em `/onboarding/contact`; botão "Próximo".

#### US-2.4 — Etapa Endereço (2 SP)
- **AC:** campos CEP (busca ViaCEP automática), rua, número, complemento, cidade, UF; persiste em `/onboarding/address`.

#### US-2.5 — Etapa Bancário (3 SP)
- **AC:** seleção de banco (lista), agência, conta, dígito, tipo (corrente/poupança), CPF/CNPJ titular; valida formato; persiste em `/onboarding/bank-data`. Aviso de segurança.

#### US-2.6 — Etapa Termos (2 SP)
- **AC:** carrega texto via `/onboarding/terms`; checkbox "Li e aceito"; submit envia `/onboarding/accept-terms`.

#### US-2.7 — Conclusão (1 SP)
- **AC:** chama `/onboarding/complete`; redireciona pro dashboard com toast de sucesso.

**Total Épico 2:** ~14 SP

---

### Épico 3 — 📊 Dashboard

#### US-3.1 — Card KPI Receita Bruta (2 SP)
**Como** produtor, **quero** ver minha receita do mês, **para** acompanhar performance.
- **AC:** consome `/finance/summary`; formata BRL; mostra delta vs. mês anterior com seta verde/vermelha; skeleton no loading.

#### US-3.2 — Card KPI Ingressos Vendidos (2 SP)
- **AC:** soma de tickets emitidos no mês (do `/events/dashboard` ou `/finance/insights`); número formatado com separador de milhar.

#### US-3.3 — Card KPI Cadastros Faciais (2 SP) 🟡
- **AC (MVP):** se `/events/dashboard` retornar agregado → mostra %; senão, esconde card e marca TODO no código com link pra issue de backend.

#### US-3.4 — Card KPI Assinaturas VIP / MRR (1 SP) 🔴
- **AC (MVP):** card escondido até backend de Membership existir. TODO comentado.

#### US-3.5 — Gráfico Vendas Diárias (5 SP)
**Como** produtor, **quero** ver as vendas dos últimos 7 dias, **para** identificar padrões.
- **AC:** Recharts BarChart; consome série temporal de `/finance/insights` ou agrega via `/finance/ledger?from=...&to=...`; tooltip mostra valor BRL; eixo X com Seg-Dom; destaque visual em pico (virada de lote).

#### US-3.6 — Lista Próximos Eventos (3 SP)
- **AC:** consome `/events?status=PUBLISHED&limit=5&order=startDate_asc`; cada item: thumb, nome, data formatada, % vendido; click leva pra `/eventos/[id]`.

#### US-3.7 — Sino de notificações (3 SP) 🟡
- **AC:** dot indicador se houver `alerts` em `/events/dashboard`; click abre dropdown listando alertas; sem persistência "lido", apenas indica presença.

**Total Épico 3:** ~18 SP

---

### Épico 4 — 📅 Eventos (CRUD)

#### US-4.1 — Lista de eventos com tabela (5 SP)
- **AC:** TanStack Table; colunas Evento (thumb+nome+local), Data, Status (badge colorido), Vendas (X/Y + barra), Ações; busca por nome (debounce 300ms); filtro por status; paginação; consome `/events`.

#### US-4.2 — Tela "Novo Evento" — Bloco Informações Básicas (5 SP)
- **AC:** form completo (nome, dataInicio, dataFim, local com geocode autocomplete, descrição rica via Tiptap ou textarea + toolbar simulada); validação Zod; save rascunho automático (debounce 2s) via `/events`.

#### US-4.3 — Tela "Novo Evento" — Bloco Setores e Lotes (8 SP)
**Como** produtor, **quero** criar setores com múltiplos lotes e gatilhos de virada, **para** ter estratégia de pricing.
- **AC:** múltiplos setores (drag&drop reordena via `dnd-kit`); cada setor tem lotes com nome, preço (R$), qty, virada (Quando esgotar / Por Data/Hora / Manual); setor com nome contendo "VIP" ganha destaque visual dourado; lotes inativos com opacity 60%; persiste via `/events/:id/batches/*` (CRUD + reorder + duplicate + toggle).

#### US-4.4 — Tela "Novo Evento" — Lateral (Imagem, Pulse Settings, Visibilidade) (5 SP)
- **AC:** upload de imagem (drag&drop, validação 1920×1080, preview); toggle "Biometria Obrigatória" → atualiza `/profile/operational` ou via campo do evento (a confirmar); toggle "Desconto VIP" desabilitado com tooltip "Em breve" (Membership pendente); select Visibilidade (Público/Privado).

#### US-4.5 — Footer "Salvar/Publicar" (2 SP)
- **AC:** indicador "Rascunho salvo às HH:MM"; Cancelar volta pra lista (confirma se há mudanças não salvas); Publicar troca status pra `OPEN` via `/events/:id/status`.

#### US-4.6 — Edição de evento (3 SP)
- **AC:** mesma tela de criação populada; mudança de status; readiness check via `/events/:id/readiness` antes de publicar.

#### US-4.7 — Detalhe do evento (3 SP)
- **AC:** página `/eventos/[id]` com abas (Visão geral, Comercial, Participantes, Equipe, Financeiro); cards com KPIs do evento.

#### US-4.8 — Cancelar evento (3 SP)
- **AC:** modal com aviso ("estorno automático em massa"); confirmação dupla; chama `/events/:id/cancel`; feedback de progresso.

**Total Épico 4:** ~34 SP

---

### Épico 5 — 🚪 Check-in ao vivo

#### US-5.1 — Seletor de evento + indicador AO VIVO (2 SP)
- **AC:** dropdown lista eventos no dia atual ou em janela ativa; badge "AO VIVO" pulsa quando evento está aberto; auto-seleciona se só 1 evento ativo.

#### US-5.2 — KPIs Entradas + Velocidade (3 SP)
- **AC:** consome `/operation/metrics?eventId=...` com polling 5s; mostra entradas/total, % com barra, velocidade pessoas/min calculada (delta últimas Y entradas / janela X seg).

#### US-5.3 — Monitor por Operador (Portão simplificado) (5 SP) 🟡
- **AC (MVP simplificado):** lista operadores (`EventStaff` ativos no evento) com método predominante (Facial/QR/Manual), contagem de check-ins, alerta visual se velocidade caiu abaixo de threshold; agrupa cliente-side.

#### US-5.4 — Log de Últimas Entradas (3 SP)
- **AC:** lista das últimas 20 entradas (avatar, nome, setor/lote, tempo relativo, badge método); polling 5s; auto-scroll quando nova entrada surge.

#### US-5.5 — Action: marcar No-Show + correção (3 SP)
- **AC:** botão "Processar No-Shows" pós-evento → `/operation/no-shows`; modal de correção de check-in via `/operation/checkin/manual`.

**Total Épico 5:** ~16 SP

---

### Épico 6 — 💰 Financeiro

#### US-6.1 — Dashboard financeiro (Saldo + Saúde) (5 SP)
- **AC:** card hero "Saldo Disponível" + "Saldo a liberar" (consome `/finance/payouts/overview` e `/finance/summary`); botão "Sacar Agora" (comportamento confirmado na sprint 1); card "Saúde Financeira" com % PIX vs Cartão e taxa chargeback.

#### US-6.2 — Extrato detalhado (5 SP)
- **AC:** tabela paginada de movimentos (`/finance/ledger`); filtros data, tipo, evento; export CSV via `/finance/reports/export`.

#### US-6.3 — Repasses agendados (3 SP)
- **AC:** lista de repasses futuros com data prevista, valor, status (`/finance/payouts/overview`); detalhe expansível.

#### US-6.4 — Cancelamentos e Estornos (3 SP)
- **AC:** lista (`/finance/cancellations`); informação de quem cancelou, valor, motivo, status do estorno.

#### US-6.5 — Comissões de Promoter (5 SP)
- **AC:** lista por promoter com total devido / pago (`/finance/promoter-commissions/audit`); botão "Marcar como pago" abre modal com seleção (`mark-paid`); ranking visual.

#### US-6.6 — Solicitar Adiantamento (3 SP)
- **AC:** consulta elegibilidade (`/finance/advance/eligibility`) → mostra valor máximo + taxa; submete (`/finance/advance`) com confirmação.

**Total Épico 6:** ~24 SP

---

### Épico 7 — 👥 Equipe e Configurações

#### US-7.1 — Lista de equipe (3 SP)
- **AC:** tabela com membros (`/team`); papel (Owner/Staff), eventos vinculados, status; busca + filtro.

#### US-7.2 — Convidar membro (5 SP)
- **AC:** modal: busca usuário existente (`/users/search`) ou e-mail novo; seleciona papel + eventos; envia (`/team/invite`); convite gera senha temporária com `mustChangePassword`.

#### US-7.3 — Editar/remover membro (3 SP)
- **AC:** ações por linha: editar papel, toggle ativo, remover (com confirmação).

#### US-7.4 — Configurações > Perfil (2 SP)
- **AC:** form (nome fantasia, descrição, logo); persist `/profile`.

#### US-7.5 — Configurações > Bancário (3 SP)
- **AC:** edição da conta bancária; aviso de segurança; persist via endpoint do onboarding (`/onboarding/bank-data`) ou `/profile/banking` se existir.

#### US-7.6 — Configurações > Operacional (3 SP)
- **AC:** padrão de biometria, configs operacionais; persist `/profile/operational`.

#### US-7.7 — Configurações > Termos + Exclusão (2 SP)
- **AC:** ver termos; opção de exclusão de conta com fluxo de confirmação.

**Total Épico 7:** ~21 SP

---

### Épico 8 — 👑 Memberships VIP (STUB no MVP)

Backend não existe — **só UI placeholder** no MVP. Implementação completa fica num roadmap separado.

#### US-8.1 — Página VIP "Em breve" (1 SP)
- **AC:** rota `/vip` mostra hero com "Memberships estão a caminho" + descrição do valor + lista de espera (campo de e-mail apenas decorativo, sem persistência neste MVP).

**Total Épico 8:** ~1 SP no MVP. ~25-35 SP quando backend ficar pronto.

---

### Épico 9 — 🧪 Qualidade e Lançamento

#### US-9.1 — Testes unitários core (5 SP)
- **AC:** Vitest cobrindo lib/format, hooks de fetch, componentes críticos (FormDate, MoneyInput).

#### US-9.2 — Testes E2E de smoke (Playwright) (8 SP)
- **AC:** fluxos chave automatizados: login, criar evento, publicar, ver dashboard, sacar (mock).

#### US-9.3 — Tracking + observabilidade (3 SP)
- **AC:** Sentry instalado; PostHog/Plausible com eventos chave (login, criar evento, publicar, sacar).

#### US-9.4 — Acessibilidade pass (3 SP)
- **AC:** axe-core sem violações high/critical; navegação por teclado funcional; contrast AA.

#### US-9.5 — Deploy preview + produção (3 SP)
- **AC:** Vercel com previews por PR; produção em domínio dedicado (ex: `painel.pulse.app`).

#### US-9.6 — Documentação (3 SP)
- **AC:** `producer-web/README.md` com setup local, env vars, comandos, conventions; ADR-001 explicando stack.

**Total Épico 9:** ~25 SP

---

## 7. Backlog priorizado (P0 / P1 / P2)

| Prio | Épico | Stories | SP |
|---|---|---|---:|
| **P0** | 0 — Setup | 0.1, 0.2, 0.3, 0.4, 0.5, 0.6 | 24 |
| **P0** | 1 — Auth | 1.1, 1.2, 1.4 | 8 |
| **P0** | 2 — Onboarding | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7 | 14 |
| **P0** | 3 — Dashboard | 3.1, 3.2, 3.5, 3.6 | 12 |
| **P0** | 4 — Eventos CRUD | 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 | 31 |
| **P1** | 1 — Auth | 1.3 (mandatory pwd) | 3 |
| **P1** | 3 — Dashboard | 3.3, 3.7 | 5 |
| **P1** | 5 — Check-in | 5.1, 5.2, 5.3, 5.4, 5.5 | 16 |
| **P1** | 6 — Financeiro | 6.1, 6.2, 6.3, 6.4, 6.5, 6.6 | 24 |
| **P1** | 4 — Eventos | 4.8 (cancelar) | 3 |
| **P1** | 7 — Equipe + Config | 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7 | 21 |
| **P2** | 9 — Qualidade | 9.1, 9.2, 9.3, 9.4, 9.5, 9.6 | 25 |
| **P2** | 8 — VIP stub | 8.1 | 1 |
| **P2** | 3 — Dashboard | 3.4 (MRR escondido) | 1 |
| **TOTAL** | | | **~188 SP** |

A 20 SP/sprint, **~10 sprints** (20 semanas) pra cobrir P0+P1+P2. Como o usuário pediu 8 sprints, vamos focar em **P0 (89 SP) + parte de P1 (~71 SP) = ~160 SP em 8 sprints (~20 SP/sprint)**, deixando P2 + restos pra um eventual sprint 9-10.

---

## 8. Plano de Sprints (8 sprints / 16 semanas)

> **Premissas:** ~20 SP planejados/sprint (75% de 25 SP = buffer pra interrupções), 1 dev solo, sprints de 2 semanas, buffer de 1 dia/sprint pra polimento.

### 🟢 Sprint 1 — "Fundação Técnica" (Semanas 1–2)

**Sprint Goal:** Projeto Next.js no ar com tipagem end-to-end no backend e shell visual fiel ao mockup.

| Story | SP | Notas |
|---|---:|---|
| US-0.1 — Projeto Next.js inicializado | 3 | |
| US-0.2 — Eden Treaty + shim | 5 | Reutiliza padrão dos apps mobile |
| US-0.3 — Better Auth client + sessão server | 5 | |
| US-0.4 — Tailwind + shadcn/ui + tema Pulse | 3 | |
| US-0.5 — Layout shell (Sidebar + Header) | 5 | Paridade visual com mockup |
| **Total** | **21** | |

**Riscos:**
- Eden Treaty no SSR do Next pode exigir adaptações vs. apps mobile (RN). **Mitigação:** começar pelo shim e validar no dia 1.
- Better Auth pode ter quirks com cookies httpOnly em RSC. **Mitigação:** prototipar `getSession()` server-side cedo.

**DoD:** sidebar renderiza com 5 itens, header com placeholder; tipo do `pulseProducer` infere endpoints; CI verde; deploy preview da Vercel ok.

---

### 🟢 Sprint 2 — "CI + Login" (Semanas 3–4)

**Sprint Goal:** Produtor consegue logar e ver layout autenticado.

| Story | SP | Notas |
|---|---:|---|
| US-0.6 — CI: build + lint + types + test | 3 | |
| US-1.1 — Tela de Login | 3 | |
| US-1.2 — Esqueci senha (OTP) | 3 | |
| US-1.4 — Logout + expiração 2h | 2 | |
| US-2.1 — Hub onboarding com progresso | 3 | |
| US-2.2 — Onb. Perfil Básico | 2 | |
| US-2.3 — Onb. Contato | 1 | |
| US-2.4 — Onb. Endereço | 2 | ViaCEP |
| **Total** | **19** | |

**Riscos:**
- Onboarding tem 6 passos sequenciais — qualquer fluxo travar bloqueia o resto.
- **Mitigação:** começar com formato linear simples; refinar UX depois.

**DoD:** fluxo login → onboarding etapas 1-3 funcionando contra backend real; logout funcional; redirect inteligente.

---

### 🟢 Sprint 3 — "Onboarding Completo + Dashboard MVP" (Semanas 5–6)

**Sprint Goal:** Produtor termina onboarding e vê dashboard com KPIs principais.

| Story | SP | Notas |
|---|---:|---|
| US-2.5 — Onb. Bancário | 3 | |
| US-2.6 — Onb. Termos | 2 | |
| US-2.7 — Onb. Conclusão | 1 | |
| US-3.1 — KPI Receita Bruta | 2 | |
| US-3.2 — KPI Ingressos Vendidos | 2 | |
| US-3.5 — Gráfico Vendas Diárias | 5 | Recharts |
| US-3.6 — Próximos Eventos | 3 | |
| **Total** | **18** | |

**Riscos:**
- Shape de retorno do `/finance/insights` ou `/finance/ledger` pra gráfico pode exigir agregação cliente-side custosa.
- **Mitigação:** validar shape no dia 1 da sprint, ajustar US se necessário.

**DoD:** produtor recém-onboard chega ao dashboard com 2 KPIs reais + gráfico + próximos eventos.

---

### 🟢 Sprint 4 — "Eventos: Lista + Criação Básica" (Semanas 7–8)

**Sprint Goal:** Produtor lista eventos e cria/edita informações básicas.

| Story | SP | Notas |
|---|---:|---|
| US-4.1 — Lista com tabela | 5 | |
| US-4.2 — Bloco Informações Básicas | 5 | RichText simples |
| US-4.4 — Lateral (Imagem + Pulse Settings + Visibilidade) | 5 | |
| US-4.5 — Footer Salvar/Publicar | 2 | |
| US-4.6 — Edição de evento | 3 | |
| **Total** | **20** | |

**DoD:** produtor cria evento com infos básicas, capa, configs, visibilidade; rascunho salvo automaticamente; edita evento existente.

---

### 🟢 Sprint 5 — "Eventos: Setores e Lotes (DIFERENCIAL)" (Semanas 9–10)

**Sprint Goal:** Produtor cria estrutura comercial completa.

| Story | SP | Notas |
|---|---:|---|
| US-4.3 — Setores e Lotes (drag&drop, virada) | 8 | Story grande — mais arriscada |
| US-4.7 — Detalhe do evento (abas) | 3 | |
| US-4.8 — Cancelar evento | 3 | |
| US-1.3 — Mandatory password change | 3 | |
| US-3.3 — KPI Cadastros Faciais (se possível) | 2 | |
| **Total** | **19** | |

**Riscos:**
- US-4.3 é a story mais arriscada do projeto. dnd-kit + RHF + nested arrays.
- **Mitigação:** começar dia 1; cortar drag&drop se ficar muito ruim e usar setas ↑↓ como fallback.

**DoD:** produtor cria evento completo do zero (infos + setores + 2-3 lotes com viradas) e publica.

---

### 🟢 Sprint 6 — "Check-in ao vivo + Equipe" (Semanas 11–12)

**Sprint Goal:** Produtor monitora dia de evento + gerencia equipe.

| Story | SP | Notas |
|---|---:|---|
| US-5.1 — Seletor evento + indicador AO VIVO | 2 | |
| US-5.2 — KPIs Entradas + Velocidade | 3 | |
| US-5.3 — Monitor por Operador | 5 | Versão simplificada |
| US-5.4 — Log Últimas Entradas | 3 | Polling 5s |
| US-7.1 — Lista equipe | 3 | |
| US-7.2 — Convidar membro | 5 | |
| **Total** | **21** | |

**DoD:** dashboard de check-in operacional em tempo real (polling); convite de Staff funciona ponta a ponta.

---

### 🟢 Sprint 7 — "Financeiro Completo" (Semanas 13–14)

**Sprint Goal:** Produtor tem visão completa do dinheiro.

| Story | SP | Notas |
|---|---:|---|
| US-6.1 — Dashboard financeiro | 5 | |
| US-6.2 — Extrato detalhado | 5 | |
| US-6.3 — Repasses agendados | 3 | |
| US-6.4 — Cancelamentos | 3 | |
| US-3.7 — Sino notificações | 3 | |
| **Total** | **19** | |

**DoD:** produtor vê saldo, extrato, repasses, cancelamentos; sino mostra alertas operacionais.

---

### 🟢 Sprint 8 — "Polimento + Lançamento" (Semanas 15–16)

**Sprint Goal:** MVP em produção com qualidade.

| Story | SP | Notas |
|---|---:|---|
| US-6.5 — Comissões Promoter | 5 | |
| US-6.6 — Adiantamento | 3 | |
| US-7.3 — Editar/remover membro | 3 | |
| US-7.4 — Config Perfil | 2 | |
| US-7.5 — Config Bancário | 3 | |
| US-9.1 — Testes unitários core | 5 | |
| US-8.1 — VIP "Em breve" | 1 | |
| **Total** | **22** | (overpacked, vai ser cortado se atrasar) |

**DoD:** painel completo em produção, todos os fluxos P0+P1 cobertos exceto VIP funcional; testes core passando.

---

### 🟡 Sprints 9–10 (opcional, se houver budget)

- US-7.6 — Config Operacional
- US-7.7 — Termos + Exclusão de conta
- US-9.2 — E2E Playwright
- US-9.3 — Sentry + PostHog
- US-9.4 — A11y pass
- US-9.5 — Deploy produção dedicado
- US-9.6 — Documentação

---

## 9. Riscos e Mitigações

| # | Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|---|
| R1 | Eden Treaty no Next.js (RSC + Server Actions) ter quirks vs. RN | Alto (bloqueador inicial) | Média | Validar no Sprint 1 dia 1; fallback pra `axios` + tipos manuais |
| R2 | Better Auth client em RSC complicar sessão server-side | Médio | Média | Prototipar `getSession()` cedo; ler issues do repo |
| R3 | US-4.3 (Setores+Lotes drag&drop) estourar prazo | Alto | Média | Cortar drag&drop pra fallback de setas ↑↓ no Sprint 5 |
| R4 | Backend não retornar shape ideal pro gráfico do dashboard | Médio | Alta | Validar contrato no Sprint 3 dia 1; agregar cliente-side se preciso |
| R5 | Polling 5s no check-in ao vivo gerar carga / latência ruim | Baixo | Média | Subir intervalo pra 10s ou usar SWR com revalidate; websocket fica pra Sprint 9+ |
| R6 | Pendência de Membership/VIP virar pressão pra mudar backend mid-roadmap | Alto | Alta | Manter VIP fora do MVP de forma firme; PRD separado |
| R7 | Acessibilidade descoberta tarde gerar refactor grande | Médio | Baixa | Usar shadcn/ui (a11y built-in) desde o início; axe rodando local |
| R8 | Inconsistência visual com mockups por causa de Tailwind compilado | Baixo | Baixa | Compilar Tailwind cedo, comparar com mockups pixel a pixel no Sprint 1-2 |

---

## 10. Definition of Done (DoD)

Toda story só fecha se:

- [ ] Código revisado (auto-review estruturado, ou peer se houver outro dev)
- [ ] Biome check sem erros nem warnings
- [ ] `tsc --noEmit` sem erros
- [ ] Testes unitários cobrindo lógica nova (Vitest)
- [ ] Build de produção passa sem warnings
- [ ] Funciona contra backend real em ambiente de dev
- [ ] Estados de loading, erro e vazio implementados
- [ ] Acessibilidade básica (navegação por teclado + labels)
- [ ] Mobile/tablet pelo menos não quebra (não responsivo perfeito, mas usável)
- [ ] Deploy preview Vercel verde
- [ ] Story atualizada com link do PR e screenshot

---

## 11. Pendências de Produto (decisões pendentes do usuário)

Coisas que precisamos decidir antes de algumas sprints. Sem isso, paramos.

| # | Decisão | Dependente de | Quando precisamos |
|---|---|---|---|
| D1 | Domínio do painel (`painel.pulse.app`? `pro.pulse.app`?) | Marketing | Sprint 1 |
| D2 | Logo do produtor (upload no onboarding ou só nas configs?) | Produto | Sprint 3 |
| D3 | Comportamento do botão "Sacar Agora": automático D+2 ou requisição manual? | Financeiro/Backend | Sprint 7 |
| D4 | Roadmap de Membership/VIP: priorizar ou empurrar pro próximo trimestre? | Estratégia | Antes do Sprint 8 |
| D5 | Política de no-show: timer X após início pra processar automático ou só manual? | Operação | Sprint 6 |
| D6 | Texto dos termos do produtor (legal) | Jurídico | Sprint 3 |
| D7 | Limite mínimo/máximo de saque/adiantamento | Financeiro | Sprint 8 |
| D8 | E-mail de convite de Staff: template e remetente | Marketing | Sprint 6 |

---

## 12. Próximos passos imediatos

1. **Você confirma** stack, capacidade, prazo (este documento).
2. **Decisão D1** (domínio) e **D2** (logo) na primeira semana.
3. **Início Sprint 1.** Primeiras 48h: validar Eden Treaty + Better Auth no Next.js (mitigação dos riscos R1 e R2).
4. **Daily check (eu te aviso assim que algo bloquear).**
5. **Demo ao fim de cada sprint** — vídeo curto + checklist de stories fechadas.

---

## 13. Resumo executivo

- **8 sprints (~16 semanas)** pra MVP funcional do painel web do produtor.
- **160 SP de trabalho** entregue (P0 + maior parte do P1), ~28 SP de P2 ficam pra Sprints 9-10 ou pós-launch.
- **Backend não muda** — gaps levantados (Membership, métrica facial, monitor por portão, saque self-service) ficam fora do escopo deste roadmap.
- **Pontos de atenção:** Eden+Next (semana 1), drag&drop de lotes (sprint 5), Membership pressão (constante).
- **Saída:** painel em produção em `painel.pulse.app` (ou domínio definido) com paridade visual com os mockups e funcional contra o backend Pulse! atual.

---

*Última atualização: 2026-05-04 | Roadmap gerado a partir dos mockups em `~/workspace/pulse/producer-web/`*
