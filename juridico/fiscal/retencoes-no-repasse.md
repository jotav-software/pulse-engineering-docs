# Retenções Fiscais no Repasse ao Produtor — Análise Técnica


## 1. Cenário

Quando a Pulse libera o repasse ao produtor (após D+1 do término do evento), pode incidir **retenção tributária na fonte**, dependendo de:
- natureza do produtor (PF ou PJ);
- município do produtor;
- valor;
- regime tributário do produtor.

## 2. Produtor Pessoa Física (PF)

Quando o produtor é PF (raro mas possível), a Pulse, como fonte pagadora, pode ter de reter:

### 2.1. IRRF
- **Tabela progressiva mensal** sobre o valor pago (alíquotas de 0% a 27,5%).
- A Pulse retém, recolhe via DARF (cód. 0561) e emite **Comprovante de Rendimentos** anual.
- Limite isenção mensal: `[VER TABELA ATUAL DA RFB]` (atualizada anualmente).

### 2.2. INSS
- Sobre serviço prestado por PF, retenção de **11%** até o teto do INSS (cód. GPS 1406).
- Exceção: se o produtor for autônomo já contribuinte por outra fonte, comprovar contribuição máxima.

### 2.3. ISS (na fonte)
- Alguns municípios obrigam o tomador (Pulse) a reter ISS quando contrata serviço de outro município.
- Verificar **regulamento do ISS** da sede da Pulse e do tomador.

## 3. Produtor Pessoa Jurídica (PJ)

A regra geral muda conforme o **regime tributário do produtor**:

### 3.1. PJ no Simples Nacional
**Retenção pela Pulse**: em geral **nenhuma retenção** de IRRF/PIS/COFINS/CSLL pela LC 123/2006 art. 13. Há exceção em alguns serviços específicos.

**ISS**: depende do anexo do Simples e do município — em geral, o produtor recolhe via DAS.

### 3.2. PJ em Lucro Presumido ou Lucro Real

Quando a Pulse paga serviço a produtor PJ não-Simples, podem incidir retenções:

**PIS/COFINS/CSLL**:
- Lei 10.833/2003 art. 30 §6º e Lei 9.430/96 art. 64:
- **PIS**: 0,65%
- **COFINS**: 3%
- **CSLL**: 1%
- **Total: 4,65%** sobre o valor — quando o serviço se enquadra (consultoria, intermediação, etc.).
- **Dispensa**: valores **menores que R$ 215,05** por nota (Lei 13.137/2015).

**IRRF**:
- Em geral **1,5%** sobre serviços de natureza profissional (Lei 7.713/1988 art. 52, IN RFB 1.234/2012).

**ISS na fonte**:
- Conforme legislação municipal — alíquota tipicamente 2%-5%.

## 4. Atenção: "Repasse de Receita" x "Pagamento de Serviço"

Aqui está o **ponto mais delicado** desta análise:

A Pulse pode argumentar que **o valor cheio do ingresso é receita do produtor desde o início**, e a Pulse apenas faz a custódia + repasse. Nesse modelo:
- A Pulse **não está pagando serviço** ao produtor; está apenas **devolvendo dinheiro de propriedade dele**.
- Logo, **não cabe retenção** de PIS/COFINS/CSLL/IRRF pela Pulse.
- A Pulse fatura **apenas a taxa de intermediação** como receita própria.

**Validar com contador**: a tese acima é defendida em alguns marketplaces (Mercado Livre, Hotmart) e tem precedentes. Estruturar contabilmente:
- valores em custódia entram como **passivo** (obrigação a pagar ao produtor), não como receita;
- só a **taxa de intermediação** entra como receita Pulse;
- ao repassar, **não há retenção** porque não é "serviço pago" pela Pulse.

**Risco**: se o Fisco entender diferente, pode autuar exigindo retenção retroativa. Mitigar com:
- contrato claro (a Cláusula 4 do [Contrato de Adesão Produtor](../contratos/contrato-adesao-produtor.md) já posiciona Pulse como custodiante);
- plano de contas separado;
- parecer fiscal específico (pode pedir Consulta à RFB ou ao Município).

## 5. Recomendações finais

1. **Modelo contábil de "passivo em custódia"** — estruturar imediatamente, antes do primeiro repasse.
2. **Parecer fiscal específico** — contratar contador/advogado tributarista para emitir parecer que justifique não-retenção.
3. **Quando split nativo de gateway estiver implementado** (Fase 2 do payments), o problema some — o dinheiro nunca entra na Pulse.
4. **Cláusula contratual** com produtor já preserva (atual Cláusula 4 do contrato): "valores arrecadados ficam em custódia com a PULSE".
5. **No portal do produtor**, deixar claro que ele é o responsável pela emissão de NF do ingresso ao consumidor — a Pulse não é a vendedora do ingresso.

## 6. ISS sobre a taxa de intermediação Pulse

Independente do tópico acima, **a Pulse paga ISS sobre sua taxa** (sua receita própria):
- Município de incidência: **sede da Pulse**.
- Alíquota: 2% a 5% (varia).
- Recolhimento: mensal.

Quando o cliente da Pulse (produtor) está em outro município, alguns regimes do ISS Brasil podem cobrar duas vezes — mitigado se a Pulse declarar corretamente que **presta serviço de intermediação eletrônica** (regime nacional, simplificado).

---

| Versão | Data       | Mudança principal             |
|--------|------------|-------------------------------|
| 1.0    | 2026-05-24 | Análise técnica preliminar    |
