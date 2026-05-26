# Pulse Admin (backoffice)

> Escopo: operação interna Pulse | Público: `PULSE_ADMIN` | Plataforma: Producer Web `/admin/*` + API `/api/admin/v1` | Última revisão: 2026-05-20

## Legenda de status

| Tag | Significado |
| --- | --- |
| `[IMPLEMENTADO]` | Entregue e utilizável em produção ou demo estável |
| `[PARCIAL]` | Fluxo existe com lacunas (inclui UI «em breve») |
| `[PENDENTE]` | Não implementado ou apenas planejado |

Fonte de status: código (`app-producer`, `producer-web`, `app-client`, `client-web`, `backend`) + `docs/RBAC.md` + revisão 2026-05-19.


## 1. Visão geral

Painel interno para operadores com papel **`PULSE_ADMIN`** (Operador Pulse). UI isolada em `producer-web` sob `/admin/*` (layout e sidebar próprios). Login unificado em `/login` com ramificação por role após OTP.

**Não confundir** com o portal da produtora ([producer-web.md](./producer-web.md)).

## 2. Autenticação e acesso

### 2.1 Auth 2FA (HU01) — [IMPLEMENTADO]

| Regra | Detalhe |
| --- | --- |
| MUST | Usuário sem `PULSE_ADMIN` recebe **403** em `/admin/*` e API admin |
| Login etapa 1 | `POST /api/admin/v1/auth/login` → `requiresOtp=true` (sem token) |
| Login etapa 2 | `POST /api/admin/v1/auth/login/verify-otp` → Bearer (~7 dias) |
| Sessão | `GET /auth/me`, `POST /auth/logout` |
| Middleware | `AdminAuthMiddleware` em todas as rotas exceto login/verify-otp |

## 3. Módulos / funcionalidades

### 3.1 Autenticação e sessão (HU01) — [IMPLEMENTADO]

MUST: usuário sem role PULSE_ADMIN não acessa `/admin/*` nem API admin (403). Given credenciais válidas When POST /api/admin/v1/auth/login Then requiresOtp=true (sem token). Given OTP válido When POST /api/admin/v1/auth/login/verify-otp Then token Bearer (~7 dias) e sessão admin. Rotas: logout, GET /auth/me. Middleware AdminAuthMiddleware em todas as rotas exceto login/verify-otp.

### 3.2 Produtoras e KYC (HU02) — [IMPLEMENTADO]

Tela /admin/produtoras: listagem com GMV 30d, busca, drawer criar produtora (CNPJ, taxa pulseFeeBps), reset de senha, drawer detalhe (HU02b). API: GET/POST /producers, GET /producers/:id, POST /producers/:id/reset-password. Subfluxo KYC titular: /admin/compliance/kyc — fila, aprovar, rejeitar, download documento. API KYC: GET /kyc/queue, GET /kyc/documents/:id, approve, reject, download.

**Efeito no produtor:** aprovação KYC desbloqueia publicação de eventos (`KYC_APPROVED`). Matriz: [kyc-blocking-matrix.md](../regras-negocio/kyc-blocking-matrix.md).

### 3.3 Visão e saúde do checkout (HU03) — [IMPLEMENTADO]

Tela /admin/visao: KPIs tráfego checkout 24h, latência p95, health gateways. API: GET /api/admin/v1/metrics/health. Ring buffer em memória (MetricsStore) para janela 24h ao vivo; snapshots persistidos a cada 5 min (HU03b) via GET /api/admin/v1/metrics/history.

### 3.4 Financeiro — repasses e freeze (HU04) — [IMPLEMENTADO]

Tela /admin/financeiro: abas repasses pendentes, congelados, liberados (30d); KPIs; modais freeze/unfreeze com motivo obrigatório (mín. 10 caracteres). MUST: evento congelado bloqueia saque do produtor (mesma regra do portal produtor). API: GET /payouts, GET /payouts/stats, GET /payouts/export (CSV HU04b), POST /payouts/events/:eventId/freeze|unfreeze. KPI chargeback rate (proxy 30d) em GET /refunds/stats.

### 3.5 Central de estornos (HU05) — [IMPLEMENTADO]

Mesma tela financeiro: listagem estornos, busca pedido, validação e processamento via gateway. API: GET /refunds, GET /refunds/:id (detalhe HU05b), /refunds/stats, /refunds/producers/:id/events, /refunds/search-orders, POST /refunds/validate, POST /refunds (executar). Drawer de detalhe na UI. Antifraude mínimo: ≥3 estornos chargeback/7d no evento dispara auto-freeze de repasse.

### 3.6 Compliance e termos (HU06) — [IMPLEMENTADO]

Tela /admin/compliance: documentos versionados, publicar nova versão com forceAcceptance. API: GET /compliance, POST /compliance/documents. Produtor e cliente bloqueados por TermsComplianceMiddleware até aceitar; PULSE_ADMIN isento. Ver [CHECKOUT_COMPLIANCE.md](../CHECKOUT_COMPLIANCE.md).

### 3.7 Contratos comerciais por produtora (HU07) — [PARCIAL]

Tela /admin/compliance: seção *Contratos comerciais por produtora* (abas Vigentes / Próx. vencimento / Vencidos), tabela com vigência, taxa negociada, PDF, status operacional (termos + KYC). API: `/api/admin/v1/commercial-contracts`. Especificação: [contratos-comerciais/](./fluxos/admin/contratos-comerciais/). Mock: seção Compliance em admin-dashboard-mock.html.

### 3.8 Mapa HU × rota × status

| HU | Fluxo | Rota/UI | Status |
| --- | --- | --- | --- |
| HU01 | Auth 2FA + isolamento /admin | /admin/*, /api/admin/v1/auth/* | [IMPLEMENTADO] |
| HU02 | Produtoras + KYC titular | /admin/produtoras, /admin/compliance/kyc | [IMPLEMENTADO] |
| HU02b | Detalhe produtora / ações menu | producers-table | [IMPLEMENTADO] |
| HU03 | Visão checkout 24h | /admin/visao | [IMPLEMENTADO] |
| HU03b | Histórico métricas persistido | metrics/history | [IMPLEMENTADO] |
| HU04 | Repasses + freeze | /admin/financeiro | [IMPLEMENTADO] |
| HU04b | Export extrato admin | financeiro-view | [IMPLEMENTADO] |
| HU05 | Estornos centralizados | /admin/financeiro | [IMPLEMENTADO] |
| HU05b | Detalhe estorno linha | refunds-table | [IMPLEMENTADO] |
| HU06 | Compliance / termos | /admin/compliance | [IMPLEMENTADO] |
| HU07 | Contratos comerciais produtora | /admin/compliance (seção contratos) | [PARCIAL] |
| — | Moderação/suspender evento global | events/:id/suspend | [IMPLEMENTADO] |
| — | Antifraude/chargeback automático | auto-freeze threshold | [PARCIAL] |

## 4. Permissões (RBAC nesta plataforma)

| Papel | Acesso Pulse Admin |
| --- | --- |
| `PULSE_ADMIN` | ✅ Total |
| `PRODUCER` / `PRODUCER_MANAGER` / `STAFF` / `PROMOTER` / `CLIENT` | ❌ |

Matriz completa: [RBAC.md](../RBAC.md).

## 5. Integrações e dependências

- API admin → MySQL (produtoras, payouts, refunds, compliance, KYC)
- Brevo para OTP de login
- Pagar.me para estornos (HU05)
- Compliance: publicação de termos bloqueia produtor/cliente via `TermsComplianceMiddleware` ([CHECKOUT_COMPLIANCE.md](../CHECKOUT_COMPLIANCE.md)); admin isento

## 6. Backlog / pendências

| Item | Status |
| --- | --- |
| Histórico métricas persistido (HU03b) | [IMPLEMENTADO] |
| Detalhe produtora / menu ações (HU02b) | [IMPLEMENTADO] |
| Export extrato admin (HU04b) | [IMPLEMENTADO] |
| Detalhe linha estorno (HU05b) | [IMPLEMENTADO] |
| Moderação/suspender evento global | [IMPLEMENTADO] |
| Antifraude/chargeback automático | [PARCIAL] — auto-freeze por threshold; sem integração gateway de disputas |
| Alertas SLA latência p95 (sugestão) | [PENDENTE] |
| Audit log UI freeze/estornos (sugestão) | [PARCIAL] — AuditLogger no backend; sem tela dedicada |

## 7. Fluxos detalhados (diagramas)

Cada módulo abaixo segue o padrão **parte 1 (entrada)** · **parte 2 (validação/ações)** · **parte 3 (persistência/efeitos)**, como [criação de evento](./fluxos/criacao-de-evento/).

| Fluxo | Pasta | HU |
| --- | --- | --- |
| KYC titular | [fluxos/admin/kyc-aprovacao/](./fluxos/admin/kyc-aprovacao/) | HU02 |
| Produtoras | [fluxos/admin/produtoras/](./fluxos/admin/produtoras/) | HU02, HU02b |
| Financeiro repasse | [fluxos/admin/financeiro-repasse/](./fluxos/admin/financeiro-repasse/) | HU04, HU04b |
| Estornos | [fluxos/admin/estornos/](./fluxos/admin/estornos/) | HU05, HU05b |
| Compliance termos | [fluxos/admin/compliance-termos/](./fluxos/admin/compliance-termos/) | HU06 |
| Contratos comerciais | [fluxos/admin/contratos-comerciais/](./fluxos/admin/contratos-comerciais/) | HU07 |

Índice completo + mock: [fluxos/admin/README.md](./fluxos/admin/README.md) · [fluxos/README.md](./fluxos/README.md)

## 8. Referências cruzadas

- [api-endpoints.md](./api-endpoints.md#2-admin-apadminv1)
- [producer-web.md](./producer-web.md) — mesmo deploy, rotas distintas
- [app-produtor.md](./app-produtor.md) — KYC titular espelha fila admin
- Mock UI: [admin-dashboard-mock.html](../../../producer-web/_apenas-git/prototipos/admin/admin-dashboard-mock.html)
