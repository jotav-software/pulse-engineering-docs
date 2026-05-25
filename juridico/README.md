# Pulse — Documentação Jurídica e Fiscal

Pasta dedicada a **contratos, políticas e estrutura LGPD/fiscal** da plataforma Pulse.

## ⚠️ Disclaimer obrigatório

Os arquivos aqui são **drafts técnicos** preparados por engenharia/produto a partir do funcionamento real da plataforma. **NÃO substituem revisão por advogado(a) habilitado(a) e/ou contador(a)**. Antes de publicar qualquer documento para clientes/produtoras:

1. Enviar para advogado(a) com prática em **CDC, LGPD, e regulação de meios de pagamento BR**.
2. Validar regime tributário com contador(a).
3. Confirmar com DPO designado (ou serviço terceirizado) o procedimento LGPD.

Itens marcados com **🔴 BLOQUEANTE** precisam estar **revisados e publicados** antes do go-live comercial.

## Estrutura

```
juridico/
├── README.md                               ← este arquivo
├── contratos/
│   ├── contrato-adesao-produtor.md         🔴 B2B — produtor assina para usar
│   ├── termos-de-uso-cliente.md            🔴 B2C — cliente aceita na conta/checkout
│   └── eula-mobile.md                      app store / play store
├── politicas/
│   ├── politica-privacidade.md             🔴 LGPD geral (não só biometria)
│   ├── politica-cookies.md                 🔴 obrigatória para web
│   ├── politica-reembolso.md               🔴 CDC art. 49 + Lei 14.046/2020
│   ├── politica-anti-cambismo.md           transferência de ingresso
│   └── politica-meia-entrada.md            Lei 12.933/2013
├── lgpd/
│   ├── ROPA.md                             🔴 Registro de Operações de Tratamento
│   ├── RIPD-geral.md                       🔴 Avaliação de Impacto (não só biométrica)
│   ├── base-legal-por-tratamento.md        🔴 mapa: tratamento × Art.7 ou Art.11
│   ├── procedimento-titular.md             🔴 atendimento Art.18 (acesso/exclusão/etc.)
│   ├── dpo.md                              encarregado: papel, contato, escalation
│   └── dpa-subprocessadores.md             Pagar.me, Stripe, Brevo, Better-Auth, Railway, R2
├── fiscal/
│   ├── regime-tributario-recomendado.md    Simples/Lucro Presumido + análise
│   ├── plano-NFSe.md                       🔴 emissão (Focus NFe / Nuvem Fiscal / eNotas)
│   └── retencoes-no-repasse.md             ISS/IRRF/PIS/COFINS sobre fee de produtor
└── compliance/
    ├── pci-dss-scoping.md                  PCI escopo (SAQ-A com tokenização)
    └── lei-do-ingresso.md                  Lei 14.046/2020 (reembolso de eventos cancelados)
```

## Status por documento (todos os principais entregues)

**Contratos**
| Doc | Status |
|---|---|
| [Contrato Adesão Produtor](contratos/contrato-adesao-produtor.md) | 🟨 Draft |
| [Termos de Uso B2C](contratos/termos-de-uso-cliente.md) | 🟨 Draft |
| [EULA Mobile](contratos/eula-mobile.md) | 🟨 Draft |

**Políticas**
| Doc | Status |
|---|---|
| [Privacidade](politicas/politica-privacidade.md) | 🟨 Draft |
| [Cookies](politicas/politica-cookies.md) | 🟨 Draft |
| [Reembolso](politicas/politica-reembolso.md) | 🟨 Draft |
| [Anti-Cambismo](politicas/politica-anti-cambismo.md) | 🟨 Draft |
| [Meia-Entrada](politicas/politica-meia-entrada.md) | 🟨 Draft |

**LGPD**
| Doc | Status |
|---|---|
| [ROPA](lgpd/ROPA.md) (16 tratamentos) | 🟨 Draft |
| [Base Legal por Tratamento](lgpd/base-legal-por-tratamento.md) | 🟨 Draft |
| [Procedimento do Titular](lgpd/procedimento-titular.md) | 🟨 Draft |
| [DPA Subprocessadores](lgpd/dpa-subprocessadores.md) | 🟨 Draft |
| [DPO](lgpd/dpo.md) | 🟨 Draft |
| [RIPD Geral](lgpd/RIPD-geral.md) | 🟨 Draft |
| [LGPD Biometria](../produto/biometria/lgpd-security.md) (já existente) | 🟢 Estado avançado |

**Fiscal**
| Doc | Status |
|---|---|
| [Regime Tributário Recomendado](fiscal/regime-tributario-recomendado.md) | 🟨 Análise técnica |
| [Plano NFS-e](fiscal/plano-NFSe.md) | 🟨 Análise técnica |
| [Retenções no Repasse](fiscal/retencoes-no-repasse.md) | 🟨 Análise técnica |

**Compliance**
| Doc | Status |
|---|---|
| [PCI-DSS Scoping](compliance/pci-dss-scoping.md) | 🟨 Análise técnica |
| [Lei do Ingresso 14.046/2020](compliance/lei-do-ingresso.md) | 🟨 Draft |

🟨 = draft técnico • 🟢 = revisado por advogado/contador • 🔴 = publicado em produção

## Versionamento

Documentos publicados (no site / no produto via HU06 — gate de termos) devem ser **versionados** com data e hash:
- Backend já modela `policy_versions` (ver `produto/regras-negocio/checkout-compliance.md`).
- Para cada atualização que altere obrigações materiais, exigir **novo aceite** dos usuários.

## Próximos passos

1. **Encontrar advogado(a)** — sugiro firma com experiência em ticketing/eventos no Brasil (Sabba, BBL, ou similar).
2. **Encontrar contador(a)** com foco em SaaS/marketplace para validar regime tributário e plano fiscal.
3. **Designar DPO** — pode ser interno ou terceirizado (várias firmas oferecem DPO-as-a-Service).
4. Submeter cada doc deste repositório para revisão; consolidar versão final em `juridico/published/`.
