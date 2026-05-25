# EPIC: Melhorias técnicas Pulse

**EPIC:** https://github.com/jotav-software/pulse-backend/issues/20

## Issues filhas

| # | Tema | URL |
|---|------|-----|
| 21 | Backend API typing & validation | https://github.com/jotav-software/pulse-backend/issues/21 |
| 22 | Error handling standardization | https://github.com/jotav-software/pulse-backend/issues/22 |
| 23 | Frontend hooks & services | https://github.com/jotav-software/pulse-backend/issues/23 |
| 24 | Form validation & test strategy | https://github.com/jotav-software/pulse-backend/issues/24 |
| 25 | Unit/integration test gaps | https://github.com/jotav-software/pulse-backend/issues/25 |
| 26 | Security hardening | https://github.com/jotav-software/pulse-backend/issues/26 |
| 27 | Cross-app library alignment | https://github.com/jotav-software/pulse-backend/issues/27 |
| 28 | CI / Biome enforcement | https://github.com/jotav-software/pulse-backend/issues/28 |
| 29 | M11 — Hash session tokens no DB | https://github.com/jotav-software/pulse-backend/issues/29 |

## Segurança (backlog detalhado)

| ID | Tema | Doc |
|----|------|-----|
| M11 | Session token hashing | [session-token-hashing.md](./session-token-hashing.md) |

## Plano de prontidão para lançamento (Trilhas A/B/C)

Plano consolidado da auditoria 2026-05-24: [`../operacoes/plano-lancamento-tecnico.md`](../operacoes/plano-lancamento-tecnico.md). Trilha A (hardening técnico) está em execução nesta sprint.

## Implementado na sessão inicial

- Helper `buildApiErrorResponse` no backend + testes
- `parseApiErrorPayload` no producer-web + testes
- Repositório de documentação: https://github.com/jotav-software/pulse-engineering-docs

## Ordem sugerida

1. #22 Erros (continuar migração middlewares)
2. #25 Testes (corrigir suite pagamentos)
3. #21 API typing (Swagger rotas críticas)
4. #26 Segurança (CORS/rate limit)
5. #23–#24 Frontend
6. #28 CI
7. #27 Cross-app (maior risco)
