# Pulse CDN & Docs (Railway)

Serviço estático que publica **brand assets** e **documentação de engenharia** do repositório `pulse-engineering-docs`.

| Rota | Auth | Conteúdo |
|---|---|---|
| `/assets/**` | Nenhuma | Logos, ícones, PNGs, SVGs (CDN pública) |
| `/kit/**`, `/brand-kit-brief.md` | Interna | Brand kits HTML, tokens.css, brief |
| `/docs/**` | Interna | ADRs, arquitetura, produto, legal, ops… com preview Markdown |
| `/` | Nenhuma | Índice HTML das rotas |

## Serviço

| Campo | Valor |
|---|---|
| Projeto Railway | **Pulse** |
| Serviço | **pulse-brand-assets** |
| URL pública | `https://pulse-brand-assets-production.up.railway.app` |
| Health check | `/assets/svg/logo-mark.svg` |
| Runtime | `node server.js` (Express + marked, Nixpacks) |

## Autenticação (rotas internas)

Rotas protegidas: `/kit/**`, `/brand-kit-brief.md`, `/docs/**`.

### Opção A — HTTP Basic Auth (padrão atual)

| Variável | Descrição |
|---|---|
| `BRAND_KIT_USER` | Usuário Basic Auth |
| `BRAND_KIT_PASSWORD` | Senha Basic Auth |

Sem credenciais configuradas, rotas protegidas retornam **503**.

### Opção B — Bearer admin Pulse (opcional, migração)

| Variável | Descrição |
|---|---|
| `PULSE_API_URL` | URL do backend (ex.: `https://api.pulse.jotav.com.br`) |

Se configurada, o servidor aceita `Authorization: Bearer <token>` de sessão **PULSE_ADMIN** (validado via `GET /api/admin/v1/auth/me`). Basic Auth continua como fallback.

**Limitação cross-domain:** cookies do producer-web **não** são enviados ao CDN Railway (origens diferentes). SSO real exige proxy no producer-web ou token Bearer explícito — ver seção abaixo.

## Documentação (`/docs/`)

Preview Markdown renderizado no browser com navegação por seção.

| Seção | URL |
|---|---|
| Índice | `/docs/` |
| ADRs | `/docs/adr/` |
| Arquitetura | `/docs/architecture/` |
| Padrões | `/docs/standards/` |
| Produto | `/docs/product/` |
| Backlog | `/docs/backlog/` |
| Legal | `/docs/legal/` |
| Comercial | `/docs/commercial/` |
| Ops | `/docs/ops/` |

Markdown bruto: acrescentar `?format=raw` (ex.: `/docs/adr/ADR-001-backend-stack.md?format=raw`).

**Excluído do deploy:** `prototypes/` (333 MB de mocks binários), `brand/screenshots/`, `scripts/`, `*.mp4`, `*.dmg`.

## Brand assets (`/assets/`)

Base: `https://pulse-brand-assets-production.up.railway.app`

| Asset | URL |
|---|---|
| Logo horizontal branco (header dark) | `/assets/svg/logo-horizontal-white.svg` |
| Logo horizontal (cor via CSS) | `/assets/svg/logo-horizontal.svg` |
| Mark / ícone | `/assets/svg/logo-mark.svg` |
| Logo empilhado | `/assets/svg/logo-stacked.svg` |
| App icon 1024 | `/assets/06-app-icon-preenchido/pulse-app-icon-1024.png` |
| Wordmark branco | `/assets/03-wordmark/pulse-wordmark-branco.png` |

## Brand kits (`/kit/`)

1. Abrir `https://pulse-brand-assets-production.up.railway.app/kit/brand-kit.html`
2. Informar credenciais quando solicitado
3. Outros kits: `/kit/brand-pitch-producers.html`, `/kit/brand-instagram-kit.html`, etc.

## Como os apps devem consumir assets

### Web (landing, client-web, producer-web)

```html
<img src="https://pulse-brand-assets-production.up.railway.app/assets/svg/logo-horizontal-white.svg" alt="Pulse!" />
```

### Apps mobile (Expo)

Expo exige assets locais. Após alterar a fonte canônica:

```bash
cd pulse-engineering-docs
./scripts/sync-brand-assets.sh
```

### Variável de ambiente sugerida

```
NEXT_PUBLIC_BRAND_CDN_URL=https://pulse-brand-assets-production.up.railway.app
```

## Deploy

```bash
railway link -p Pulse -e production -s pulse-brand-assets
railway variables --set 'BRAND_KIT_USER=<usuario>'
railway variables --set 'BRAND_KIT_PASSWORD=<senha>'
railway variables --set 'PULSE_API_URL=https://api.pulse.jotav.com.br'  # opcional
railway up -s pulse-brand-assets -d
```

O `.railwayignore` exclui binários pesados; sobem `brand/`, pastas de docs, `lib/`, `server.js`, `package.json`, `railway.toml`, `README.md`.

## Auth via producer-web — caminho de migração

| Abordagem | Prós | Contras |
|---|---|---|
| **Basic Auth (atual)** | Simples, funciona cross-domain, zero dependência | Credenciais separadas, popup do browser, sem RBAC |
| **Bearer via PULSE_API_URL (implementado)** | Reutiliza sessão admin real, RBAC PULSE_ADMIN | Token não vai automaticamente cross-domain; precisa enviar header |
| **Proxy no producer-web (`/internal/docs/*`)** | SSO transparente, mesma origem, UX integrada | Mais código no Next.js, latência proxy |
| **Cookie `Domain=.pulse.app` + CDN em subdomínio** | SSO potencial no domínio prod | Requer CDN em `docs.pulse.app`, cookies HttpOnly, refator auth |

**Recomendação:** manter Basic Auth no curto prazo; adicionar link "Documentação" no painel admin apontando para `/docs/` (usuário já autenticado via Basic ou via proxy futuro). Próximo passo ideal: rota proxy `admin.pulse.jotav.com.br/docs/*` que valida sessão local e repassa ao CDN upstream.

## Fonte canônica (git)

Edições sempre no git; a CDN é espelho publicado.

- Marca: `brand/assets/`, `brand/kit/`
- Docs: `adr/`, `architecture/`, `standards/`, `product/`, `backlog/`, `legal/`, `commercial/`, `ops/`

## CORS

Assets via `<img>` não exigem CORS. `fetch()` cross-origin para rotas protegidas exige proxy ou headers CORS (não configurado hoje).
