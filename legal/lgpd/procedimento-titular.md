# PROCEDIMENTO DE ATENDIMENTO AOS DIREITOS DO TITULAR — ART. 18 LGPD

**Versão:** 1.0 — DRAFT TÉCNICO (não revisado por advogado)
**Última atualização:** 2026-05-24

> ⚠️ Este documento é um **draft técnico** preparado por engenharia/produto a partir do funcionamento real da plataforma. **Deve ser revisado por advogado(a) habilitado(a) e/ou DPO antes de qualquer publicação.** Itens entre `[colchetes em maiúsculas]` precisam ser preenchidos/decididos pela empresa antes da publicação.

Este documento descreve como a PULSE atende solicitações dos titulares previstas no **Art. 18 da Lei 13.709/2018 (LGPD)**, definindo canais, prazos, procedimento interno e templates de resposta.

---

## 1. DIREITOS COBERTOS (ART. 18 LGPD)

Conforme Art. 18, o titular pode obter do controlador, a qualquer momento e mediante requisição:

| Inciso | Direito | Implementação Pulse |
|---|---|---|
| I | **Confirmação** da existência de tratamento | Resposta automatizada + sumário no portal `pulse.com.br/privacidade/meus-dados` |
| II | **Acesso** aos dados | Export ZIP com JSON/PDF de todos os dados pessoais |
| III | **Correção** de dados incompletos, inexatos ou desatualizados | Self-service no app (perfil) ou via DPO |
| IV | **Anonimização, bloqueio ou eliminação** de dados desnecessários, excessivos ou tratados em desconformidade | Análise caso a caso; quando aplicável, soft-delete (`deletedAt`) + purge programado |
| V | **Portabilidade** a outro fornecedor | Export estruturado (JSON), formato aberto |
| VI | **Eliminação** dos dados tratados com consentimento (Art. 8º, §5º) | Self-service ou via DPO; resguardadas as hipóteses do Art. 16 |
| VII | Informação sobre **entidades** com as quais a Pulse compartilhou | Lista pública: [`dpa-subprocessadores.md`](./dpa-subprocessadores.md) + relação personalizada por solicitação |
| VIII | Informação sobre **possibilidade de não fornecer consentimento** e consequências | Disclosed nos formulários de coleta e no banner de cookies |
| IX | **Revogação do consentimento** | Self-service (perfil → "Privacidade") ou via DPO |

E ainda:

- **Art. 20** — revisão de decisões automatizadas (a Pulse hoje **não** executa decisões 100% automatizadas com efeitos jurídicos relevantes; bloqueios anti-fraude têm revisão humana — ver §6 abaixo).
- **Art. 19** — direito de petição contra o controlador perante a ANPD (informação prestada na resposta a todo titular).

---

## 2. CANAIS OFICIAIS

### 2.1. Canais primários

| Canal | Endereço | Tempo de triagem |
|---|---|---|
| E-mail do Encarregado | `dpo@pulse.com.br` | 1 dia útil |
| Formulário web | `https://pulse.com.br/privacidade/solicitacao` | 1 dia útil (registro automático) |
| Self-service (autenticado) | `https://pulse.com.br/conta/privacidade` | Imediato (export e exclusão de consentimento) |

### 2.2. Canais secundários (aceitos mas redirecionados)

- Telefone / chat de suporte: o atendente registra o pedido no sistema interno e encaminha ao Encarregado em até 1 dia útil.
- Carta física para a sede `[ENDEREÇO COMPLETO]`: digitalizada e tratada como qualquer outro pedido.

### 2.3. Identificação do canal nos documentos

Os canais devem aparecer **expressamente** em:

- [Política de Privacidade](../politicas/politica-privacidade.md);
- [Termos de Uso](../contratos/termos-de-uso-cliente.md);
- Rodapé do site;
- Tela "Privacidade" do app.

---

## 3. PRAZOS

3.1. **Confirmação de tratamento e acesso a dados** (Art. 18, I e II): **15 (quinze) dias** corridos a contar da requisição (Art. 19, §1º LGPD).

3.2. **Demais direitos** (correção, eliminação, portabilidade, etc.): a LGPD não fixa prazo expresso; a Pulse adota o mesmo prazo de **15 dias** corridos como referência.

3.3. **Prorrogação**: o prazo pode ser prorrogado por **mais 15 dias**, mediante justificativa fundamentada (complexidade do pedido, volume, validações de identidade). A prorrogação é **comunicada por escrito ao titular antes do término do prazo original**.

3.4. **Pedidos urgentes** (ex.: vazamento, identidade comprometida, evento iminente): tratamento prioritário em até **72 horas**, sem prejuízo da resposta formal posterior.

3.5. **Pedidos inadmissíveis** (titular não identificado, pedido vago, requisitos suficientes não atendidos): comunicar negativa fundamentada em até 15 dias, indicando o que falta para reapresentação.

---

## 4. AUTENTICAÇÃO DO TITULAR

4.1. **Princípio**: a Pulse **não pode entregar dados** a quem não comprove ser o titular (ou seu representante legal). Caso contrário, criaria-se vetor de fraude.

4.2. **Para usuário autenticado** (logado na Plataforma): identificação considerada satisfeita pelo próprio login (Better Auth + OTP). Pedidos via self-service usam essa autenticação.

4.3. **Para pedidos por e-mail / formulário**:

- (a) e-mail deve coincidir com o e-mail cadastrado em `User.email`;
- (b) solicitamos confirmação por **link de validação** enviado ao e-mail cadastrado;
- (c) em caso de dúvida razoável, solicitamos **prova adicional** (foto do documento, selfie comparada à biometria armazenada, ou pergunta de verificação com base em transação recente — ex.: último número de pedido).

4.4. **Para representante legal**: além da prova de identidade do titular, exigir procuração com poderes específicos para LGPD ou documento equivalente (curatela, tutela, inventariante).

4.5. **Para titular falecido**: pedido aceito de herdeiros mediante prova (certidão de óbito + documento de herdeiro). Em conformidade com Art. 18 LGPD + entendimento doutrinário sobre direitos da personalidade post mortem.

4.6. **Não cobrar** pela atendimento (Art. 18, §5º — gratuito).

---

## 5. FLUXO INTERNO

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Recepção (DPO ou suporte → triagem em 1 dia útil)           │
│  2. Autenticação do titular (§4)                                 │
│  3. Classificação (qual inciso do Art. 18; urgência)             │
│  4. Coleta de dados (consulta cross-system: backend, R2, Brevo,  │
│     Sentry, PSP, pulse-face — quando aplicável)                  │
│  5. Análise jurídica (DPO valida hipóteses do Art. 16)           │
│  6. Execução técnica (export, anonimização, exclusão)            │
│  7. Resposta formal ao titular (e-mail + log em AuditLog)        │
│  8. Registro em `LGPDRequest` (tabela interna — §7)              │
└─────────────────────────────────────────────────────────────────┘
```

5.1. **Responsabilidades**:

| Função | Responsabilidade |
|---|---|
| Encarregado (DPO) | Decisão jurídica final, comunicação com o titular, interface com ANPD |
| Suporte (N1) | Triagem inicial, identificação do canal correto |
| Engenharia (`[SQUAD PRIVACY]` ou tech lead on-call) | Execução técnica (export, purge, anonimização) |
| Jurídico externo | Casos complexos (litígios, ordem judicial) |

5.2. **Cada execução técnica** registra entrada em `AuditLog` (`action` = `LGPD_DSR_<INCISO>`, `entity` = `User`, `entityId` = `userId`, `newData` = JSON com tipo do pedido e timestamp).

---

## 6. ESPECIFICIDADES POR DIREITO

### 6.1. Confirmação (Art. 18, I) e Acesso (Art. 18, II)

- Resposta inclui:
  - confirmação do tratamento;
  - finalidades específicas (referenciando [`ROPA.md`](./ROPA.md));
  - categorias de dados tratados;
  - bases legais (referenciando [`base-legal-por-tratamento.md`](./base-legal-por-tratamento.md));
  - terceiros com quem houve compartilhamento (referenciando [`dpa-subprocessadores.md`](./dpa-subprocessadores.md));
  - prazo de retenção;
  - canais para os demais direitos.
- Formato: PDF (relatório) + ZIP com JSON dos dados brutos.

### 6.2. Correção (Art. 18, III)

- Maior parte resolvido por **self-service** no perfil.
- Para dados imutáveis (CPF, biometria): manual via DPO, com prova nova do dado correto.

### 6.3. Anonimização / Eliminação (Art. 18, IV e VI)

- **Hipóteses do Art. 16** em que a Pulse **pode reter** mesmo após pedido:
  - cumprimento de obrigação legal/regulatória (fiscal, MCI, antilavagem);
  - estudo por órgão de pesquisa (não se aplica);
  - transferência a terceiro com bases legais próprias (somente após anonimização);
  - uso exclusivo do controlador, vedado acesso de terceiros, e desde que anonimizados (Art. 16, IV).
- **Procedimento técnico**:
  - **Soft-delete** imediato: `User.deletedAt = now()`, sessões invalidadas, biometria zerada (`DELETE /biometry` → `biometricVector=null`, `biometricHash=null`), notificações desativadas.
  - **Anonimização** dos campos de PII mantidos por obrigação fiscal (substituir CPF por hash, e-mail por `deleted+<userId>@pulse.invalid`, nome por "Usuário anonimizado").
  - **Purge** dos arquivos KYC e de imagens: após o prazo fiscal aplicável (5 a 10 anos), purge físico em R2.
  - Pedido encaminhado aos subprocessadores que possuam cópia (Brevo "delete contact", Sentry "delete user", PSP — ressalvado o que cada um precisa reter por exigência regulatória).
- Resposta ao titular indica **quais dados foram eliminados imediatamente** e **quais permanecem retidos por obrigação legal**, com prazo previsto de purge.

### 6.4. Portabilidade (Art. 18, V)

- Export **JSON estruturado** com schema documentado. Inclui: perfil, lista de eventos comprados, ingressos, transações (sem PAN), preferências, consentimentos.
- Não inclui dados de outros titulares (ex.: lista de presença do produtor) — Art. 18, II in fine.

### 6.5. Revogação do consentimento (Art. 18, IX)

- **Marketing**: opt-out imediato (link em todo e-mail) + bloqueio do perfil em Brevo.
- **Biometria**: `DELETE /biometry` zera o vetor; galeria de eventos em curso é regenerada sem o titular.
- **Cookies analíticos**: revisão no banner `pulse.com.br/cookies`.
- Lembrar o titular de que **a revogação tem efeitos prospectivos** (Art. 8º, §5º — não desfaz tratamentos anteriores legítimos).

### 6.6. Revisão de decisões automatizadas (Art. 20)

- Bloqueios anti-fraude e bloqueio de KYC envolvem **revisão humana obrigatória** antes de produzir efeito permanente sobre o titular.
- Em caso de bloqueio por fraude, o titular recebe explicação resumida da razão (sem detalhes que ajudem a contornar antifraude — Art. 20, §2º) e canal para contestar.

---

## 7. REGISTRO INTERNO

7.1. Tabela `LGPDRequest` (a ser criada — `[BACKLOG]`):

| Campo | Tipo |
|---|---|
| `id` | UUID |
| `userId` | UUID (nullable se titular não identificado) |
| `channel` | enum (`EMAIL`, `FORM`, `SELF_SERVICE`, `SUPPORT`, `LETTER`) |
| `inciso` | enum (`ART18_I` … `ART18_IX`, `ART20`) |
| `receivedAt` | timestamp |
| `dueAt` | timestamp (= `receivedAt + 15d`) |
| `extendedAt` | timestamp nullable |
| `closedAt` | timestamp |
| `outcome` | enum (`ATENDIDO`, `PARCIAL`, `RECUSADO`, `REDIRECIONADO`) |
| `summary` | texto |
| `handlerUserId` | UUID (DPO ou colaborador) |

7.2. Métricas mensais reportadas ao DPO:

- volume por inciso;
- tempo médio de resposta;
- % atendido no prazo;
- pedidos recusados (com justificativa agregada).

---

## 8. TEMPLATES DE RESPOSTA

### 8.1. Confirmação de recebimento (envio em até 1 dia útil)

> **Assunto**: [Pulse | LGPD] Recebemos sua solicitação — protocolo `<ID>`
>
> Olá `<nome>`,
>
> Recebemos sua solicitação relativa aos seus direitos como titular de dados pessoais (Art. 18, LGPD). Seu protocolo é **`<ID>`** e nosso prazo para resposta é até **`<dueAt>`** (15 dias corridos), prorrogável por igual período mediante justificativa.
>
> Para que possamos prosseguir, confirme sua identidade clicando no link abaixo (válido por 7 dias):
>
> `<https://pulse.com.br/privacidade/confirmar/<token>>`
>
> Atenciosamente,
> Encarregado de Dados Pessoais (DPO) — Pulse
> `dpo@pulse.com.br`

### 8.2. Resposta a pedido de acesso (Art. 18, II)

> **Assunto**: [Pulse | LGPD] Acesso aos seus dados — protocolo `<ID>`
>
> Olá `<nome>`,
>
> Em atenção à sua solicitação, segue em anexo:
>
> 1. **Relatório PDF** com sumário dos dados pessoais que tratamos a seu respeito, finalidades, bases legais, prazo de retenção e compartilhamentos;
> 2. **Arquivo JSON** contendo os dados estruturados, em formato aberto, conforme Art. 18, V LGPD.
>
> Caso queira exercer outros direitos (correção, eliminação, portabilidade, revogação de consentimento), responda a este e-mail ou utilize `https://pulse.com.br/privacidade/solicitacao`.
>
> Você também pode peticionar diretamente à Autoridade Nacional de Proteção de Dados (ANPD) — `https://www.gov.br/anpd`.
>
> Atenciosamente,
> Encarregado de Dados Pessoais (DPO) — Pulse

### 8.3. Resposta a pedido de eliminação (Art. 18, VI)

> **Assunto**: [Pulse | LGPD] Eliminação dos seus dados — protocolo `<ID>`
>
> Olá `<nome>`,
>
> Conforme sua solicitação, eliminamos imediatamente os seguintes dados:
>
> - `<lista>`
>
> Os dados abaixo permanecem retidos por **obrigação legal**, conforme Art. 16, I LGPD:
>
> - `<lista — ex.: registros fiscais, logs MCI, registros de transação>`
>
> Esses dados serão **purgados** automaticamente após o término dos prazos legais aplicáveis (em geral, 5 a 10 anos a contar do tratamento). Após o purge, não restará nenhum dado pessoal seu sob nosso controle.
>
> Sua conta foi **desativada** e os subprocessadores que possuíam cópia foram notificados.

### 8.4. Negativa fundamentada

> **Assunto**: [Pulse | LGPD] Resposta à sua solicitação — protocolo `<ID>`
>
> Olá `<nome>`,
>
> Analisamos sua solicitação e, após avaliação, **não podemos atendê-la** integralmente, pelos seguintes motivos:
>
> `<fundamentação — ex.: dado não localizado; titular não identificado; conflito com obrigação legal>`
>
> Você pode (a) reapresentar o pedido com informações adicionais; ou (b) peticionar à ANPD — `https://www.gov.br/anpd`.

---

## 9. INTERFACE COM A ANPD

9.1. Em caso de petição do titular à ANPD, o DPO responde formalmente em **até 10 dias úteis** após a notificação.

9.2. Em caso de **incidente** com dados pessoais (Art. 48 LGPD), o procedimento próprio está em `[RIPD-geral.md / incidente-resposta.md — A CRIAR]`. A comunicação à ANPD é feita em **prazo razoável** (sugestão ANPD: até **2 dias úteis** após a tomada de ciência).

---

| Versão | Data       | Mudança principal                  |
|--------|------------|------------------------------------|
| 1.0    | 2026-05-24 | Draft inicial — fluxo Art. 18      |
