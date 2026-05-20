# Checklist de segurança

## Autenticação

| Item | Status | Notas |
|------|--------|-------|
| Better Auth B2C | ✅ | `src/infrastructure/auth/auth.ts` |
| Bearer + sessão Prisma | ✅ | Mobile e testes |
| Producer portal (`x-producer-id`) | ✅ | `ProducerAuthMiddleware` |
| Admin `PULSE_ADMIN` | ✅ | `AdminAuthMiddleware` |
| API interna (`PULSE_INTERNAL_API_KEY`) | ✅ | `InternalApiMiddleware` |
| Troca de senha obrigatória | ✅ | `MUST_CHANGE_PASSWORD` |
| Termos LGPD (HU06) | ✅ | `TermsComplianceMiddleware` |

## Autorização (RBAC)

- `requireRole([...])` em rotas B2C
- Guards produtor: `producerPortal`, `commercialRbacGuard`
- Documentação: `pulse-backend/docs/RBAC.md`

## Upload

- KYC: 10 MB, PDF/JPEG/PNG/WebP — `assertValidKycUpload` + magic bytes (`detectKycFileKind`)
- Validação TypeBox `t.File()` + regras de negócio

## Rate limiting

| Área | Status |
|------|--------|
| Better Auth | ✅ (15 min / 100 — revisar para produção) |
| OTP resend | ✅ cooldown 60s nos use cases |
| HTTP login/register/pagamento | ✅ `httpRateLimitMiddleware` (30 req / 15 min por IP; `HTTP_RATE_LIMIT_ENABLED=false` para desligar) |

Variáveis: `HTTP_RATE_LIMIT_MAX`, `HTTP_RATE_LIMIT_WINDOW_MS`, `HTTP_RATE_LIMIT_ENABLED`.

Rotas limitadas: `/auth/login`, `/auth/register`, `/api/admin/v1/auth/login`, `/api/admin/v1/auth/login/verify-otp`, `/api/producer/v1/auth/login`, `/payment/pix`, `/payment/card` (e espelhos em `/api/client/v1`).

## CORS

- Variável canônica no backend: **`CORS_ORIGINS`** (lista separada por vírgula, implementação em `runtimeEnv.ts` + `@elysiajs/cors`).
- **Desenvolvimento:** se `CORS_ORIGINS` estiver vazia, o código usa defaults (localhost + domínios `*.pulse.app`).
- **Produção (Railway):** definir allowlist explícita — ver [Variáveis de ambiente — pulse-backend](../ops/environment-variables.md#pulse-backend-railway). Origens Railway atuais incluem client-web, pulse-producer-web e landing; incluir domínios custom quando forem para produção.
- Comportamento: a origem da requisição só é refletida se estiver na lista (fail-closed para browsers fora da allowlist).
- **Não usar** `CORS_ALLOWED_ORIGINS` (nome legado em docs antigos).

## Secrets

- `.env.example` documentado; nunca commitar `.env`
- Chaves faciais, Pagarme, Brevo, internal API
- Produção: `QR_SECRET`, `BIOMETRIC_HASH_SECRET` obrigatórios (`runtimeEnv.ts`)

## Frontend

| Risco | Mitigação |
|-------|-----------|
| Tokens em cookies sem `httpOnly` em alguns fluxos | Avaliar cookies httpOnly + SameSite |
| client-web sem middleware | Adicionar guard de rotas protegidas |
| SecureStore mobile | ✅ padrão Expo |
| Convite equipe sem `temporaryPassword` na API | E-mail com **Esqueci minha senha** + `inviteEmailSent` + reenvio (`ResendTeamInviteAccess`) |

## Biometria

- Criptografia de vetores: `biometricCrypto.ts`
- pulse-face: `x-api-key`
- Feature flags: `facialFlags.ts`

## OWASP remediation status (backend, maio/2026)

Auditoria inicial: relatório em conversa de segurança (subagente OWASP). Legenda: **fechado** | **pendente** | **backlog** (decisão produto/ops ou esforço alto).

| ID | Achado | Status | Notas |
|----|--------|--------|-------|
| C1 | Logs de sistema públicos (`/admin/logs`) | fechado | Exige `PULSE_ADMIN` |
| H1 | IDOR checkout/pagamento | fechado | Ownership `session.userId` |
| H2 | CORS refletivo | fechado | `CORS_ORIGINS` + allowlist |
| H3 | Webhooks sem HMAC em misconfig | fechado | Fail-closed em produção |
| H4 | Auto-registro PRODUCER | fechado | Só `CLIENT` no registro público |
| H5 | QR_SECRET fallback hardcoded | fechado | `resolveQrSecret()` |
| H6 | ADMIN legado + `x-producer-id` | fechado | Membership / migração |
| H7 | Swagger público | fechado | Desligado em prod |
| H8 | Stripe webhook bypass mock | fechado | Validação em prod |
| M1 | OTP `Math.random()` | fechado | CSPRNG |
| M2 | OTP no stdout | fechado | Removido |
| M3 | Rate limit HTTP fraco | fechado | `httpRateLimitMiddleware` |
| M4 | Senha Better Auth 6 vs 8 | fechado | `minPasswordLength: 8` |
| M5 | `temporaryPassword` na API | fechado | Removido; convite por e-mail + Esqueci minha senha |
| M6 | KYC sem magic bytes | fechado | Magic bytes em `producerKycHelpers.ts` (PDF/JPEG/PNG/WebP) |
| M7 | Fallback hash biométrico | fechado | `resolveBiometricHashSecret()` |
| M8 | CPF integral no check-in QR | fechado | `maskCpfLast3` em `ValidateCheckinUseCase` |
| M9 | Dependências (`xlsx`, transitivos) | fechado | `xlsx` removido; export financeiro só CSV (incl. bundle) |
| M10 | Role via `expo-origin` | fechado | Com H4 — signup produtor bloqueado |
| M11 | Sessão em texto claro no DB | backlog | [Issue #29](https://github.com/jotav-software/pulse-backend/issues/29) — [session-token-hashing.md](../backlog/session-token-hashing.md) |
| M12 | PII em `system_logs` | parcial | Check-in QR sem nome completo no log; política global pendente |
| L1 | Check-in manual 3 dígitos CPF | backlog | Risco aceito pelo produto |
| L2 | Health sem probe DB | fechado | `SELECT 1` |
| L3 | Bind `0.0.0.0` | fechado | `HOST` configurável |
| L4 | Pagar.me HMAC SHA-1 | backlog | Especificação do gateway |
| L5 | `.env` local com secrets | backlog | Ops — [environment-variables.md](../ops/environment-variables.md) |

### M9 — `bun audit` (snapshot)

| Pacote | Severidade | Uso | Ação |
|--------|------------|-----|------|
| ~~`xlsx@0.18.5`~~ | — | Removido (maio/2026) | Export financeiro CSV-only |
| `kysely` (via better-auth) | alta | transitivo | `bun update` quando adapter permitir |
| `esbuild` (drizzle-kit) | moderada | dev tooling | Atualizar drizzle-kit |
| `uuid` (typeorm) | moderada | transitivo | Atualizar quando typeorm permitir |

## Ações prioritárias

1. ~~Definir `BIOMETRIC_HASH_SECRET` e `QR_SECRET` no Railway prod~~ (configurados)
2. ~~Atualizar apps produtor para convite sem `temporaryPassword`~~ (fechado)
3. Rate limit AUTH-004 (5 falhas / 15 min) — endurecer Better Auth em produção
4. Alinhar formato 401 com `errorHandler`
5. Remover segredos do workspace `docs/` local (chaves `.p8` — não versionar)
