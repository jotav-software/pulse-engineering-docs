# Análise: Regime Tributário Recomendado para a Pulse


## 1. Contexto

A Pulse é uma plataforma de tecnologia (marketplace de ingressos) que:
- intermedeia venda B2C de ingressos (consumidor compra; produtor vende);
- cobra **taxa de intermediação/conveniência** (modelo principal: adicionada ao preço, paga pelo consumidor);
- segura valores em custódia até liberar para o produtor (D+1 após evento);
- atua nacionalmente; sede `São Paulo/SP`.

O ponto crítico fiscal é: **qual é a base tributável da Pulse?**
- **Resposta funcional**: a Pulse fatura **a taxa de intermediação** (sua receita própria), e o **valor cheio do ingresso** transita por sua custódia mas é receita do produtor.

## 2. CNAEs aplicáveis

CNAEs candidatos (verificar com contador):

| CNAE | Descrição | Comentário |
|---|---|---|
| **63.19-4-00** | Portais, provedores de conteúdo e outros serviços de informação na internet | Boa cobertura para a operação Pulse |
| **62.04-0-00** | Consultoria em tecnologia da informação | Acessório (não-principal) |
| **77.39-0-99** | Aluguel de outras máquinas e equipamentos comerciais não especificados | Não cabe |
| **82.99-7-99** | Outras atividades de serviços prestados principalmente às empresas não especificadas | Possível complementar |
| **79.90-2-00** | Serviços de reservas e outros serviços de turismo não especificados | Pode caber por analogia a ticketing |

**Recomendação inicial**: CNAE primário **63.19-4-00**, secundário **62.04-0-00** ou **79.90-2-00**, a ser validado com contador.

## 3. Comparativo de regimes tributários

### 3.1. Simples Nacional

**Aplicável a**: empresas com faturamento até **R$ 4,8 mi/ano**.
**Anexo provável**: III ou V (depende do peso da folha de pagamento — fator R).
**Alíquota efetiva**: **6% a 19,5%** sobre receita bruta, conforme faixa e anexo.

**Prós**:
- alíquota inicial baixa;
- unifica IRPJ, CSLL, PIS, COFINS, ISS, ICMS, CPP, IPI;
- menos burocracia (DAS único);
- elegibilidade clara nas fases iniciais.

**Contras**:
- teto pode ficar pequeno rapidamente em ticketing (1 evento médio = R$ 50-500 mi de **valor transacionado** — mas a base tributável é só a taxa);
- **atenção**: se IRPJ for sobre receita bruta toda (incluindo o valor em custódia), o teto estoura. Daí a importância de **estruturar contabilmente** a receita do produtor como passivo/repasse, não como receita Pulse;
- nem todos os CNAEs são compatíveis (verificar Lei Complementar 123/2006 anexos);
- **fator R** (folha de pagamento ≥ 28% do faturamento → Anexo III com alíquota menor) pode mover muito a economia.

**Quando faz sentido**: nos **primeiros 12-18 meses** de operação enquanto o GMV cresce, **se** o contador conseguir estruturar a receita da Pulse como apenas a taxa.

### 3.2. Lucro Presumido

**Aplicável a**: faturamento até **R$ 78 mi/ano**.
**Presunção** para serviços de TI/marketplace: **32% do faturamento** como lucro presumido (variável conforme atividade).
**Tributos**:
- IRPJ: **15% sobre presumido (= 4,8% efetivo)** + adicional 10% acima de R$ 20k/mês de lucro presumido;
- CSLL: **9% sobre presumido (= 2,88% efetivo)**;
- PIS: 0,65%;
- COFINS: 3,0%;
- ISS: **2% a 5%** (depende do município) sobre a receita;
- Total efetivo: aprox. **13% a 16%** da receita líquida (sem ICMS no caso de serviço).

**Prós**:
- escalabilidade até R$ 78 mi/ano;
- previsibilidade tributária alta;
- não há limite de funcionários como o Simples;
- aceito por maioria dos clientes corporativos.

**Contras**:
- alíquota efetiva maior que Simples na faixa inicial;
- exige escrituração contábil regular;
- ISS varia por município (a Pulse paga ISS no município da sede — relevante na escolha da sede);
- não compensa muito quando margem real é menor que 32% (paga sobre lucro presumido maior que o real).

**Quando faz sentido**: a partir do **ano 2** ou quando o GMV se aproximar do teto do Simples.

### 3.3. Lucro Real

**Aplicável a**: qualquer faturamento; **obrigatório** acima de R$ 78 mi/ano ou em alguns casos específicos (instituições financeiras, factoring).
**Tributos**: incidem sobre o **lucro contábil real** (receita − despesas − amortizações, etc.).
- IRPJ: **15% sobre lucro + adicional 10% acima de R$ 240k/ano de lucro**;
- CSLL: **9% sobre lucro**;
- PIS: 1,65% sobre receita (regime não-cumulativo);
- COFINS: 7,6% sobre receita (regime não-cumulativo);
- ISS: 2% a 5%.

**Prós**:
- paga sobre lucro real (vantajoso se a margem real for menor que a presunção do Lucro Presumido);
- aproveita créditos de PIS/COFINS sobre insumos;
- viável para qualquer faturamento.

**Contras**:
- complexidade contábil/fiscal alta;
- PIS/COFINS sobre receita são maiores que no Lucro Presumido;
- exige escrituração eletrônica completa (ECD, ECF, EFD).

**Quando faz sentido**: empresa madura, com grande estrutura, faturamento alto, ou quando a margem real for menor que a presunção.

## 4. Recomendação resumida

| Fase | Regime sugerido | Motivo |
|---|---|---|
| **MVP / Ano 1** (GMV pequeno; faturamento próprio Pulse < R$ 3 mi) | **Simples Nacional** | Menor alíquota e burocracia. Validar com contador a estruturação correta da receita (taxa apenas). |
| **Crescimento / Ano 2-3** (faturamento entre R$ 3-78 mi) | **Lucro Presumido** | Estável, simples, escalável. Permite focar em crescimento sem complexidade. |
| **Escala** (acima de R$ 78 mi ou margem baixa) | **Lucro Real** | Obrigatório acima do teto, e vantajoso se margem real for baixa. |

## 5. Pontos críticos a discutir com contador(a)

1. **Classificação da receita**: o valor cheio do ingresso é receita da Pulse ou só repasse a produtor? **CRÍTICO** para todos os regimes.
2. **CNAE principal**: definir antes do CNPJ.
3. **Sede / Município**: o ISS é municipal — alguns municípios têm alíquota de 2% (mínima); outros 5%. **Considerar mudança de sede** para município com menor ISS pode ser legalmente válido. Validar com contador local.
4. **Substituição tributária ISS**: alguns municípios podem exigir que o tomador (produtor que está em outro município) recolha ISS na fonte. Mapear cenários.
5. **PIS/COFINS sobre receita financeira**: rendimento de aplicação do dinheiro em custódia é receita financeira tributável.
6. **Tributação dos repasses ao produtor**:
   - O produtor é PJ ou PF? Se PF, há retenção de IRRF na fonte (modelo "fonte pagadora").
   - Reter PIS/COFINS/CSLL na fonte se o tomador for PJ (Lei 10.833/2003 art. 30 §6º + 9º).
7. **Antecipação de recebíveis** (futuro): exige regime financeiro/regulatório distinto (FIDC ou CDB exigem autorização BCB; pode ser melhor terceirizar via Stark Bank, Cora, etc.).
8. **Notas fiscais**: ver [plano-NFSe.md](./plano-NFSe.md).
9. **Splits via gateway** (futuro): se a Pulse migrar para split nativo do PSP (Pagar.me/Stripe), reduz a base tributável da Pulse (não há mais receita "em custódia") — simplifica fiscal mas requer mudança contratual.

## 6. Ações imediatas

- [ ] Agendar reunião com contador(a) com experiência em **marketplace / SaaS / fintech**.
- [ ] Definir CNAE e regime para o CNPJ.
- [ ] Decidir cidade da sede (impacto direto no ISS).
- [ ] Estruturar plano de contas separando **receita própria (taxa)** de **valor em custódia (passivo)**.
- [ ] Validar com contador o cronograma de migração Simples → Lucro Presumido quando faturamento aproximar do teto.

---

| Versão | Data       | Mudança principal             |
|--------|------------|-------------------------------|
| 1.0    | 2026-05-24 | Análise técnica preliminar pré-lançamento |
