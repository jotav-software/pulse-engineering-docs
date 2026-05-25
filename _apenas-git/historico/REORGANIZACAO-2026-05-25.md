# Reorganização — estrutura 6 domínios

**Data:** 2026-05-25  
**Motivo:** Separar marca, engenharia, produto, jurídico, comercial e operações com nomes claros em português.

## Mapa de migração

| Antes | Depois |
|-------|--------|
| `brand/assets/` | `marca/assets/` |
| `brand/kit/` | `marca/kits/` |
| `brand/brand-kit-brief.md` | `marca/brand-kit-brief.md` |
| `brand/screenshots/` | `_apenas-git/capturas-marca/` |
| `adr/` | `engenharia/decisoes/` |
| `architecture/` | `engenharia/arquitetura/` |
| `standards/` | `engenharia/padroes/` |
| `backlog/` | `engenharia/backlog/` |
| `product/` | `produto/` |
| `product/policies/` | `produto/regras-negocio/` |
| `product/access/` | `produto/acesso/` |
| `product/facial/` | `produto/biometria/` |
| `product/dev/` | `produto/qa/` |
| `legal/` | `juridico/` |
| `legal/politicas/` | `juridico/politicas-publicas/` |
| `legal/compliance/` | `juridico/conformidade/` |
| `legal/PROXIMOS-PASSOS.md` | `juridico/proximos-passos.md` |
| `commercial/gtm/` | `comercial/lancamento/` |
| `commercial/commercial-payments-client.html` | `comercial/apresentacoes/pagamentos-cliente.html` |
| `ops/` | `operacoes/` |
| `ops/environment-variables.md` | `operacoes/variaveis-ambiente.md` |
| `ops/brand-cdn.md` | `operacoes/cdn-e-docs.md` |
| `ops/app-store-connect-api.md` | `operacoes/app-store-connect.md` |
| `ops/launch-readiness-plan.md` | `operacoes/plano-lancamento-tecnico.md` |
| `prototypes/` | `_apenas-git/prototipos/` |
| `scripts/` | `_apenas-git/scripts/` |
| `MIGRATION-LOG.md` | `_apenas-git/historico/MIGRATION-LOG.md` |
| `*.mp4` (raiz) | `_apenas-git/midia/` |

## Rotas CDN

Rotas **estáveis** (apps dependem):
- `/assets/**` → `marca/assets/**` (público)
- `/kit/**` → `marca/kits/**` (protegido)

Rotas **docs** (novas + redirects 301):
- `/docs/engenharia/**`, `/docs/produto/**`, `/docs/juridico/**`, `/docs/comercial/**`, `/docs/operacoes/**`
- Redirects legados: `/docs/adr/` → `/docs/engenharia/decisoes/`, etc. (ver `server.js`)

## Runtime alterado

- `server.js` — `MARCA_ROOT = marca/`, redirects 301
- `lib/docs.js` — 5 seções de docs
- `.railwayignore` — `_apenas-git/**`
- `_apenas-git/scripts/sync-brand-assets.sh` — path `marca/assets/`

## Serviço Railway

Renomeado de `pulse-brand-assets` para `pulse-docs` (se aplicável via CLI).  
URL Railway permanece `pulse-brand-assets-production.up.railway.app` — apps usam `*_BRAND_CDN_URL`. Renomear serviço no dashboard Railway é opcional (CLI v4.62 não expõe rename).
