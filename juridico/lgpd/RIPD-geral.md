# RIPD — Relatório de Impacto à Proteção de Dados Pessoais (Geral, Pulse)

**Versão:** 1.0 — DRAFT TÉCNICO
**Última atualização:** 2026-05-24

> ⚠️ Draft técnico — revisar com DPO/advogado. Esta análise é o ponto de partida; refinar com base em incidentes e mudanças do produto.

> Para a análise específica de **biometria facial**, ver [`produto/biometria/lgpd-security.md`](../../produto/biometria/lgpd-security.md), que já está em estado avançado.

## 1. Sumário executivo

Este documento avalia os **riscos à proteção de dados pessoais** decorrentes do funcionamento integral da plataforma Pulse e identifica medidas mitigatórias.

**Resultado geral da avaliação**: RISCO **MODERADO** após mitigantes implementadas. Aspectos críticos:
- (a) tratamento de **CPF, dados bancários e KYC** de produtores;
- (b) **biometria facial** (avaliação separada e detalhada em doc próprio);
- (c) **dependência de subprocessadores** internacionais;
- (d) **dados de crianças e adolescentes** indiretamente (eventos com classificação 16/18+ podem ter participantes mais jovens com autorização).

## 2. Escopo

| Item | Descrição |
|---|---|
| Controlador | Pulse (`Jhonatan Vitor Lopes Camargo Consultoria em Tecnologia da Informação LTDA`) |
| Atividade avaliada | Operação integral da Plataforma Pulse (cadastro, ingressos, biometria, pagamentos, comunicação, suporte) |
| Categorias de dados | Identificação, contato, financeiros, biométricos sensíveis, logs técnicos |
| Volume estimado | `[ESTIMATIVA — ex: 100k-500k titulares no primeiro ano]` |
| Subprocessadores | Pagar.me, Stripe, Brevo, Railway, R2, Upstash, Sentry, Pulse-face self-hosted |
| Transferência internacional | Sim (EUA, UE) |

## 3. Necessidade e proporcionalidade

| Tratamento | Necessário? | Justificativa |
|---|---|---|
| Nome + e-mail + CPF | SIM | Identificação obrigatória para emissão de ingresso e prevenção a fraude |
| Telefone | SIM | OTP de segurança e comunicação transacional |
| Endereço (cliente) | NÃO ESSENCIAL | Coletado apenas em casos específicos (entrega física, evento com obrigação fiscal); minimizar |
| KYC do produtor | SIM | Obrigação regulatória (sub-adquirência), prevenção a fraude, base BC |
| Biometria facial | NECESSÁRIA SE OPTADA | Opt-in expresso; alternativa por QR mantém serviço acessível |
| Geolocalização aproximada | NÃO ESSENCIAL | Coletada com consentimento, melhora UX (eventos próximos); revogável |
| Logs técnicos | SIM | Cumprimento Marco Civil + segurança |

**Conclusão**: a coleta é adequada ao princípio da necessidade (Art. 6º, III LGPD). Endereço do cliente foi marcado para minimização.

## 4. Riscos identificados e mitigantes

### 4.1. Vazamento de credenciais (login compromised)
- **Probabilidade**: Média
- **Impacto**: Alto (acesso à conta, possível fraude financeira)
- **Mitigantes**:
   - senhas hasheadas com Better Auth (argon2id);
   - hash de tokens de sessão em DB ([backlog tem M11 explícito](../../backlog/session-token-hashing.md));
   - OTP por e-mail para operações sensíveis;
   - rate-limit nas rotas de login (Upstash);
   - 2FA TOTP para Pulse Admin.
- **Risco residual**: Baixo.

### 4.2. Exposição de KYC (documentos)
- **Probabilidade**: Baixa
- **Impacto**: Muito alto (identidade pode ser usada para fraude em larga escala)
- **Mitigantes**:
   - documentos armazenados em **bucket privado R2** (acesso só via assinatura);
   - acesso restrito a admins com role específica;
   - audit log de toda visualização (`producer_kyc_document_audit`);
   - **PII em repouso planejada**: criptografar campos CPF/CNPJ/bancários (primitivas prontas — ver [Trilha A A7](../../operacoes/plano-lancamento-tecnico.md#a7)).
- **Risco residual**: Médio (até PII em repouso ser aplicada ao schema).

### 4.3. Vazamento de biometria facial
- **Probabilidade**: Muito baixa
- **Impacto**: Catastrófico (dado biométrico não pode ser "trocado")
- **Mitigantes**: ver [LGPD Biometria](../../produto/biometria/lgpd-security.md). Inclui AES-256-GCM, retenção limitada, audit logs.
- **Risco residual**: Baixo.

### 4.4. Fraude financeira (cartão de crédito)
- **Probabilidade**: Média
- **Impacto**: Alto (perda financeira + chargeback custos)
- **Mitigantes**:
   - PCI-DSS scope reduzido (tokenização client-side);
   - rate-limit no checkout;
   - **idempotency-key** (Trilha A A2, implementado) previne cobrança duplicada;
   - **3DS2** planejado mas ainda não implementado — risco residual maior aqui.
- **Risco residual**: Médio.

### 4.5. Subprocessador comprometido
- **Probabilidade**: Baixa (varia por provider)
- **Impacto**: Alto
- **Mitigantes**:
   - escolha de providers com SOC 2 / ISO 27001 / DPA;
   - princípio do menor privilégio (token R2 só pode escrever em 1 bucket; Stripe scope mínimo);
   - monitoramento de incidentes públicos dos providers.
- **Risco residual**: Médio. Plano de contingência: trocar de provider com plano B documentado.

### 4.6. Erro humano de admin (acesso indevido)
- **Probabilidade**: Média
- **Impacto**: Médio
- **Mitigantes**:
   - RBAC granular;
   - audit log;
   - treinamento e termo de confidencialidade interna;
   - revisão periódica de acessos.
- **Risco residual**: Baixo-Médio.

### 4.7. Não-atendimento a direitos do titular
- **Probabilidade**: Média (especialmente no início)
- **Impacto**: Médio (reputacional + sanções ANPD)
- **Mitigantes**:
   - [Procedimento do Titular](procedimento-titular.md) documentado;
   - DPO designado com SLA;
   - canal `dpo@pulse.com.br` divulgado.
- **Risco residual**: Baixo após DPO operacional.

### 4.8. Comunicação de marketing sem consentimento
- **Probabilidade**: Baixa
- **Impacto**: Médio (multa + reclamação)
- **Mitigantes**:
   - opt-in explícito;
   - mecanismo de descadastro em **todo** e-mail (Brevo gerencia);
   - segregação técnica entre lista transacional e marketing.
- **Risco residual**: Baixo.

### 4.9. Compartilhamento indevido com produtor
- **Probabilidade**: Baixa
- **Impacto**: Médio
- **Mitigantes**:
   - Pulse compartilha apenas dados necessários (lista de presença + flag biometria);
   - Contrato com produtor impõe LGPD ([Cláusula 8 do contrato](../contratos/contrato-adesao-produtor.md));
   - produtor é controlador autônomo dos dados que recebe.
- **Risco residual**: Baixo.

### 4.10. Dados de menores
- **Probabilidade**: Média (eventos para 16+ acontecem)
- **Impacto**: Alto (proteção integral pela ECA)
- **Mitigantes**:
   - cadastro só com 18+ (Termos de Uso);
   - menores compram via responsáveis;
   - eventos com classificação adequada exibida no catálogo.
- **Risco residual**: Médio. Monitorar e refinar.

## 5. Matriz de risco

| Risco | Prob | Impacto | Residual |
|---|---|---|---|
| Vazamento credenciais | Média | Alto | Baixo |
| Exposição KYC | Baixa | Muito alto | Médio (até A7) |
| Biometria | Muito baixa | Catastrófico | Baixo |
| Fraude cartão | Média | Alto | Médio (até 3DS2) |
| Subprocessador | Baixa | Alto | Médio |
| Erro admin | Média | Médio | Baixo-Médio |
| Não atendimento titular | Média | Médio | Baixo |
| Marketing s/ consent | Baixa | Médio | Baixo |
| Compartilhamento produtor | Baixa | Médio | Baixo |
| Dados menores | Média | Alto | Médio |

## 6. Plano de tratamento de riscos residuais

| Ação | Owner | Prazo |
|---|---|---|
| Aplicar criptografia PII no schema (A7 fase 2) | Eng + DPO | Pré-go-live |
| Implementar 3DS2 no checkout cartão | Eng | Pós-go-live MVP |
| Criar runbook de incidente de segurança | DPO + Ops | Antes do go-live |
| Treinamento LGPD time interno (anual) | DPO | Recorrente |
| Auditoria externa de segurança (pentest) | DPO + Eng | Anual |
| Revisão deste RIPD | DPO | Anual ou em mudança material |

## 7. Comunicação de incidente (Art. 48 LGPD)

Em caso de incidente que possa acarretar **risco ou dano relevante**:

1. **Detecção** (Sentry, logs, denúncia, ouvinte externo).
2. **Contenção imediata** (rotacionar creds, isolar serviço).
3. **Avaliação** (escopo, dados afetados, número de titulares).
4. **Comunicação à ANPD** em até **3 (três) dias úteis** contados do conhecimento do incidente, conforme **Resolução CD/ANPD nº 15/2024**, art. 5º.
5. **Comunicação aos titulares afetados** com:
   - descrição do incidente;
   - dados envolvidos;
   - medidas tomadas;
   - canal para mais informações.
6. **Pós-mortem técnico** (RCA, ações preventivas).
7. **Registro** no DPO para histórico.

Template detalhado em `operacoes/incident-response-playbook.md` (a criar).

---

| Versão | Data       | Mudança principal             |
|--------|------------|-------------------------------|
| 1.0    | 2026-05-24 | Draft inicial pré-lançamento  |
