# Log de migração — consolidação de documentação

**Data:** 2026-05-20
**Modo:** não-destrutivo (apenas cópias; origens intactas).

## Origens → Destinos

### Produto / Spec funcional
| Origem | Destino |
|---|---|
| `docs/especificacao-funcional/*.md` (7) | `product/especificacao-funcional/` |
| `app-producer/docs/fluxos/**` (4) | `product/especificacao-funcional/fluxos/` |
| `docs/RBAC.md` *(19/mai 20:38 — mais recente)* | `product/rbac.md` |
| `docs/TEST-USERS.md` | `product/test-users.md` |
| `docs/CHECKOUT_COMPLIANCE.md` | `product/checkout-compliance.md` |
| `docs/product/ROLE_MATRIX.md` | `product/role-matrix.md` |
| `backend/docs/product/kyc-blocking-matrix.md` *(versão completa)* | `product/kyc-blocking-matrix.md` *(substitui stub)* |
| `docs/product/facial-*.md` (3) + `epic-facial-self-hosted.md` + `como-funciona-biometria-facial.md` | `product/facial/` |

### Arquitetura
| Origem | Destino |
|---|---|
| `docs/product/technical/ARCHITECTURE_PRINCIPLES.md` | `architecture/principles.md` |
| `backend/docs/technical/ARCHITECTURE_GOLDEN_RULES.md` | `architecture/golden-rules.md` |
| `backend/docs/job-repasse.md` | `architecture/job-repasse.md` |
| `docs/product/technical/payments/PAGAMENTOS_ESPECIFICACAO.md` | `architecture/payments/especificacao.md` |
| `docs/product/technical/CHECKOUT_FLOWS.md` | `architecture/payments/checkout-flows.md` |

### Padrões
| Origem | Destino |
|---|---|
| `docs/product/technical/TECHNICAL_RULES.md` *(versão grande, 31/mar)* | `standards/technical-rules.md` |
| `docs/product/technical/PRISMA-WORKFLOW.md` | `standards/prisma-workflow.md` |
| `docs/product/technical/BACKEND_COMMENTS.md` | `standards/backend-comments.md` |
| `docs/product/technical/BACKEND_COMMENTS_ROADMAP.md` | `standards/backend-comments-roadmap.md` |
| `backend/docs/technical/openapi-typing-increment.md` | `standards/openapi-typing.md` |

### ADRs
| Origem | Destino |
|---|---|
| `backend/docs/technical/ADR-001-Backend-Stack.md` *(versão completa, 5/mai)* | `adr/ADR-001-backend-stack.md` *(substitui stub)* |
| `backend/src/docs/technical/ADR-002-Authentication-Strategy.md` | `adr/ADR-002-authentication-strategy.md` |
| `backend/src/docs/technical/ADR-003-Implementation-Rules.md` | `adr/ADR-003-implementation-rules.md` |

### Backlog
| Origem | Destino |
|---|---|
| `docs/ROADMAP-PRODUCER-WEB.md` | `backlog/roadmap-producer-web.md` |
| `docs/product/implementation/02-events-ticketing-plan.md` | `backlog/events-ticketing-plan.md` |

### Brand / Commercial / Ops
| Origem | Destino |
|---|---|
| `docs/BRAND-KIT-BRIEF.md` | `brand/brand-kit-brief.md` |
| `docs/Pulse/pulse-kit/*` (HTMLs + assets) | `brand/kit/` |
| `docs/Pulse/uploads/logo-pulse-*.{svg,png}` + `app-icon-pulse-*.png` | `brand/assets/` |
| `docs/apresentacao/pagamentos-pulse-cliente.html` | `commercial/commercial-payments-client.html` |
| `app-client/docs/app-store-connect-api.md` | `ops/app-store-connect-api.md` |
| `docs/scripts/*.py` | `scripts/` |

### Pendente-conferir (não promovido — aguardando validação)
| Origem | Destino |
|---|---|
| `docs/product/business/**` (17) | `_pendente-conferir/business-pre-spec-funcional/` |
| `docs/Pulse/Pulse Admin Panel.html` + `tokens.css` + `pulse-admin/` | `_pendente-conferir/admin-mock/` |
| `docs/app-store-screenshots/**` | `_pendente-conferir/screenshots/` |
| `docs/Guia_Integracao_SmartPOS_WhoollieFood.pdf`, `pagarme_intro.txt`, propostas GCP | `_pendente-conferir/_candidatos-delete/` |

### Movimentações executadas (destrutivas, com aprovação)
| Origem | Destino |
|---|---|
| `docs/AuthKey_2UVTMTPQVA.p8` | `~/workspace/keys/` ✅ |
| `docs/AuthKey_5T734CQ67S.p8` | `~/workspace/keys/` ✅ |
| `docs/agency-agents/` (361 arquivos) | `~/workspace/agency-agents/` ✅ |
| `docs/Pulse/Pulse Admin Panel.html` | `producer-web/prototypes/admin/admin-dashboard-mock.html` ✅ |
| `docs/app-store-screenshots/` (22 PNGs ipad/mobile) | `app-client/docs/app-store-screenshots/` ✅ |
| `docs/Pulse/screenshots/app-client/` (7 PNGs marca) | `pulse-engineering-docs/brand/screenshots/app-client/` ✅ |

### Exclusões executadas
- `docs/Pulse.zip` (25 MB)
- `docs/Pulse/uploads/` — Capturas Slack (19 PNGs), `proposta-gcp.pdf`, `[GCP] Novo Site... Proposta.pdf`, `index.html`, `pasted-*.png`, `BRAND-KIT-BRIEF.md` (dup)
- `docs/Guia_Integracao_SmartPOS_WhoollieFood.pdf` (outro produto)
- `docs/pagarme_intro.txt` (substituído por `architecture/payments/especificacao.md`)
- `docs/` (raiz inteira) — após esvaziar
- `backend/docs/` + `backend/src/docs/` — conteúdo centralizado
- `app-client/docs/checkout_rules.md` + `app-client/docs/app-store-connect-api.md`
- `app-producer/docs/fluxos/` (mantido `README.md` apontando para o central)

### Estado final dos repos de código
| Repo | Conteúdo de doc remanescente |
|---|---|
| `client-web` | `README.md` + `prototypes/README.md` |
| `producer-web` | `README.md` + `src/lib/auth/README.md` + `prototypes/README.md` + `prototypes/admin/admin-dashboard-mock.html` (mockup) |
| `app-client` | `CHANGELOG.md` + `docs/app-store-screenshots/` |
| `app-producer` | `CHANGELOG.md` + `docs/README.md` + `docs/app-store-screenshots/` + `src/infrastructure/auth/README.md` |
| `pulse-face` | `README.md` + `tests/fixtures/README.md` |
| `landing-page` | `README.md` |
| `backend` | `README.md` + `CHANGELOG.md` + `CLAUDE.md` |

## Consolidação business → canônico (2026-05-20)

Revisão de `_pendente-conferir/business-pre-spec-funcional/` (17 arquivos de `docs/product/business/`) concluída.

### Promovidos

| Origem pendente | Destino canônico |
|---|---|
| `PAYOUT_POLICIES.md` | `product/payout-policies.md` (código D+1 canônico; § legado 10 check-ins) |
| `GLOBAL_BUSINESS_RULES.md` | `product/global-business-rules.md` |
| `05-membership.md` | `backlog/membership-vip.md` [PENDENTE] |

### Mesclados na especificação funcional

Conteúdo único integrado em `product/especificacao-funcional/` (app-produtor, producer-web, app-client, client-web, pulse-admin, README): KYC bloqueio publicação, `cpfLast3` manual, `qrCodeHash`, multi-PSP, taxas conforme código (10% + Pix 5% taxa + 4x), fluxo facial/check-in.

### Atualizados

- `product/kyc-blocking-matrix.md` — gates implementados vs helper repasse
- `architecture/payments/especificacao.md` — links e taxa 10% (código)
- `README.md`, scripts `build_especificacao_funcional_md.py`, `update_especificacao_funcional.py`
- Links `docs/product/business/` → `product/global-business-rules.md` / `payout-policies.md`

### Removidos

- `_pendente-conferir/` (pasta inteira)
- `docs/product/business/` no monorepo pulse (já ausente após migração 20/mai)

## Consolidação mocks HTML (2026-05-20)

Inventário e padronização de protótipos HTML no monorepo.

### Renomeados (`brand/kit/` → kebab-case)

| Antes | Depois |
|---|---|
| `Pulse Brand Kit.html` | `brand-kit.html` |
| `Pitch Produtores.html` | `brand-pitch-producers.html` |
| `Client Web v2.html` | `brand-client-web-v2.html` |
| `Instagram Kit.html` | `brand-instagram-kit.html` |
| `Instagram Kit-print.html` | `brand-instagram-kit-print.html` |
| `commercial/pagamentos-pulse-cliente.html` | `commercial/commercial-payments-client.html` |

### Producer Web (`prototypes/`)

| Antes | Depois |
|---|---|
| `painel-produtor.html` | `producer-dashboard-mock.html` |
| `criar-vip.html` | `producer-create-vip-mock.html` |
| `admin/index.html` | `admin/admin-dashboard-mock.html` |
| `design-proposal.html` (raiz) | `prototypes/producer-design-proposal-mock.html` |
| `create-event-proposal.html` (raiz) | `prototypes/producer-create-event-mock.html` |
| `pulse-produtor-novo.html` (raiz) | `prototypes/producer-dashboard-alt-mock.html` |
| `pulse-produtor-novo-criar-evento.html` (raiz) | `prototypes/producer-create-event-alt-mock.html` |

Removidos (duplicatas de `client-web/prototypes/`): `app.html`, `landing-page.html`.

### Client Web (`prototypes/`)

| Antes | Depois |
|---|---|
| `app.html` | `client-app-mock.html` |
| `landing-page.html` | `client-landing-page-mock.html` |
| (de `producer-web/index.html`) | `client-home-dark-mock.html` |

### Excluído

- `ui-kit/` na raiz do workspace — duplicata obsoleta de `brand/kit/` (versão canônica com `assets/` e `deck-stage.js`).

### Índice central

- `prototypes/README.md` — catálogo de todos os mocks por produto e status.

