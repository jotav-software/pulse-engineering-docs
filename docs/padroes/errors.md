# Tratamento de erros

## Fluxo atual

```
Use Case → throw AppError(code, status, message)
                ↓
         errorHandler (Elysia onError)
                ↓
    { success, error, message, timestamp }

Auth middleware (401/403) → resposta direta (formato legado)
                ↓
         Frontend ApiError.from() / treatyErrors (mobile)
```

## Backend — classes

| Classe | HTTP | Código default |
|--------|------|----------------|
| `AppError` | configurável | `BAD_REQUEST` |
| `NotFoundError` | 404 | `NOT_FOUND` |
| `UnauthorizedError` | 401 | `UNAUTHORIZED` |
| `ForbiddenError` | 403 | `FORBIDDEN` |

Arquivo: `pulse-backend/src/presentation/middlewares/ErrorHandler.ts`

## Helper unificado (implementado)

`buildApiErrorResponse()` em `src/shared/http/apiErrorResponse.ts`:

- Sempre inclui `timestamp` (campo aditivo, compatível)
- Suporta `code` opcional (ex.: `MUST_CHANGE_PASSWORD`)
- Modo legado: `error` pode permanecer mensagem humana quando necessário

## Frontend web

`ApiError` + mapa `ERROR_MESSAGES` (PT-BR) em `lib/errors.ts`.

`unwrap()` lança `ApiError.from(error)` para respostas Eden.

`getErrorMessage()` para exibição em toast.

## Mobile

- `shared/api/apiError.ts` + `treatyErrors.ts`
- UI: `Alert.alert` — aceitável, mas parsing deve espelhar web

## Padrão recomendado (alvo)

| Campo | Semântica |
|-------|-----------|
| `success` | sempre `false` em erro |
| `error` | código máquina (`SNAKE_CASE`) |
| `message` | texto para usuário (PT-BR) |
| `code` | opcional, códigos de fluxo (`MUST_CHANGE_PASSWORD`) |
| `timestamp` | ISO 8601 |

## Migração sem breaking change

1. ✅ Helper + timestamp em respostas de auth
2. Adicionar `message` paralelo onde `error` é texto legado
3. Frontends priorizam `message` para UI, `error` para lógica
4. Deprecar mensagens em `error` após janela de migração
