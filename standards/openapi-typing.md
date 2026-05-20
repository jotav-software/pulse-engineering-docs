# Tipagem OpenAPI — incremento (issue #21)

## Escopo deste PR

Schemas TypeBox em `src/shared/schemas/` e `response` Swagger nas rotas:

| Grupo | Prefixo | Rotas tipadas |
|-------|---------|----------------|
| Producer Auth | `/api/producer/v1/auth` | login, logout, forgot/reset/resend, onboarding/status |
| Producer KYC | `/api/producer/v1/kyc/documents` | list, get, upload, replace |
| Admin Auth | `/api/admin/v1/auth` | login, verify-otp, logout, me |
| Admin KYC | `/api/admin/v1/kyc` | queue, detail, download, approve, reject |

## Rotas B2C raiz sem OpenAPI (inventário)

Montadas por `registerClientApplicationApi` na raiz e espelhadas em `/api/client/v1`:

- `/auth` — AuthController
- `/events` — EventController
- `/tickets` — TicketController
- `/payment` — PaymentController
- `/biometric` — BiometricController
- `/checkout` — CheckoutController
- `/admin` — AdminController (legado)
- `/compliance` — ComplianceController
- `/api/promoter` — PromoterController

O plugin Swagger em `src/index.ts` exclui esses paths da UI; migração futura: repetir o padrão `shared/schemas` + `response` no espelho `/api/client/v1` primeiro.

## Próximos passos (issue aberta)

- [ ] Tipar rotas B2C canônicas (`/api/client/v1/auth`, events, tickets)
- [ ] Onboarding produtor (`profile/*`, `terms/*`) com envelopes mistos
- [ ] Financeiro/comercial produtor
- [ ] Inventário automatizado (script que diff rotas vs Swagger)
