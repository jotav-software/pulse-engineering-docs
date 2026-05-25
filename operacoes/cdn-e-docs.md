# Pulse CDN & Docs (Railway)

Serviço estático que publica **brand assets** e **documentação interna** do repositório `pulse-engineering-docs`.

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
| Serviço | **`pulse-brand-assets`** *(alias desejado: `pulse-docs` — renomear manualmente no dashboard)* |
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
| `PULSE_API_URL` | URL do backend — prod: `https://api.pulse.jotav.com.br` (configurado no Railway) |

Se configurada, o servidor aceita `Authorization: Bearer <token>` de sessão **PULSE_ADMIN** (validado via `GET /api/admin/v1/auth/me`). Basic Auth continua como fallback.

**Limitação cross-domain:** cookies do producer-web **não** são enviados ao CDN Railway (origens diferentes). SSO real exige proxy no producer-web ou token Bearer explícito — ver seção abaixo.

## Documentação (`/docs/`)

Preview Markdown renderizado no browser com navegação por seção.

| Seção | URL |
|---|---|
| Índice | `/docs/` |
| ADRs | `/docs/engenharia/decisoes/` |
| Arquitetura | `/docs/engenharia/arquitetura/` |
| Padrões | `/docs/engenharia/padroes/` |
| Produto | `/docs/produto/` |
| Backlog | `/docs/engenharia/backlog/` |
| Legal | `/docs/juridico/` |
| Comercial | `/docs/comercial/` |
| Ops | `/docs/operacoes/` |

Markdown bruto: acrescentar `?format=raw` (ex.: `/docs/engenharia/decisoes/ADR-001-backend-stack.md?format=raw`).

**Excluído do deploy:** `_apenas-git/prototipos/` (333 MB de mocks binários), `_apenas-git/capturas-marca/`, `_apenas-git/scripts/`, `*.mp4`, `*.dmg`.

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
./_apenas-git/scripts/sync-brand-assets.sh
```

### Variáveis de ambiente por consumer

| Repo | Variável | Helper |
|------|----------|--------|
| client-web, producer-web | `NEXT_PUBLIC_BRAND_CDN_URL` | `src/lib/brand-cdn.ts` → `getBrandCdnUrl()`, `brandCdnAsset()` |
| app-client, app-producer | `EXPO_PUBLIC_BRAND_CDN_URL` | `src/shared/config/brand-cdn.ts` → `getBrandCdnUrl()`, `brandCdnAsset()` |
| client-web | `NEXT_PUBLIC_BRAND_CDN_URL` | `src/lib/brand-cdn.ts` |
| ~~landing-page~~ | *(descontinuado — migrado para client-web)* | — |

```
NEXT_PUBLIC_BRAND_CDN_URL=https://pulse-brand-assets-production.up.railway.app
EXPO_PUBLIC_BRAND_CDN_URL=https://pulse-brand-assets-production.up.railway.app
```

## Deploy e GitHub (auto-deploy)

| Item | Valor |
|------|-------|
| Repositório | `jotav-software/pulse-engineering-docs` |
| Branch | `main` |
| Root directory | `/` (raiz do repo) |
| Trigger | Push na branch `main` dispara build/deploy no Railway |

Conectar o serviço ao GitHub (uma vez): Railway → **pulse-brand-assets** → **Settings** → **Connect GitHub repo**, ou via API `serviceConnect` com `repo` + `branch`.

Fallback manual (sem Git ou emergência):

```bash
railway link -p Pulse -e production -s pulse-brand-assets
railway up -d
```

### Variáveis Railway (production)

| Variável | Obrig. | Valor em prod | Notas |
|----------|--------|---------------|-------|
| `BRAND_KIT_USER` | Sim | `pulse-brand` | Basic Auth para rotas internas |
| `BRAND_KIT_PASSWORD` | Sim | *(segredo no Railway)* | Não versionar; rotacionar com `openssl rand -base64 24` |
| `PULSE_API_URL` | Recom. | `https://api.pulse.jotav.com.br` | Bearer admin opcional; Basic Auth permanece fallback |
| `PORT` | Sim | *(injetado)* | Railway define automaticamente |

```bash
railway link -p Pulse -e production -s pulse-brand-assets
railway variables --set 'BRAND_KIT_USER=pulse-brand'
railway variables --set 'BRAND_KIT_PASSWORD=<openssl rand -base64 24>'
railway variables --set 'PULSE_API_URL=https://api.pulse.jotav.com.br'
```

Alterações de variável reiniciam o serviço; não exigem novo commit.

O `.railwayignore` exclui binários pesados; sobem `marca/`, pastas de docs, `lib/`, `server.js`, `package.json`, `railway.toml`, `README.md`.

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

- Marca: `marca/assets/`, `marca/kits/`
- Docs: `engenharia/decisoes/`, `engenharia/arquitetura/`, `engenharia/padroes/`, `produto/`, `engenharia/backlog/`, `juridico/`, `comercial/`, `operacoes/`

## CORS

Assets via `<img>` não exigem CORS. `fetch()` cross-origin para rotas protegidas exige proxy ou headers CORS (não configurado hoje).
