# Encarregado pelo Tratamento de Dados Pessoais (DPO) — Pulse

**Versão:** 1.0 — DRAFT TÉCNICO
**Última atualização:** 2026-05-24

> ⚠️ Draft técnico — finalizar com advogado/DPO antes da publicação.

## 1. Designação

Em cumprimento ao **Art. 41 da LGPD**, a Pulse designa formalmente um Encarregado pelo Tratamento de Dados Pessoais (DPO).

**Modelo escolhido**: `[INTERNO | TERCEIRIZADO]`

- **Opção A — DPO interno**: `[NOME COMPLETO]`, `[CARGO]`, registrado pela Pulse para esta função.
- **Opção B — DPO terceirizado**: `[RAZÃO SOCIAL DA EMPRESA]`, CNPJ `55.346.033/0001-80`, contratada para prestar o serviço de DPO-as-a-Service.

A escolha deve ser registrada no contrato social ou em ato formal interno, e divulgada publicamente.

## 2. Contato público do DPO

Conforme exige a LGPD (Art. 41, §1º), o contato do DPO é **público e acessível**:

- **E-mail**: `dpo@pulse.com.br`
- **Formulário web**: `[URL]/dpo` (com captcha para evitar spam)
- **Endereço para correspondência**: `Av. Paulista, 1106, Sala 01, Andar 16, Bela Vista, São Paulo/SP, CEP 01310-914` — A/C "Encarregado pelo Tratamento de Dados"

O contato consta:
- na [Política de Privacidade](../politicas/politica-privacidade.md);
- no rodapé do site;
- na configuração do app (Configurações → Privacidade).

## 3. Atribuições (Art. 41, §2º LGPD)

O DPO da Pulse é responsável por:

1. **Aceitar reclamações e comunicações** dos titulares, prestar esclarecimentos e adotar providências.
2. **Receber comunicações da ANPD** e adotar providências.
3. **Orientar funcionários e contratados** da Pulse sobre práticas de proteção de dados.
4. **Executar as demais atribuições** determinadas pelo controlador ou estabelecidas em normas complementares.

Atribuições internas (não exigidas mas adotadas pela Pulse):
- Coordenação do [Procedimento do Titular](procedimento-titular.md).
- Manutenção do [ROPA](ROPA.md) atualizado.
- Aprovação de avaliações de impacto ([RIPD](RIPD-geral.md)).
- Revisão e aprovação de contratos com subprocessadores ([DPA Subprocessadores](dpa-subprocessadores.md)).
- Treinamento periódico do time.
- Avaliação de incidentes e notificação à ANPD quando aplicável (Art. 48 LGPD).

## 4. Independência funcional

Para que o DPO exerça suas funções sem conflito:

- O DPO **reporta-se diretamente à Diretoria** (não à área de tecnologia ou jurídico exclusivamente).
- O DPO **não pode ser sancionado** por adotar posições em conformidade com a LGPD.
- O DPO tem **acesso necessário** a sistemas, registros e equipes para cumprir suas atribuições.
- Em caso de conflito entre o DPO e outra área, prevalece a opinião do DPO até que a Diretoria decida, sempre privilegiando o cumprimento da LGPD.

## 5. Escalation interna

Quando uma solicitação requer múltiplas áreas:

```
Titular / ANPD
      │
      ▼
   DPO  ──── Suporte  (1ª linha, atende casos simples)
      │
      ▼
  Diretoria  (decisões estratégicas)
```

**SLA interno**:
- 1ª linha (Suporte) responde em até 48h, com escalação automática para o DPO se:
   - solicitação for de exercício de direito Art. 18 LGPD;
   - houver risco de incidente de segurança;
   - houver suspeita de tratamento ilegal de dados.
- DPO responde em até 15 dias (prazo legal Art. 19 LGPD), prorrogável.

## 6. Comunicação com a ANPD

O DPO é o **único ponto de contato oficial** com a ANPD:
- Recebe ofícios, fiscalizações, requisitos.
- Coordena resposta da empresa.
- Notifica incidentes de segurança graves (procedimento em [RIPD-geral.md](RIPD-geral.md)).

## 7. Formação e atualização

O DPO deve manter-se atualizado:
- Acompanhar publicações e resoluções da ANPD.
- Participar de eventos/treinamentos anuais.
- Ler doutrina e jurisprudência relevantes.

Recomendado: o DPO ter formação em **Direito**, **Privacy** ou **Compliance**, e certificações como **EXIN PDP**, **IAPP CIPP/E**, **IAPP CIPM**.

## 8. Substituição

Em caso de afastamento do DPO (férias, licença, desligamento):
- Designar **substituto temporário** formalmente, com mesmas atribuições.
- Atualizar o contato público se durar mais de 30 dias.

## 9. Revisão deste documento

Anualmente, ou em mudança material (troca de DPO, mudança de endereço, etc.).

---

| Versão | Data       | Mudança principal             |
|--------|------------|-------------------------------|
| 1.0    | 2026-05-24 | Draft inicial pré-lançamento  |
