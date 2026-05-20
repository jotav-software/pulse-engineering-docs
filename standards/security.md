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

- KYC: 10 MB, PDF/JPEG/PNG/WebP — `assertValidKycUpload`
- Validação TypeBox `t.File()` + regras de negócio

## Rate limiting

| Área | Status |
|------|--------|
| Better Auth | ✅ (15 min / 100 — revisar para produção) |
| OTP resend | ✅ cooldown 60s nos use cases |
| HTTP login produtor/admin | ✅ `httpRateLimitMiddleware` (30 req / 15 min por IP; `HTTP_RATE_LIMIT_ENABLED=false` para desligar) |

Variáveis: `HTTP_RATE_LIMIT_MAX`, `HTTP_RATE_LIMIT_WINDOW_MS`, `HTTP_RATE_LIMIT_ENABLED`.

## CORS

- Variável canônica no backend: **`CORS_ORIGINS`** (lista separada por vírgula, implementação em `runtimeEnv.ts` + `@elysiajs/cors`).
- **Desenvolvimento:** se `CORS_ORIGINS` estiver vazia, o código usa defaults (localhost + domínios `*.pulse.app`).
- **Produção (Railway):** definir allowlist explícita — ver [Variáveis de ambiente — pulse-backend](../ops/environment-variables.md#pulse-backend-railway). Origens Railway atuais incluem client-web, pulse-producer-web e landing; incluir domínios custom quando forem para produção.
- Comportamento: a origem da requisição só é refletida se estiver na lista (fail-closed para browsers fora da allowlist).
- **Não usar** `CORS_ALLOWED_ORIGINS` (nome legado em docs antigos).

## Secrets

- `.env.example` documentado; nunca commitar `.env`
- Chaves faciais, Pagarme, Brevo, internal API

## Frontend

| Risco | Mitigação |
|-------|-----------|
| Tokens em cookies sem `httpOnly` em alguns fluxos | Avaliar cookies httpOnly + SameSite |
| client-web sem middleware | Adicionar guard de rotas protegidas |
| SecureStore mobile | ✅ padrão Expo |

## Biometria

- Criptografia de vetores: `biometricCrypto.ts`
- pulse-face: `x-api-key`
- Feature flags: `facialFlags.ts`

## Ações prioritárias

1. Definir `CORS_ALLOWED_ORIGINS` em staging/prod (Railway)
2. Rate limit em upload KYC e AUTH-004 (5 falhas / 15 min) — pendente
3. Alinhar formato 401 com `errorHandler`
4. Remover segredos do workspace `docs/` local (chaves `.p8` — não versionar)
