# Pulse — Documentação de Engenharia

Repositório central de arquitetura, padrões, segurança e backlog técnico do ecossistema **Pulse** (JV / jotav-software).

## Repositórios de código

| Repositório | Descrição |
|-------------|-----------|
| [pulse-backend](https://github.com/jotav-software/pulse-backend) | API Bun + Elysia + Prisma |
| [pulse-producer-web](https://github.com/jotav-software/pulse-producer-web) | Portal produtor/admin (Next.js) |
| [client-web](https://github.com/jotav-software/client-web) | Web B2C (Next.js) |
| [pulse-app-client](https://github.com/jotav-software/pulse-app-client) | App cliente (Expo) |
| [pulse-app-producer](https://github.com/jotav-software/pulse-app-producer) | App organizador (Expo) |
| [pulse-face](https://github.com/jotav-software/pulse-face) | Microserviço biometria (FastAPI) |
| [pulse-landing-page](https://github.com/jotav-software/pulse-landing-page) | Landing estática |

## Índice

- [Visão geral da arquitetura](./architecture/overview.md)
- [Padrões backend](./standards/backend.md)
- [Contratos de API e tipagem](./standards/api.md)
- [Padrões frontend](./standards/frontend.md)
- [Tratamento de erros](./standards/errors.md)
- [Testes](./standards/testing.md)
- [Segurança](./standards/security.md)
- [ADRs](./adr/README.md)
- [Backlog e EPIC](./backlog/epic-technical-improvements.md)

## EPIC GitHub

Melhorias técnicas rastreadas no repositório **pulse-backend** — ver [backlog/epic-technical-improvements.md](./backlog/epic-technical-improvements.md) para links atualizados às issues.

## Como contribuir

1. Alterações de padrão: PR neste repositório (`docs/`).
2. Implementação: PR no repositório de código correspondente, referenciando a issue do EPIC.
3. Não commitar segredos (`.env`, chaves `.p8`, tokens).
