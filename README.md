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
pulse-engineering-docs/
├── docs/                   Docs técnicos, produto, legal, ops
│   ├── arquitetura/        Visão técnica, decisões (ADR), pagamentos
│   ├── produto/            Specs, regras de negócio, acesso, biometria
│   ├── negocio/            Contratos, LGPD, fiscal, comercial, GTM
│   ├── operacoes/          Deploy, infra, CDN, variáveis
│   └── padroes/            Padrões de código, testes, backlog
│
├── public/                 CDN: /assets (público) + /kit (protegido)
│   ├── assets/             Logos, ícones, splash, cores
│   └── kits/               Brand kits HTML interativos
│
├── src/                    Runtime CDN (Railway)
│   ├── server.js           Express server
│   └── lib/docs.js         Markdown generator
│
├── _apenas-git/            Nunca vai pro Railway
│   ├── prototipos/         Mocks HTML + PNG (referência)
│   ├── exports/            Exportações brutas do Figma
│   ├── scripts/            Automação Python/shell
│   ├── midia/              Vídeos locais
│   └── historico/          Logs de migração
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

### Arquitetura (Antigo Engenharia)
- [ADR-001 — Backend stack](./docs/arquitetura/ADR-001-backend-stack.md) · [ADR-002 — Auth](./docs/arquitetura/ADR-002-authentication-strategy.md)
- [Visão geral](./docs/arquitetura/overview.md) · [Princípios](./docs/arquitetura/principles.md)
- [Pagamentos](./docs/arquitetura/payments/especificacao.md) · [Job repasse](./docs/arquitetura/job-repasse.md)

### Padrões e Backlog
- [API](./docs/padroes/api.md) · [Backend](./docs/padroes/backend.md) · [Frontend](./docs/padroes/frontend.md)
- [Testes](./docs/padroes/testing.md) · [Prisma](./docs/padroes/prisma-workflow.md)
- [Épico melhorias](./docs/padroes/epic-technical-improvements.md) · [Roadmap Producer Web](./docs/padroes/roadmap-producer-web.md)

### Produto
- [Índice produto](./docs/produto/README.md) · [Especificação funcional](./docs/produto/especificacao-funcional/README.md)
- [Regras globais](./docs/produto/regras-negocio/global-business-rules.md) · [KYC](./docs/produto/regras-negocio/kyc-blocking-matrix.md)
- [RBAC](./docs/produto/acesso/rbac.md) · [Biometria](./docs/produto/biometria/como-funciona-biometria-facial.md)

### Negócio (Jurídico e Comercial)
- [Índice jurídico](./docs/negocio/README.md)
- [Contrato produtor](./docs/negocio/contratos/contrato-adesao-produtor.md) · [Termos B2C](./docs/negocio/contratos/termos-de-uso-cliente.md)
- [Go-to-market](./docs/negocio/lancamento/go-to-market-plan.md) · [Pricing](./docs/negocio/lancamento/pricing-publico.md)
- [Brand kit brief](./docs/negocio/brand-kit-brief.md)

### Operações & Assets
- Sync assets: `./_apenas-git/scripts/sync-brand-assets.sh`
- [Variáveis de ambiente](./docs/operacoes/variaveis-ambiente.md) · [CDN](./docs/operacoes/cdn-e-docs.md)
- [Protótipos (índice)](./_apenas-git/prototipos/README.md)

## Como contribuir

1. Alteração de padrão/produto/ADR: PR neste repositório.
2. Implementação: PR no repositório de código, referenciando o épico.
3. Nunca commitar segredos (`.env`, chaves `.p8`, tokens).

## Histórico de reorganizações

- [MIGRATION-LOG.md](./_apenas-git/historico/MIGRATION-LOG.md) — consolidação inicial (2026-05-20)
- [REORGANIZACAO-2026-05-25.md](./_apenas-git/historico/REORGANIZACAO-2026-05-25.md) — estrutura 6 domínios
