# Pulse — Documentação Central

Repositório canônico de **marca, engenharia, produto, jurídico, comercial e operações** do ecossistema **Pulse** (JV / jotav-software). Também serve como **CDN** (logos públicos + docs internos protegidos).

Os repositórios de código mantêm apenas READMEs locais e documentação estritamente técnica de pasta.

## Repositórios de código

| Repositório | Descrição |
|-------------|-----------|
| [pulse-backend](https://github.com/jotav-software/pulse-backend) | API Bun + Elysia + Prisma |
| [pulse-producer-web](https://github.com/jotav-software/pulse-producer-web) | Portal produtor/admin (Next.js) |
| [client-web](https://github.com/jotav-software/client-web) | Web B2C + landing marketing (Next.js) |
| [pulse-app-client](https://github.com/jotav-software/pulse-app-client) | App cliente (Expo) |
| [pulse-app-producer](https://github.com/jotav-software/pulse-app-producer) | App organizador (Expo) |
| [pulse-face](https://github.com/jotav-software/pulse-face) | Microserviço biometria (FastAPI) |

## Estrutura — 6 domínios

```
pulse-engineering-docs/
├── marca/                  CDN: /assets (público) + /kit (protegido)
│   ├── assets/             Logos, ícones, splash, cores
│   ├── kits/               Brand kits HTML interativos
│   └── brand-kit-brief.md
│
├── engenharia/             Docs técnicos → /docs/engenharia/**
│   ├── decisoes/           Decisões de arquitetura (ADR)
│   ├── arquitetura/        Visão técnica, pagamentos, jobs
│   ├── padroes/            Padrões de código (API, backend, frontend…)
│   └── backlog/            Roadmaps e épicos técnicos
│
├── produto/                Spec e regras → /docs/produto/**
│   ├── especificacao-funcional/
│   ├── regras-negocio/     Regras INTERNAS (alinhadas ao código)
│   ├── acesso/             RBAC e matriz de papéis
│   ├── biometria/          Domínio facial
│   └── qa/                 Contas de teste
│
├── juridico/               Legal → /docs/juridico/**
│   ├── contratos/
│   ├── politicas-publicas/ Textos para USUÁRIO FINAL (drafts)
│   ├── lgpd/
│   ├── fiscal/
│   └── conformidade/
│
├── comercial/              Marketing → /docs/comercial/**
│   ├── lancamento/         Go-to-market, ads, pricing
│   └── apresentacoes/      Decks HTML para clientes
│
├── operacoes/              Infra → /docs/operacoes/**
│   ├── variaveis-ambiente.md
│   ├── cdn-e-docs.md
│   └── plano-lancamento-tecnico.md
│
├── _apenas-git/            Nunca vai pro Railway
│   ├── prototipos/         Mocks HTML + PNG (referência)
│   ├── capturas-marca/     Screenshots App Store
│   ├── scripts/            Automação Python/shell
│   ├── midia/              Vídeos locais
│   └── historico/          Logs de migração
│
├── server.js, lib/         Runtime CDN (Railway)
└── README.md               Este arquivo
```

## Glossário

| Termo | Significado |
|-------|-------------|
| **ADR** | *Architecture Decision Record* — registro de decisão técnica importante |
| **GTM** | *Go-to-Market* — estratégia de lançamento comercial |
| **RBAC** | Controle de acesso por papéis (admin, produtor, staff…) |
| **KYC** | Verificação de identidade do produtor |
| **LGPD** | Lei Geral de Proteção de Dados (Lei 13.709/2018) |
| **Regras de negócio** | `produto/regras-negocio/` — regras internas para engenharia/PO |
| **Políticas públicas** | `juridico/politicas-publicas/` — textos legais para usuário final |

## CDN (Railway — serviço `pulse-brand-assets`)

| Rota | Auth | Conteúdo |
|------|------|----------|
| `/assets/**` | Nenhuma | Logos e ícones (apps consomem via `*_BRAND_CDN_URL`) |
| `/kit/**` | Interna | Brand kits HTML |
| `/docs/**` | Interna | Preview Markdown de todos os domínios |

Detalhes: [operacoes/cdn-e-docs.md](./operacoes/cdn-e-docs.md)

## Índice rápido

### Engenharia — Decisões (ADR)
- [ADR-001 — Backend stack](./engenharia/decisoes/ADR-001-backend-stack.md)
- [ADR-002 — Authentication strategy](./engenharia/decisoes/ADR-002-authentication-strategy.md)
- [ADR-003 — Implementation rules](./engenharia/decisoes/ADR-003-implementation-rules.md)

### Engenharia — Arquitetura
- [Visão geral](./engenharia/arquitetura/overview.md) · [Princípios](./engenharia/arquitetura/principles.md) · [Golden rules](./engenharia/arquitetura/golden-rules.md)
- [Job de repasse](./engenharia/arquitetura/job-repasse.md)
- [Pagamentos](./engenharia/arquitetura/payments/especificacao.md) · [Checkout flows](./engenharia/arquitetura/payments/checkout-flows.md)

### Engenharia — Padrões
- [API](./engenharia/padroes/api.md) · [Backend](./engenharia/padroes/backend.md) · [Frontend](./engenharia/padroes/frontend.md)
- [Segurança](./engenharia/padroes/security.md) · [Testes](./engenharia/padroes/testing.md)
- [Regras técnicas](./engenharia/padroes/technical-rules.md) · [Prisma](./engenharia/padroes/prisma-workflow.md)

### Produto
- [Índice produto](./produto/README.md)
- [Especificação funcional](./produto/especificacao-funcional/README.md)
- [Regras globais](./produto/regras-negocio/global-business-rules.md) · [Aceite legal](./produto/regras-negocio/checkout-compliance.md) · [Repasse](./produto/regras-negocio/payout-policies.md) · [KYC](./produto/regras-negocio/kyc-blocking-matrix.md)
- [RBAC](./produto/acesso/rbac.md) · [Biometria](./produto/biometria/como-funciona-biometria-facial.md)

### Jurídico
- [Índice jurídico](./juridico/README.md)
- [Contrato produtor](./juridico/contratos/contrato-adesao-produtor.md) · [Termos B2C](./juridico/contratos/termos-de-uso-cliente.md)
- [Privacidade](./juridico/politicas-publicas/politica-privacidade.md) · [Reembolso](./juridico/politicas-publicas/politica-reembolso.md)

### Comercial
- [Go-to-market](./comercial/lancamento/go-to-market-plan.md) · [Pricing](./comercial/lancamento/pricing-publico.md)

### Backlog técnico
- [Épico melhorias](./engenharia/backlog/epic-technical-improvements.md) · [Roadmap Producer Web](./engenharia/backlog/roadmap-producer-web.md)

### Marca & Operações
- [Brand kit brief](./marca/brand-kit-brief.md) · Sync: `./_apenas-git/scripts/sync-brand-assets.sh`
- [Variáveis de ambiente](./operacoes/variaveis-ambiente.md) · [CDN](./operacoes/cdn-e-docs.md)
- [Protótipos (índice)](./_apenas-git/prototipos/README.md)

## Como contribuir

1. Alteração de padrão/produto/ADR: PR neste repositório.
2. Implementação: PR no repositório de código, referenciando o épico.
3. Nunca commitar segredos (`.env`, chaves `.p8`, tokens).

## Histórico de reorganizações

- [MIGRATION-LOG.md](./_apenas-git/historico/MIGRATION-LOG.md) — consolidação inicial (2026-05-20)
- [REORGANIZACAO-2026-05-25.md](./_apenas-git/historico/REORGANIZACAO-2026-05-25.md) — estrutura 6 domínios
