# CONTRATO DE ADESÃO — PLATAFORMA PULSE PARA PRODUTORES DE EVENTOS


## PARTES

**CONTRATADA**: `Jhonatan Vitor Lopes Camargo Consultoria em Tecnologia da Informação LTDA`, inscrita no CNPJ sob nº `55.346.033/0001-80`, com sede em `Av. Paulista, 1106, Sala 01, Andar 16, Bela Vista, São Paulo/SP, CEP 01310-914`, doravante denominada **"PULSE"**.

**CONTRATANTE**: o(a) produtor(a), pessoa física ou jurídica, qualificado(a) no formulário eletrônico de adesão integrado a este Contrato, doravante denominado(a) **"PRODUTOR"**.

PULSE e PRODUTOR conjuntamente denominados **"PARTES"**.

---

## CONSIDERANDO

a) Que a PULSE é titular e operadora da plataforma tecnológica denominada Pulse (composta por aplicativos móveis e interfaces web), destinada a intermediar a venda de ingressos para eventos e oferecer ferramentas de gestão, controle de acesso e relacionamento com público;

b) Que o PRODUTOR é organizador de eventos próprios e deseja utilizar a Plataforma Pulse para divulgar, comercializar ingressos e operar seus eventos;

c) Que a relação aqui estabelecida é de **intermediação tecnológica**, **NÃO** caracterizando sociedade, mandato com poderes de representação, parceria, prestação de serviço subordinado ou vínculo empregatício entre as PARTES;

As PARTES celebram este Contrato, que se regerá pelas seguintes cláusulas.

---

## CLÁUSULA 1ª — OBJETO

1.1. Este Contrato tem por objeto a concessão, pela PULSE ao PRODUTOR, de licença não-exclusiva, intransferível e revogável para acesso e uso da Plataforma Pulse, conforme descrição em https://pulse.com.br/produtor e nas especificações funcionais vigentes.

1.2. A PULSE atuará como **intermediadora tecnológica** entre o PRODUTOR e os compradores de ingressos ("CONSUMIDOR FINAL"), oferecendo:
   - (a) catálogo, divulgação e busca de eventos;
   - (b) checkout e processamento de pagamentos via parceiros licenciados (gateways);
   - (c) emissão de ingresso digital com QR e/ou identificação biométrica facial;
   - (d) ferramentas operacionais (check-in, scanner, lista de presença, dashboard de vendas, financeiro);
   - (e) repasse dos valores arrecadados, líquidos das deduções deste Contrato.

1.3. **A PULSE não é organizadora dos eventos**. A responsabilidade pela realização, segurança, qualidade, alvarás, conformidade trabalhista e fiscal **do evento em si** é exclusiva do PRODUTOR.

---

## CLÁUSULA 2ª — ADESÃO E ONBOARDING

2.1. A celebração deste Contrato se dá mediante:
   - (a) cadastro completo do PRODUTOR no portal Pulse Pro;
   - (b) envio dos documentos de **KYC** (Know Your Customer) exigidos: documento de identidade do titular, CPF, comprovante de endereço, comprovante de inscrição CNPJ (se PJ), contrato social, dados bancários para repasse, e, quando aplicável, biometria facial do responsável legal;
   - (c) aceite eletrônico deste Contrato e demais documentos vinculados (Política de Privacidade, Política de Reembolso);
   - (d) aprovação do KYC pela PULSE — fase em que poderá ser solicitada documentação complementar.

2.2. A aprovação do KYC é condição suspensiva para publicação de eventos. A PULSE reserva-se o direito de **recusar adesão** sem necessidade de justificativa, hipótese em que o cadastro será excluído nos termos da Política de Privacidade.

2.3. O PRODUTOR declara que **todas as informações** fornecidas no cadastro são verdadeiras, atualizadas e completas, e compromete-se a comunicar imediatamente quaisquer alterações.

---

## CLÁUSULA 3ª — REMUNERAÇÃO DA PULSE ("TAXA DE INTERMEDIAÇÃO")

3.1. Pelo uso da Plataforma, será cobrada **taxa de intermediação** sobre o valor de cada ingresso vendido. As condições atuais são:

   **Modelo de cobrança principal**: a taxa de intermediação é **adicionada ao preço unitário do ingresso** e paga pelo CONSUMIDOR FINAL no checkout. O PRODUTOR recebe **o valor cheio do ingresso ofertado, sem desconto**, exceto as deduções previstas neste Contrato (Cláusula 4).

   **Percentual atual da taxa**: **10% (dez por cento)** sobre o preço unitário do ingresso ofertado pelo PRODUTOR, calculado e exibido ao CONSUMIDOR FINAL no momento do checkout.

3.2. A PULSE poderá oferecer **plano alternativo** em que a taxa é descontada do repasse ao PRODUTOR (taxa absorvida pelo PRODUTOR), mediante condições específicas pactuadas no portal.

3.3. **Reajuste**: a taxa de intermediação poderá ser reajustada anualmente, com **comunicação prévia mínima de 30 dias** ao PRODUTOR. Reajustes que ultrapassem o IPCA acumulado de 12 meses exigem **novo aceite eletrônico** para que sigam aplicáveis a eventos não publicados.

3.4. **Outras taxas operacionais**:
   - **Estornos / chargebacks**: o custo do estorno (taxa cobrada pelo gateway de pagamento, atualmente entre R$ 2,00 e R$ 25,00 por operação a depender da bandeira) será debitado do saldo do PRODUTOR;
   - **Saque manual antecipado** (caso ofertado): taxa flat de **R$ 4,90** por solicitação adicional ao saque automático D+1 já incluso na taxa de intermediação;
   - **Antecipação de recebíveis** (se ofertada): condições específicas serão informadas no momento da solicitação. `[BLOQUEADO ATÉ VALIDAÇÃO REGULATÓRIA BCB]`.

---

## CLÁUSULA 4ª — REPASSE FINANCEIRO

4.1. Os valores arrecadados nas vendas ficam **em custódia** com a PULSE até o repasse.

4.2. **Janela de liberação (RETAINED → AVAILABLE)**: o valor de cada venda fica retido até **D+1 (um dia útil) após a data de término do evento**. A regra técnica está em [`produto/regras-negocio/payout-policies.md`](../../produto/regras-negocio/payout-policies.md).

4.3. **Razões da retenção**:
   - (a) cobertura de chargebacks (até 180 dias após a venda, conforme regras das bandeiras);
   - (b) cobertura de reembolsos solicitados conforme Cláusula 7 e a [Política de Reembolso](../politicas-publicas/politica-reembolso.md);
   - (c) custódia regulatória em razão de ausência (na fase atual da plataforma) de split nativo de pagamento pelo gateway.

4.4. **Saque**: liberado o saldo, o PRODUTOR pode solicitar saque via dashboard. Pagamento por **PIX ou TED** para a conta bancária validada no KYC. Janela operacional: dias úteis das 09h às 18h (BRT); solicitações fora dessa janela serão processadas no dia útil seguinte.

4.5. **Bloqueio preventivo**: a PULSE poderá congelar saldo do PRODUTOR em casos de:
   - (a) indícios concretos de fraude;
   - (b) determinação judicial;
   - (c) reclamações coletivas sobre evento não realizado;
   - (d) inadimplência do PRODUTOR perante a PULSE.

   A retenção será comunicada por e-mail no prazo máximo de 24h, com justificativa e procedimento para defesa.

---

## CLÁUSULA 5ª — OBRIGAÇÕES DO PRODUTOR

5.1. Cabe ao PRODUTOR:
   - (a) **realizar o evento** conforme anunciado (data, local, line-up, programação) ou, na impossibilidade, **comunicar oficialmente** o cancelamento/adiamento à PULSE com **antecedência mínima de 48 horas**, observando as regras de reembolso da Lei 14.046/2020;
   - (b) **obter alvarás, licenças, autorizações** (corpo de bombeiros, ECAD, ANCINE quando aplicável, vigilância sanitária, prefeitura) — a PULSE não responde pela falta destes;
   - (c) cumprir a **legislação trabalhista** com sua equipe e prestadores (a PULSE não tem qualquer vínculo com colaboradores do PRODUTOR);
   - (d) **emitir nota fiscal de serviço** ao consumidor final referente ao ingresso, na forma da legislação municipal aplicável;
   - (e) garantir a **acessibilidade** do evento conforme Lei 13.146/2015 (Estatuto da Pessoa com Deficiência);
   - (f) **respeitar a meia-entrada** prevista em lei (Lei 12.933/2013 e congêneres), aplicando o desconto na criação do ingrediente correspondente;
   - (g) **não publicar conteúdo ilícito, discriminatório, que viole direitos de terceiros ou normas de proteção de crianças e adolescentes**;
   - (h) zelar pelo **uso de marca** da Pulse conforme regras de comunicação fornecidas;
   - (i) **proteger as credenciais** de acesso à conta — toda atividade realizada com seu login é de responsabilidade do PRODUTOR;
   - (j) tratar com **boa-fé e respeito** os consumidores e a equipe da PULSE.

5.2. **Vedações**: É vedado ao PRODUTOR:
   - (i) duplicar contas para fracionar volume e burlar taxas;
   - (ii) vender ingressos para eventos inexistentes ou enganosos;
   - (iii) usar a Plataforma para lavagem de dinheiro, financiamento de terrorismo, jogos não-autorizados ou qualquer atividade ilícita;
   - (iv) coletar dados dos compradores **fora** da Plataforma sem base legal LGPD própria;
   - (v) revender, sublicenciar ou expor por API a Plataforma a terceiros sem autorização escrita.

---

## CLÁUSULA 6ª — OBRIGAÇÕES E DIREITOS DA PULSE

6.1. Cabe à PULSE:
   - (a) manter a Plataforma operacional, com SLA-alvo de **99% mensal** (medido em janelas de 5 minutos sobre rota crítica de checkout) — incidentes serão comunicados via status page (`Av. Paulista, 1106, Sala 01, Andar 16, Bela Vista, São Paulo/SP, CEP 01310-914`);
   - (b) repassar valores ao PRODUTOR nos termos da Cláusula 4;
   - (c) prestar suporte técnico ao PRODUTOR pelos canais oficiais — e-mail `suporte@pulse.com.br` e chat in-app — em horário comercial dias úteis;
   - (d) preservar a segurança dos dados pessoais (conforme [Política de Privacidade](../politicas-publicas/politica-privacidade.md));
   - (e) comunicar incidentes de segurança que afetem dados do PRODUTOR ou de seus compradores no prazo da LGPD.

6.2. **A PULSE não responde** por:
   - (i) qualidade artística do evento, infraestrutura física, segurança dentro do local, falhas do PRODUTOR;
   - (ii) atos de terceiros (gateways, operadoras, redes elétricas, ANATEL/ANEEL/etc.);
   - (iii) caso fortuito ou força maior (incluindo, sem limitação, intempéries, pandemia, conflito armado, atos governamentais, blackout);
   - (iv) reclamação do consumidor referente ao evento em si — encaminhará formalmente ao PRODUTOR para tratamento.

---

## CLÁUSULA 7ª — REEMBOLSO AO CONSUMIDOR

7.1. As regras de reembolso seguem a [Política de Reembolso](../politicas-publicas/politica-reembolso.md), em conformidade com:
   - **CDC art. 49** (direito de arrependimento de 7 dias em compras à distância);
   - **Lei 14.046/2020** (eventos cancelados/adiados);
   - regras operacionais da Plataforma.

7.2. Quando o reembolso for **devido**, a PULSE poderá:
   - (a) **debitar do saldo** do PRODUTOR (se houver saldo retido suficiente);
   - (b) **cobrar do PRODUTOR** ativamente caso o saldo seja insuficiente (boleto/cartão);
   - (c) executar a operação via gateway, com custo de estorno (Cláusula 3.4).

7.3. Em caso de **cancelamento de evento por culpa do PRODUTOR**:
   - (i) **integralidade** do valor pago pelo consumidor (incluindo a taxa Pulse) é devolvida;
   - (ii) PULSE poderá **descontar do saldo** ou **cobrar reposição** da taxa de intermediação que precisou ser estornada (não cabendo ao PRODUTOR repassar esse custo ao consumidor).

---

## CLÁUSULA 8ª — DADOS PESSOAIS (LGPD)

8.1. O tratamento de dados pessoais entre as PARTES segue a [Política de Privacidade](../politicas-publicas/politica-privacidade.md) e a Lei 13.709/2018 ("LGPD").

8.2. **Papéis LGPD**:
   - **Em relação ao operacional da Plataforma** (compra, ingresso, check-in, biometria): a PULSE é **controladora**, o PRODUTOR é **suboperador**/coadjuvante para dados a que tem acesso restrito (ex: lista de presença) e age sob instruções da PULSE;
   - **Em relação à divulgação do evento e relacionamento com público pelo PRODUTOR** (ex: dados que ele exporta da Plataforma): o PRODUTOR é **controlador autônomo** e responsável.

8.3. O PRODUTOR compromete-se a:
   - (a) não utilizar dados de compradores para finalidades incompatíveis com a venda do ingresso ou com a expectativa do titular;
   - (b) implementar segurança técnica e administrativa razoável;
   - (c) atender solicitações de titulares (Art. 18 LGPD) referentes aos dados que mantém;
   - (d) **NÃO repassar dados a terceiros** sem base legal própria;
   - (e) excluir dados quando a finalidade que justificou o tratamento se esgotar.

8.4. **Biometria facial**: aceita-se a coleta apenas mediante consentimento expresso e específico do titular (Art. 11 LGPD), com finalidade exclusiva de identificação na portaria do evento e retenção máxima conforme [`produto/biometria/lgpd-security.md`](../../produto/biometria/lgpd-security.md).

---

## CLÁUSULA 9ª — PROPRIEDADE INTELECTUAL

9.1. A **Plataforma Pulse**, código-fonte, layouts, marcas, logotipos, design e demais sinais distintivos são de **titularidade exclusiva da PULSE**.

9.2. O **conteúdo do evento** (banners, descrições, vídeos, fotos) submetido pelo PRODUTOR permanece de sua titularidade. O PRODUTOR concede à PULSE licença não-exclusiva, gratuita e mundial para reproduzir tal conteúdo na Plataforma e para divulgação do evento.

9.3. O PRODUTOR garante que detém **todos os direitos** sobre o conteúdo submetido (incluindo direitos autorais, direito de imagem de pessoas exibidas, licenças musicais).

---

## CLÁUSULA 10ª — CONFIDENCIALIDADE

10.1. As PARTES manterão sigilo sobre informações comerciais sensíveis a que tiverem acesso (incluindo, sem limitação, dados de vendas agregados, listas de compradores, condições comerciais especiais).

10.2. A obrigação de confidencialidade sobrevive ao término deste Contrato pelo prazo de **5 (cinco) anos**.

---

## CLÁUSULA 11ª — RESCISÃO

11.1. Este Contrato vigora por prazo **indeterminado**, podendo ser rescindido:
   - **Pelo PRODUTOR**: a qualquer tempo, mediante aviso prévio de **30 dias** comunicado via portal, desde que não tenha eventos publicados pendentes;
   - **Pela PULSE**: mediante aviso prévio de **30 dias** sem justa causa, ou **imediatamente** em caso de descumprimento grave deste Contrato pelo PRODUTOR, fraude, ou ordem judicial.

11.2. Em caso de rescisão:
   - (a) eventos **já publicados** seguem operados normalmente até a conclusão e repasse final;
   - (b) saldo pendente é repassado conforme cronograma da Cláusula 4;
   - (c) dados são tratados conforme Política de Privacidade.

---

## CLÁUSULA 12ª — LIMITAÇÃO DE RESPONSABILIDADE

12.1. **A responsabilidade total da PULSE** por quaisquer perdas e danos relacionados a este Contrato fica limitada ao **maior valor entre**:
   - (i) R$ 5.000,00 (cinco mil reais); ou
   - (ii) o total de taxas de intermediação efetivamente pagas pelo PRODUTOR (ou em seu nome pelo CONSUMIDOR FINAL) nos **12 meses imediatamente anteriores** ao fato gerador.

12.2. A PULSE **não responde por lucros cessantes, danos indiretos, perdas de oportunidade**, salvo dolo ou culpa grave comprovada.

12.3. As limitações acima **não se aplicam** quando a lei vedar tal limitação (ex: Código de Defesa do Consumidor em relação ao consumidor final, hipóteses de dolo, fraude, violação de LGPD).

---

## CLÁUSULA 13ª — ALTERAÇÕES

13.1. A PULSE poderá **alterar** este Contrato a qualquer tempo, mediante:
   - (a) comunicação prévia de **30 dias** por e-mail e no portal;
   - (b) **novo aceite eletrônico** do PRODUTOR antes de operar novos eventos (o gate técnico está implementado conforme HU06).

13.2. Não havendo aceite, o PRODUTOR poderá rescindir sem ônus dentro do prazo de 30 dias.

---

## CLÁUSULA 14ª — DISPOSIÇÕES GERAIS

14.1. **Independência entre as PARTES**: este Contrato não cria vínculo societário, trabalhista, de representação ou de mandato.

14.2. **Cessão**: o PRODUTOR não pode ceder este Contrato sem anuência prévia e escrita da PULSE. A PULSE poderá ceder este Contrato a empresas do mesmo grupo econômico mediante simples comunicação.

14.3. **Tolerância**: a tolerância da PULSE quanto a inadimplementos do PRODUTOR não implicará renúncia, perdão ou novação.

14.4. **Comunicações**: todas as comunicações formais serão feitas por e-mail aos endereços cadastrados no portal e/ou pelo próprio portal. Considera-se entregue 48 horas após o envio.

---

## CLÁUSULA 15ª — LEI APLICÁVEL E FORO

15.1. Este Contrato é regido pelas leis da **República Federativa do Brasil**.

15.2. Fica eleito o foro da Comarca de `São Paulo/SP` para dirimir quaisquer controvérsias.

---

**Aceite eletrônico**: ao clicar em "Aceito" no portal Pulse Pro, o PRODUTOR declara ter lido, compreendido e concordado com todos os termos acima, em conformidade com a Medida Provisória 2.200-2/2001 e o Marco Civil da Internet.

| Versão | Data       | Mudança principal             |
|--------|------------|-------------------------------|
| 1.0    | 2026-05-24 | Draft inicial pré-lançamento  |
