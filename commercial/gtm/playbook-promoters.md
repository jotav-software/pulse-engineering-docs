# Playbook de Promoters — Pulse

**Versão:** 1.0 — 2026-05-25
**Owner:** Marketing + Produto

## Contexto

O papel **PROMOTER** já existe no sistema:
- Vínculo via `EventStaff` com `PromoterCommission` por evento
- Link rastreável (deeplink) por promoter (`pulse-client://event/{id}?promoter={code}`)
- Pagamento via `PromoterCommissionPayment` (D+1 após evento, igual ao repasse de produtor)

Este documento padroniza **como produtores devem usar o programa** e **como a Pulse incentiva** a adoção.

## 1. O que é um promoter (na Pulse)

Pessoa física vinculada a uma produtora que recebe **comissão sobre ingressos vendidos** através do seu link/código próprio. Diferente do funcionário CLT da produtora (esse é STAFF na plataforma).

- **STAFF**: equipe operacional, acesso ao app produtor (check-in, configuração)
- **PROMOTER**: divulgador externo, recebe comissão por venda atribuída

Um mesmo CPF pode ser PROMOTER em N eventos e STAFF em outros, independentemente.

## 2. Como o sistema atribui a venda

```
Comprador clica em [pulse-client://event/123?promoter=ABC] no Instagram do promoter
       ↓
App abre na página do evento; query param salva no localStorage por 24h
       ↓
Comprador finaliza compra
       ↓
PromoterCommission é criada com:
  - promoterUserId = (dono do código ABC)
  - eventId = 123
  - transactionId = (compra)
  - amountBps = (configurado pelo produtor no evento)
       ↓
Após evento, status RELEASED → PromoterCommissionPayment criado
       ↓
Promoter recebe via Pix cadastrado no perfil dele
```

## 3. Modelo de comissionamento

### Por evento (escolha do produtor)

| Modelo | Como funciona | Quando usar |
|---|---|---|
| **% do preço** | Ex: 10% sobre cada ingresso vendido (R$ 10 em R$ 100) | Maioria dos casos. Simples e proporcional. |
| **Valor fixo** | Ex: R$ 5 por ingresso vendido | Eventos com baixo preço (festas universitárias R$ 30) onde % seria irrisório |
| **Híbrido** | % + bônus a partir de N vendas | Eventos grandes onde quer engajar promoters de peso |
| **Por lote** | Comissão diferente por lote (lote 1: R$ 8, lote 2: R$ 4) | Para incentivar venda no primeiro lote (preço cheio) |

### Comissão típica de mercado BR

- Festas universitárias: **5–15%** ou R$ 3–8 por ingresso
- Baladas eletrônicas: **8–12%** ou R$ 5–15 por ingresso
- Shows/festivais: **3–8%** (volume alto)

### Sugestão Pulse para produtores

Configurar **inicialmente 10%** e ajustar a partir do segundo evento com dados reais (qual promoter trouxe mais). O sistema oferece dashboard de performance por promoter.

## 4. Onboarding do promoter (pelo produtor)

1. Produtor abre `producer-web` → `Equipe` → `Adicionar promoter`
2. Insere e-mail + telefone do promoter
3. Sistema envia link de convite
4. Promoter clica → cadastra-se em `app-client` (download Expo)
5. Aceita termos específicos de promoter (já existem em LegalDocument)
6. Cadastra dados bancários para recebimento
7. KYC simplificado (CPF + Foto do doc) — alinhado a Lei do BC sobre PJ/PF de pagamentos

## 5. Como o promoter usa

No app cliente, ele tem:
- **Aba "Promoter"** (já existe) → meus eventos, links únicos, performance, extrato
- **Geração de link** por evento: 1 click
- **Material de divulgação** (banners) baixáveis: `[BACKLOG-PRODUTO]` — disponibilizar criativos prontos

## 6. Pagamento

- **D+1 após o evento**, junto com repasse ao produtor
- Pix para a chave cadastrada no perfil
- Histórico no extrato dentro do app

Caso o promoter não tenha conta bancária ainda, comissão fica em saldo até cadastrar (sem limite de tempo).

## 7. Anti-fraude

| Risco | Mitigação |
|---|---|
| Promoter compra com próprio link | **Bloqueio**: vendas atribuídas ao mesmo CPF do promoter não geram comissão |
| Promoter usa link próprio em rede privada/familiar (auto-uso) | Limite 6 ingressos/CPF (já implementado) limita escala |
| Atribuição duplicada (cliente clicou em 2 links) | **Last-click attribution** com janela de 24h |
| Comissão sobre ingresso refundado | Comissão é **cancelada** automaticamente quando `Transaction.status = REFUNDED` |

## 8. KPIs do programa (acompanhar)

| Métrica | Alvo Fase 3 | Como medir |
|---|---|---|
| % de vendas atribuídas a promoter | > 30% | `Transaction.promoterUserId != null` / total |
| Média de promoters por evento | > 5 | `EventStaff.role=PROMOTER` por evento |
| Receita média por promoter | R$ 200 | `PromoterCommissionPayment.amount` médio |
| Taxa de saque sem problemas | > 95% | Payments com status `PAID` / total |
| Promoter recorrente (>=2 eventos) | > 40% | DISTINCT promoter ativo em N eventos |

## 9. Comunicação para produtor (texto público)

> 📣 **Aumente as vendas com seu time de promoters.**
> Cadastre seus promoters no painel Pulse e dê a cada um um link único de divulgação. Eles recebem comissão sobre cada venda atribuída — você define o percentual. Pagamento automático no Pix, no dia seguinte ao evento. Tudo dentro da plataforma, sem planilha de Excel.

## 10. Próximos passos de produto (backlog gerado)

- [ ] **Material de divulgação automático** — gerar imagem 1080×1920 (Story) com link + banner do evento, baixável pelo promoter
- [ ] **Leaderboard público** opcional por evento (top 10 promoters) — pode incentivar competição saudável
- [ ] **Notificação push** quando promoter vende (gamificação) — depende de `expo-notifications`
- [ ] **Bônus por meta** automatizado — "Se vender 50, ganha +R$ 200"
- [ ] **Comissão recorrente** — promoter que captou um cliente recebe % de futuras compras do mesmo CPF em eventos da produtora (modelo afiliado)

## 11. Riscos jurídicos

- Promoter **não é empregado** (sem CLT) — modelo `prestador de serviço autônomo`. Pulse paga ao promoter pessoa física, mas **o pagamento é feito pelo produtor** (a Pulse só faz o split técnico). Documentar no contrato adesão-produtor que **o produtor é o tomador do serviço**.
- Cuidado com promoters menores de 18 — sistema **bloqueia** cadastro de promoter < 18 anos (já alinhado com Termos B2C).
- Imposto: o pagamento ao promoter é renda tributável. Acima de R$ 1.903,98/mês obriga retenção IRRF. Como cada pagamento é por evento, na prática raramente atinge — mas **alertar produtor no painel** quando promoter passar do teto anual.
