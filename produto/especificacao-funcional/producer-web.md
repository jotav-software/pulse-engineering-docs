# Producer Web (portal da produtora)

> Escopo: painel web da produtora (não é Admin) | Público: Dono, Gestor, Staff | Plataforma: Next.js `producer-web/` rotas `(producer)/*` | Última revisão: 2026-05-20

## Legenda de status

| Tag | Significado |
| --- | --- |
| `[IMPLEMENTADO]` | Entregue e utilizável em produção ou demo estável |
| `[PARCIAL]` | Fluxo existe com lacunas (inclui UI «em breve») |
| `[PENDENTE]` | Não implementado ou apenas planejado |

Fonte de status: código (`app-producer`, `producer-web`, `app-client`, `client-web`, `backend`) + `docs/RBAC.md` + revisão 2026-05-19.


## 1. Visão geral

Portal **desktop-first** da produtora: dashboard, eventos, financeiro, equipe, onboarding e listas. Compartilha deploy com Pulse Admin, mas rotas **`/admin/*` estão excluídas** deste documento ([pulse-admin.md](./pulse-admin.md)).

Rotas: /dashboard, /events, /finance/*, /team, /settings, onboarding /onboarding/*, /lists. Check-in operacional ao vivo [PENDENTE] (botão «Em breve» em quick-actions). Listas /lists: consulta participantes [PARCIAL]. Financeiro web: repasse e KPIs [IMPLEMENTADO]; cancelamentos/comissões UI [PENDENTE]. Área admin isolada em /admin/* — ver seção 21 (não confundir com portal produtor).

### Rotas principais (implementadas)

| Rota | Função | Status |
| --- | --- | --- |
| `/login`, `/forgot-password`, `/set-password` | Auth | [IMPLEMENTADO] |
| `/onboarding/*` | Cadastro produtora + KYC | [IMPLEMENTADO] |
| `/dashboard` | KPIs e atalhos | [IMPLEMENTADO] |
| `/events`, `/events/new`, `/events/[id]` | CRUD eventos | [IMPLEMENTADO] |
| `/finance`, `/finance/payouts`, `/finance/statement` | Financeiro | [PARCIAL] |
| `/team` | Equipe (gestor, staff, promoter) | [IMPLEMENTADO] |
| `/settings` | Perfil e conta | [PARCIAL] |
| `/lists` | Listas operacionais | [PARCIAL] |
| `/vip` | Programa VIP | [PARCIAL] stub «em breve» |

## 2. Autenticação e acesso

- Login produtor: `POST /api/producer/v1/auth/login`
- Compliance gate com documentos dinâmicos e pendências de aceite ([checkout-compliance.md](../regras-negocio/checkout-compliance.md))
- Middleware web restringe sidebar por papel (Gestor sem `/finance` global)

## 3. Módulos / funcionalidades

### 3.1 Onboarding & KYC — [IMPLEMENTADO]

Fluxo `/onboarding/*` + upload documentos titular; fila revisada no [Pulse Admin](./pulse-admin.md).

- **Publicar evento:** bloqueado no backend até `producerKycStatus = KYC_APPROVED` (mesma regra do App Produtor).
- Readiness na UI deve refletir bloqueio KYC — ver [kyc-blocking-matrix.md](../regras-negocio/kyc-blocking-matrix.md).

### 3.2 Eventos & oferta comercial — [IMPLEMENTADO]

- CRUD e publicação com readiness
- Comercial/lotes: paridade com app; gestão avançada de lotes [PARCIAL] vs App Produtor
- Criação rápida sem setores na web em alguns fluxos [PARCIAL]

### 3.3 Dashboard — [IMPLEMENTADO]

Cards, gráfico de vendas, eventos próximos, alertas. Insights preditivos [PENDENTE].

### 3.4 Participantes & emissão manual — [IMPLEMENTADO]

Lista, busca, cortesia e venda direta. Exportações [PENDENTE].

### 3.5 Check-in ao vivo — [PENDENTE]

Paridade com App Produtor Access: botões «Em breve» no dashboard. Backend já expõe `operation/*` (QR `qrCodeHash`, facial 1:N/1:1, manual com `cpfLast3`) — ver [app-produtor.md](./app-produtor.md#37-access-check-in--implementado).

### 3.6 Financeiro — [PARCIAL]

| Submódulo | App Produtor | Producer Web |
| --- | --- | --- |
| Resumo / por evento | [IMPLEMENTADO] | [IMPLEMENTADO] / [PARCIAL] |
| Cancelamentos na UI | [IMPLEMENTADO] | [PENDENTE] |
| Repasses / antecipação | [IMPLEMENTADO] | [IMPLEMENTADO] |
| Comissões promoter | — | [PENDENTE] |

### 3.7 Equipe & RBAC — [PARCIAL]

Convites: `invite-manager`, staff, promoter ([RBAC.md](../RBAC.md)). Validação visual por tela em evolução.

## 4. Permissões (RBAC nesta plataforma)

Área produtora (`/dashboard`, `/events`, …) — sem acesso `/admin/*`.

| Capacidade | Dono | Gestor | Staff |
| --- | --- | --- | --- |
| Dashboard GMV empresa | ✅ | ❌ | ❌ |
| `/finance` global | ✅ | ❌ | ❌ |
| Financeiro por evento | ✅ | ✅ | ❌ |
| Equipe — convidar Gestor/Staff | ✅ | ❌ | ❌ |
| Equipe — convidar Promoter | ✅ | ✅ | ❌ |

## 5. Integrações e dependências

- Eden Treaty → backend `/api/producer/v1`
- Better Auth cliente, TanStack Query
- Roadmap histórico: [roadmap-producer-web.md](../../backlog/roadmap-producer-web.md)

## 6. Backlog / pendências

| Item | Status |
| --- | --- |
| Check-in web ao vivo | [PENDENTE] |
| Checkout/carteira (escopo B2C no client-web) | N/A |
| Telas cancelamentos/comissões financeiro | [PENDENTE] |
| Analytics preditivos | [PENDENTE] |

## 7. Referências cruzadas

- [app-produtor.md](./app-produtor.md)
- [pulse-admin.md](./pulse-admin.md)
- [client-web.md](./client-web.md)
