# EPIC: Melhorias técnicas Pulse

**Repositório de rastreamento:** [jotav-software/pulse-backend](https://github.com/jotav-software/pulse-backend)

> Atualize os links abaixo após criar as issues (placeholders substituídos na sessão de automação).

## Objetivo

Padronizar tipagem de API, tratamento de erros, hooks frontend, testes e segurança sem quebrar contratos em produção.

## Temas e issues filhas

| Tema | Issue | Docs |
|------|-------|------|
| Backend API typing & validation | TBD | [standards/api.md](../standards/api.md) |
| Error handling standardization | TBD | [standards/errors.md](../standards/errors.md) |
| Frontend hooks & services | TBD | [standards/frontend.md](../standards/frontend.md) |
| Form validation & test strategy | TBD | [standards/testing.md](../standards/testing.md) |
| Unit/integration test gaps | TBD | [standards/testing.md](../standards/testing.md) |
| Security hardening | TBD | [standards/security.md](../standards/security.md) |
| Cross-app library alignment | TBD | [standards/frontend.md](../standards/frontend.md) |
| CI / Biome enforcement | TBD | [standards/backend.md](../standards/backend.md) |

## Ordem de implementação sugerida

1. Contrato de erro (helper + testes) — baixo risco
2. Testes de parsing de erro no frontend web
3. Documentação OpenAPI rotas legadas (não remover rotas)
4. CORS e rate limit por ambiente
5. Alinhamento cookies client-web
6. Error Boundaries React
7. Testes mobile (treatyErrors, auth store)
8. Remoção dependências mortas backend
9. Biome strict incremental por pasta

## Riscos deferidos

- Mudar semântica do campo `error` em 401 legado (breaking)
- Habilitar Biome error-on-warnings no monólito legado
- Unificar React 18→19 em web sem regressão visual
- Remover rotas B2C na raiz antes de migração mobile completa
