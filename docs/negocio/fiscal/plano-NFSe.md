# PLANO DE EMISSÃO DE NF-e / NFS-e — ANÁLISE TÉCNICA


Este documento analisa o desafio fiscal da Pulse — **quem emite NF para quem** —, compara 3 (três) provedores de emissão automatizada e recomenda um caminho técnico-econômico para o MVP.

---

## 1. CONTEXTO DA OPERAÇÃO

A Pulse opera como **intermediadora tecnológica** ([Contrato de Adesão](../contratos/contrato-adesao-produtor.md), Cl. 1.2). No fluxo de uma venda de ingresso:

```
Consumidor final ──paga R$ 100 (R$ 90 ingresso + R$ 10 taxa)──► Pulse (custódia)
                                                                 │
                              ◄──repassa R$ 90 em D+1 evento─────┤
Produtor ◄────────────────────────────────────────────────────────┘
```

Há, portanto, **2 (duas) operações fiscais distintas**:

| # | De → Para | Natureza | Quem deve emitir? |
|---|---|---|---|
| **A** | Produtor → Consumidor | Venda do ingresso (serviço de entretenimento / evento) | **Produtor** (NFS-e ou NF-e modelo `[VALIDAR — DEPENDE DO MUNICÍPIO E DO TIPO DE EVENTO]`) |
| **B** | Pulse → Produtor | Taxa de intermediação (serviço de plataforma tecnológica) | **Pulse** (NFS-e) |
| **C** | Pulse → Consumidor (eventual) | Taxa de conveniência repassada (modelo "taxa adicionada") | **Em análise** — ver §2 |

---

## 2. ENTIDADE EMISSORA — DECISÃO PRELIMINAR

### 2.1. Operação A — Ingresso (Produtor → Consumidor)

- **Responsabilidade**: **PRODUTOR** (Cl. 5.1, "d" do Contrato de Adesão obriga-o a emitir NF ao consumidor final).
- **Pulse não emite** essa nota, mas **deve facilitar** ao produtor: relatório de vendas, dados do comprador (quando disponíveis), comprovante de transação.
- **Risco**: muitos produtores menores **não emitem** NF hoje no mercado brasileiro de ingressos. A Pulse pode ser questionada (PROCON, MP, Receita) se for considerada solidária. **Mitigação contratual**: Cl. 5.1, "d" + Cl. 6.2 do Contrato de Adesão.
- `[VALIDAR COM ADVOGADO TRIBUTARISTA]`: o entendimento atual da Receita sobre marketplaces (Solução de Consulta COSIT 170/2018 — venda de bens) e o tratamento específico de **ingressos para evento** — Lei Geral do Esporte, Lei 14.046/2020.

### 2.2. Operação B — Taxa de intermediação (Pulse → Produtor)

- **Responsabilidade**: **PULSE**.
- **Tipo de nota**: **NFS-e** (Nota Fiscal de Serviço Eletrônica) — serviço de intermediação tecnológica.
- **Item de serviço (LC 116/2003)** — opções a validar com contador, em ordem de aderência ao modelo de negócio:
  - **`1.05` (licenciamento ou cessão de direito de uso de programas de computação)** — viável se o produtor enxergar a Pulse como SaaS licenciado;
  - **`17.12` (administração em geral, inclusive de bens e negócios de terceiros)** — viável como prestação de serviço de gestão da venda;
  - **`10.05` (agenciamento, corretagem ou intermediação de bens móveis ou imóveis, não abrangidos em outros itens ou subitens, inclusive aqueles realizados no âmbito de Bolsas de Mercadorias e Futuros, por quaisquer meios)** — interpretação mais antiga; subitem 10.02 é específico para *títulos e valores mobiliários* e **não se aplica** ao caso da Pulse.
  - **Recomendação técnica preliminar**: `1.05` para a parcela SaaS (licença) + `10.05` ou `17.12` para a parcela de intermediação. Combo emite NFS-e com itens distintos. `[CONFIRMAR COM CONTADOR]`.
- **ISS — Município de São Paulo/SP** (sede): alíquota geral 5%, com possibilidade de **2,9% a 2,5%** para serviços de TI/software conforme Lei Municipal 13.701/2003 e regulamentação SP (Decreto 50.896/2009). **Validar enquadramento exato com contador**.
- **Periodicidade**: **uma NFS-e por movimentação de repasse** (modelo simples) ou **resumo mensal por produtor** (modelo agregado). Recomendação técnica: **por movimentação**, alinhada ao `ProducerPayoutMovement`.

### 2.3. Operação C — Taxa de conveniência adicionada ao consumidor

- **Modelo atual da Pulse**: taxa de 10% **adicionada ao preço** e paga pelo consumidor (Cl. 3.1 do Contrato de Adesão, §4 de [`especificacao.md`](../../engenharia/arquitetura/payments/especificacao.md)).
- **Discussão**: do ponto de vista jurídico/fiscal, há duas leituras:
  - **(i) Tomador = produtor** — a Pulse presta serviço ao produtor, repassando o custo via cobrança casada com o ingresso. Emite NFS-e ao **produtor** (Operação B). É o tratamento mais defensável e o mais usado por concorrentes (Sympla, Eventbrite).
  - **(ii) Tomador = consumidor** — a Pulse presta serviço diretamente ao consumidor (taxa de conveniência). Exigiria emissão de NFS-e ao consumidor — milhares de notas, com CPF do comprador.
- **Recomendação técnica**: adotar **(i)** — a NF é emitida ao **produtor**, mesmo quando o valor é cobrado no checkout do consumidor. Razões: (a) reduz volume de notas por ordem de magnitude; (b) ISS recolhido na sede da Pulse (previsibilidade); (c) consistência com o modelo de "intermediação tecnológica" do Contrato.
- **Validação obrigatória**: `[CONTADOR + ADVOGADO TRIBUTARISTA] confirmar`. Há decisões de TJ-SP e Receita que vão em direções opostas.

---

## 3. COMPARATIVO DE PROVEDORES

Três provedores avaliados: **Focus NFe**, **Nuvem Fiscal** e **eNotas**. Todos suportam **NFS-e** (foco da Pulse hoje), com cobertura municipal variada.

### 3.1. Quadro-resumo

| Critério | **Focus NFe** | **Nuvem Fiscal** | **eNotas** |
|---|---|---|---|
| **NFS-e — cobertura municipal** | Muito alta (cobre **+5.000 municípios** declaradamente; padrão ABRASF + integrações específicas) | Alta (foco em padrão nacional NFS-e da RFB e padrão ABRASF; **+3.000 municípios** declaradamente) | Alta (histórico forte; **+5.000 municípios** declaradamente) |
| **Padrão nacional NFS-e (Emissor Nacional/RFB)** | Sim | **Sim — implementação destacada** | Sim |
| **NF-e (modelo 55) / NFC-e** | Sim | Sim | Sim |
| **API REST + Webhooks** | Sim | Sim, OpenAPI bem documentada | Sim |
| **SDKs / bibliotecas** | Comunidade (Node, Ruby, PHP) | Documentação oficial OpenAPI; client-gen | Documentação JSON/REST |
| **Sandbox** | Sim | Sim | Sim |
| **Preço (ordem de grandeza)** | **R$ 0,40 a R$ 1,00 por NFS-e** + mensalidade base (`[CONFIRMAR — TABELA PÚBLICA]`) | **Plano por volume**, com tier de baixa carga gratuito ou de R$ 100 a R$ 400/mês para volume MVP `[CONFIRMAR]` | **Por nota emitida**, **+** taxa de "habilitação por município" (custo recorrente quando há expansão geográfica) `[CONFIRMAR]` |
| **Suporte** | E-mail + chat | E-mail + chat + Discord/Slack `[CONFIRMAR]` | E-mail + chat |
| **Tempo médio para habilitação municipal** | 1–5 dias úteis | 1–3 dias úteis | 3–10 dias úteis (depende do município) |
| **Risco operacional** | Baixo (player consolidado, marca da Acras Tecnologia) | Baixo-médio (player mais novo, mas com tração) | Baixo (player consolidado) |

> Todos os preços e coberturas acima são **estimativas a partir de tabelas públicas** dos fornecedores e do conhecimento de mercado. **Confirmar com cada provider** antes da contratação — `[VALIDAR COM CONTADOR / PROPOSTA COMERCIAL]`.

### 3.2. Análise qualitativa

#### Focus NFe
- **Pró**: maturidade, comunidade grande, cobertura municipal historicamente a maior, documentação clara.
- **Contra**: precificação por nota pode ficar cara em volume alto; UX da API mais "legacy".

#### Nuvem Fiscal
- **Pró**: forte aposta no **Padrão Nacional NFS-e da RFB** (`https://www.gov.br/nfse`), que tende a unificar gradualmente os municípios brasileiros. API moderna, OpenAPI. Boa relação custo/benefício para MVP.
- **Contra**: player mais novo — menor base instalada que Focus/eNotas. Cobertura municipal específica (fora do Padrão Nacional) ainda em expansão.

#### eNotas
- **Pró**: consolidado, suporte robusto.
- **Contra**: cobrança por **habilitação municipal** encarece em produtos com produtores em muitos municípios (caso da Pulse). API um pouco menos moderna.

### 3.3. **Recomendação: Nuvem Fiscal** para o MVP

Justificativa:

1. **Aposta no Padrão Nacional NFS-e** alinha a Pulse com a direção regulatória (RFB tem prazo de adesão obrigatório progressivo até 2027 — `[VALIDAR CRONOGRAMA RFB]`). Reduz risco de retrabalho quando municípios migrarem.
2. **OpenAPI + documentação moderna** reduz tempo de integração (estimativa: **5 a 8 dias úteis** para integração inicial).
3. **Custo previsível** (plano por volume vs. cobrança por nota) — favorece o MVP de baixo volume.
4. **Compatibilidade** com necessidade futura de NF-e modelo 55 e NFC-e, caso a Pulse evolua para venda direta de produtos.

**Risco a monitorar**: cobertura municipal em casos de **produtores fora da sede da Pulse**. Como a NFS-e da Pulse (Operação B) é emitida **na sede da Pulse**, e a Operação A é responsabilidade do produtor, essa exposição é **baixa para o ano 1**.

**Plano de contingência**: manter contrato avaliativo simultâneo com Focus NFe (POC paralela) caso a cobertura efetiva da Nuvem Fiscal não comporte algum município crítico.

---

## 4. FLUXO TÉCNICO DE EMISSÃO (OPERAÇÃO B)

### 4.1. Diagrama

```
[Webhook PSP: payment.confirmed]                  ← Pagar.me / Stripe
            │
            ▼
[Backend: ConfirmPaymentUseCase] ── grava Transaction PAID
            │
            ▼
[Backend: ReleaseRetainedPayoutsUseCase] (D+1 evento)
            │
            ▼
[Backend: IssuePulseFeeInvoiceUseCase]  ──► [Provider NFS-e API]
            │                                        │
            │                                        ▼
            │                              [Município: SEFIN/ISS]
            │                                        │
            │                                        ▼
            ◄──── webhook NFS-e autorizada ──────────┘
            │
            ▼
[Backend: armazena XML + PDF/DANFSe em R2; vincula a ProducerPayoutMovement]
            │
            ▼
[Brevo: e-mail ao PRODUTOR com link da NFS-e]
```

### 4.2. Passos detalhados

| # | Passo | Status |
|---|---|---|
| 1 | Webhook de pagamento confirma `Transaction.status = PAID` | **[TÉCNICO PRONTO]** — `ConfirmPaymentUseCase` |
| 2 | Job de repasse (`ReleaseRetainedPayoutsUseCase`) muda `Event.payoutStatus` para `AVAILABLE` em D+1 | **[TÉCNICO PRONTO]** |
| 3 | Novo use case `IssuePulseFeeInvoiceUseCase` é disparado por evento `PayoutAvailable` | **[A IMPLEMENTAR]** |
| 4 | Use case consulta `ProducerPayoutMovement` agregando taxas Pulse do período | **[A IMPLEMENTAR]** |
| 5 | Chamada à API do provider NFS-e com payload: tomador (produtor), prestador (Pulse), item de serviço (LC 116), valor, descrição | **[BLOQUEADO POR REGISTRO MUNICIPAL E CONTRATAÇÃO DO PROVIDER]** |
| 6 | Provider envia XML ao município, recebe **número de protocolo** ou **número da NFS-e** | **[BLOQUEADO]** |
| 7 | Webhook do provider retorna ao backend Pulse com status (autorizada / rejeitada / cancelada) | **[A IMPLEMENTAR]** |
| 8 | Backend armazena XML + PDF (DANFSe) em **Cloudflare R2** sob chave `nfse/<producerId>/<year>/<month>/<nfseNumber>.{xml,pdf}` | **[A IMPLEMENTAR]** |
| 9 | Tabela nova `Invoice` (modelo Prisma) liga NFS-e a `ProducerPayoutMovement`, `eventId`, `producerId`, `amountCents`, `gross`, `iss`, `status` | **[A IMPLEMENTAR — MIGRAÇÃO PRISMA]** |
| 10 | E-mail transacional via Brevo ao produtor com PDF anexo ou link público assinado | **[A IMPLEMENTAR]** |
| 11 | Painel do produtor (Pulse Pro) lista NFS-e emitidas, com download | **[A IMPLEMENTAR — FRONTEND]** |
| 12 | Tratamento de **rejeições** (item de serviço errado, dados de tomador incorretos): retry com backoff + alerta operacional | **[A IMPLEMENTAR]** |

### 4.3. Idempotência

- Cada `ProducerPayoutMovement` pode gerar **no máximo 1 NFS-e**.
- `Invoice.payoutMovementId` é `UNIQUE`.
- Header `Idempotency-Key` na chamada ao provider, derivado do `payoutMovementId`.

### 4.4. Cancelamento de NFS-e

- Reembolso integral ao consumidor (Operação A) **não cancela** a NFS-e Pulse → Produtor automaticamente — é a Pulse que decide se devolverá a taxa.
- Quando devolve, criar **NFS-e de cancelamento/substituição** (regras municipais variam) — passo `[BLOQUEADO POR REGRA MUNICIPAL]`.

---

## 5. PRÉ-REQUISITOS FISCAIS PARA O GO-LIVE

| Item | Status | Bloqueador? |
|---|---|---|
| **CNPJ** da Pulse com atividade compatível (CNAE — provavelmente **6311-9/00** ou **6202-3/00**) | `[VERIFICAR CONTRATO SOCIAL]` | **🔴 Sim** |
| **Inscrição municipal** no município sede | `[VERIFICAR]` | **🔴 Sim** |
| **Certificado digital A1** (e-CNPJ ICP-Brasil) — necessário para assinar NFS-e em muitos municípios e padrão nacional | `[A EMITIR]` | **🔴 Sim** |
| **Regime tributário** definido (Simples Nacional vs. Lucro Presumido vs. Real) | Análise em [`regime-tributario-recomendado.md`](./regime-tributario-recomendado.md) | **🔴 Sim** |
| **Item de serviço LC 116/2003** confirmado | `[VALIDAR COM CONTADOR]` | **🔴 Sim** |
| **Alíquota ISS** do município confirmada | `[VALIDAR]` | **🔴 Sim** |
| **Contrato com Nuvem Fiscal** (ou alternativa) | `[A CONTRATAR]` | **🔴 Sim** |
| **Retenções** sobre o repasse (ISS retido na fonte, INSS, IRRF, PIS, COFINS) | Análise em [`retencoes-no-repasse.md`](./retencoes-no-repasse.md) | Amarelo |

---

## 6. CUSTO ESTIMADO (MVP — ANO 1)

`[ESTIMATIVA — CONFIRMAR EM PROPOSTA COMERCIAL]`

| Item | Custo estimado |
|---|---|
| Nuvem Fiscal — plano por volume (até 1.000 NFS-e/mês) | R$ 100 a R$ 400/mês |
| Certificado digital A1 (renovação anual) | R$ 200 a R$ 400/ano |
| Inscrição municipal | Variável por município (custo único / taxas anuais) |
| Honorários contábeis (mensal) | `[A CONTRATAR]` |
| **Total estimado ano 1** | `[R$ 5.000 – R$ 15.000]` (excluindo ISS recolhido) |

ISS recolhido sobre as taxas Pulse (operação B):

- Premissa: 10.000 ingressos vendidos × R$ 9 taxa média = **R$ 90.000 de receita Pulse/mês**;
- Alíquota ISS 5% (teto LC 116) = **R$ 4.500/mês** de ISS recolhido — `[CONFIRMAR ALÍQUOTA DA SEDE]`.

---

## 7. PRÓXIMOS PASSOS

1. **Contador** valida: regime tributário, item de serviço LC 116, município, alíquota ISS, retenções sobre repasse, tratamento da Operação C (§2.3).
2. **Advogado tributarista** valida: enquadramento da Pulse como intermediadora (jurisprudência STJ e Receita), risco de solidariedade pela NF do ingresso (Operação A), exposição em ICMS/ISS estaduais e municipais.
3. **POC técnica** com Nuvem Fiscal sandbox — `[ATRIBUIR ENG]`.
4. **POC paralela** com Focus NFe (contingência) — opcional.
5. Definir **modelo Prisma `Invoice`** + migrações + use cases (§4.2).
6. Definir **painel** no Pulse Pro para o produtor baixar suas NFS-e.
7. Decidir **periodicidade** (por movimentação vs. mensal agregada).
8. Atualizar [`produto/regras-negocio/payout-policies.md`](../../produto/regras-negocio/payout-policies.md) com o ponto de emissão de NFS-e dentro do fluxo de payout.

---

## 8. REFERÊNCIAS CRUZADAS

| Documento | Conteúdo |
|---|---|
| [Contrato de Adesão — Cl. 5.1, "d"](../contratos/contrato-adesao-produtor.md) | Obrigação do produtor de emitir NF ao consumidor |
| [`regime-tributario-recomendado.md`](./regime-tributario-recomendado.md) | Análise de regime (Simples / LP / Lucro Real) |
| [`retencoes-no-repasse.md`](./retencoes-no-repasse.md) | ISS retido, INSS, IRRF, PIS, COFINS sobre repasse |
| [`produto/regras-negocio/payout-policies.md`](../../produto/regras-negocio/payout-policies.md) | Ciclo `RETAINED` → `AVAILABLE` → `PAID_OUT` |
| [`engenharia/arquitetura/payments/especificacao.md`](../../engenharia/arquitetura/payments/especificacao.md) | Modelo de checkout e taxas |

---

| Versão | Data       | Mudança principal                                |
|--------|------------|--------------------------------------------------|
| 1.0    | 2026-05-24 | Draft inicial — recomendação Nuvem Fiscal        |
