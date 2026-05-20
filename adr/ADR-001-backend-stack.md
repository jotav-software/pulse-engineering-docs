# ADR-001: Backend Architecture & Technology Stack

> Fonte canônica: [pulse-backend/docs/technical/ADR-001-Backend-Stack.md](https://github.com/jotav-software/pulse-backend/blob/develop/docs/technical/ADR-001-Backend-Stack.md)

## Status
Accepted

## Decision (resumo)

Clean Architecture com **Bun**, **Elysia**, **Prisma** (MySQL), **Better Auth**.

Namespaces: `/api/client/v1`, `/api/producer/v1`, `/api/admin/v1`, espelho legado B2C na raiz.

Camadas: Domain → Application (use cases) → Infrastructure → Presentation.
