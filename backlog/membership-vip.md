# Membership / VIP — [PENDENTE]

> Programa de assinatura recorrente e benefícios VIP. **Não implementado** no schema/backend; telas no App Cliente e Producer Web são mock ou stub «em breve».

**Origem:** consolidação de `_pendente-conferir/business-pre-spec-funcional/05-membership.md` (26/mar/2026).

**Última revisão:** 2026-05-20

---

## Escopo planejado

### App Cliente

- Lista de planos, benefícios, CTA «Assinar»
- **Meu VIP:** cartão black/gold (logo produtor, badge Ativo, plano, membro desde, benefícios em grid, eventos com Free Pass)

### Produtor

- Planos criados pelo produtor (mensal ou por evento)
- Benefícios configuráveis (fila prioritária, lounge, desconto em ingressos)
- Gestão de membros ativos
- Destaque VIP no check-in (gold vs cortesia vs comum)

---

## Regras de produto (rascunho)

| ID | Regra |
|----|--------|
| VIP-001 | Planos por produtor |
| VIP-002 | Venda mensal ou por evento |
| VIP-003 | Benefícios configuráveis |
| VIP-004 | Gestão de membros |
| VIP-005 | Validação visual no check-in |
| VIP-006 | Receita recorrente para produtor |
| VIP-007 | Fidelização de público |

---

## O que já existe (não confundir)

| Item | Status |
|------|--------|
| Lote VIP (`isVip` no batch) | [IMPLEMENTADO] — comercial |
| Tela `/vip` Producer Web | [PARCIAL] stub |
| App Cliente tela VIP | [PARCIAL] mock |
| Assinatura recorrente / planos no schema | [PENDENTE] |

Ver [app-client.md](../product/especificacao-funcional/app-client.md#35-vip--membership--pendente) e [producer-web.md](../product/especificacao-funcional/producer-web.md).

---

## Decisões em aberto

- Preço mínimo/máximo de plano
- Pagamento da assinatura (cartão recorrente? Pix?)
- Política de cancelamento e expiração mid-evento
- Limite de membros por plano
- Desconto automático no checkout vs manual
- Free Pass: todos os eventos do produtor ou lista selecionada

---

## Referências

- [global-business-rules.md](../product/global-business-rules.md) — fidelização no North Star
- [app-produtor.md](../product/especificacao-funcional/app-produtor.md) — destaque VIP no Access (quando membership existir)
