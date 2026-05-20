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
