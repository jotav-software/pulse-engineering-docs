# PCI-DSS — Escopo de Compliance da Pulse

**Versão:** 1.0 — DRAFT TÉCNICO
**Última atualização:** 2026-05-24

> ⚠️ Draft técnico — validar com QSA (Qualified Security Assessor) certificado em PCI-DSS.

## 1. O que é PCI-DSS

**Payment Card Industry Data Security Standard** — padrão obrigatório para qualquer entidade que **transmita, processe ou armazene** dados de cartão. Vigente: PCI-DSS v4.0.1 (2024).

## 2. Posição atual da Pulse

A Pulse adota arquitetura **PCI-friendly por design**:

1. **Não armazenamos dados de cartão**. Cartão é tokenizado no cliente (Stripe.js / Pagar.me Hash):
   - app cliente coleta dados via SDK oficial do gateway;
   - gateway retorna **token opaco**;
   - Pulse guarda apenas: token, bandeira, últimos 4 dígitos, nome do portador, validade (mês/ano sem o número completo).

2. **Não processamos transação direto**. Todas operações via API do gateway autorizado (Pagar.me e Stripe, ambos com PCI-DSS Level 1).

3. **Não transmitimos** PAN (Primary Account Number) em texto claro pelos nossos servidores.

## 3. Nível PCI aplicável

Por **não tocar PAN**, a Pulse se enquadra em **SAQ-A**:

> "SAQ-A applies to merchants who have **fully outsourced** all cardholder data functions to PCI-DSS validated third-party service providers and have no electronic storage, processing or transmission of cardholder data in their own systems."

**Atenção**: Pulse usa **SDK do gateway no app/web**. Se o SDK envolve coleta de dados no app Pulse (mesmo que vá direto ao gateway), pode haver enquadramento em **SAQ-A-EP** (que é mais exigente). Validar com QSA.

## 4. Validação do enquadramento (a fazer)

### 4.1. Análise por gateway
- **Stripe Elements / Payment Sheet**: enquadra em SAQ-A (a UI vem do Stripe via iframe / SDK nativo; dados não trafegam pela Pulse). **Provável**.
- **Pagar.me Tokenize SDK**: similar, SAQ-A na maioria dos casos. Confirmar.

### 4.2. Aplicabilidade ao web
No `client-web` futuro (quando implementar checkout), usar exclusivamente:
- **Stripe Elements** (iframe) ou **Pagar.me Tokenize** (não há contato com PAN no servidor);
- nunca submeter PAN para nossa API.

### 4.3. Aplicabilidade ao mobile
Mobile usa SDK Stripe/Pagar.me. Mesmo princípio. **Confirmar com QSA** se o uso de SDK nativo (`@stripe/stripe-react-native`) preserva SAQ-A.

## 5. Requisitos SAQ-A (resumo)

Mesmo no escopo reduzido, a Pulse precisa cumprir:

| Req | Resumo | Status Pulse |
|---|---|---|
| 2.1.1 | Configurações seguras (alterar defaults) | ✅ Better Auth, senhas hash; Railway hardened |
| 6.4 | Mudanças sob controle | ✅ Git + PR review |
| 8.1, 8.2 | Identificação única e autenticação forte | ✅ MFA admin via OTP |
| 8.5 | Acesso de fornecedores supervisionado | 🟨 Mapear (acesso de eng a prod) |
| 9 | Segurança física | N/A para SAQ-A (cloud) |
| 10.4 | Logs de eventos de autenticação | ✅ via Logger + SystemLog |
| 11.6 | Procedimento de resposta a incidente | 🟨 a documentar |
| 12.3 | Uso aceitável de tecnologia | 🟨 a documentar |
| 12.5 | Atribuições documentadas | 🟨 a documentar |
| 12.8 | Lista de prestadores PCI compartilhada | 🟨 [DPA Subprocessadores](../lgpd/dpa-subprocessadores.md) |
| 12.10 | Plano de resposta a incidente | 🟨 a documentar |

## 6. Itens a fazer pré-go-live

- [ ] Contratar QSA para análise formal (não obrigatório no SAQ-A mas recomendado);
- [ ] Preencher e assinar **SAQ-A** anualmente (auto-avaliação);
- [ ] Documentar plano de resposta a incidente PCI;
- [ ] Treinar time anual em segurança de cartão;
- [ ] Manter [DPA Subprocessadores](../lgpd/dpa-subprocessadores.md) atualizado;
- [ ] Confirmar que **provedores são Level 1 PCI** (Stripe ✓, Pagar.me ✓).

## 7. Itens explícitos de design para preservar PCI-friendly

**NUNCA fazer**:
- coletar número de cartão direto pelo backend Pulse;
- armazenar PAN, CVV ou track data, mesmo cifrado;
- transmitir PAN por HTTP nem por logs;
- ter funcionários acessando PAN em produção.

**SEMPRE fazer**:
- usar SDK oficial do gateway (atualizado);
- usar HTTPS em tudo (TLS 1.2+);
- isolar tokens em DB (não exportá-los em respostas que não precisem);
- logar transações pelo `transactionId` do gateway, nunca pelo PAN.

## 8. Mudanças que tirariam Pulse do SAQ-A

Acionar consulta com QSA se Pulse passar a:
- aceitar PAN em formulário web próprio (sem iframe do gateway);
- armazenar PAN ainda que cifrado;
- atuar como **adquirente** ou **subadquirente** com licença BCB;
- oferecer cartão Pulse próprio (BIN próprio);
- intermediar transações fora dos gateways atuais.

---

| Versão | Data       | Mudança principal             |
|--------|------------|-------------------------------|
| 1.0    | 2026-05-24 | Draft inicial pré-lançamento  |
