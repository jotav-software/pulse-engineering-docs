# Estratégia de testes

## Backend

| Tipo | Local | Comando |
|------|-------|---------|
| Unit | `tests/unit/` (~70 arquivos) | `bun run test:unit` |
| Integration | `tests/integration/` (~5) | `bun run test:integration` |
| Co-localizados | `src/**/__tests__/*.spec.ts` | `bun test` |

**Cobertura forte:** checkout, pagamentos, RBAC produtor, KYC admin, facial, repasse.

**Gaps:** poucos testes HTTP de controller completos; E2E produtor/admin limitados; integração depende de DB real.

## Frontend web

- Runner: `bun test` (preload em `bunfig.toml`)
- **Cobertura atual:** 1 teste utilitário (`cn`) por app
- `vitest` em devDependencies **não usado** nos scripts

### Recomendações frontend

| Prioridade | O que testar |
|------------|--------------|
| Alta | `ApiError.from`, `parseApiErrorPayload`, `unwrap` |
| Alta | Hooks críticos (auth login, KYC upload) com MSW |
| Média | Validação zod de formulários (schemas isolados) |
| Baixa | E2E Playwright (fluxos onboarding) |

**Unit vs integration:** validações de formulário = **unit** (schema zod); fluxo auth = **integration** com mock API.

## Mobile

- **Sem scripts de teste** em app-producer e app-client
- Recomendação: Jest/Vitest + mock Eden para `treatyErrors` e stores Zustand

## pulse-face

- pytest em `tests/`

## CI (recomendado)

- `bun run build` + `bun run test:unit` em PRs backend
- `bun run type-check` + `bun test` em PRs web
- Não habilitar Biome `--error-on-warnings` em todo legado de uma vez
