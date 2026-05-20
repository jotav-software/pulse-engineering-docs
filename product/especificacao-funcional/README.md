# Especificação funcional — Ecossistema Pulse

> **Fonte de verdade** para regras de negócio, fluxos, permissões e backlog por plataforma.  
> Migrado de `docs/especificacao_funcional.docx` (conteúdo riscado ignorado). Arquivos `.docx` permanecem como arquivo histórico.

**Última revisão:** 2026-05-20

---

## Documentos por sistema

| Arquivo | Sistema | Público |
| --- | --- | --- |
| [pulse-admin.md](./pulse-admin.md) | Pulse Admin (backoffice) | Operadores `PULSE_ADMIN` |
| [app-produtor.md](./app-produtor.md) | App Produtor (mobile) | Dono, Gestor, Staff |
| [producer-web.md](./producer-web.md) | Producer Web (portal produtora) | Dono, Gestor, Staff |
| [app-client.md](./app-client.md) | App Cliente (mobile B2C) | Comprador, Promoter |
| [client-web.md](./client-web.md) | Client Web (site comprador) | Visitante / comprador |

**Transversal:** [arquitetura.md](./arquitetura.md) · [api-endpoints.md](./api-endpoints.md)

---

## Legenda de status

| Tag | Significado |
| --- | --- |
| `[IMPLEMENTADO]` | Entregue e utilizável em produção ou demo estável |
| `[PARCIAL]` | Fluxo existe com lacunas (inclui UI «em breve») |
| `[PENDENTE]` | Não implementado ou apenas planejado |

Fonte de status: código (`app-producer`, `producer-web`, `app-client`, `client-web`, `backend`) + `docs/RBAC.md` + revisão 2026-05-19.


---

## Glossário de plataformas

| Nome | Repo / rota | Observação |
| --- | --- | --- |
| **App Produtor** | `app-producer/` | Operação mobile (Access, financeiro completo) |
| **Producer Web** | `producer-web/` — `/dashboard`, `/events`, … | Portal web da produtora (sem `/admin`) |
| **Pulse Admin** | `producer-web/` — `/admin/*` | Backoffice interno; API `/api/admin/v1` |
| **App Cliente** | `app-client/` | Compra, carteira, facial, promoter |
| **Client Web** | `client-web/` | Vitrine pública; checkout [PENDENTE] |

---

## Regras transversais (todas as plataformas)

Consulte [global-business-rules.md](../policies/global-business-rules.md) e [payout-policies.md](../policies/payout-policies.md).

| Regra | Detalhe |
| --- | --- |
| Taxa Pulse | Repassada ao **comprador** (hoje **10%** do preço do lote por ingresso no código) |
| Pix | 5% de desconto sobre a taxa de conveniência |
| Cartão | Até **4x**; PSP `pagarme` ou `stripe` (`PAYMENT_PROVIDER`) |
| Limite compra | Máx. **4 ingressos por evento** por CPF/conta |
| Checkout | Reserva **10 min**; máx. **3 tentativas** de pagamento por pedido |
| Cancelamento comprador | Até **24h antes** do início; ingresso **USED** não reembolsa |
| Repasse produtor | `RETAINED` → job D+1 após término → `AVAILABLE` ([payout-policies.md](../policies/payout-policies.md)) |
| KYC titular | Publicar evento bloqueado até `KYC_APPROVED` ([kyc-blocking-matrix.md](../policies/kyc-blocking-matrix.md)) |
| QR check-in | Payload = `qrCodeHash` (UUID), não número TKT |
| Facial vs QR | Facial principal; QR e manual (`cpfLast3`) como fallback |
| Promoter | Experiência principal no **App Cliente** (`/promoter`) |

**Princípios invioláveis:** ingresso de venda só após `PAID`; emissão manual auditável; pedido expirado devolve estoque; `USED` não reverte; RBAC validado no backend.

---

## Mapa rápido de épicos (produtor)

| # | Épico | App Produtor | Producer Web |
| --- | --- | --- | --- |
| 1 | Acesso & Onboarding | [IMPLEMENTADO] | [IMPLEMENTADO] |
| 2 | Perfil & Configurações | [PARCIAL] | [PARCIAL] |
| 3 | Gestão de Eventos | [IMPLEMENTADO] | [IMPLEMENTADO] |
| 4 | Oferta Comercial | [IMPLEMENTADO] | [IMPLEMENTADO] |
| 5 | Lotes avançados | [IMPLEMENTADO] | [PARCIAL] |
| 6 | Dashboard | [IMPLEMENTADO] | [IMPLEMENTADO] |
| 7 | Pedidos & Participantes | [IMPLEMENTADO] | [IMPLEMENTADO] |
| 8 | Access / Check-in | [IMPLEMENTADO] | [PENDENTE] |
| 9 | Financeiro & Repasses | [IMPLEMENTADO] | [PARCIAL] |
| 10 | Equipe & RBAC | [PARCIAL] | [PARCIAL] |

Detalhes por sistema nos arquivos linkados acima.

**Fluxos em diagrama:** [fluxos/README.md](./fluxos/README.md) (App Produtor + [Pulse Admin](./fluxos/admin/README.md)).

---

## Referências canônicas

- [RBAC.md](../access/rbac.md) — papéis e matriz por app
- [CHECKOUT_COMPLIANCE.md](../policies/checkout-compliance.md) — gate de termos B2C/produtor
- [global-business-rules.md](../policies/global-business-rules.md) · [payout-policies.md](../policies/payout-policies.md)
- [architecture/payments/especificacao.md](../../architecture/payments/especificacao.md) — checkout e gateways
- OpenAPI: `GET /swagger` no backend
