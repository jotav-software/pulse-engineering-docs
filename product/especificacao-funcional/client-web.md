# Client Web (site comprador)

> Escopo: vitrine pública e descoberta | Público: visitante / comprador | Plataforma: Next.js `client-web/` | Última revisão: 2026-05-20

## Legenda de status

| Tag | Significado |
| --- | --- |
| `[IMPLEMENTADO]` | Entregue e utilizável em produção ou demo estável |
| `[PARCIAL]` | Fluxo existe com lacunas (inclui UI «em breve») |
| `[PENDENTE]` | Não implementado ou apenas planejado |

Fonte de status: código (`app-producer`, `producer-web`, `app-client`, `client-web`, `backend`) + `docs/RBAC.md` + revisão 2026-05-19.


## 1. Visão geral

Site público de eventos: home, feed e detalhe. Seleção de lotes na web. **Checkout integrado na web:** [PENDENTE] — CTA direciona para App Cliente («Vendas em breve» quando pagamentos desabilitados).

## 2. Autenticação e acesso

| Fluxo | Status |
| --- | --- |
| Navegação anônima (vitrine) | [IMPLEMENTADO] |
| Login comprador | [PENDENTE] / via app |
| Carteira web | [PENDENTE] |

## 3. Módulos / funcionalidades

### 3.1 Vitrine e detalhe — [IMPLEMENTADO]

- Listagem/feed de eventos publicados
- Detalhe público com painel de lotes ([client-web/src/components/events/event-ticket-panel.tsx](../../client-web/src/components/events/event-ticket-panel.tsx))
- Exibe lotes à venda, esgotados e «em breve» conforme janela

### 3.2 Seleção de ingressos — [IMPLEMENTADO]

- Escolha de lotes e quantidades (respeita limite **4/evento/CPF** no backend no checkout)
- Sem finalização de pagamento na web

### 3.3 Checkout — [PENDENTE]

- Integração com `/api/client/v1/checkout` e pagamentos (mesmas regras do App Cliente: 10 min, 3 tentativas, taxa 10%, Pix −5% taxa, 4x, multi-PSP)
- Compliance gate HU06 quando autenticado

### 3.4 Carteira e pós-compra — [PENDENTE]

- Meus ingressos, facial e cancelamento permanecem no App Cliente por enquanto

## 4. Permissões (RBAC nesta plataforma)

Apenas experiência **CLIENT** anônima ou futura autenticada. Papéis de produtora não aplicam.

## 5. Integrações e dependências

- API pública de eventos (`/api/client/v1/events` ou rotas públicas equivalentes)
- Mesmas regras de negócio de preço/lote que App Cliente

## 6. Backlog / pendências

| Item | Status |
| --- | --- |
| Checkout web completo | [PENDENTE] |
| Login + carteira web | [PENDENTE] |
| SSO / deep link para app | [PENDENTE] |

## 7. Referências cruzadas

- [app-client.md](./app-client.md)
- [README.md](./README.md#regras-transversais-todas-as-plataformas)
