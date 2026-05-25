# Variáveis de ambiente — ecossistema Pulse

Documento **canônico** de configuração por sistema. Valores secretos **nunca** entram neste repositório — use placeholders e a coluna **Onde obter**.

**Referências locais:** `backend/.env.example`, `client-web/.env.example`, `producer-web/.env.example`, `app-client/.env.example`, `app-producer/.env.example`, `landing-page/.env.example`, `pulse-face/.env.example`.

**URLs públicas (produção, maio/2026)**

| Sistema | Domínio canônico (jotav) | Domínio Railway (legado) |
|---------|--------------------------|---------------------------|
| pulse-backend (API) | `https://api.pulse.jotav.com.br` | `https://api.pulse.jotav.com.br` |
| client-web | `https://pulse.jotav.com.br` | `https://client-web-production-be7d.up.railway.app` |
| pulse-producer-web (admin) | `https://admin.pulse.jotav.com.br` | `https://pulse-producer-web-production.up.railway.app` |
| pulse-face | `https://face.jotav.com.br` | `https://pulse-face-production.up.railway.app` |
| pulse-brand-assets (CDN + docs) | — | `https://pulse-brand-assets-production.up.railway.app` |
| pulse-landing-page | — | `https://pulse-landing-page-production-e0ce.up.railway.app` |

Frontends e apps mobile devem usar **`NEXT_PUBLIC_API_URL` / `EXPO_PUBLIC_API_URL` = `https://api.pulse.jotav.com.br`** (com `https://`).

Descobrir domínios atualizados: Railway → projeto **Pulse** → serviço → **Settings → Networking**, ou na pasta do serviço linkado: `railway variables -k | grep RAILWAY_SERVICE`.

---

## Legenda das colunas (matriz de auditoria)

| Coluna | Significado |
|--------|-------------|
| **example** | Presente em `.env.example` do projeto |
| **docs** | Documentado neste arquivo |
| **prod** | Configurado ou esperado em Railway / EAS produção |
| **Ambiente** | `dev` · `staging` · `prod` · `all` |

---

## pulse-backend (Railway)

Deploy: serviço **pulse-backend**, branch acordada (`develop`).

### Core / runtime

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `NODE_ENV` | Sim prod | prod | — | Sim | Railway define `production`. Local: omitir ou `development`. |
| `PORT` | Sim | all | Sim | Sim (inj.) | Railway injeta; local default `3000`. |
| `HOST` | Não | all | Sim | Não | Bind do servidor. Default `0.0.0.0`. |
| `SHUTDOWN_TIMEOUT_MS` | Não | prod | Sim | Recom. | Default `25000`. Graceful shutdown no SIGTERM (Railway grace = 30s). |

### Segurança HTTP / OWASP

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `CORS_ORIGINS` | **Sim prod** | prod | Sim | Sim | Lista vírgula, **sem espaços**. Prod: incluir `https://pulse.jotav.com.br`, `https://admin.pulse.jotav.com.br` e hosts Railway/legado conforme necessário (ex.: `https://client-web-production-be7d.up.railway.app`, `https://pulse-producer-web-production.up.railway.app`, `https://pulse-landing-page-production-e0ce.up.railway.app`, `https://pulse.app`, `https://www.pulse.app`, `https://admin.pulse.app`, `https://app.pulse.app`). Dev: incluir `http://localhost:3000`, `http://localhost:3001`, `http://localhost:8081`. |
| `QR_SECRET` | **Sim prod** | prod | Sim | Sim | HMAC do QR dinâmico. `openssl rand -base64 32`. |
| `WEBHOOK_ALLOW_UNSIGNED` | Não | dev only | Sim | **Não** | `true` só dev local. Ignorado em `NODE_ENV=production`. |
| `SWAGGER_ENABLED` | Não | staging | Sim | Não | Em prod OpenAPI desligado salvo `true`. |
| `HTTP_RATE_LIMIT_ENABLED` | Não | all | Sim | Sim | Default ligado; `false` desliga. |
| `HTTP_RATE_LIMIT_MAX` | Não | all | Sim | Opc. | Default 30 req/janela. |
| `HTTP_RATE_LIMIT_WINDOW_MS` | Não | all | Sim | Opc. | Default 15 min (900000). |

### Autenticação

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `BETTER_AUTH_SECRET` | Sim | all | Sim | Sim | Segredo longo aleatório; **mesmo valor** em client-web e producer-web. |
| `BETTER_AUTH_URL` | Sim | all | Sim | Sim | URL pública do backend, ex.: `https://api.pulse.jotav.com.br` (sem `/` final). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Opc. | all | Sim | Opc. | Google Cloud Console → OAuth client. |
| `APPLE_CLIENT_ID` / `APPLE_CLIENT_SECRET` | Opc. | all | Sim | Opc. | Apple Developer → Sign in with Apple. |
| `APPLE_APP_BUNDLE_IDENTIFIER` | Opc. | all | — | Opc. | Default `com.pulse.fan`. Bundle do app cliente iOS. |

### Banco de dados

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `DATABASE_URL` | Sim* | all | Sim | Sim | `mysql://USER:PASS@HOST:3306/DB` |
| `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` | Sim* | prod | Sim | Sim | Plugin MySQL Railway (`${{ MySQL.*}}`). Aliases: `MYSQLHOST`, `MYSQLUSER`, etc. (*URL única **ou** conjunto `MYSQL_*`). |

### Pagamentos

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `PAYMENT_PROVIDER` | Não | all | Sim | Sim | `pagarme` (default) ou `stripe`. |
| `PAYMENTS_ENABLED` | Não | prod | Sim | Sim | `true`/`false` — endpoints `/payment` retornam 503 se `false`. |
| `STRIPE_SECRET_KEY` | Se Stripe | all | Sim | Se Stripe | Dashboard Stripe → Secret key (`sk_live_...` / `sk_test_...`). |
| `STRIPE_WEBHOOK_SECRET` | Se Stripe WH | all | Sim | Se Stripe | Stripe → Webhooks → signing secret (`whsec_...`). |
| `STRIPE_PUBLISHABLE_KEY` | Opc. | all | Sim | Se Stripe | Stripe → Publishable key. Apps usam `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`. |
| `PAGARME_SECRET_KEY` | Se Pagar.me | all | Sim | Se Pagar.me | Dashboard Pagar.me. Omitir = mock (`sk_test_mock`). |
| `PAGARME_WEBHOOK_SECRET` | Se Pagar.me WH | all | Sim | Se Pagar.me | HMAC webhook; fallback `PAGARME_SECRET_KEY`. |
| `PAGARME_MOCK_PIX_AUTO_CONFIRM` | Não | dev only | Sim | **Não** | `true` só dev — auto-confirma Pix mock após 7s. |
| `ADVANCE_FEE_BPS` | Não | all | — | Opc. | Taxa de antecipação financeira produtor (basis points). |

### E-mail / convites / URLs de acesso

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `MAIL_PROVIDER` | Não | all | Sim | Sim | `brevo` ou fallback (log). |
| `BREVO_API_KEY` | Se Brevo | all | Sim | Sim | Brevo → SMTP & API. |
| `BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME` | Se Brevo | all | Sim | Sim | Remetente verificado. Ex.: `"Pulse Eventos"`. |
| `MAIL_DELIVERY_SYNC` | Não | dev/test | Sim | Não | `true` = entrega síncrona (testes). |
| `MAIL_LOG_OTP_IN_DEV` | Não | dev only | Sim | **Não** | `true` = loga OTP no console (fallback mail). |
| `PRODUCER_WEB_URL` | Recom. prod | prod | Sim | Sim | Links nos e-mails produtor. Ex.: `https://admin.pulse.jotav.com.br` ou `https://app.pulse.app`. Alias: `PRODUCER_PORTAL_URL`. |
| `CLIENT_WEB_URL` | Recom. prod | prod | Sim | Sim | Fallback web nos convites de cadastro cliente. Ex.: `https://pulse.jotav.com.br` ou `https://pulse.app`. Alias: `CLIENT_PORTAL_URL`. |
| `RAILWAY_SERVICE_CLIENT_WEB_URL` | Não | prod | — | Auto | Railway injeta host do serviço client-web quando linkado no mesmo projeto — usado como fallback de `CLIENT_WEB_URL`. |
| `CLIENT_APP_SCHEME` | Não | all | Sim | Sim | Deeplink Expo nos convites. Default `pulse-client`. Alias: `EXPO_PUBLIC_APP_SCHEME`. |
| `CLIENT_IOS_STORE_URL` | Opc. | prod | Sim | Opc. | `https://apps.apple.com/app/idXXXXXXXX` |
| `CLIENT_ANDROID_STORE_URL` | Opc. | prod | Sim | Opc. | `https://play.google.com/store/apps/details?id=com.pulse.fan` |

### Rate limit — convites de cadastro (transferência)

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `CLIENT_SIGNUP_INVITE_RATE_LIMIT_ENABLED` | Não | prod | Sim | Sim | Default `true`. |
| `CLIENT_SIGNUP_INVITE_RATE_LIMIT_SENDER_MAX` | Não | prod | Sim | Sim | Default `5` convites/hora por remetente. |
| `CLIENT_SIGNUP_INVITE_RATE_LIMIT_SENDER_WINDOW_MS` | Não | prod | Sim | Sim | Default `3600000` (1h). |
| `CLIENT_SIGNUP_INVITE_RATE_LIMIT_DESTINATION_MAX` | Não | prod | Sim | Sim | Default `3`/dia por e-mail destino. |
| `CLIENT_SIGNUP_INVITE_RATE_LIMIT_DESTINATION_WINDOW_MS` | Não | prod | Sim | Sim | Default `86400000` (24h). |

### Criptografia PII em repouso

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `PII_ENCRYPTION_KEY` | **Sim prod** | prod | Sim | Sim | AES-256-GCM para CPF/CNPJ/dados bancários. `openssl rand -hex 32` (64 chars hex). **Perder = dados irrecuperáveis.** |
| `PII_HASH_PEPPER` | **Sim prod** | prod | Sim | Sim | HMAC para lookup hash. `openssl rand -hex 32`. Independente da encryption key. |
| — | — | dev | — | — | Fallback dev: deriva de `BETTER_AUTH_SECRET`. **Não usar em produção.** |

### Object storage (KYC / documentos)

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `STORAGE_DRIVER` | Não | all | Sim | Sim | `local` (default, volume Railway) ou `r2`/`s3`. Alias legado: `KYC_STORAGE_DRIVER`. |
| `KYC_STORAGE_PATH` | Se local | all | Sim | Sim | Path do volume. Ex.: `./storage/kyc`. |
| `S3_ENDPOINT` | Se r2/s3 | prod | Sim | Sim | Cloudflare R2: `https://<accountId>.r2.cloudflarestorage.com` |
| `S3_REGION` | Se r2/s3 | prod | Sim | Sim | R2: `auto`. |
| `S3_ACCESS_KEY_ID` | Se r2/s3 | prod | Sim | Sim | Cloudflare R2 → Manage R2 API Tokens. |
| `S3_SECRET_ACCESS_KEY` | Se r2/s3 | prod | Sim | Sim | Par da access key. |
| `S3_BUCKET` | Se r2/s3 | prod | Sim | Sim | Ex.: `pulse-kyc`. |
| `S3_PUBLIC_BASE_URL` | Opc. | prod | Sim | Opc. | Domínio custom do bucket (se servir público). |

### Observabilidade (Sentry)

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `SENTRY_DSN` | Recom. prod | prod | Sim | Sim | Sentry → Project → Client Keys (DSN). Sem DSN = no-op silencioso. |
| `SENTRY_RELEASE` | Opc. | prod | Sim | Opc. | Git SHA do deploy. Ex.: `abc1234`. |
| `SENTRY_TRACES_SAMPLE_RATE` | Não | prod | Sim | Sim | Default `0.1` (10% spans). |
| `SENTRY_PROFILES_SAMPLE_RATE` | Não | prod | Sim | Não | Default `0` (profiling off). |

### Rate-limit distribuído (Upstash Redis)

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `UPSTASH_REDIS_REST_URL` | Recom. prod | prod | Sim | Sim | [Upstash Console](https://console.upstash.com) → Database → REST URL. |
| `UPSTASH_REDIS_REST_TOKEN` | Recom. prod | prod | Sim | Sim | Par da REST URL. Sem envs = fallback in-memory (ok dev / 1 instância). |

### Biometria facial

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `FACIAL_ENABLED` | Por fase | all | Sim | Por fase | Master switch opcional. `true`/`false`/omitido — ver `facialFlags.ts`. |
| `BIOMETRIC_ENCRYPTION_KEY` | Prod+V2 | prod | Sim | Sim | `openssl rand -hex 32`. Vetores 512-d criptografados. |
| `BIOMETRIC_HASH_SECRET` | **Sim prod** | prod | Sim | Sim | HMAC hash biométrico. `openssl rand -base64 32`. |
| `FACIAL_ENROLLMENT_V2` / `FACIAL_ENROLLMENT_ENABLED` | Por fase | all | Sim | Por fase | Cadastro vetor real (US-FAC-004). |
| `FACIAL_GALLERY_ENABLED` | Por fase | all | Sim | Por fase | Galeria 1:N por evento (US-FAC-006). |
| `FACIAL_CHECKIN_ENABLED` | Por fase | all | Sim | Por fase | Check-in facial portaria (US-FAC-008). |
| `FACIAL_AUTO_CHECKIN_THRESHOLD` | Não | all | Sim | Opc. | Default `0.55`. |
| `FACIAL_REQUIRE_CONFIRMATION_BELOW` | Não | all | Sim | Opc. | Default `0.55`. |
| `FACIAL_VERIFY_AFTER_QR_ENABLED` | Por fase | all | Sim | Por fase | Verificação 1:1 pós-QR (US-FAC-009). |
| `PULSE_FACE_IDENTIFY_THRESHOLD` | Não | all | Sim | Opc. | Default `0.45`. |
| `PULSE_FACE_VERIFY_THRESHOLD` | Não | all | Sim | Opc. | Default `0.50`. |
| `PULSE_FACE_MIN_SCORE_GAP` | Não | all | Sim | Opc. | Default `0.05`. |
| `PULSE_FACE_SERVICE_URL` | Extract/identify | prod | Sim | Sim | `https://pulse-face-production.up.railway.app` |
| `PULSE_FACE_SERVICE_API_KEY` | Extract/identify | prod | Sim | Sim | Segredo forte; **igual** no pulse-face (`x-api-key`). |
| `PULSE_FACE_HEALTH_TIMEOUT_MS` | Não | all | Sim | Opc. | Default `3000`. |
| `PULSE_FACE_IDENTIFY_TIMEOUT_MS` | Não | all | Sim | Opc. | Default `5000`. |
| `PULSE_FACE_EXTRACT_ENABLED` | Por fase | all | Sim | Por fase | Extração ONNX no pulse-face. |
| `PULSE_FACE_EXTRACT_TIMEOUT_MS` | Não | all | Sim | Opc. | Default `15000`. |
| `PULSE_FACE_GALLERY_SYNC` | Por fase | all | Sim | Por fase | Sync embeddings ao pulse-face no rebuild. |
| `PULSE_FACE_USE_IDENTIFY` | Por fase | all | Sim | Por fase | Delegar 1:N ao pulse-face. |
| `PULSE_INTERNAL_API_KEY` | Crons | prod | Sim | Sim | Header `x-pulse-internal-key` para `/internal/*`. |
| `FACE_GALLERY_RETENTION_DAYS` | Não | prod | Sim | Sim | Default `30`. LGPD retenção galeria. |
| `ENABLE_FACE_GALLERY_PURGE_JOB` | Não | prod | Sim | Sim | `true` = cron purge diário. |
| `FACE_GALLERY_PURGE_JOB_INTERVAL_MS` | Não | prod | Sim | Opc. | Default `86400000` (24h). |

Detalhes de rollout: [Checklist deploy facial](../product/facial/infra-deploy-checklist.md).

### Jobs em background

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `ENABLE_PAYOUT_RELEASE_JOB` | Não | prod | — | Sim | Default ligado; `false` desliga job de liberação de repasses. |
| `PAYOUT_RELEASE_JOB_INTERVAL_MS` | Não | prod | — | Opc. | Default `3600000` (1h). |

### Comandos Railway (pulse-backend)

```bash
cd backend   # ou repo pulse-backend linkado
railway link   # projeto Pulse, serviço pulse-backend, environment production
railway variables -k
railway variables --set 'CORS_ORIGINS=https://pulse.jotav.com.br,https://admin.pulse.jotav.com.br,...'
railway variables --set 'PII_ENCRYPTION_KEY=<openssl rand -hex 32>'
railway variables --set 'UPSTASH_REDIS_REST_URL=https://<id>.upstash.io'
```

---

## pulse-face (Railway)

Referência: `pulse-face/.env.example`. Serviço **separado** (Docker/Python).

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `PULSE_FACE_SERVICE_API_KEY` | Sim | all | Sim | Sim | **Mesmo valor** que no backend. |
| `PULSE_FACE_MODEL_PATH` | Não | all | Sim | Sim | `/models` (default Dockerfile). |
| `PULSE_FACE_GALLERY_BACKEND` | Sim prod | all | Sim | Sim | `memory` (dev) / `persistent` / `sqlite` + volume. |
| `PULSE_FACE_GALLERY_PATH` | Com persistent | prod | Sim | Sim | Volume Railway, ex.: `/data/gallery`. |
| `PULSE_FACE_IDENTIFY_THRESHOLD` | Não | all | Sim | Opc. | Default `0.45`. |
| `PULSE_FACE_VERIFY_THRESHOLD` | Não | all | Sim | Opc. | Default `0.50`. |
| `PULSE_FACE_MIN_SCORE_GAP` | Não | all | Sim | Opc. | Default `0.05`. |
| `PORT` | Sim | all | Sim | Sim (inj.) | Railway injeta; app escuta `0.0.0.0:${PORT}`. |
| `REDIS_URL` | Futuro | — | Sim | Não | Só se `PULSE_FACE_GALLERY_BACKEND=redis`. |

**Não colocar no pulse-face:** segredos do backend, `DATABASE_URL`, chaves Stripe/Pagar.me, PII keys.

---

## producer-web (Railway — pulse-producer-web)

Referência: `producer-web/.env.example`. Variáveis `NEXT_PUBLIC_*` exigem **rebuild** após alteração.

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `NEXT_PUBLIC_API_URL` | Sim | all | Sim | Sim | `https://api.pulse.jotav.com.br` (com ou sem `https://`; o app normaliza hostname Railway) |
| `NEXT_PUBLIC_APP_URL` | Sim | all | Sim | Sim | Prod: `https://admin.pulse.jotav.com.br`; local `http://localhost:3001`. |
| `BETTER_AUTH_SECRET` | Sim | all | Sim | Sim | **Idêntico** ao backend. |
| `NEXT_PUBLIC_BRAND_CDN_URL` | Recom. prod | prod | Sim | Sim | CDN de logos/ícones. Prod: `https://pulse-brand-assets-production.up.railway.app`. Sem env = fallback local (`public/`). Helper: `src/lib/brand-cdn.ts`. |

### Sentry (producer-web)

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `NEXT_PUBLIC_SENTRY_DSN` | Recom. prod | prod | Sim | Sim | Sentry → projeto producer-web. Sem DSN = no-op. |
| `SENTRY_DSN` | Opc. | prod | Sim | Sim | Fallback server-side (mesmo DSN). |
| `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` | Não | prod | Sim | Sim | Default `0.1`. |
| `SENTRY_TRACES_SAMPLE_RATE` | Não | prod | Sim | Sim | Server/edge fallback. |
| `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` | CI | prod | Sim | CI | Upload source maps no build Railway/CI. |

### Analytics (Trilha C — GTM)

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `NEXT_PUBLIC_GTM_ID` | Opc. | prod | Sim | Sim | Google Tag Manager → Container ID (`GTM-XXXXXXX`). Sem ID = no-op. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Opc. | prod | Sim | Opc. | Referência; envio via GTM. |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Opc. | prod | Sim | Opc. | Referência; envio via GTM. |

---

## client-web (Railway)

Referência: `client-web/.env.example`.

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `NEXT_PUBLIC_API_URL` | Sim | all | Sim | Sim | `https://api.pulse.jotav.com.br` |
| `NEXT_PUBLIC_APP_URL` | Sim | all | Sim | Sim | Prod: `https://pulse.jotav.com.br`; local `http://localhost:3000`. |
| `BETTER_AUTH_SECRET` | Sim | all | Sim | Sim | **Idêntico** ao backend. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Se Stripe | all | —* | Se Stripe | Stripe Dashboard → publishable key. Usado em checkout web. *Adicionar ao `.env.example` se ainda ausente. |
| `NEXT_PUBLIC_BRAND_CDN_URL` | Recom. prod | prod | Sim | Sim | CDN de logos/ícones. Prod: `https://pulse-brand-assets-production.up.railway.app`. Sem env = fallback local (`public/`). Helper: `src/lib/brand-cdn.ts`. |

Sentry e GTM: mesmas variáveis que producer-web (`NEXT_PUBLIC_SENTRY_*`, `SENTRY_*`, `NEXT_PUBLIC_GTM_ID`, etc.) — ver seção acima.

---

## pulse-landing-page (Railway)

Site **estático** (HTML). Variável de build/deploy para logos em `<img>`.

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `BRAND_CDN_URL` | Opc. | prod | Sim | Sim | Default: `https://pulse-brand-assets-production.up.railway.app`. HTML já aponta para este host; override via `landing-page/scripts/apply-brand-cdn-url.sh` antes do deploy. |

| Item | Notas |
|------|-------|
| Deploy | Railway serve arquivos estáticos de `landing-page/`. |
| Logos runtime | `<img>` → CDN (`/assets/svg/logo-horizontal-white.svg`). Cópias locais em `assets/` mantidas para offline/`file://`. |
| Screenshots | `images/app-cliente-*.png` permanecem locais (não estão no CDN). |
| CORS | Se passar a chamar API autenticada, incluir origem em `CORS_ORIGINS` no backend (já incluída URL Railway prod). |
| Analytics | GTM/Meta/GA4 embutidos no HTML ou via tag manager externo — não via env vars. |

Domínio prod: `https://pulse-landing-page-production-e0ce.up.railway.app`.

---

## pulse-brand-assets (Railway — CDN + docs)

Repositório **pulse-engineering-docs** (`jotav-software/pulse-engineering-docs`). Runtime: `node server.js` (Express + marked).

| Item | Valor |
|------|-------|
| Projeto / serviço | **Pulse** → **pulse-brand-assets** (production) |
| GitHub | `jotav-software/pulse-engineering-docs`, branch **`main`**, root **`/`** |
| Deploy | **Auto-deploy** em push para `main`; fallback manual: `railway up -d` |
| URL prod | `https://pulse-brand-assets-production.up.railway.app` |
| Health | `/assets/svg/logo-mark.svg` (público; ver `railway.toml`) |
| Docs detalhadas | [ops/brand-cdn.md](./brand-cdn.md) |

| Variável | Obrig. | Ambiente | example | prod | Notas |
|----------|--------|----------|---------|------|-------|
| `BRAND_KIT_USER` | **Sim** | prod | — | **Sim** | HTTP Basic Auth (`/kit/**`, `/docs/**`, brief). Prod: usuário `pulse-brand` (Railway). |
| `BRAND_KIT_PASSWORD` | **Sim** | prod | — | **Sim** | Segredo **somente no Railway** — gerar com `openssl rand -base64 24`; nunca commitar. |
| `PULSE_API_URL` | Recom. | prod | — | **Sim** | `https://api.pulse.jotav.com.br` — valida `Authorization: Bearer` de sessão **PULSE_ADMIN** via `GET /api/admin/v1/auth/me`. Basic Auth continua como fallback. |
| `PORT` | Sim | all | — | Sim (inj.) | Railway injeta; local default `8080`. |

Rotas **públicas** (sem auth): `/assets/**` — consumo via `NEXT_PUBLIC_BRAND_CDN_URL`.

Rotas **protegidas** (Basic Auth e/ou Bearer admin): `/kit/**`, `/brand-kit-brief.md`, `/docs/**`.

Sem `BRAND_KIT_*` **e** sem Bearer admin válido, rotas protegidas retornam **503**.

```bash
railway link -p Pulse -e production -s pulse-brand-assets
railway variables --set 'BRAND_KIT_USER=pulse-brand'
railway variables --set 'BRAND_KIT_PASSWORD=<openssl rand -base64 24>'
railway variables --set 'PULSE_API_URL=https://api.pulse.jotav.com.br'
# GitHub: Settings → Connect repo (ou GraphQL serviceConnect) — branch main
```

---

## app-client (EAS / `.env`)

Referência: `app-client/.env.example`. Variáveis `EXPO_PUBLIC_*` exigem **rebuild EAS** após alteração.

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `EXPO_PUBLIC_API_URL` | Sim | all | Sim | Sim | Prod: `https://api.pulse.jotav.com.br`; dev: IP LAN / `10.0.2.2` / `localhost`. |
| `EXPO_PUBLIC_PAYMENTS_ENABLED` | Não | all | Sim | Sim | Alinhar com `PAYMENTS_ENABLED` do backend. |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Se Stripe | all | Sim* | Se Stripe | Stripe Dashboard → publishable key. *Comentado no example. |
| `EXPO_PUBLIC_FACIAL_ENROLLMENT_V2` | Por rollout | all | —* | Por rollout | Espelhar `FACIAL_ENROLLMENT_V2`. *Usado no código; adicionar ao example. |
| `EXPO_PUBLIC_PULSE_FACE_EXTRACT` | Por rollout | all | —* | Por rollout | Espelhar `PULSE_FACE_EXTRACT_ENABLED`. *Usado no código; adicionar ao example. |
| `EXPO_PUBLIC_BRAND_CDN_URL` | Recom. prod | prod | Sim | Sim | CDN para imagens runtime (ex.: `AuthLogo`). Prod: `https://pulse-brand-assets-production.up.railway.app`. Sem env = PNGs locais em `assets/images/`. **Splash, app icon e adaptive icon** em `app.json`/`app.config.js` permanecem bundled. Helper: `src/shared/config/brand-cdn.ts`. |

### Sentry (app-client)

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `EXPO_PUBLIC_SENTRY_DSN` | Recom. prod | prod | Sim | Sim | Sentry → projeto app-client. Configurar no **EAS Dashboard → Environment variables** para builds de produção. |
| `EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` | Não | prod | Sim | Sim | Default `0.1`. |
| `EXPO_PUBLIC_SENTRY_ENVIRONMENT` | Opc. | prod | — | Opc. | Ex.: `production`, `preview`. |

CI/EAS: plugin `@sentry/react-native/expo` em `app.json` — symbolication via EAS Build.

**Nunca** no app: `QR_SECRET`, `BIOMETRIC_ENCRYPTION_KEY`, `PULSE_FACE_SERVICE_API_KEY`, webhook secrets, `PII_*`.

---

## app-producer (EAS / `.env`)

Referência: `app-producer/.env.example`.

| Variável | Obrig. | Ambiente | example | prod | Onde obter / exemplo |
|----------|--------|----------|---------|------|----------------------|
| `EXPO_PUBLIC_API_URL` | Sim | all | Sim | Sim | Mesmo backend que app-client. |
| `EXPO_PUBLIC_PULSE_FACE_EXTRACT` | Por rollout | all | —* | Por rollout | Espelhar backend. *Usado no código; adicionar ao example. |
| `EXPO_PUBLIC_CLIENT_WEB_URL` | Opc. | all | — | Opc. | URL client-web para links. Default hardcoded: `https://pulse.jotav.com.br`. |
| `EXPO_PUBLIC_DEBUG_SCANNER` | Não | dev only | — | **Não** | `true` = botão simular scan (dev). |
| `EXPO_PUBLIC_DEBUG_SCAN_QR_HASH` | Não | dev only | — | **Não** | Hash QR de ingresso ISSUED para teste de scanner. |
| `EXPO_PUBLIC_BRAND_CDN_URL` | Recom. prod | prod | Sim | Sim | CDN para imagens runtime quando aplicável. Prod: `https://pulse-brand-assets-production.up.railway.app`. Logos inline SVG (`PulseLogo`) e splash/icon bundled permanecem locais. Helper: `src/shared/config/brand-cdn.ts`. |

Sentry: mesmas variáveis que app-client (`EXPO_PUBLIC_SENTRY_DSN`, `EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE`).

---

## EAS — variáveis por profile de build

Configurar no [Expo Dashboard](https://expo.dev) → projeto → **Environment variables** (ou `eas env:create`).

| Profile | Variáveis típicas |
|---------|-------------------|
| `development` | `EXPO_PUBLIC_API_URL` → backend local ou staging |
| `preview` | API staging/prod, flags faciais/pagamento para QA |
| `production` | `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SENTRY_DSN`, `EXPO_PUBLIC_PAYMENTS_ENABLED`, `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `EXPO_PUBLIC_BRAND_CDN_URL`, flags faciais |

Arquivos: `app-client/eas.json`, `app-producer/eas.json` — não contêm envs inline; usar dashboard EAS.

---

## Matriz rápida — segredos compartilhados

| Segredo | Onde deve ser igual |
|---------|---------------------|
| `BETTER_AUTH_SECRET` | backend, client-web, producer-web |
| `PULSE_FACE_SERVICE_API_KEY` | backend ↔ pulse-face |
| `PULSE_INTERNAL_API_KEY` | backend + cron/jobs que chamam `/internal/*` |
| `PII_ENCRYPTION_KEY` + `PII_HASH_PEPPER` | backend prod (único; backup em vault) |

---

## Gaps conhecidos (auditoria 2026-05-25)

Variáveis presentes em código ou Railway mas com documentação incompleta nos `.env.example` dos apps — **corrigir nos repos de app**, não neste doc:

| Projeto | Variável | Status |
|---------|----------|--------|
| app-client | `EXPO_PUBLIC_FACIAL_ENROLLMENT_V2`, `EXPO_PUBLIC_PULSE_FACE_EXTRACT` | Código + `.env` local; faltam no `.env.example` |
| app-producer | `EXPO_PUBLIC_PULSE_FACE_EXTRACT`, `EXPO_PUBLIC_CLIENT_WEB_URL` | Código; faltam no `.env.example` |
| client-web | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Código (`stripe.ts`); faltam no `.env.example` |

Variáveis adicionadas nesta revisão da documentação (estavam em `.env.example` do backend mas ausentes ou incompletas no doc canônico):

- Observabilidade: `SENTRY_*`
- PII: `PII_ENCRYPTION_KEY`, `PII_HASH_PEPPER`
- Storage: `STORAGE_DRIVER`, `S3_*`, `KYC_STORAGE_DRIVER`
- Upstash: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- Convites cliente: `CLIENT_WEB_URL`, `CLIENT_APP_SCHEME`, `CLIENT_*_STORE_URL`, `CLIENT_SIGNUP_INVITE_RATE_LIMIT_*`, `RAILWAY_SERVICE_CLIENT_WEB_URL`
- Ops: `SHUTDOWN_TIMEOUT_MS`, jobs payout/purge
- Frontends: Sentry e GTM em client-web / producer-web; Sentry EAS nos apps

---

## Referências

- [Segurança — CORS](../standards/security.md)
- [Checklist deploy facial](../product/facial/infra-deploy-checklist.md)
- [Plano launch readiness](./launch-readiness-plan.md) — Sentry, Upstash, R2, PII
- `backend/.env.example`

*Última atualização: 2026-05-25 — CDN brand assets: `NEXT_PUBLIC_BRAND_CDN_URL` / `EXPO_PUBLIC_BRAND_CDN_URL` / `BRAND_CDN_URL` nos consumer repos.*
