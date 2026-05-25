# Programa de Indicação B2B — Produtor indica Produtor

**Versão:** 0.1 — OUTLINE (precisa decisão de % de bônus)
**Status:** 🟨 Outline — implementação técnica em backlog

## Premissa

O **CAC de produtor** estimado (Fase 3) é R$ 800. Pagar **R$ 300–500 a um produtor existente** que indique outro produtor que **publique 1 evento e venda 100 ingressos** é mais barato que mídia paga + traz lead pré-qualificado (produtores conhecem produtores).

## Modelo proposto (a confirmar)

### Estrutura recomendada
- **Indicador**: produtor já ativo na Pulse (publicou ≥ 1 evento)
- **Indicado**: produtor novo (CNPJ/CPF diferente, e-mail diferente)
- **Recompensa**: R$ 300 ao indicador **+** R$ 300 ao indicado (em saldo Pulse, sacável após Pix)
- **Gatilho**: indicado publica primeiro evento **E** vende ≥ 50 ingressos pagos (não-cortesia)
- **Validade do link**: 90 dias

Alternativa **percentual**:
- Indicador recebe **2% das comissões Pulse** geradas pelo indicado nos primeiros 6 meses (cap R$ 2.000)
- Mais alinhado a LTV mas mais complexo de explicar

> **🔴 Decisão de negócio bloqueante**: escolher entre flat (R$ 300+R$ 300) ou recorrente (2% × 6m, cap R$ 2k). Recomendo flat para simplicidade de comunicação.

## Mecânica técnica

```
Produtor A (existente) gera código no painel: PULSE-PRODA-ABC123
       ↓
Compartilha com Produtor B
       ↓
Produtor B se cadastra com /produtor?ref=PULSE-PRODA-ABC123
       ↓
Backend salva ReferralAttribution { referrerId, referredId, code, createdAt }
       ↓
Quando indicado bate condição (50 ingressos pagos no primeiro evento):
  → ReferralReward { amount: 300, status: PENDING } para cada lado
  → ProducerPayoutMovement criado (entra no saldo)
       ↓
Produtor pode sacar conforme regras normais
```

## Schema (backlog produto)

```prisma
model ReferralAttribution {
  id           String   @id @default(uuid())
  referrerId   String   @map("referrer_id")
  referrer     User     @relation("Referrer", fields: [referrerId], references: [id])
  referredId   String   @unique @map("referred_id")
  referred     User     @relation("Referred", fields: [referredId], references: [id])
  code         String   @unique
  status       String   @default("PENDING") // PENDING | QUALIFIED | EXPIRED | REWARDED
  createdAt    DateTime @default(now()) @map("created_at")
  qualifiedAt  DateTime? @map("qualified_at")
  expiresAt    DateTime @map("expires_at")

  rewards      ReferralReward[]

  @@map("referral_attributions")
}

model ReferralReward {
  id              String   @id @default(uuid())
  attributionId   String   @map("attribution_id")
  attribution     ReferralAttribution @relation(fields: [attributionId], references: [id])
  beneficiaryId   String   @map("beneficiary_id") // referrer ou referred
  beneficiary     User     @relation(fields: [beneficiaryId], references: [id])
  amount          Decimal  @db.Decimal(10,2)
  status          String   @default("PENDING") // PENDING | RELEASED | CANCELLED
  createdAt       DateTime @default(now()) @map("created_at")
  releasedAt      DateTime? @map("released_at")

  @@map("referral_rewards")
}
```

## Comunicação ao produtor

> 🎁 **Indique um produtor e ganhe R$ 300.**
> Convide outro produtor para vender ingressos no Pulse. Quando ele publicar o primeiro evento e vender 50 ingressos, **você ganha R$ 300 e ele ganha R$ 300** — direto no saldo Pulse. Compartilhe seu código no painel.

## KPIs

- **Taxa de adoção**: % de produtores ativos que geram pelo menos 1 código (alvo: 30%)
- **Taxa de conversão**: % de códigos compartilhados que viram cadastro (alvo: 5%)
- **Taxa de qualificação**: % de cadastros que batem 50 ingressos (alvo: 40%)
- **CAC via referral**: < R$ 500 (vs R$ 800 mídia paga)

## Riscos

| Risco | Mitigação |
|---|---|
| Auto-indicação (mesmo CPF, e-mails alternados) | Bloqueio por CPF + análise manual quando suspeita |
| Indicado paga só a si mesmo (compra própria) | Já há regra `promoter ≠ comprador`; aplicar mesma aqui |
| Custo descontrolado se viralizar | Cap mensal: R$ 5k em rewards na fase 3, R$ 25k na fase 4 |
| Concorrência copia o programa | Acelerar implementação para 1º semestre fase 3 |

## Próximos passos

- [ ] Decidir entre modelo flat (R$ 300+R$ 300) vs recorrente (2% × 6m)
- [ ] Definir critério de "primeiro evento qualificado" (50 ingressos? 100? GMV mínimo?)
- [ ] Criar schema Prisma + migration
- [ ] Implementar geração de código no `producer-web` (rota `/refer`)
- [ ] Implementar handler `?ref=` no signup do produtor
- [ ] Cron para qualificar attribution (executar diário no worker)
- [ ] Comunicação no painel + e-mail marketing para divulgar quando lançar
