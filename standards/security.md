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
| OTP resend | Documentado 60s |
| HTTP global por rota | ❌ gap |

## CORS

- `origin: true` (reflete qualquer origin) — **revisar em produção**

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

1. Restringir CORS por ambiente
2. Rate limit em rotas sensíveis (login, OTP, upload)
3. Alinhar formato 401 com `errorHandler`
4. Remover segredos do workspace `docs/` local (chaves `.p8` — não versionar)
