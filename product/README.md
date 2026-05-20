# Produto — Documentação Pulse

Índice da documentação de **regras de negócio, especificação funcional, acesso e operação** do ecossistema Pulse.

**Última revisão:** 2026-05-20

---

## Especificação funcional

Documentação por plataforma, fluxos e visão transversal do produto.

→ **[especificacao-funcional/](./especificacao-funcional/README.md)** *(alias em português; pasta canônica)*

| Seção | Conteúdo |
| --- | --- |
| [Por sistema](./especificacao-funcional/README.md#documentos-por-sistema) | Pulse Admin, App Produtor, Producer Web, App Cliente, Client Web |
| [Transversal](./especificacao-funcional/arquitetura.md) | [Arquitetura funcional](./especificacao-funcional/arquitetura.md) · [API endpoints](./especificacao-funcional/api-endpoints.md) |
| [Fluxos](./especificacao-funcional/fluxos/README.md) | Fluxos detalhados (ex.: criação de evento) |

---

## Políticas e regras de negócio

Regras transversais que valem em todas as plataformas.

| Documento | Descrição |
| --- | --- |
| [global-business-rules.md](./policies/global-business-rules.md) | Regras invioláveis de negócio |
| [payout-policies.md](./policies/payout-policies.md) | Repasse, cancelamento e elegibilidade |
| [checkout-compliance.md](./policies/checkout-compliance.md) | Gate HU06 — termos B2C/produtor |
| [kyc-blocking-matrix.md](./policies/kyc-blocking-matrix.md) | Bloqueios por status KYC |

---

## Acesso e papéis

RBAC e matriz de permissões por app.

| Documento | Descrição |
| --- | --- |
| [rbac.md](./access/rbac.md) | Papéis, convites e escopo por plataforma |
| [role-matrix.md](./access/role-matrix.md) | Matriz HU3 — fronteiras e hierarquia |

---

## Biometria facial

Domínio facial (enrollment, LGPD, infra, épico self-hosted).

| Documento | Descrição |
| --- | --- |
| [como-funciona-biometria-facial.md](./facial/como-funciona-biometria-facial.md) | Visão geral do fluxo |
| [lgpd-security.md](./facial/lgpd-security.md) | LGPD e segurança |
| [enrollment-mvp.md](./facial/enrollment-mvp.md) | Enrollment MVP |
| [infra-deploy-checklist.md](./facial/infra-deploy-checklist.md) | Checklist de deploy |
| [epic-self-hosted.md](./facial/epic-self-hosted.md) | Épico self-hosted |

---

## Desenvolvimento e QA

| Documento | Descrição |
| --- | --- |
| [test-users.md](./dev/test-users.md) | Contas de teste e credenciais padrão |

---

## Referências externas

- Pagamentos (técnico): [architecture/payments/](../architecture/payments/README.md)
- Padrões de engenharia: [standards/](../standards/technical-rules.md)
- Índice geral do repositório: [README.md](../README.md)
