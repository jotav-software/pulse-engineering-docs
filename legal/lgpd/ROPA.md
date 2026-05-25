# ROPA — REGISTRO DE OPERAÇÕES DE TRATAMENTO DE DADOS PESSOAIS

**Versão:** 1.0 — DRAFT TÉCNICO (não revisado por advogado)
**Última atualização:** 2026-05-24

> ⚠️ Este documento é um **draft técnico** preparado por engenharia/produto a partir do funcionamento real da plataforma. **Deve ser revisado por advogado(a) habilitado(a) e/ou DPO antes de qualquer divulgação à ANPD.** Itens entre `[colchetes em maiúsculas]` precisam ser preenchidos/decididos pela empresa antes da publicação. Este ROPA cumpre o Art. 37 da Lei 13.709/2018 (LGPD) e segue as orientações da ANPD para agentes de tratamento.

---

## 1. IDENTIFICAÇÃO DO CONTROLADOR

| Item | Valor |
|---|---|
| Razão social | `[RAZÃO SOCIAL PULSE]` |
| CNPJ | `[CNPJ]` |
| Endereço | `[ENDEREÇO COMPLETO]` |
| Encarregado (DPO) | `[NOME / EMPRESA] — dpo@pulse.com.br` |
| Site / canal | `https://pulse.com.br/privacidade` |

A PULSE é **controladora** dos tratamentos abaixo, exceto quando indicado de outra forma na coluna "Papel".

## 2. LEGENDA — BASES LEGAIS LGPD

- **Art. 7º** — dados pessoais comuns:
  - I — consentimento; II — cumprimento de obrigação legal/regulatória; V — execução de contrato; VI — exercício de direitos em processo; IX — legítimo interesse; X — proteção do crédito.
- **Art. 11** — dados pessoais sensíveis:
  - II, "a" — cumprimento de obrigação legal; II, "g" — garantia da prevenção à fraude e à segurança do titular nos processos de identificação.
  - I — consentimento específico e destacado.

Justificativa detalhada por finalidade em [`base-legal-por-tratamento.md`](./base-legal-por-tratamento.md).

---

## 3. INVENTÁRIO DE TRATAMENTOS

> Ordenado por momento no ciclo de vida do usuário. Cada linha representa uma **operação de tratamento** distinta, conforme Art. 5º, X LGPD.

### 3.1. Cadastro e autenticação de clientes (B2C)

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Criação e manutenção de conta de comprador via Better Auth (e-mail + OTP) |
| **Finalidade** | Permitir compra de ingressos, autenticação segura, recuperação de acesso |
| **Base legal** | Art. 7º, V (execução de contrato — Termos de Uso) |
| **Dados tratados** | `User.email`, `User.name`, `User.phone`, `User.cpf` (opcional na compra), `Account.providerId`, `Verification` (OTP) |
| **Titulares** | Compradores de ingressos (PF), maiores de 18 anos |
| **Retenção** | Enquanto a conta estiver ativa + 5 anos após `deletedAt` (prazo prescricional CDC, Art. 27) |
| **Compartilhamentos** | Brevo (envio do OTP — ver §3.10); Cloudflare (CDN/WAF); Railway (hospedagem) |

### 3.2. Cadastro e onboarding de PRODUTOR (B2B)

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Criação de conta de produtor + dados societários |
| **Finalidade** | Habilitar publicação de eventos e repasse financeiro |
| **Base legal** | Art. 7º, V (execução do [Contrato de Adesão](../contratos/contrato-adesao-produtor.md)); Art. 7º, II (obrigação legal — registro de transações financeiras) |
| **Dados tratados** | `User.name`, `User.email`, `User.cpf`, `User.cnpj`, `User.phone`, `User.responsibleName`, `ProducerMembership`, endereço |
| **Titulares** | Produtores PF e PJ (responsáveis legais identificados) |
| **Retenção** | Vigência do contrato + **10 anos** após encerramento (conservação fiscal — Lei 8.218/91, CTN art. 173) |
| **Compartilhamentos** | Brevo, Cloudflare, Railway, Pagar.me/Stripe (KYC de recebedor — Fase 2) |

### 3.3. KYC do produtor (documentos)

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Recebimento, análise e arquivamento de documentos do produtor (RG/CNH, comprovante de endereço, contrato social, selfie) |
| **Finalidade** | Prevenção à fraude, lavagem de dinheiro (PLD-FT), conformidade com regras do PSP |
| **Base legal** | Art. 7º, II (obrigação legal — Lei 9.613/98 e Circular BCB 3.978/2020 quando aplicável); Art. 7º, IX (legítimo interesse — prevenção de fraude); para selfie/biometria do responsável legal: **Art. 11, II, "g"** |
| **Dados tratados** | `ProducerKycDocument` (tipo, arquivo, status), `ProducerKycDocumentAudit`, número de documento de identidade |
| **Titulares** | Produtor titular e responsáveis legais |
| **Retenção** | 5 anos após encerramento da relação (alinhado à Lei 9.613/98, art. 10, II) |
| **Compartilhamentos** | Cloudflare R2 (storage dos arquivos, criptografados); Pagar.me/Stripe quando aplicável |

### 3.4. Biometria facial (US-FAC-014)

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Captura de selfie no app, extração de **vetor 512-d**, armazenamento criptografado e *matching* na portaria do evento |
| **Finalidade** | Identificação do titular para acesso ao evento (1:N e 1:1) — controle de fraude de transferência de ingresso |
| **Base legal** | **Art. 11, I** (consentimento específico e destacado) — registrado em `User.biometricConsentAt`, `biometricConsentIp`, `biometricTermsVersion` |
| **Dados tratados** | `User.biometricVector` (AES-256-GCM), `biometricHash` (HMAC-SHA256 — dedupe), `biometricQuality`; `EventFaceGalleryEntry`; `BiometricAudit` (com `score`, `staffUserId`, `ticketId`, `channel`) |
| **Titulares** | Compradores que optaram por habilitar biometria |
| **Retenção** | Template global: até exclusão pelo titular (`DELETE /biometry`). Galeria por evento: **30 dias após `endDate`** (`FACE_GALLERY_RETENTION_DAYS`) — purge automatizado |
| **Compartilhamentos** | **Nenhum subprocessador de visão computacional externo** — `pulse-face` é self-hosted no Railway. Não há Azure/AWS Rekognition |

Detalhes técnicos: [`product/facial/lgpd-security.md`](../../product/facial/lgpd-security.md).

### 3.5. Emissão de ingresso digital

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Geração de ingresso após `Transaction.status = PAID` |
| **Finalidade** | Cumprimento do contrato de compra (entrega do ingresso); controle de acesso ao evento |
| **Base legal** | Art. 7º, V (execução de contrato) |
| **Dados tratados** | `Ticket` (`qrCodeHash`, `holderName`, `holderCpf` — últimos 3 dígitos visíveis no manual check-in, `usedAt`, `IssuanceSource`) |
| **Titulares** | Comprador titular; eventual portador (transferência de ingresso) |
| **Retenção** | 5 anos após o evento (prazo prescricional CDC) |
| **Compartilhamentos** | Compartilhado com PRODUTOR do evento (controlador autônomo da lista de presença, conforme Cl. 8.2 do Contrato de Adesão) |

### 3.6. Transações de pagamento

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Processamento de pagamento Pix/cartão via PSP |
| **Finalidade** | Cobrança do consumidor, repasse ao produtor, conformidade contábil e antifraude |
| **Base legal** | Art. 7º, V (contrato); Art. 7º, II (obrigação legal — conservação contábil/fiscal); Art. 7º, IX (legítimo interesse — prevenção de fraude/chargeback) |
| **Dados tratados** | `CheckoutSession`, `CheckoutItem`, `Transaction` (`externalId`, `status`, `pixQrCode`, `pixCopyPaste`, `attemptsCount`, `lastError`), `IdempotencyKey` |
| **Não tratados pela Pulse** | PAN (número de cartão), CVV — tokenização ocorre no cliente, backend recebe `card_token` (escopo PCI-DSS **SAQ-A**, ver [`compliance/pci-dss-scoping.md`](../compliance/pci-dss-scoping.md)) |
| **Titulares** | Compradores |
| **Retenção** | 10 anos (CTN art. 173, fiscal) |
| **Compartilhamentos** | Pagar.me (PSP default) **ou** Stripe (alternativo via `PAYMENT_PROVIDER`); BACEN/COAF quando obrigado por lei |

### 3.7. Dados bancários do produtor (repasse)

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Cadastro e validação de conta para repasse via PIX/TED |
| **Finalidade** | Pagamento ao produtor; conformidade com regras BACEN |
| **Base legal** | Art. 7º, V (execução do Contrato de Adesão) |
| **Dados tratados** | `BankAccount` (`bankCode`, `branch`, `account`, `accountDigit`, `holderName`, `holderDoc`, `pixKey`, `pixKeyType`) |
| **Titulares** | Produtores |
| **Retenção** | Vigência do contrato + 10 anos (fiscal) |
| **Compartilhamentos** | PSP de saque (`[A DEFINIR — PAGAR.ME / API DICT BACEN / OUTRO]`) |

### 3.8. Repasse e movimentações financeiras

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Cálculo de saldo retido/disponível, execução de saque, registro contábil |
| **Finalidade** | Cumprimento da cláusula de repasse; obrigação fiscal |
| **Base legal** | Art. 7º, V e Art. 7º, II |
| **Dados tratados** | `ProducerPayoutMovement`, `ProducerWithdrawalRequest`, `ProducerWithdrawalAllocation`, `Event.payoutStatus`, `payoutBlockedReason` |
| **Titulares** | Produtores |
| **Retenção** | 10 anos (fiscal) |
| **Compartilhamentos** | Contabilidade externa (`[A DEFINIR]`); Receita Federal/BACEN quando obrigado |

### 3.9. Estornos / reembolsos (CDC e Lei 14.046/2020)

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Estorno admin via `ProcessAdminRefundUseCase` |
| **Finalidade** | Atendimento de direito do consumidor; cancelamento de evento |
| **Base legal** | Art. 7º, II (obrigação legal — CDC Art. 49, Lei 14.046/2020); Art. 7º, V |
| **Dados tratados** | `AdminRefund` (`reason`, `amountCents`, `netImpactCents`, `gatewayRefundId`, `adminUserId`) |
| **Titulares** | Compradores; administradores Pulse (`adminUserId`) |
| **Retenção** | 10 anos |
| **Compartilhamentos** | PSP (estorno) |

### 3.10. Comunicação transacional (e-mail OTP, confirmação de compra, alerta de KYC)

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Envio de e-mails transacionais via Brevo |
| **Finalidade** | Autenticação (OTP), confirmação de pedido, comunicados operacionais ao produtor |
| **Base legal** | Art. 7º, V (execução de contrato) — não exige consentimento por ser transacional |
| **Dados tratados** | E-mail, nome, código OTP, número de pedido, número de ingresso |
| **Titulares** | Clientes e produtores |
| **Retenção** | Logs de envio em Brevo: `[A DEFINIR — PADRÃO BREVO 6 MESES]`. Backend: idem `User` |
| **Compartilhamentos** | Brevo (Sendinblue SAS — França) |

### 3.11. Comunicação de marketing (newsletter, campanhas)

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Disparo de campanhas via Brevo |
| **Finalidade** | Divulgação de eventos, ofertas, conteúdo |
| **Base legal** | Art. 7º, I (consentimento — opt-in expresso) |
| **Dados tratados** | E-mail, nome, segmento, histórico de cliques/aberturas |
| **Titulares** | Clientes que aceitaram receber comunicações |
| **Retenção** | Até revogação do consentimento (opt-out) + 6 meses para auditoria |
| **Compartilhamentos** | Brevo |

### 3.12. Logs de aplicação e auditoria de segurança

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Coleta de logs operacionais e auditoria de ações sensíveis |
| **Finalidade** | Segurança, depuração, defesa em incidentes |
| **Base legal** | Art. 7º, IX (legítimo interesse — segurança) + Marco Civil da Internet (Lei 12.965/2014, Art. 15 — guarda de logs por 6 meses) |
| **Dados tratados** | `SystemLog`, `AuditLog` (`action`, `entity`, `oldData`, `newData`, `ip`, `userAgent`), `BiometricAudit`, `ProducerKycDocumentAudit` |
| **Titulares** | Todos os usuários da Plataforma |
| **Retenção** | **6 meses** (mínimo legal MCI) — `[CONFIRMAR LIMITE MÁXIMO — RECOMENDADO 12 MESES]` |
| **Compartilhamentos** | Sentry (telemetria de erros — IP truncado); Railway (host) |

### 3.13. Suporte ao usuário

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Atendimento por e-mail (`suporte@pulse.com.br`) e chat in-app |
| **Finalidade** | Resolução de dúvidas, reclamações e solicitações |
| **Base legal** | Art. 7º, V (execução de contrato); Art. 7º, VI (exercício regular de direitos) |
| **Dados tratados** | Conteúdo da interação, `userId`, `ticketId` interno de suporte |
| **Titulares** | Clientes e produtores |
| **Retenção** | 5 anos após o fechamento do ticket |
| **Compartilhamentos** | `[FERRAMENTA DE HELPDESK — A DEFINIR; HOJE BREVO/E-MAIL]` |

### 3.14. Cookies, analytics e telemetria web

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Inventário em [`politica-cookies.md`](../politicas/politica-cookies.md) |
| **Finalidade** | Funcionamento do site (essencial), estatística (analítico — quando GA4 ativo) |
| **Base legal** | Essenciais: Art. 7º, V/IX. Analíticos: Art. 7º, I (consentimento) |
| **Dados tratados** | IP, user agent, identificadores de sessão, eventos de uso anonimizados |
| **Titulares** | Visitantes e usuários |
| **Retenção** | Por cookie — ver Política de Cookies |
| **Compartilhamentos** | Cloudflare; Google (GA4) quando ativo |

### 3.15. Comissão de promotores

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Apuração e pagamento de comissão por venda |
| **Finalidade** | Pagamento de promotores associados ao produtor |
| **Base legal** | Art. 7º, V (contrato entre PRODUTOR e promotor, intermediado pela Pulse) |
| **Dados tratados** | `PromoterCommission`, `PromoterCommissionPayment`, dados bancários do promotor |
| **Titulares** | Promotores cadastrados pelo produtor |
| **Retenção** | 10 anos (fiscal) |
| **Compartilhamentos** | PSP de pagamento |

### 3.16. Termos e aceites legais (gate HU06)

| Atributo | Conteúdo |
|---|---|
| **Tratamento** | Registro de aceite de Termos / Privacidade / Reembolso / Cookies |
| **Finalidade** | Prova de consentimento e prova contratual |
| **Base legal** | Art. 7º, II (obrigação legal — Marco Civil); Art. 7º, V |
| **Dados tratados** | `LegalDocument`, `UserTermsAcceptance`, `ProducerTermsAcceptance` (versão, IP, timestamp, hash do documento) |
| **Titulares** | Todos os usuários |
| **Retenção** | Vigência da conta + 10 anos |
| **Compartilhamentos** | — |

---

## 4. TRATAMENTO DE DADOS DE CRIANÇAS E ADOLESCENTES

A Plataforma é destinada a maiores de 18 anos. Não há, por design, coleta dirigida a crianças (Art. 14 LGPD). Caso seja identificado tratamento de dados de menor sem autorização do(s) responsável(is), o registro é excluído conforme [`procedimento-titular.md`](./procedimento-titular.md).

---

## 5. TRANSFERÊNCIA INTERNACIONAL DE DADOS

Resumo dos fluxos para fora do Brasil — detalhamento em [`dpa-subprocessadores.md`](./dpa-subprocessadores.md):

| Destino | Jurisdição | Mecanismo (Art. 33 LGPD) |
|---|---|---|
| Stripe | EUA | Cláusulas-padrão / DPA Stripe |
| Brevo | França (UE) | Decisão de adequação ANPD/UE quando publicada; cláusulas-padrão até lá |
| Cloudflare | EUA (rede global) | DPA Cloudflare + cláusulas-padrão |
| Sentry | EUA | DPA Sentry + cláusulas-padrão |
| Upstash | EUA / `[REGIÃO]` | DPA Upstash |
| Pagar.me | Brasil | — |
| Railway | EUA / `[REGIÃO ESCOLHIDA]` | DPA Railway + cláusulas-padrão |

---

## 6. MEDIDAS DE SEGURANÇA (Art. 46 LGPD)

Resumo (detalhes em [`compliance/pci-dss-scoping.md`](../compliance/pci-dss-scoping.md) e [`product/facial/lgpd-security.md`](../../product/facial/lgpd-security.md)):

- TLS em todos os endpoints públicos.
- Biometria criptografada em repouso (AES-256-GCM).
- Tokenização de cartão no cliente — backend não recebe PAN.
- Controle de acesso por RBAC (`Permission`, `Role`, `RolePermission`).
- Idempotência em operações sensíveis (`IdempotencyKey`).
- Logs de auditoria (`AuditLog`, `BiometricAudit`, `ProducerKycDocumentAudit`).
- Janela de retenção configurável por finalidade (purges automatizados).

---

## 7. REVISÃO

7.1. Este ROPA deve ser revisado:

- (a) a cada **6 meses** pelo Encarregado;
- (b) sempre que um **novo tratamento** for introduzido;
- (c) sempre que um **subprocessador** for adicionado/removido;
- (d) após qualquer **incidente** com dados pessoais.

7.2. Histórico de revisões:

| Versão | Data       | Mudança principal                                |
|--------|------------|--------------------------------------------------|
| 1.0    | 2026-05-24 | Draft inicial pré-lançamento (16 tratamentos)    |
