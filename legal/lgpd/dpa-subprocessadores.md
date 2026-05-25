# LISTA DE SUBPROCESSADORES (DPA)

**Versão:** 1.0 — DRAFT TÉCNICO (não revisado por advogado)
**Última atualização:** 2026-05-24

> ⚠️ Este documento é um **draft técnico** preparado por engenharia/produto a partir do funcionamento real da plataforma. **Deve ser revisado por advogado(a) habilitado(a) e/ou DPO antes de qualquer publicação.** Itens entre `[colchetes em maiúsculas]` precisam ser preenchidos/decididos pela empresa antes da publicação.

A presente lista cumpre o compromisso da PULSE (controladora) de informar quais **operadores e subprocessadores** atuam sobre dados pessoais tratados na Plataforma (Art. 18, VII e Art. 33 LGPD), bem como descrever o **mecanismo de transferência internacional** quando aplicável.

A lista é atualizada sempre que houver inclusão, substituição ou remoção de subprocessador, com **notificação prévia de 30 dias** aos produtores (Cl. 13 do [Contrato de Adesão](../contratos/contrato-adesao-produtor.md)).

---

## 1. PRINCÍPIOS DE TRANSFERÊNCIA INTERNACIONAL

1.1. A LGPD condiciona a transferência internacional de dados (Art. 33) a uma das hipóteses:

- **I** — países com nível adequado de proteção (lista a ser publicada pela ANPD);
- **II** — garantias específicas (cláusulas-padrão contratuais, normas corporativas globais, selos/certificações);
- **III** — cooperação jurídica internacional;
- **IV** — proteção da vida ou incolumidade física;
- **V** — autorização específica da ANPD;
- **VII** — execução de contrato com o titular;
- **VIII** — consentimento específico e destacado do titular;
- **IX** — cumprimento de obrigação legal/regulatória.

1.2. **Hoje a ANPD ainda não publicou a lista do inciso I** (consulta pública concluída em 2024). Até a publicação, a Pulse adota como mecanismo principal:

- **Cláusulas-padrão contratuais** (modelo a ser publicado pela ANPD — Resolução CD/ANPD nº 19/2024 traz minutas em consulta pública) `[VALIDAR ESTÁGIO ATUAL]`;
- **DPA (Data Processing Agreement)** de cada subprocessador, complementado pelos SCC da UE (GDPR) onde aplicável — solução híbrida usada amplamente no mercado.

1.3. Para cada subprocessador, indicamos: **finalidade**, **dados tratados**, **jurisdição**, **mecanismo de transferência** e **link público para o DPA**.

---

## 2. SUBPROCESSADORES ATUAIS

### 2.1. Pagar.me

| Item | Conteúdo |
|---|---|
| Fornecedor | Pagar.me Pagamentos S.A. (grupo Stone) |
| Papel LGPD | Operador (processamento de pagamento) / Controlador (para finalidades regulatórias próprias — antifraude, conservação fiscal) |
| Finalidade | Processar pagamento Pix e cartão (PSP default — `PAYMENT_PROVIDER=pagarme`) |
| Dados tratados | Nome, CPF, e-mail, telefone do comprador, IP, dados de cartão (tokenizados no cliente — Pulse não recebe PAN), valor, identificador da transação |
| Jurisdição | Brasil |
| Transferência internacional | Não (operação doméstica) |
| Mecanismo | DPA Pagar.me / contrato comercial |
| Link DPA | `https://pagar.me/lgpd` `[CONFIRMAR URL OFICIAL]` |

### 2.2. Stripe

| Item | Conteúdo |
|---|---|
| Fornecedor | Stripe Payments Brazil (e Stripe, Inc. — EUA) |
| Papel LGPD | Operador / Controlador autônomo para finalidades próprias |
| Finalidade | Processar pagamento Pix e cartão quando `PAYMENT_PROVIDER=stripe` (provedor alternativo / Stripe BR) |
| Dados tratados | Idem Pagar.me |
| Jurisdição | EUA (entidade global) e Brasil (Stripe BR) |
| Transferência internacional | Sim — para EUA |
| Mecanismo | Stripe DPA + Standard Contractual Clauses (UE 2021/914) + ajuste para LGPD; certificação SOC 2 e PCI-DSS Level 1 |
| Link DPA | `https://stripe.com/legal/dpa` |

### 2.3. Brevo (ex-Sendinblue)

| Item | Conteúdo |
|---|---|
| Fornecedor | Sendinblue SAS (Brevo) |
| Papel LGPD | Operador (envio de e-mails transacionais e campanhas) |
| Finalidade | Envio de OTP (Better Auth), confirmação de compra, comunicados ao produtor, campanhas de marketing |
| Dados tratados | Nome, e-mail, eventos de envio/abertura/clique, dados em conteúdo do e-mail (n.º de pedido, OTP) |
| Jurisdição | França (UE) — servidores na UE |
| Transferência internacional | Sim — para França (UE) |
| Mecanismo | DPA Brevo + GDPR (UE) + Cláusulas-padrão internacionais; adequação UE-Brasil pendente de decisão ANPD |
| Link DPA | `https://www.brevo.com/legal/termsofuse/#data-processing-agreement` |

### 2.4. Better Auth (biblioteca self-hosted)

| Item | Conteúdo |
|---|---|
| Fornecedor | Biblioteca open-source (Bun's auth) — operada **internamente** pela Pulse |
| Papel LGPD | **Não é subprocessador externo** — código executa dentro da infraestrutura Pulse (Railway). Listado aqui para transparência |
| Finalidade | Autenticação por OTP / sessões |
| Dados tratados | E-mail, token de sessão, refresh token, código OTP |
| Jurisdição | Junto com a Pulse — Railway (ver §2.6) |
| Transferência internacional | Indireta (via Railway) |
| Mecanismo | N/A (componente interno) |
| Link | `https://better-auth.com` (referência da biblioteca) |

### 2.5. Cloudflare

| Item | Conteúdo |
|---|---|
| Fornecedor | Cloudflare, Inc. |
| Papel LGPD | Operador (CDN, WAF, mitigação de bots, DNS) |
| Finalidade | Distribuição de conteúdo estático, proteção contra ataques (L4/L7), rate limiting |
| Dados tratados | IP do visitante, user agent, headers de requisição, cookies `__cf_bm`/`cf_clearance` |
| Jurisdição | EUA (rede global anycast) |
| Transferência internacional | Sim — POPs globais |
| Mecanismo | DPA Cloudflare + SCC UE + adesão a frameworks de privacidade aplicáveis |
| Link DPA | `https://www.cloudflare.com/cloudflare-customer-dpa/` |

### 2.6. Railway

| Item | Conteúdo |
|---|---|
| Fornecedor | Railway Corp. |
| Papel LGPD | Operador (hospedagem de aplicação + banco de dados gerenciado) |
| Finalidade | Hosting do backend Pulse, banco MySQL, serviço `pulse-face`, cron jobs (purge biométrico, repasse) |
| Dados tratados | **Todos** os dados tratados pela Pulse trafegam pelo Railway (com criptografia em repouso e em trânsito) |
| Jurisdição | EUA (regiões disponíveis: `us-west`, `us-east` — `[REGIÃO ESCOLHIDA EM PRODUÇÃO]`) |
| Transferência internacional | Sim — para EUA |
| Mecanismo | DPA Railway + SCC UE + adesão a frameworks aplicáveis; certificação SOC 2 |
| Link DPA | `https://railway.app/legal/dpa` `[CONFIRMAR URL]` |

### 2.7. Cloudflare R2 (Object Storage)

| Item | Conteúdo |
|---|---|
| Fornecedor | Cloudflare, Inc. (mesmo do §2.5) |
| Papel LGPD | Operador (armazenamento de arquivos) |
| Finalidade | Armazenar documentos KYC, imagens de banner do evento, comprovantes |
| Dados tratados | Arquivos enviados pelo produtor (RG/CNH, contrato social, comprovante de endereço, selfie KYC), arquivos do evento |
| Jurisdição | EUA / multi-região |
| Transferência internacional | Sim |
| Mecanismo | DPA Cloudflare + criptografia em repouso (server-side) + URLs assinadas com expiração curta |
| Link DPA | Idem §2.5 |

### 2.8. Upstash

| Item | Conteúdo |
|---|---|
| Fornecedor | Upstash, Inc. |
| Papel LGPD | Operador (cache / Redis gerenciado) |
| Finalidade | Cache de sessões, rate limiting, filas (caso utilizadas) |
| Dados tratados | Identificadores de sessão, contadores de rate limit, payloads de filas (efêmeros) |
| Jurisdição | EUA (regiões disponíveis globais) |
| Transferência internacional | Sim |
| Mecanismo | DPA Upstash + SCC UE |
| Link DPA | `https://upstash.com/dpa` `[CONFIRMAR URL]` |

### 2.9. Sentry

| Item | Conteúdo |
|---|---|
| Fornecedor | Functional Software, Inc. (Sentry) |
| Papel LGPD | Operador (telemetria de erros) |
| Finalidade | Captura e diagnóstico de erros do backend e dos apps |
| Dados tratados | Stack traces, breadcrumbs, `userId` (quando logado), IP **truncado**, user agent. PII redatada por filtros (`beforeSend`) |
| Jurisdição | EUA |
| Transferência internacional | Sim |
| Mecanismo | DPA Sentry + SCC UE |
| Link DPA | `https://sentry.io/legal/dpa/` |

### 2.10. pulse-face (serviço facial self-hosted)

| Item | Conteúdo |
|---|---|
| Fornecedor | **Self-hosted** — código operado pela Pulse no Railway |
| Papel LGPD | **Não é subprocessador externo** — listado para transparência (não há provider de visão computacional cloud, ex.: AWS Rekognition, Azure Face API) |
| Finalidade | Indexação e *matching* de vetores faciais 1:N e 1:1 |
| Dados tratados | Vetores 512-d (criptografados em trânsito), índice em memória/Redis Upstash |
| Jurisdição | Idêntica à Railway / Upstash |
| Transferência internacional | Idem |
| Mecanismo | API key + `x-pulse-internal-key` + TLS (ver [`product/facial/lgpd-security.md`](../../product/facial/lgpd-security.md)) |

### 2.11. Outros eventuais subprocessadores

Os fornecedores abaixo **podem** ser adicionados conforme a Pulse evoluir. **Hoje não estão ativos**:

| Fornecedor | Finalidade prevista | Status |
|---|---|---|
| Google Analytics 4 | Estatísticas web | `[NÃO ATIVO]` |
| Google Tag Manager | Orquestração de tags | `[NÃO ATIVO]` |
| Provider de NF-e/NFS-e | Emissão fiscal — ver [`fiscal/plano-NFSe.md`](../fiscal/plano-NFSe.md) | `[A CONTRATAR]` |
| Helpdesk (Zendesk / Intercom / Crisp) | Suporte ao usuário | `[A DEFINIR]` |
| BACEN — DICT (PIX) | Validação de chave PIX no repasse | `[A INTEGRAR]` |

---

## 3. AVALIAÇÃO DOS SUBPROCESSADORES

3.1. Antes da contratação, a Pulse exige:

- (a) DPA assinado (próprio ou aderido);
- (b) certificações relevantes (SOC 2, ISO 27001, PCI-DSS quando aplicável);
- (c) evidência de medidas de segurança (criptografia, controle de acesso, logs);
- (d) mecanismo claro de transferência internacional;
- (e) compromisso de notificar incidentes em prazo razoável.

3.2. Revisão de fornecedores: **anual** ou após incidente.

---

## 4. PRODUTOR COMO CONTROLADOR AUTÔNOMO

4.1. Quando o produtor **exporta dados** da Plataforma (lista de presença, lista de compradores) para uso fora da Pulse, ele passa a atuar como **controlador autônomo** (Cl. 8.2 do [Contrato de Adesão](../contratos/contrato-adesao-produtor.md)).

4.2. Subprocessadores escolhidos **pelo produtor** (e.g., CRM próprio, ferramenta de e-mail marketing dele) **não fazem parte desta lista** — são responsabilidade dele perante seus titulares.

---

## 5. COMUNICAÇÃO DE MUDANÇAS

5.1. Inclusão/substituição/remoção de subprocessador será comunicada por:

- (a) atualização desta página, com nova versão e changelog abaixo;
- (b) e-mail aos produtores **30 dias** antes da efetivação (Cl. 13 do Contrato de Adesão);
- (c) banner informativo no portal Pulse Pro.

5.2. O produtor pode **objetar** justificadamente; persistindo divergência, pode rescindir o Contrato sem ônus.

---

## 6. CHANGELOG

| Versão | Data       | Mudança principal                                |
|--------|------------|--------------------------------------------------|
| 1.0    | 2026-05-24 | Draft inicial — 10 subprocessadores mapeados     |
