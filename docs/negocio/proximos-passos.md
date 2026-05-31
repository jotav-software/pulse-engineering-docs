# Próximos Passos — Trilha B (Jurídico / Fiscal)

> Documento de tracking dos itens que **ainda precisam de input externo** após a passada de engenharia. Cross-reference deste arquivo com [`../operacoes/plano-lancamento-tecnico.md`](../operacoes/plano-lancamento-tecnico.md).

**Status atual**: drafts publicáveis em PT-BR jurídico, com dados da empresa (Jhonatan Vitor Lopes Camargo Consultoria em Tecnologia da Informação LTDA, CNPJ 55.346.033/0001-80, sede Av. Paulista 1106 SP) preenchidos. Erros factuais identificados pela auditoria foram corrigidos. Inconsistências transversais (taxa Pulse 10%, biometria 30d, idade 18+, prazo ANPD 3 dias úteis) padronizadas.

---

## 🔴 BLOQUEANTES — não publicar antes de resolver

### 1. Revisão por advogado(a) — Direito Digital + LGPD + CDC

Levar **todos os 13 documentos da pasta `juridico/`** para revisão. Pontos críticos para alertar:

| Doc | Ponto sensível para advogado revisar |
|---|---|
| `contratos/contrato-adesao-produtor.md` | Cl. 12 (limitação de responsabilidade R$ 5k/12m taxas); Cl. 3 (modelo de custódia centralizada vs split — risco regulatório BCB); Cl. 14 (rescisão e direito de informação) |
| `contratos/termos-de-uso-cliente.md` | Teto de responsabilidade 2× valor do ingresso vs vedação CDC; idade mínima 18+ (estrita); cláusula de foro |
| `politicas-publicas/politica-reembolso.md` | Aplicação concreta CDC art. 49 (7 dias) + Lei 14.046 como **piso voluntário** (não obrigação direta hoje); fluxo refund x estorno cartão (2 ciclos); validar copy exibida no aceite por sessão |
| `politicas-publicas/politica-anti-cambismo.md` | Limite de 6 ingressos/CPF + redação compatível com Lei 14.597/2023 (Lei Geral do Esporte, art. 173); proporção da pena de bloqueio |
| `conformidade/lei-do-ingresso.md` | Manter como piso voluntário, não obrigação direta — alinhar redação |
| `lgpd/base-legal-por-tratamento.md` | Cada base do Art. 7º/Art. 11 mapeada corretamente |
| `lgpd/procedimento-titular.md` | Prazos (15 dias resposta), modelo dos formulários, log de exercício de direitos |

### 2. Validação pelo contador

| Doc | Item |
|---|---|
| `fiscal/regime-tributario-recomendado.md` | Confirmar **Simples Nacional Anexo III/V** vs **Lucro Presumido** com base na projeção 12 meses |
| `fiscal/plano-NFSe.md` | **Item LC 116/2003** efetivo (recomendamos `1.05` SaaS + `10.05` ou `17.12` intermediação) + alíquota ISS São Paulo (Lei Municipal 13.701/2003) |
| `fiscal/plano-NFSe.md` | Escolha do provedor NFS-e (Focus NFe, Nuvem Fiscal, eNotas) — pegar 2 propostas comerciais com volume estimado |
| `fiscal/retencoes-no-repasse.md` | Confirmar se a Pulse é fonte pagadora retentora ou se cada produtor cuida da própria retenção |
| `conformidade/pci-dss-scoping.md` | Validar SAQ-A (escopo mínimo com tokenização Stripe.js + Pagar.me hosted) |
| Geral | Definir se receita Pulse é "valor recebido em custódia" (passa pela conta mas não é receita) ou "fee de intermediação" para fins de cálculo de tributos |

### 3. Designação formal do DPO

Você já se nomeou. Falta:
- [ ] E-mail dedicado: criar `privacidade@pulse.com.br` (ou similar) com forward para sua caixa pessoal
- [ ] Telefone de contato publicado
- [ ] Comunicar nomeação à ANPD (não há registro obrigatório atualmente, mas é boa prática manter ata de nomeação interna)
- [ ] Substituir `[DPO_EMAIL_TBD]` e `[DPO_PHONE_TBD]` nos docs (busca: `rg "DPO_(EMAIL|PHONE)_TBD" juridico/`)

### 4. Criar e-mails institucionais

| E-mail | Destino | Aparece em |
|---|---|---|
| `privacidade@pulse.com.br` | DPO | Política de Privacidade, ROPA, procedimento titular |
| `juridico@pulse.com.br` | Você | Contrato Adesão, ToS |
| `suporte@pulse.com.br` | Suporte | ToS, app stores |
| `contato@pulse.com.br` | Geral | Rodapé landing-page |

---

## 🟨 PENDÊNCIAS NÃO BLOQUEANTES

### URLs de DPA dos subprocessadores
Confirmar URLs em [`lgpd/dpa-subprocessadores.md`](lgpd/dpa-subprocessadores.md):
- [ ] Pagar.me — `https://pagar.me/lgpd` ou DPA específico (pedir comercial)
- [ ] Stripe — `https://stripe.com/juridico/dpa` ✅ pública
- [ ] Railway — verificar se tem DPA público (Railway é menor, pode não ter)
- [ ] Cloudflare R2 — `https://www.cloudflare.com/cloudflare-customer-dpa/` ✅
- [ ] Upstash — `https://upstash.com/trust/dpa`
- [ ] Brevo — `https://www.brevo.com/juridico/termsofuse/dpa/` ✅
- [ ] Sentry — `https://sentry.io/juridico/dpa/` ✅
- [ ] Better Auth — projeto open-source, sem DPA formal (registrar como "operador local")

### Antecipação de recebíveis
- [ ] Decisão estratégica: oferecer ou remover do brand-kit/marketing
- [ ] Se sim: estruturar legalmente (parceria com FIDC ou banco) e atualizar `contrato-adesao-produtor.md` Cl. 3.4

### Programa LGPD operacional
- [ ] Implementar mecanismo de **exportação de dados** do titular (endpoint `/api/client/v1/me/export` — backlog técnico)
- [ ] Implementar **exclusão real** (não só soft-delete) com confirmação
- [ ] Definir matriz de retenção por categoria (já está em ROPA, executar)

### EULA mobile
- [ ] Confirmar que bundle IDs em `contratos/eula-mobile.md` batem com `app.json` real:
  - `app-client/app.json`: `com.pulse.fan` → ✅
  - `app-producer/app.json`: **`com.jotav.pulse.producer`** (não `com.pulse.producer` como o EULA pode estar listando) — alinhar ou trocar bundle.

---

## Versionamento e publicação

Quando cada documento for revisado e aprovado:
1. Mudar header de `**Versão:** 1.0 — DRAFT TÉCNICO` para `**Versão:** 1.0 — VIGENTE`
2. Atualizar `effectiveDate`
3. Commit em branch separada com label `juridico/v1.0-published`
4. Backend: incrementar `TERMS_OF_USE_VERSION` (gate HU06) → força re-aceite dos produtores
5. Publicar HTML em `landing-page/` (`pulse.com.br/termos`, `/privacidade`, etc.)
6. Footer dos apps: link para versão vigente

---

**Última revisão**: 2026-05-25
