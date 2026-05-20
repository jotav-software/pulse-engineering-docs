# API — tipagem e contratos

## OpenAPI / Swagger

- UI: `/swagger` no backend
- Rotas legadas na raiz **excluídas** da documentação OpenAPI (`exclude` regex) — ainda ativas em runtime
- Metadados: `bearerAuth`, tags por persona

## Type-safety ponta a ponta

| Camada | Mecanismo |
|--------|-----------|
| Backend | TypeBox + `export type App = typeof app` |
| producer-web / client-web | `@elysiajs/eden` → `pulseProducer` / `pulseClient` |
| Mobile | Eden Treaty em `eden.client.ts` |

## Formato de erro (alvo)

```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Recurso não encontrado.",
  "timestamp": "2026-05-19T12:00:00.000Z"
}
```

Casos especiais com `code` adicional (ex.: `MUST_CHANGE_PASSWORD`) permanecem compatíveis.

## Gaps de tipagem

| Gap | Impacto | Mitigação |
|-----|---------|-----------|
| Auth middleware retorna `error` como mensagem PT em alguns 401 | Frontends mapeiam `error` como código | Helper `buildApiErrorResponse` + migração gradual |
| Rotas raiz fora do Swagger | Clientes antigos sem contrato único | Migrar para `/api/client/v1` |
| `noExplicitAny` relaxado em controllers comerciais | Tipagem fraca em financeiro | Refatorar incrementalmente |
| Docs mencionam Zod; código usa TypeBox | Confusão onboarding | Atualizar docs (feito aqui) |

## Headers por cliente

| Header | Uso |
|--------|-----|
| `Authorization: Bearer <token>` | Sessão mobile e APIs autenticadas |
| `x-producer-id` | Tenant produtor (portal B2B) |
| `x-pulse-app` | Identificação do cliente (`producer-web`, `client-web`, …) |

## Eden unwrap (frontend)

Services web usam `unwrap()` que espera `{ success, data }` e propaga `ApiError.from(error)` em falhas.

## Schemas compartilhados (backend)

Pasta: `backend/src/shared/schemas/`

| Arquivo | Uso |
|---------|-----|
| `httpEnvelope.ts` | `successDataResponse()`, `standardSuccessResponses()`, `legacySuccessMessageResponse`, `apiErrorResponseSchema` |
| `producerAuth.ts` / `adminAuth.ts` | Login, sessão, onboarding |
| `producerKyc.ts` / `adminKyc.ts` | Documentos KYC (enum de tipo/status reutilizado) |

**Padrão em controllers (Elysia):**

```ts
import { standardSuccessResponses, producerLoginDataSchema } from "../../shared/schemas";

.post("/login", handler, {
  body: t.Object({ email: t.String(), password: t.String() }),
  response: standardSuccessResponses(producerLoginDataSchema),
  detail: { tags: ["Producer Auth"], summary: "…" },
})
```

- `response` documenta OpenAPI e reforça inferência Eden; **não altera** o JSON em runtime.
- Rotas com payload legado usam `legacySuccessMessageResponse` e descrição explícita no `detail`.

## Envelope `{ success, data }` vs legado

| Padrão | Exemplo | Quando usar |
|--------|---------|-------------|
| **Canônico** | `{ "success": true, "data": { … } }` | KYC produtor/admin, login admin, onboarding status, maioria das rotas novas B2B |
| **Legado (auth)** | `{ "success": true, "message": "…" }` | `forgot-password`, `reset-password`, `resend-first-access`, alguns passos de onboarding |
| **Legado (middleware)** | `{ "success": false, "error": "mensagem PT" }` | 401 antigos; migrar para `buildApiErrorResponse` gradualmente |
| **Binário** | bytes + headers | download KYC admin |

Inventário parcial de rotas B2C **fora do Swagger** (ativas na raiz): `/auth/*`, `/events/*`, `/tickets/*`, `/checkout/*`, `/payment/*`, `/biometric/*`, `/admin/*` (legado cliente), `/compliance/*`. Contrato documentado: `/api/client/v1/*` apenas.
