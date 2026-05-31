# Catálogo de endpoints API

> Escopo: contrato HTTP consolidado | Público: engenharia | Plataforma: backend Elysia | Última revisão: 2026-05-26

## Legenda de status

| Tag | Significado |
| --- | --- |
| `[IMPLEMENTADO]` | Entregue e utilizável em produção ou demo estável |
| `[PARCIAL]` | Fluxo existe com lacunas (inclui UI «em breve») |
| `[PENDENTE]` | Não implementado ou apenas planejado |

Fonte de status: código (`app-producer`, `producer-web`, `app-client`, `client-web`, `backend`) + `docs/RBAC.md` + revisão 2026-05-19.


## 1. Visão geral

- **OpenAPI interativo:** `GET /swagger` (somente rotas documentadas; B2C canônico em `/api/client/v1`).
- **Health:** `GET /health`
- Rotas legadas B2C na raiz espelham `/api/client/v1` — preferir o prefixo canônico em novos clientes.

## 2. Admin (`/api/admin/v1`)

Ver detalhes em [pulse-admin.md](./pulse-admin.md#3-módulos--funcionalidades).

## 3. Producer (`/api/producer/v1`)

Ver [app-produtor.md](./app-produtor.md) e [producer-web.md](./producer-web.md).

## 4. Client B2C (`/api/client/v1`)

Ver [app-client.md](./app-client.md) e [client-web.md](./client-web.md).

## 5. Tabela consolidada

| Domínio | Método | Caminho | Descrição resumida |
| --- | --- | --- | --- |
| Sistema | GET | /health | Health check |
| Admin v1 | POST | /api/admin/v1/auth/login | Login etapa 1 → OTP e-mail |
| Admin v1 | POST | /api/admin/v1/auth/login/verify-otp | Login etapa 2 → token |
| Admin v1 | POST | /api/admin/v1/auth/logout | Logout admin |
| Admin v1 | GET | /api/admin/v1/auth/me | Sessão admin |
| Admin v1 | GET | /api/admin/v1/producers | Listar produtoras + GMV |
| Admin v1 | GET | /api/admin/v1/producers/:id | Detalhe seguro da produtora (HU02b; sem arquivos/URLs KYC) |
| Admin v1 | POST | /api/admin/v1/producers | Criar produtora (HU02) |
| Admin v1 | POST | /api/admin/v1/producers/:id/reset-password | Reset senha produtor |
| Admin v1 | GET | /api/admin/v1/metrics/health | Métricas checkout (HU03) |
| Admin v1 | GET | /api/admin/v1/payouts | Listar repasses admin |
| Admin v1 | GET | /api/admin/v1/payouts/stats | KPIs repasses |
| Admin v1 | POST | /api/admin/v1/payouts/events/:eventId/freeze | Congelar repasse |
| Admin v1 | POST | /api/admin/v1/payouts/events/:eventId/unfreeze | Descongelar |
| Admin v1 | GET | /api/admin/v1/refunds | Listar estornos |
| Admin v1 | GET | /api/admin/v1/refunds/stats | KPIs estornos |
| Admin v1 | GET | /api/admin/v1/refunds/producers/:producerId/events | Eventos p/ estorno |
| Admin v1 | GET | /api/admin/v1/refunds/search-orders | Buscar pedido |
| Admin v1 | POST | /api/admin/v1/refunds/validate | Validar estorno |
| Admin v1 | POST | /api/admin/v1/refunds | Processar estorno (HU05) |
| Admin v1 | GET | /api/admin/v1/compliance | Documentos legais + KPIs |
| Admin v1 | GET | /api/admin/v1/compliance/documents/:id | Detalhe de documento legal |
| Admin v1 | POST | /api/admin/v1/compliance/documents | Publicar documento legal (HU06) |
| Admin v1 | GET | /api/admin/v1/compliance/acceptance-logs | Logs de aceite legal |
| Admin v1 | GET | /api/admin/v1/compliance/acceptance-logs/export | Export CSV/JSON de aceites |
| Admin v1 | GET | /api/admin/v1/kyc/queue | Fila KYC |
| Admin v1 | GET | /api/admin/v1/kyc/documents/:id | Detalhe KYC |
| Admin v1 | GET | /api/admin/v1/kyc/documents/:id/download | Download documento |
| Admin v1 | POST | /api/admin/v1/kyc/documents/:id/approve | Aprovar KYC |
| Admin v1 | POST | /api/admin/v1/kyc/documents/:id/reject | Rejeitar KYC |
| Producer v1 | POST | /api/producer/v1/auth/login | Login produtor |
| Producer v1 | POST | /api/producer/v1/auth/onboarding/* | Fluxo onboarding/OTP |
| Producer v1 | GET|PATCH | /api/producer/v1/profile/* | Perfil produtor |
| Producer v1 | GET|POST|PATCH|DELETE | /api/producer/v1/team/* | Equipe e convites |
| Producer v1 | GET|POST|PATCH | /api/producer/v1/events/* | CRUD eventos |
| Producer v1 | GET|POST|PATCH | /api/producer/v1/events/:id/comercial/* | Setores e lotes |
| Producer v1 | GET|POST | /api/producer/v1/finance/* | Financeiro e saques |
| Producer v1 | GET|POST | /api/producer/v1/kyc/documents/* | KYC titular upload |
| Producer v1 | GET|POST | /api/producer/v1/operation/* | Check-in QR/facial/lista |
| Producer v1 | GET|POST | /api/producer/v1/compliance/* | Aceite termos produtor |
| Client v1 | POST | /api/client/v1/auth/* | Cadastro/login B2C |
| Client v1 | GET | /api/client/v1/events/* | Catálogo e detalhe |
| Client v1 | GET|POST | /api/client/v1/tickets/* | Carteira, transfer, cancel |
| Client v1 | GET|POST | /api/client/v1/checkout/* | Sessão de compra + aceite de reembolso por sessão |
| Client v1 | GET|POST|DELETE | /api/client/v1/payment/* | Cartões e Pix/cartão |
| Client v1 | GET|POST|DELETE | /api/client/v1/biometry/* | Facial enrollment |
| Client v1 | GET|POST | /api/client/v1/compliance/* | Termos B2C |
| Promoter | GET | /api/promoter/* | Vendas e comissões promoter |
| Auth | ALL | /api/auth/* | Better Auth handler |
| Interno | POST | /internal/facial-* | Jobs galeria/retenção (API key) |

## 6. Recursos

Infra mínima: processo Node (backend), MySQL, opcional `pulse-face`, deploys SSR/static para webs, builds EAS para apps.

| Categoria | Variáveis (sem valores secretos) |
| --- | --- |
| Banco | `DATABASE_URL` / `MYSQL_*` |
| Auth | `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` |
| HTTP | `PORT`, CORS dos frontends |
| Pagamentos | `PAGARME_SECRET_KEY`, `PAYMENTS_ENABLED` |
| E-mail | `BREVO_API_KEY`, `BREVO_SENDER_*`, `PRODUCER_WEB_URL` |
| Facial | `BIOMETRIC_*`, `FACIAL_*`, `PULSE_FACE_SERVICE_*` |
| KYC/Admin | `KYC_STORAGE_PATH`, seed admin |

## 7. Referências cruzadas

- Código: `backend/src/index.ts`, controllers em `backend/src/presentation/controllers/`
- [arquitetura.md](./arquitetura.md)
- Contrato do feed B2C: [feed-descoberta-client.md](../regras-negocio/feed-descoberta-client.md)
