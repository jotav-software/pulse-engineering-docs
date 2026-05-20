# Roadmap — padronização de comentários (backend)

Critérios em: [BACKEND_COMMENTS.md](./BACKEND_COMMENTS.md).

Cada fase pode virar um PR pequeno. Ordem sugerida: camadas externas → domínio → infra → testes.

| Fase | Módulo (`backend/src/`) | Escopo | Status |
|------|-------------------------|--------|--------|
| **1** | `presentation/` | `middlewares/`, `routes/`, `controllers/**` | Concluída |
| **2** | `application/use-cases/auth/` + `biometric/` (só casos de uso) | Login, perfil, LGPD, biometria | Concluída |
| **3** | `application/use-cases/checkout/` + `payment/` | Sessão, pagamento, regras 13.x / 15.x | Concluída |
| **4** | `application/use-cases/events/` + `event/` (feed público) | Feed, detalhe, cancelamento | Concluída |
| **5** | `application/use-cases/producer/**` | Eventos, equipe, onboarding, dashboard, comercial | Concluída |
| **6** | `application/use-cases/operation/` + `tickets/` + `promoter/` | Check-in, ingressos, promoter | Concluída |
| **7** | `domain/`, `infrastructure/`, `shared/`, `application/services/` | Repositórios, auth infra, utilitários | Concluída |
| **8** | `**/__tests__/**` | Comentários de mock: uma linha objetiva por arquivo | Concluída |

## Notas

- **JSDoc em controllers**: manter só onde o Swagger não cobre o “por quê” (ex.: prefixos legados).
- **Regras numeradas (13.x, HU…)**: manter referência curta quando existir rastreabilidade em especificação; remover só a casca narrativa (`// 1. // 2.`).
- Após cada fase: `cd backend && bun run lint`.
