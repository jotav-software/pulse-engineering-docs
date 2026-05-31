# Trilha C — Go-to-Market & Marketing

> Documentação estratégica e operacional para o lançamento comercial da Pulse no mercado brasileiro de ticketing.

## Estrutura

```
comercial/lancamento/
├── README.md                     este arquivo
├── go-to-market-plan.md          fases de rollout, ICP, posicionamento, metas
├── pricing-publico.md            tabela publicável da taxa Pulse (10% comprador)
├── piloto-produtoras.md          critérios e shortlist do beta fechado
├── plano-google-ads.md           campanhas search + PMax, palavras-chave, budget
├── plano-meta-ads.md             Facebook/Instagram, públicos, criativos
├── tracking-plan.md              eventos GA4/Meta/TikTok, dataLayer, instalação técnica
├── playbook-promoters.md         programa de comissionamento (papel existe no produto)
└── programa-indicacao.md         referral B2B (produtor indica produtor)
```

## Status (2026-05-25)

| Documento | Status |
|---|---|
| `go-to-market-plan.md` | 🟢 Draft denso |
| `pricing-publico.md` | 🟢 Pronto (taxa 10% fechada) |
| `piloto-produtoras.md` | 🟢 Critérios + template de outbound |
| `plano-google-ads.md` | 🟢 Plano completo com budgets |
| `plano-meta-ads.md` | 🟢 Plano completo com públicos/criativos |
| `tracking-plan.md` | 🟢 38 eventos mapeados + código pronto |
| `playbook-promoters.md` | 🟢 Fluxo + tabela de comissões |
| `programa-indicacao.md` | 🟨 Outline (precisa de decisão de % de bônus) |

## Instalação técnica

A parte técnica (GTM container, GA4, Meta Pixel) está implementada nos frontends e documentada em [`tracking-plan.md`](tracking-plan.md). IDs de containers e contas a serem criadas estão listados em [`tracking-plan.md#contas-a-criar`](tracking-plan.md#contas-a-criar).

## Cross-references

- Pricing aplicado nos docs jurídicos: [`../../juridico/contratos/contrato-adesao-produtor.md`](../../juridico/contratos/contrato-adesao-produtor.md) Cl. 3
- Plano técnico de lançamento (engenharia): [`../../operacoes/plano-lancamento-tecnico.md`](../../operacoes/plano-lancamento-tecnico.md)
- ICP de produtoras-piloto referencia [`../../produto/regras-negocio/global-business-rules.md`](../../produto/regras-negocio/global-business-rules.md)
