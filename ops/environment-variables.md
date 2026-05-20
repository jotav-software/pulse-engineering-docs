# Variáveis de ambiente — ecossistema Pulse

Documento **canônico** de configuração por sistema. Valores secretos **nunca** entram neste repositório — use placeholders e a coluna **Onde obter**.

**URLs públicas Railway (produção, maio/2026)**

| Sistema | Domínio |
|---------|---------|
| pulse-backend | `https://pulse-backend-production-653f.up.railway.app` |
| client-web | `https://client-web-production-be7d.up.railway.app` |
| pulse-producer-web | `https://pulse-producer-web-production.up.railway.app` |
| pulse-face | `https://pulse-face-production.up.railway.app` |
| pulse-landing-page | `https://pulse-landing-page-production-e0ce.up.railway.app` |

Descobrir domínios atualizados: Railway → projeto **Pulse** → serviço → **Settings → Networking**, ou na pasta do serviço linkado: `railway variables -k | grep RAILWAY_SERVICE`.

---

## pulse-backend (Railway)

Referência local: `backend/.env.example`. Deploy: serviço **pulse-backend**, branch acordada (`develop`).

### Segurança HTTP / OWASP

| Variável | Obrigatória | Valor / onde obter |
|----------|-------------|-------------------|
| `CORS_ORIGINS` | **Sim (prod)** | Lista separada por vírgula, **sem espaços** entre origens. Produção (configurado): `https://client-web-production-be7d.up.railway.app`, `https://pulse-producer-web-production.up.railway.app`, `https://pulse-landing-page-production-e0ce.up.railway.app`, `https://pulse.app`, `https://www.pulse.app`, `https://admin.pulse.app`, `https://app.pulse.app`. Dev local: incluir `http://localhost:3000`, `http://localhost:3001`, `http://localhost:8081` conforme apps. Se omitida fora de prod, usa defaults em código (`runtimeEnv.ts`). |
| `QR_SECRET` | **Sim (prod)** | Segredo HMAC do QR dinâmico. Gerar: `openssl rand -base64 32` (ou string longa aleatória). Railway: `railway variables --set 'QR_SECRET=<segredo>'` no serviço pulse-backend. **Nunca** commitar. |
| `WEBHOOK_ALLOW_UNSIGNED` | Não | **`true` só em dev local.** Em `NODE_ENV=production` o código **ignora** esta flag (fail-closed). Não definir em Railway prod. |
| `SWAGGER_ENABLED` | Não | Em prod, OpenAPI fica **desligado** salvo `SWAGGER_ENABLED=true`. Homolog: opcional `true` para debug. |
| `HOST` | Não | Bind do servidor (default `0.0.0.0`). Railway normalmente não precisa alterar. |
| `PORT` | Sim | Railway injeta `PORT`; local default `3000`. |
| `HTTP_RATE_LIMIT_ENABLED` | Não | Default ligado; `false` desliga rate limit HTTP. |
| `HTTP_RATE_LIMIT_MAX` | Não | Default 30 req / janela. |
| `HTTP_RATE_LIMIT_WINDOW_MS` | Não | Default 15 min. |

### Autenticação

| Variável | Obrigatória | Valor / onde obter |
|----------|-------------|-------------------|
| `BETTER_AUTH_SECRET` | Sim | Segredo longo aleatório; **mesmo valor** nos frontends Next que usam Better Auth. |
| `BETTER_AUTH_URL` | Sim | URL pública do backend, ex.: `https://pulse-backend-production-653f.up.railway.app` (sem barra final). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Opcional | Google Cloud Console → OAuth client. |
| `APPLE_CLIENT_ID` / `APPLE_CLIENT_SECRET` | Opcional | Apple Developer → Sign in with Apple. |

### Banco de dados

| Variável | Obrigatória | Valor / onde obter |
|----------|-------------|-------------------|
| `DATABASE_URL` | Sim* | String MySQL ou montada a partir de `MYSQL_*` (Railway plugin). |
| `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` | Sim* | Variáveis do plugin MySQL no Railway (*use URL única **ou** conjunto `MYSQL_*`). |

### Pagamentos

| Variável | Obrigatória | Valor / onde obter |
|----------|-------------|-------------------|
| `PAYMENT_PROVIDER` | Não | `pagarme` (default) ou `stripe`. |
| `PAYMENTS_ENABLED` | Não | `true` / `false` — endpoints de pagamento 503 se `false`. |
| `STRIPE_SECRET_KEY` | Se Stripe | Dashboard Stripe → API keys. |
| `STRIPE_WEBHOOK_SECRET` | Se Stripe webhooks | Stripe → Webhooks → signing secret (`whsec_...`). |
| `STRIPE_PUBLISHABLE_KEY` | Opcional | Stripe → publishable key ( também no app via `EXPO_PUBLIC_*`). |
| `PAGARME_SECRET_KEY` | Se Pagar.me | Dashboard Pagar.me. |
| `PAGARME_WEBHOOK_SECRET` | Se Pagar.me webhooks | Pagar.me → webhook HMAC; se omitido, fallback `PAGARME_SECRET_KEY`. |
| `PAGARME_MOCK_PIX_AUTO_CONFIRM` | Não | **`true` só dev** — auto-confirma Pix mock. |

### E-mail / produtor

| Variável | Obrigatória | Valor / onde obter |
|----------|-------------|-------------------|
| `MAIL_PROVIDER` | Não | `brevo` ou fallback (log). |
| `BREVO_API_KEY` | Se Brevo | Brevo → SMTP & API. |
| `BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME` | Se Brevo | Remetente verificado no Brevo. |
| `PRODUCER_WEB_URL` | Recomendado prod | URL do portal produtor nos e-mails, ex.: `https://pulse-producer-web-production.up.railway.app` ou domínio custom `https://app.pulse.app`. |

### Biometria facial (backend)

| Variável | Obrigatória | Valor / onde obter |
|----------|-------------|-------------------|
| `BIOMETRIC_ENCRYPTION_KEY` | Prod + enrollment V2 | `openssl rand -hex 32` (64 chars hex). |
| `BIOMETRIC_HASH_SECRET` | Opcional | Segredo HMAC; se vazio, fallback da encryption key. |
| `PULSE_FACE_SERVICE_URL` | Extract / identify | `https://pulse-face-production.up.railway.app` |
| `PULSE_FACE_SERVICE_API_KEY` | Extract / identify | Gerar segredo forte; **igual** no serviço pulse-face (`x-api-key`). |
| `PULSE_INTERNAL_API_KEY` | Crons `/internal/*` | Segredo forte; header `x-pulse-internal-key`. |
| Flags `FACIAL_*`, `PULSE_FACE_*`, `FACE_GALLERY_*` | Por fase | Ver [infra deploy facial](../product/facial/infra-deploy-checklist.md) e `backend/.env.example`. |

### KYC / storage

| Variável | Obrigatória | Valor / onde obter |
|----------|-------------|-------------------|
| `KYC_STORAGE_PATH` | MVP Railway | Volume montado, ex.: `./storage/kyc`. |

### Comandos Railway (pulse-backend)

```bash
cd backend   # ou repo pulse-backend linkado
railway link   # projeto Pulse, serviço pulse-backend, environment production
railway variables -k
railway variables --set 'CORS_ORIGINS=https://client-web-production-be7d.up.railway.app,...'
```

---

## pulse-face (Railway)

Referência: `pulse-face/.env.example`. Serviço **separado** do Bun (Docker).

| Variável | Obrigatória | Valor / onde obter |
|----------|-------------|-------------------|
| `PULSE_FACE_SERVICE_API_KEY` | Sim | **Mesmo valor** que `PULSE_FACE_SERVICE_API_KEY` no backend. |
| `PULSE_FACE_MODEL_PATH` | Não | `/models` (default Dockerfile). |
| `PULSE_FACE_GALLERY_BACKEND` | Sim prod | `memory` (dev) / `persistent` ou `sqlite` + volume. |
| `PULSE_FACE_GALLERY_PATH` | Com persistent | Volume Railway, ex.: `/data/gallery`. |
| `PULSE_FACE_IDENTIFY_THRESHOLD` | Não | Default `0.45`. |
| `PULSE_FACE_VERIFY_THRESHOLD` | Não | Default `0.50`. |
| `PULSE_FACE_MIN_SCORE_GAP` | Não | Default `0.05`. |
| `PORT` | Sim | Railway injeta; app escuta `0.0.0.0:${PORT}`. |
| `REDIS_URL` | Futuro | Só se `PULSE_FACE_GALLERY_BACKEND=redis`. |

**Não colocar no pulse-face:** segredos do backend, `DATABASE_URL`, chaves Stripe/Pagar.me.

---

## producer-web (Railway — pulse-producer-web)

Referência: `producer-web/.env.example`.

| Variável | Obrigatória | Valor / onde obter |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | Sim | `https://pulse-backend-production-653f.up.railway.app` |
| `NEXT_PUBLIC_APP_URL` | Sim | URL pública **deste** app: prod `https://pulse-producer-web-production.up.railway.app`; local `http://localhost:3001`. |
| `BETTER_AUTH_SECRET` | Sim | **Idêntico** ao `BETTER_AUTH_SECRET` do backend. |

Variáveis `NEXT_PUBLIC_*` exigem **rebuild** no Railway após alteração.

---

## client-web (Railway)

Referência: `client-web/.env.example`.

| Variável | Obrigatória | Valor / onde obter |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | Sim | `https://pulse-backend-production-653f.up.railway.app` |
| `NEXT_PUBLIC_APP_URL` | Sim | Prod: `https://client-web-production-be7d.up.railway.app`; local `http://localhost:3000`. |
| `BETTER_AUTH_SECRET` | Sim | **Idêntico** ao backend. |

---

## pulse-landing-page (Railway)

Site estático; em geral **não** chama API autenticada. Se passar a chamar o backend a partir do browser, a origem deve constar em `CORS_ORIGINS` no backend (já incluída a URL Railway de produção).

Domínio prod: `https://pulse-landing-page-production-e0ce.up.railway.app`.

---

## app-client (EAS / `.env`)

Referência: `app-client/.env.example`.

| Variável | Obrigatória | Valor / onde obter |
|----------|-------------|-------------------|
| `EXPO_PUBLIC_API_URL` | Sim | Prod: `https://pulse-backend-production-653f.up.railway.app`; dev: IP LAN / `10.0.2.2` / `localhost`. |
| `EXPO_PUBLIC_PAYMENTS_ENABLED` | Não | Alinhar com `PAYMENTS_ENABLED` do backend. |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Se Stripe no app | Stripe Dashboard → publishable key. |
| `EXPO_PUBLIC_FACIAL_ENROLLMENT_V2` | Por rollout | Espelhar `FACIAL_ENROLLMENT_V2` — rebuild EAS obrigatório. |
| `EXPO_PUBLIC_PULSE_FACE_EXTRACT` | Por rollout | Espelhar `PULSE_FACE_EXTRACT_ENABLED`. |

**Nunca** no app: `QR_SECRET`, `BIOMETRIC_ENCRYPTION_KEY`, `PULSE_FACE_SERVICE_API_KEY`, webhooks secrets.

---

## app-producer (EAS / `.env`)

Não há `.env.example` no repo; espelhar app-client.

| Variável | Obrigatória | Valor / onde obter |
|----------|-------------|-------------------|
| `EXPO_PUBLIC_API_URL` | Sim | Mesmo backend que app-client. |
| `EXPO_PUBLIC_PULSE_FACE_EXTRACT` | Por rollout | Espelhar backend. |
| `EXPO_PUBLIC_PAYMENTS_ENABLED` | Não | Alinhar backend. |

Deep link / web cliente (hardcode opcional): `clientWebUrl.ts` usa fallback `https://client-web-production-be7d.up.railway.app`.

---

## Matriz rápida — segredos compartilhados

| Segredo | Onde deve ser igual |
|---------|---------------------|
| `BETTER_AUTH_SECRET` | backend, client-web, producer-web |
| `PULSE_FACE_SERVICE_API_KEY` | backend ↔ pulse-face |
| `PULSE_INTERNAL_API_KEY` | backend + cron/jobs que chamam `/internal/*` |

---

## Referências

- [Segurança — CORS](../standards/security.md)
- [Checklist deploy facial](../product/facial/infra-deploy-checklist.md)
- `backend/.env.example`

*Última atualização: 2026-05-20 — CORS produção aplicado via Railway CLI.*
