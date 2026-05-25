# POLÍTICA DE PRIVACIDADE — PULSE

**Versão:** 1.0 — DRAFT TÉCNICO (não revisado por advogado)
**Última atualização:** 2026-05-24

> ⚠️ Este documento é um **draft técnico** preparado por engenharia/produto, baseado no funcionamento real da plataforma. **Deve ser revisado por advogado(a) habilitado(a) e pelo DPO antes da publicação.** Itens entre `[colchetes em maiúsculas]` precisam ser preenchidos pela empresa.

---

A Pulse leva sua privacidade muito a sério. Esta Política explica, em linguagem simples e direta, **quais dados coletamos**, **por que**, **com quem compartilhamos**, **quanto tempo guardamos** e **quais direitos você tem** — em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018, "LGPD").

## 1. Quem somos

**Controlador dos dados**: `Jhonatan Vitor Lopes Camargo Consultoria em Tecnologia da Informação LTDA`, CNPJ `55.346.033/0001-80`, com sede em `Av. Paulista, 1106, Sala 01, Andar 16, Bela Vista, São Paulo/SP, CEP 01310-914`.

**Encarregado pelo Tratamento de Dados Pessoais (DPO)**: `[NOME OU "Função DPO terceirizada por <empresa>"]` — contato: `dpo@pulse.com.br` e formulário em `[URL]`.

A Pulse pode atuar como **controladora** (define finalidades e meios — caso da maior parte do tratamento aqui descrito) ou **operadora** (atuando sob instrução de produtores em situações específicas, como dados que produtores exportam para sistemas próprios).

## 2. Dados que coletamos

### 2.1. Quando você cria conta / compra ingresso
- **Identidade**: nome, e-mail, CPF, telefone, data de nascimento.
- **Endereço** (quando necessário para evento ou fatura): logradouro, número, complemento, CEP, cidade, UF.
- **Credenciais**: hash da senha (nunca a senha em si) ou identificador de provedor social (Google, Apple).
- **Documentos** (somente para produtores): RG/CNH, comprovante de endereço, contrato social, dados bancários — coletados via fluxo de KYC, criptografados em repouso.

### 2.2. Quando você compra ingresso
- **Histórico de compras**, eventos visitados, ingressos emitidos e transferências.
- **Dados de pagamento**: a Pulse **não armazena** número completo de cartão. O cartão é tokenizado pelo gateway (Pagar.me ou Stripe). Guardamos: token opaco, bandeira, últimos 4 dígitos, e dados mínimos para reconciliação.

### 2.3. Quando você opta por biometria facial (Art. 11 LGPD — dado pessoal sensível)
- **Foto e embedding facial** (vetor matemático de 512 dimensões), coletado mediante **consentimento expresso e específico**. Detalhes técnicos e medidas de segurança em [LGPD Biometria](../../produto/biometria/lgpd-security.md).
- Uso exclusivo: identificação na portaria do evento para o qual o consentimento foi dado.
- **Retenção máxima**: até `30 dias` após o término do evento — daí é **apagado automaticamente** por job recorrente.

### 2.4. Coletados automaticamente
- **Logs técnicos**: IP, navegador/SO, identificadores do dispositivo, timestamps de acesso, rotas acessadas — base legal: cumprimento de obrigação legal (Marco Civil da Internet, Lei 12.965/2014: 6 meses para apps de internet) e legítimo interesse (segurança).
- **Cookies e tecnologias similares**: ver [Política de Cookies](politica-cookies.md).
- **Dados de geolocalização** aproximada (cidade), só quando você dá permissão explícita no app — para mostrar eventos próximos.

### 2.5. Recebidos de terceiros
- **Status de pagamento** dos gateways (aprovado/negado/estornado).
- **E-mail e nome** quando você faz login social (Google ou Apple — só o que o provedor envia no escopo `openid email profile`).

## 3. Por que coletamos (finalidades)

| Finalidade | Base legal LGPD |
|---|---|
| Cadastro, autenticação e gestão de conta | Art. 7º, V (execução de contrato) |
| Processar compra de ingresso e repasse ao produtor | Art. 7º, V (contrato) |
| Identificação na portaria via biometria facial | Art. 11, I (consentimento expresso) |
| Comunicação transacional (OTP, confirmação de compra, transferência) | Art. 7º, V (contrato) |
| Atendimento ao cliente / suporte | Art. 7º, V (contrato) e Art. 7º, IX (legítimo interesse) |
| Prevenção a fraude, segurança da plataforma | Art. 7º, IX (legítimo interesse) |
| Cumprimento de obrigação legal (logs, KYC) | Art. 7º, II (obrigação legal) |
| Comunicação de marketing | Art. 7º, I (consentimento) — opt-in |
| Analytics / métricas agregadas | Art. 7º, IX (legítimo interesse) — sem identificação pessoal |
| Auditoria interna, defesa em processos | Art. 7º, VI (exercício regular de direitos) |

Mapeamento completo em [Base Legal por Tratamento](../lgpd/base-legal-por-tratamento.md) e em [ROPA](../lgpd/ROPA.md).

## 4. Com quem compartilhamos

Compartilhamos seus dados **apenas com**:

### 4.1. Subprocessadores essenciais (operadores da Pulse)
| Subprocessador | Finalidade | Jurisdição |
|---|---|---|
| **Pagar.me** | Processamento de Pix e cartão | Brasil |
| **Stripe** | Processamento de cartão (gateway secundário) | EUA (com SCC) |
| **Brevo** (Sendinblue) | E-mail transacional (OTP, confirmações) | França (UE) |
| **Railway** | Hospedagem do backend + DB MySQL | EUA / Frankfurt (com SCC) |
| **Cloudflare R2** | Armazenamento de documentos KYC | Global (com SCC) |
| **Upstash** | Cache / rate-limit (Redis) | EUA / UE |
| **Sentry** | Detecção de erros (sem PII intencional) | Alemanha (UE) |
| **Pulse-face** (próprio) | Microserviço de biometria self-hosted | Mesma infra Pulse |

Lista detalhada em [DPA Subprocessadores](../lgpd/dpa-subprocessadores.md).

### 4.2. Produtores dos eventos
Para que o produtor possa receber você no evento, compartilhamos:
- **lista de presença** com nome e (quando aplicável) última transferência de ingresso;
- **flag de biometria cadastrada** (sim/não — sem o embedding em si);
- **CPF apenas** quando obrigatório por lei (ex: meia-entrada com documentação obrigatória).

O produtor é controlador autônomo desses dados que recebe.

### 4.3. Autoridades públicas
- Quando exigido por lei, ordem judicial ou requisição administrativa formal.

### 4.4. Nunca vendemos seus dados
A Pulse **não vende**, **não aluga** e **não troca** dados pessoais com terceiros para fins de marketing.

## 5. Transferência internacional

Algumas das nossas ferramentas processam dados fora do Brasil (Stripe nos EUA, Brevo na França, Railway/R2 globalmente). Adotamos:
- **Cláusulas Contratuais Padrão (SCC)** ou contratos de tratamento conforme o caso;
- avaliação de adequação;
- restrição contratual de uso.

Detalhes: [DPA Subprocessadores](../lgpd/dpa-subprocessadores.md).

## 6. Por quanto tempo guardamos

| Tipo de dado | Retenção |
|---|---|
| Dados de conta ativa | Enquanto a conta existir |
| Dados após exclusão da conta | 30 dias (purga) — exceto retenções legais |
| Logs de acesso e operações | 6 meses (Marco Civil) — depois anonimizados ou apagados |
| Transações financeiras / fiscais | 5 anos (CTN art. 173) |
| KYC de produtor (após encerramento de relação) | 5 anos (combate à fraude / obrigação BC) |
| Biometria facial | Até `30 dias` após término do evento (purga automática) |
| Audit logs | Conforme política interna — mínimo 12 meses |
| Suporte ao cliente | 5 anos (prescrição CDC art. 27) |

## 7. Seus direitos (Art. 18 LGPD)

Você pode, **gratuitamente** e a qualquer momento, exercer estes direitos:

- **Confirmação** de que tratamos seus dados;
- **Acesso** aos dados que mantemos;
- **Correção** de dados incompletos, inexatos ou desatualizados;
- **Anonimização, bloqueio ou eliminação** de dados desnecessários ou tratados em desconformidade com a LGPD;
- **Portabilidade** para outro fornecedor de serviço similar;
- **Eliminação** dos dados tratados com base em consentimento;
- **Informação** sobre com quem compartilhamos seus dados;
- **Revogação do consentimento** (lembrando que pode inviabilizar uso da Plataforma para a finalidade dependente);
- **Oposição** ao tratamento, em hipóteses específicas;
- **Revisão de decisões automatizadas** que afetem seus interesses.

### Como solicitar
- E-mail: `dpo@pulse.com.br`
- Formulário web: `[URL]`
- Em até **15 dias** responderemos, podendo prorrogar com justificativa. Procedimento detalhado: [Procedimento do Titular](../lgpd/procedimento-titular.md).

### Quando podemos negar
Em casos previstos na LGPD (ex: necessidade de cumprir obrigação legal, exercício regular de direitos em processo, segurança pública). A recusa será sempre **fundamentada por escrito**.

## 8. Segurança dos dados

Implementamos medidas técnicas e administrativas razoáveis para proteger seus dados:

- **Criptografia em trânsito**: TLS 1.2+ em todas as conexões.
- **Criptografia em repouso**: AES-256-GCM para embeddings biométricos; senhas hasheadas com algoritmo forte (Better Auth padrão).
- **Tokenização** de dados de cartão (PCI scope reduzido).
- **Controle de acesso** RBAC (papéis: cliente, promoter, produtor, staff, admin) com princípio do menor privilégio.
- **Logs de auditoria** de operações sensíveis (acesso a KYC, mudanças de dados bancários, refunds).
- **Rate limit** em rotas críticas (login, OTP, checkout).
- **Detecção de erros** com Sentry (sem PII no payload).
- **Backups regulares** com retenção e criptografia.
- **Plano de resposta a incidentes** (ver Procedimento de Incidente em `operacoes/`).

Apesar das medidas, **nenhuma plataforma é 100% segura**. Em caso de incidente que possa afetar você, comunicaremos conforme exige o art. 48 da LGPD.

## 9. Crianças e adolescentes

A Pulse é destinada a maiores de 18 anos. **Não tratamos intencionalmente** dados de crianças. Caso identifique uso por menor sem autorização de responsável, contate `dpo@pulse.com.br` para exclusão.

## 10. Cookies

Uso e categorização: [Política de Cookies](politica-cookies.md).

## 11. Alterações desta Política

Quando atualizarmos, comunicaremos por:
- e-mail aos titulares ativos;
- banner no app/site;
- novo aceite obrigatório se a mudança afetar materialmente seu tratamento.

A versão anterior fica disponível em `[URL HISTÓRICO]`.

## 12. Como falar com a gente

- **DPO / Privacidade**: `dpo@pulse.com.br`
- **Suporte geral**: `suporte@pulse.com.br`
- **Endereço para correspondência formal**: `Av. Paulista, 1106, Sala 01, Andar 16, Bela Vista, São Paulo/SP, CEP 01310-914`
- **Autoridade Nacional de Proteção de Dados (ANPD)**: https://www.gov.br/anpd — se você não estiver satisfeito com nossa resposta.

---

| Versão | Data       | Mudança principal             |
|--------|------------|-------------------------------|
| 1.0    | 2026-05-24 | Draft inicial pré-lançamento  |
