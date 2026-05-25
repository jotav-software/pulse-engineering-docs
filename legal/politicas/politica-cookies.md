# POLÍTICA DE COOKIES — PLATAFORMA PULSE

**Versão:** 1.0 — DRAFT TÉCNICO (não revisado por advogado)
**Última atualização:** 2026-05-24

> ⚠️ Este documento é um **draft técnico** preparado por engenharia/produto a partir do funcionamento real da plataforma. **Deve ser revisado por advogado(a) habilitado(a) antes de qualquer publicação.** Itens entre `[colchetes em maiúsculas]` precisam ser preenchidos/decididos pela empresa antes da publicação.

---

## 1. O QUE SÃO COOKIES

1.1. **Cookies** são pequenos arquivos de texto armazenados pelo seu navegador (ou tecnologias equivalentes — `localStorage`, `sessionStorage`, `IndexedDB`, pixels de rastreamento e SDKs em aplicativos móveis) quando você acessa a Plataforma Pulse (sites `pulse.com.br`, `pulse.app`, painéis administrativos e apps móveis Pulse Cliente e Pulse Produtor).

1.2. Esta Política descreve **quais tecnologias usamos**, **para que finalidade**, **qual a base legal** sob a Lei 13.709/2018 (LGPD) e **como você pode controlar** essas tecnologias.

1.3. Esta Política integra a [Política de Privacidade](./politica-privacidade.md) e os [Termos de Uso](../contratos/termos-de-uso-cliente.md). Em caso de conflito, prevalece a redação mais protetiva ao titular.

---

## 2. CATEGORIZAÇÃO

A PULSE classifica seus cookies em **4 (quatro) categorias**, conforme orientação do Guia de Cookies da ANPD (Autoridade Nacional de Proteção de Dados — Guia Orientativo "Cookies e Proteção de Dados Pessoais", outubro/2023):

### 2.1. Cookies **estritamente necessários** (essenciais)

São indispensáveis ao funcionamento da Plataforma. **Não exigem consentimento prévio** (base legal: **legítimo interesse** — Art. 7º, IX LGPD — e/ou **execução de contrato** — Art. 7º, V LGPD).

### 2.2. Cookies **funcionais** (preferências)

Memorizam escolhas do usuário (idioma, layout, preferências de checkout, "lembrar dispositivo"). Operam mediante **consentimento** (Art. 7º, I LGPD), com exceção quando essenciais à entrega do serviço solicitado.

### 2.3. Cookies **analíticos** (estatísticos / desempenho)

Mensuram uso agregado da Plataforma. Exigem **consentimento prévio e granular** do titular. Hoje a Pulse opera **sem ferramentas analíticas externas em produção**; quando GA4 / GTM forem ativados, este documento será atualizado e novo consentimento será coletado.

### 2.4. Cookies **de marketing / publicidade**

Personalização de comunicações e remarketing. **Atualmente não utilizados pela Pulse.** Quando ativados, dependerão de consentimento expresso, opt-in, com possibilidade de revogação a qualquer momento.

---

## 3. INVENTÁRIO DE COOKIES E TECNOLOGIAS ATUAIS

### 3.1. Cookies estritamente necessários

| Nome / Chave | Origem | Categoria técnica | Finalidade | Retenção |
|---|---|---|---|---|
| `better-auth.session_token` | Pulse (primário) | Cookie HTTP-only, Secure, SameSite=Lax | Sessão autenticada via Better Auth | Até logout ou expiração (`[DEFINIR — 7 DIAS PADRÃO BETTER AUTH]`) |
| `better-auth.session_data` | Pulse (primário) | Cookie HTTP-only | Cache de dados da sessão | Vinculado ao token |
| `better-auth.csrf_token` | Pulse (primário) | Cookie HTTP-only, Secure | Proteção CSRF em fluxos sensíveis | Sessão |
| `pulse.checkout.session` | Pulse (primário) | Cookie ou `sessionStorage` | Manter `CheckoutSession.id` durante reserva de 10 min | 10 minutos (alinhado a `expiresAt`) |
| `pulse.idempotency.<rota>` | Pulse (primário) | `localStorage` | Header `Idempotency-Key` em retries de pagamento (`IdempotencyKey` no backend) | 24 horas |
| `pulse.compliance.lastChecked` | Pulse (primário) | `localStorage` | Cache de `GET /compliance/pending` (HU06) para evitar round-trips | Sessão |
| `pulse.locale` | Pulse (primário) | Cookie | Idioma da interface (pt-BR default) | 365 dias |
| `__cf_bm` / `cf_clearance` | Cloudflare | Cookie de terceiro (essencial) | Mitigação de bots / WAF na CDN | Sessão a 30 minutos |

### 3.2. Cookies funcionais

| Nome / Chave | Finalidade | Retenção |
|---|---|---|
| `pulse.consent.choices` | Armazena as opções do usuário no banner de cookies (categorias aceitas/recusadas + timestamp + versão) | 12 meses |
| `pulse.ui.theme` | Tema claro/escuro | 365 dias |
| `pulse.recent.events` | Últimos eventos vistos para "Continuar onde parou" | 30 dias |

### 3.3. Cookies analíticos

| Nome | Status | Observação |
|---|---|---|
| `_ga`, `_ga_<ID>` (Google Analytics 4) | `[NÃO ATIVO — ATIVAR POR FEATURE FLAG ANALYTICS_ENABLED]` | Quando ativo: anonimização de IP, `ad_storage=denied` por padrão até consentimento |
| `_gid`, `_gat` | `[NÃO ATIVO]` | — |
| Google Tag Manager (`GTM-XXXX`) | `[NÃO ATIVO — CONTAINER NÃO CRIADO]` | Roteamento de tags só será carregado **após** o consentimento |
| Sentry (`sentry-trace`, `baggage`) | Operacional | Headers de tracing distribuído de erros — não cookie persistido em navegador; coleta IP truncado |

### 3.4. SDKs em aplicativos móveis (Expo / React Native)

Em apps Pulse Cliente e Pulse Produtor (Expo / React Native), tecnologias equivalentes a cookies incluem:

| Tecnologia | Finalidade | Categoria |
|---|---|---|
| `expo-secure-store` | Token de sessão Better Auth, refresh tokens | Essencial |
| `AsyncStorage` (`pulse.*`) | Preferências, último evento, drafts de checkout | Funcional |
| Push tokens (`expo-notifications`) | Notificações de evento / aprovação KYC | Funcional (depende de permissão nativa do SO) |
| Sentry SDK | Crash reporting / performance | Essencial (legítimo interesse — segurança) |

---

## 4. BASE LEGAL E CONSENTIMENTO

4.1. Sob a LGPD:

| Categoria | Base legal | Necessita consentimento? |
|---|---|---|
| Essenciais | Art. 7º, V (execução de contrato) e/ou IX (legítimo interesse — segurança) | Não |
| Funcionais | Art. 7º, I (consentimento) — quando não essenciais | Sim |
| Analíticos | Art. 7º, I (consentimento) | Sim, granular |
| Marketing | Art. 7º, I (consentimento) | Sim, opt-in expresso |

4.2. O **banner de consentimento** (CMP — Consent Management Platform) será exibido no primeiro acesso e oferecerá, no mínimo:

- (a) botão **"Aceitar todos"**;
- (b) botão **"Recusar todos"** (com o mesmo destaque visual do "Aceitar" — conforme Guia ANPD);
- (c) botão **"Personalizar"** abrindo painel com chaves de toggle por categoria;
- (d) link para esta Política de Cookies;
- (e) data e versão desta Política aceita.

4.3. A escolha é registrada em `pulse.consent.choices` e (para usuários autenticados) também no backend, em campo equivalente a `UserTermsAcceptance` / `ProducerTermsAcceptance`, vinculado ao `userId` e à versão do documento.

4.4. **Revogação**: o usuário pode revisar e alterar suas escolhas a qualquer momento em `pulse.com.br/cookies` (link permanente no rodapé). A revogação tem efeito **prospectivo** — não desfaz tratamentos anteriores legítimos.

---

## 5. COMO CONTROLAR

5.1. **No banner Pulse**: aceitar, recusar ou personalizar por categoria.

5.2. **No navegador**: cada navegador permite gerenciar/excluir cookies. Links:

- Chrome: `chrome://settings/cookies`
- Firefox: `about:preferences#privacy`
- Safari: Ajustes → Safari → Avançado → Dados de sites
- Edge: `edge://settings/content/cookies`

5.3. **Atenção**: bloquear cookies essenciais poderá **impedir login, checkout e operação** da Plataforma — esta é uma limitação técnica, não contratual.

5.4. **Apps móveis**: as preferências equivalentes ficam em "Configurações → Privacidade" dentro do app, e em "Permissões" no sistema operacional.

---

## 6. COMPARTILHAMENTO COM TERCEIROS

6.1. A lista completa de subprocessadores que atuam sobre dados eventualmente coletados via cookies está em [`dpa-subprocessadores.md`](../lgpd/dpa-subprocessadores.md).

6.2. Resumo:

| Terceiro | Finalidade | Dado vinculado a cookie/ID |
|---|---|---|
| Cloudflare | CDN, WAF, mitigação de bots | `__cf_bm`, IP, fingerprint mínimo de requisição |
| Sentry | Telemetria de erros | `userId` (quando logado), IP truncado |
| Better Auth (self-hosted) | Sessão | Token de sessão |
| Google Analytics 4 (`[QUANDO ATIVADO]`) | Estatísticas de uso | `_ga`, `_ga_<ID>` |
| Google Tag Manager (`[QUANDO ATIVADO]`) | Orquestração de tags | — |

---

## 7. DADOS DE MENORES

7.1. A Plataforma é destinada a maiores de 18 anos (ou maiores de 16 emancipados, conforme [Termos de Uso](../contratos/termos-de-uso-cliente.md)).

7.2. **Não direcionamos publicidade ou rastreamento a crianças** (Art. 14 LGPD). Nenhum cookie de marketing é ativado para usuários identificados como menores.

---

## 8. ATUALIZAÇÕES

8.1. Esta Política pode ser atualizada. Mudanças materiais (novos terceiros, novas categorias, novas finalidades) exigirão **novo consentimento** via banner re-exibido.

8.2. A versão e a data desta Política ficam registradas no documento `LegalDocument` (tipo `[DEFINIR — COOKIE_POLICY]`) e no campo de aceite (`UserTermsAcceptance`).

---

## 9. CONTATO

9.1. Dúvidas sobre esta Política ou pedidos relativos aos seus direitos:

- **Encarregado (DPO)**: `[NOME / RAZÃO SOCIAL DO DPO]` — e-mail: `dpo@pulse.com.br`
- **Formulário web**: `https://pulse.com.br/privacidade/solicitacao`
- Procedimento detalhado em [`procedimento-titular.md`](../lgpd/procedimento-titular.md).

---

| Versão | Data       | Mudança principal                                  |
|--------|------------|----------------------------------------------------|
| 1.0    | 2026-05-24 | Draft inicial — inventário pré-GA4/GTM             |
