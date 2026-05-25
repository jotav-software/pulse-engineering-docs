# Pulse — Documentação de Engenharia

Repositório central de **arquitetura, padrões, segurança, produto e backlog técnico** do ecossistema **Pulse** (JV / jotav-software). Fonte canônica — os repositórios de código mantêm apenas READMEs e documentação técnica local.

## Repositórios de código

| Repositório | Descrição |
|-------------|-----------|
| [pulse-backend](https://github.com/jotav-software/pulse-backend) | API Bun + Elysia + Prisma |
| [pulse-producer-web](https://github.com/jotav-software/pulse-producer-web) | Portal produtor/admin (Next.js) |
| [client-web](https://github.com/jotav-software/client-web) | Web B2C + landing marketing (Next.js) |
| [pulse-app-client](https://github.com/jotav-software/pulse-app-client) | App cliente (Expo) |
| [pulse-app-producer](https://github.com/jotav-software/pulse-app-producer) | App organizador (Expo) |
| [pulse-face](https://github.com/jotav-software/pulse-face) | Microserviço biometria (FastAPI) |
| ~~[pulse-landing-page](https://github.com/jotav-software/pulse-landing-page)~~ | **Descontinuado** — migrado para client-web |

## Estrutura

```
pulse-engineering-docs/
├── adr/           Architectural Decision Records (1, 2, 3...)
├── architecture/  Visão técnica, princípios, golden rules, pagamentos, jobs
├── standards/     Padrões transversais (API, backend, frontend, testes, segurança, comentários, Prisma)
├── product/       Produto: specs, políticas, acesso, facial, dev
├── backlog/       Roadmaps e épicos técnicos
├── brand/         Brand kit: assets canônicos (`assets/`), HTML kits (`kit/`), screenshots
├── commercial/    Materiais de apresentação para cliente (HTMLs)
├── prototypes/    Índice central de mocks HTML (ver README)
├── ops/           Credenciais de deploy (App Store API, etc) — sem segredos
└── scripts/       Automação dos docs (Python)
```

## Índice

### Architectural Decision Records (ADR)
- [ADR-001 — Backend stack](./adr/ADR-001-backend-stack.md)
- [ADR-002 — Authentication strategy](./adr/ADR-002-authentication-strategy.md)
- [ADR-003 — Implementation rules](./adr/ADR-003-implementation-rules.md)

### Arquitetura
- [Visão geral](./architecture/overview.md)
- [Princípios](./architecture/principles.md)
- [Golden rules](./architecture/golden-rules.md)
- [Job de repasse (RETAINED → AVAILABLE)](./architecture/job-repasse.md)
- [Pagamentos — especificação técnica](./architecture/payments/especificacao.md)
- [Pagamentos — checkout flows](./architecture/payments/checkout-flows.md)

### Padrões
- [API e contratos](./standards/api.md)
- [Backend](./standards/backend.md)
- [Frontend](./standards/frontend.md)
- [Tratamento de erros](./standards/errors.md)
- [Testes](./standards/testing.md)
- [Segurança](./standards/security.md)
- [Regras técnicas (consolidado)](./standards/technical-rules.md)
- [Prisma workflow](./standards/prisma-workflow.md)
- [Backend comments](./standards/backend-comments.md) · [roadmap](./standards/backend-comments-roadmap.md)
- [Tipagem OpenAPI](./standards/openapi-typing.md)

### Produto
- [Índice produto](./product/README.md)
- [Especificação funcional (por sistema)](./product/especificacao-funcional/README.md)
  - [Pulse Admin](./product/especificacao-funcional/pulse-admin.md)
  - [App Produtor](./product/especificacao-funcional/app-produtor.md)
  - [Producer Web](./product/especificacao-funcional/producer-web.md)
  - [App Cliente](./product/especificacao-funcional/app-client.md)
  - [Client Web](./product/especificacao-funcional/client-web.md)
  - [Arquitetura (visão funcional)](./product/especificacao-funcional/arquitetura.md)
  - [Endpoints](./product/especificacao-funcional/api-endpoints.md)
  - [Fluxos detalhados](./product/especificacao-funcional/fluxos/README.md)
- Acesso — [RBAC](./product/access/rbac.md) · [Role matrix](./product/access/role-matrix.md)
- Políticas — [Regras globais](./product/policies/global-business-rules.md) · [Repasse](./product/policies/payout-policies.md) · [KYC](./product/policies/kyc-blocking-matrix.md) · [Checkout compliance (HU06)](./product/policies/checkout-compliance.md)
- Dev — [Test users](./product/dev/test-users.md)
- Biometria facial — [como funciona](./product/facial/como-funciona-biometria-facial.md) · [LGPD](./product/facial/lgpd-security.md) · [enrollment MVP](./product/facial/enrollment-mvp.md) · [infra deploy](./product/facial/infra-deploy-checklist.md) · [épico self-hosted](./product/facial/epic-self-hosted.md)

### Backlog
- [Épico — melhorias técnicas](./backlog/epic-technical-improvements.md)
- [Roadmap Producer Web](./backlog/roadmap-producer-web.md)
- [Plano events & ticketing](./backlog/events-ticketing-plan.md)
- [Membership VIP](./backlog/membership-vip.md) — [PENDENTE]

### Brand & Commercial
- [Brand kit brief](./brand/brand-kit-brief.md)
- Brand kit (HTML): `brand/kit/` · Assets canônicos: `brand/assets/` · sync: `scripts/sync-brand-assets.sh` · CDN: `ops/brand-cdn.md`
- **Documentação no CDN:** `/docs/` (preview Markdown, auth) — ver [ops/brand-cdn.md](./ops/brand-cdn.md)
- Apresentações para cliente: `commercial/`
- **Índice de mocks HTML:** [prototypes/README.md](./prototypes/README.md)

### Ops
- [Variáveis de ambiente (por sistema)](./ops/environment-variables.md)
- [Brand CDN (Railway)](./ops/brand-cdn.md)
- [App Store Connect API (metadata, sem `.p8`)](./ops/app-store-connect-api.md) — chaves privadas em `~/workspace/keys/`

## Convivência com os repositórios

Cada repo de código mantém:

- `README.md` — visão geral, setup, scripts
- `CHANGELOG.md` — histórico de versões (onde aplicável)
- `CLAUDE.md` — instruções para assistentes IA (somente backend)
- Documentação técnica **estritamente local** (ex.: `src/lib/auth/README.md`) que descreve uma pasta específica do código

Tudo mais é centralizado aqui.

## Como contribuir

1. Alteração de padrão/produto/ADR: PR neste repositório.
2. Implementação: PR no repositório de código, referenciando a issue do épico.
3. Nunca commitar segredos (`.env`, chaves `.p8`, tokens).
