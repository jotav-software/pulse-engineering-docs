# BASE LEGAL POR TRATAMENTO — MAPA LGPD


Este documento complementa o [`ROPA.md`](./ROPA.md) e justifica, por seção, a escolha da base legal aplicada a cada finalidade de tratamento. Sempre que possível, citamos o inciso específico da Lei 13.709/2018.

---

## 1. RAZÕES METODOLÓGICAS

1.1. A LGPD lista **10 (dez)** hipóteses para dados pessoais comuns (Art. 7º) e **8 (oito)** para dados pessoais sensíveis (Art. 11). A escolha da base **não é arbitrária**: cada tratamento deve eleger **uma única base principal** suficiente para sustentá-lo, sob pena de invalidade — entendimento consolidado pela ANPD em seu Guia Orientativo de Bases Legais.

1.2. Hierarquia interna seguida pela Pulse:

1. Se o tratamento é **estritamente necessário** ao contrato com o titular → **Art. 7º, V**.
2. Se decorre de **obrigação legal ou regulatória** → **Art. 7º, II**.
3. Se há **necessidade objetiva e equilibrada** de tratamento sem afetar direitos do titular → **Art. 7º, IX** (legítimo interesse) — com **LIA** (Legitimate Interest Assessment) documentada.
4. Em último caso, **consentimento** — **Art. 7º, I** — apenas quando nenhuma outra base se aplique e quando for **livre, informado e inequívoco**.
5. Para dados sensíveis (biometria, saúde, opiniões políticas, origem racial/étnica): preferência por **Art. 11, II** (com inciso específico) e, residualmente, **Art. 11, I** (consentimento específico e destacado).

1.3. **Consentimento não é "preferível"** — é, na verdade, a base mais frágil porque é revogável a qualquer momento (Art. 8º, §5º). Por isso, a Pulse só recorre a consentimento quando não há alternativa.

---

## 2. CADASTRO E AUTENTICAÇÃO

### 2.1. Conta de cliente (B2C)

- **Base**: Art. 7º, V — **execução de contrato**.
- **Justificativa**: a coleta de e-mail, telefone, nome e (opcional) CPF é **condição imprescindível** para celebrar o contrato de uso da Plataforma (Termos de Uso) e para emitir ingressos nominais. Sem esses dados, a Pulse não consegue cumprir sua prestação principal — entregar o ingresso e identificar o titular na portaria.
- **Não usar consentimento** porque negar consentimento equivaleria a impedir a entrega do serviço — caracterizando consentimento "viciado" pela condição de contratação (Art. 9º, §1º LGPD).

### 2.2. Conta de produtor (B2B)

- **Base primária**: Art. 7º, V — **execução do [Contrato de Adesão](../contratos/contrato-adesao-produtor.md)**.
- **Base secundária**: Art. 7º, II — **obrigação legal** para conservação de dados em razão de obrigações fiscais (Lei 8.218/91 e CTN) e antilavagem (Lei 9.613/98) quando aplicável.

### 2.3. Autenticação via OTP por e-mail (Better Auth)

- **Base**: Art. 7º, V — execução de contrato (a autenticação é o mecanismo de acesso ao serviço contratado).
- **Base concorrente para logs**: Art. 7º, IX — legítimo interesse (segurança da conta, detecção de fraude).

### 2.4. "Lembrar dispositivo" / sessões persistentes

- **Base**: Art. 7º, I — consentimento (opcional). Se o usuário não marcar "lembrar", a sessão expira normalmente.

---

## 3. KYC E PREVENÇÃO À FRAUDE

### 3.1. Documentos de identificação do produtor

- **Base**: Art. 7º, II — **obrigação legal**. Aplicam-se:
  - Lei 9.613/98 (PLD-FT) — Pulse, ao intermediar valores, atua em ambiente equiparado à definição da Lei e segue boas práticas COAF;
  - Circular BCB 3.978/2020 quando aplicável ao PSP parceiro;
  - Resoluções do CADE / SISBACEN sobre KYC em arranjos de pagamento `[VALIDAR APLICABILIDADE DIRETA À PULSE]`.
- **Justificativa para não usar consentimento**: a coleta é exigida por lei e por contrato com o PSP. O produtor pode recusar — e, ao recusar, **não terá publicação aprovada**, sem que isso configure tratamento abusivo.

### 3.2. Selfie do responsável legal (biometria de KYC)

- **Base**: Art. 11, II, "g" — **garantia da prevenção à fraude e à segurança do titular nos processos de identificação**.
- **Justificativa**: a selfie é tratada como dado biométrico (sensível). A hipótese do Art. 11, II, "g" foi introduzida precisamente para permitir uso de biometria em onboarding/KYC sem depender de consentimento (revogável). Há que demonstrar **necessidade**, **adequação** e **proporcionalidade** — atendidas, no caso, pela exigência regulatória de identificação do responsável legal.

### 3.3. Logs de auditoria de KYC (`ProducerKycDocumentAudit`)

- **Base**: Art. 7º, II e Art. 7º, IX — obrigação legal + legítimo interesse em provar conformidade.

---

## 4. PAGAMENTOS

### 4.1. Processamento de pagamento (Pix / cartão)

- **Base primária**: Art. 7º, V — execução de contrato.
- **Base secundária**: Art. 7º, II — obrigação legal (conservação contábil e fiscal — CTN art. 173, Decreto 9.580/2018).

### 4.2. Tokenização de cartão / `Transaction.attemptsCount`, `lastError`

- **Base**: Art. 7º, V (executar o pagamento) + Art. 7º, IX (legítimo interesse — antifraude, controle do limite de 3 tentativas por sessão).

### 4.3. Dados bancários do produtor (`BankAccount`)

- **Base**: Art. 7º, V — repasse é prestação principal do contrato.

### 4.4. Movimentações de repasse e saque

- **Base**: Art. 7º, V + Art. 7º, II (registros contábeis).

### 4.5. Estornos e reembolsos

- **Base**: Art. 7º, II — **CDC art. 49** (direito de arrependimento) e **Lei 14.046/2020** (eventos cancelados/adiados) tornam o estorno **obrigação legal**.

---

## 5. BIOMETRIA FACIAL (CONTROLE DE ACESSO AO EVENTO)

### 5.1. Captura e armazenamento do vetor facial

- **Base**: **Art. 11, I** — **consentimento específico e destacado**.
- **Justificativa**: diferentemente da selfie de KYC (Art. 11, II, "g"), o reconhecimento facial **na portaria do evento** **não é exigência legal nem é estritamente necessário ao contrato** (o ingresso pode ser validado por QR ou check-in manual). Trata-se de **conveniência operacional** oferecida ao comprador. Por isso, exige **consentimento específico**, registrado em `User.biometricConsentAt`, `biometricConsentIp` e `biometricTermsVersion`. O titular pode revogar a qualquer momento via `DELETE /biometry`.
- **Salvaguardas obrigatórias** (Art. 11, §1º LGPD):
  - finalidade limitada (controle de acesso — não há uso para marketing ou analytics);
  - minimização (armazena vetor, não foto);
  - retenção curta (galeria do evento expira em 30 dias);
  - registro de auditoria (`BiometricAudit`).

### 5.2. Galeria por evento (`EventFaceGalleryEntry`)

- **Base**: derivada do consentimento do titular (Art. 11, I) — escopo restrito ao evento aceito pelo titular ao comprar o ingresso.

---

## 6. EMISSÃO DE INGRESSO E CONTROLE DE ACESSO

### 6.1. Geração do ingresso (`Ticket`)

- **Base**: Art. 7º, V — execução de contrato (entrega da prestação principal).

### 6.2. Check-in (QR / facial / manual com `cpfLast3`)

- **Base**: Art. 7º, V — execução de contrato com o comprador.
- **Compartilhamento com PRODUTOR**: o PRODUTOR atua como **controlador autônomo** sobre a lista de presença, com base contratual própria (Art. 7º, V — relação com seu cliente final no evento). Ver Cl. 8.2 do [Contrato de Adesão](../contratos/contrato-adesao-produtor.md).

### 6.3. Transferência de ingresso (anti-cambismo)

- **Base**: Art. 7º, V para o portador atual; Art. 7º, IX para registro de **uma única transferência** (legítimo interesse de combate ao cambismo, Lei 12.933/2013 e regulações estaduais).

---

## 7. COMUNICAÇÃO

### 7.1. Transacional (OTP, confirmação de compra, alertas operacionais)

- **Base**: Art. 7º, V — execução de contrato. **Não exige consentimento**, pois é informação necessária ao próprio serviço contratado.

### 7.2. Marketing / newsletter

- **Base**: Art. 7º, I — **consentimento opt-in**.
- **Justificativa**: comunicação promocional não é necessária ao contrato. Exige opt-in expresso, com possibilidade de revogação a qualquer momento (link "descadastrar" em todo envio — Art. 8º, §5º + boa prática anti-spam).

### 7.3. Pesquisas de satisfação

- **Base**: Art. 7º, IX — legítimo interesse (com LIA — melhoria do serviço); contato apenas para usuários ativos; opt-out facilitado.

---

## 8. SEGURANÇA E LOGS

### 8.1. Logs de aplicação (`SystemLog`)

- **Base**: Art. 7º, IX — legítimo interesse em **segurança da informação** (Art. 46 LGPD obriga adoção de medidas de segurança; logs são instrumento essencial).
- **Base concorrente**: Marco Civil da Internet (Lei 12.965/2014, Art. 15) exige guarda de **registros de aplicação por 6 meses** para provedores. Há, portanto, também Art. 7º, II (obrigação legal) para essa janela mínima.

### 8.2. Auditoria de ações sensíveis (`AuditLog`)

- **Base**: Art. 7º, II + Art. 7º, IX.

### 8.3. Telemetria de erros (Sentry)

- **Base**: Art. 7º, IX — legítimo interesse (depuração e estabilidade). IP é truncado; PII é redatado por filtros.

---

## 9. ANALYTICS (FUTURO — GA4/GTM)

### 9.1. Estatísticas de uso, funil de checkout, retenção

- **Base**: Art. 7º, I — **consentimento opt-in** (granular, por categoria, via banner CMP).
- **Justificativa**: a ANPD posiciona-se (Guia de Cookies, 2023) pela exigência de consentimento prévio para cookies analíticos de terceiros, especialmente quando há transferência internacional.
- Detalhes: [`politica-cookies.md`](../politicas-publicas/politica-cookies.md).

### 9.2. Métricas internas anonimizadas

- **Base**: dado **anonimizado** não está sob a LGPD (Art. 12). Quando a Pulse derivar métricas internas a partir de dados agregados e irreversivelmente anonimizados, **não há base legal exigida** — desde que a anonimização atenda ao Art. 5º, XI.

---

## 10. SUPORTE E ATENDIMENTO

### 10.1. E-mail e chat de suporte

- **Base**: Art. 7º, V — execução de contrato; Art. 7º, VI — exercício regular de direitos em processo administrativo (PROCON, ANPD) ou judicial.

### 10.2. Gravação de chamadas / chats

- **Base**: `[A DEFINIR — SE HOUVER GRAVAÇÃO]` — Art. 7º, IX (legítimo interesse) com aviso prévio ao usuário.

---

## 11. ATENDIMENTO A DIREITOS DO TITULAR (ART. 18)

- **Base**: Art. 7º, II — obrigação legal (a própria LGPD obriga o controlador a atender pedidos do Art. 18).
- Procedimento detalhado: [`procedimento-titular.md`](./procedimento-titular.md).

---

## 12. RESUMO POR FINALIDADE × BASE

| Finalidade | Base principal | Base concorrente |
|---|---|---|
| Cadastro / login | Art. 7º, V | Art. 7º, IX (segurança) |
| KYC produtor | Art. 7º, II | Art. 11, II, "g" (selfie) |
| Biometria de acesso ao evento | **Art. 11, I** (consentimento) | — |
| Emissão de ingresso | Art. 7º, V | — |
| Pagamento | Art. 7º, V | Art. 7º, II (fiscal) |
| Repasse / saque | Art. 7º, V | Art. 7º, II |
| Estorno / reembolso | Art. 7º, II (CDC, Lei 14.046) | Art. 7º, V |
| Comunicação transacional | Art. 7º, V | — |
| Marketing | Art. 7º, I | — |
| Logs / segurança | Art. 7º, IX | Art. 7º, II (MCI) |
| Analytics (GA4/GTM) | Art. 7º, I | — |
| Atendimento Art. 18 | Art. 7º, II | — |

---

## 13. REVISÃO

13.1. Revisar este mapa sempre que:

- (a) novo tratamento for introduzido;
- (b) houver mudança regulatória relevante (resolução ANPD, alteração da LGPD);
- (c) houver decisão judicial ou administrativa que afete a base aplicada.

| Versão | Data       | Mudança principal                |
|--------|------------|----------------------------------|
| 1.0    | 2026-05-24 | Draft inicial — mapa por seção   |
