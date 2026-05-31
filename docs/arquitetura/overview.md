# Visão geral da arquitetura Pulse

## Ecossistema

O Pulse é uma plataforma de ingressos e experiências com múltiplos repositórios Git independentes, organizados localmente sob um workspace comum.

```
                    ┌─────────────────┐
                    │  pulse-backend  │
                    │  Elysia + Prisma│
                    └────────┬────────┘
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
  producer-web         client-web          app-producer
  (Next.js B2B)        (Next.js B2C)       (Expo B2B)
         │                   │                   │
         └───────────────────┼───────────────────┘
                             ▼
                       app-client (Expo B2C)
                             │
                             ▼
                       pulse-face (biometria)
```

## Namespaces HTTP (backend)

| Namespace | Prefixo | Persona |
|-----------|---------|---------|
| B2C canônico | `/api/client/v1/*` | Cliente final |
| B2C legado | `/` (`/auth`, `/events`, …) | Espelho até migração completa |
| Produtor | `/api/producer/v1/*` | Organizador / equipe |
| Admin Pulse | `/api/admin/v1/*` | Operações internas |
| Auth | `/api/auth/*` | Better Auth (OAuth, sessão) |
| Interno | headers `x-pulse-internal-key` | Serviços internos (ex.: pulse-face) |

## Camadas backend (Clean Architecture)

| Camada | Responsabilidade |
|--------|------------------|
| `presentation/` | Controllers Elysia, middlewares, rotas |
| `application/` | Use cases, serviços de domínio |
| `infrastructure/` | Prisma, mail, storage, gateways |
| `domain/` | Interfaces e tipos (uso parcial) |
| `shared/` | Utils, RBAC helpers, constantes |

**Padrão dominante:** use cases instanciam `prisma` diretamente; repositórios de domínio existem mas não cobrem todo o código.

## Frontends

| App | Stack | Comunicação API |
|-----|-------|-----------------|
| producer-web | Next 16, React 18, TanStack Query, Eden | Cookies + Bearer + `x-producer-id` |
| client-web | Idem (menor superfície) | Eden + `fetch` em auth |
| app-producer | Expo 54, React 19, clean arch + DI | Eden + SecureStore |
| app-client | Expo 54, React 19 | Eden + SecureStore |

Contrato type-safe: `export type App = typeof app` no backend + Eden Treaty nos clientes TypeScript.

## Documentação legada migrada

Conteúdo técnico de produto permanece referenciado a partir de `pulse-backend/docs/` (KYC, biometria, jobs). Este repositório consolida **padrões transversais**; detalhes de domínio específico continuam no backend com links aqui.

Ver também: [ADR-001 Backend Stack](../decisoes/ADR-001-backend-stack.md)
· [Autenticação e sessões](./autenticacao.md).
