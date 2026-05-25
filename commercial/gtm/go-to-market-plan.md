# Pulse — Plano de Go-to-Market (GTM)

**Versão:** 1.0 — 2026-05-25
**Owner:** Produto + Marketing

## 1. Posicionamento

**Pulse é a plataforma de venda de ingressos com check-in facial nativo, repasse D+1 e taxa única de 10% para produtores brasileiros de eventos.**

### O que nos diferencia (vs Sympla / Eventbrite / Ingresse / Bilheteria Digital)
| Diferencial | Como entregamos |
|---|---|
| **Check-in facial nativo** | Pulse-Face (microserviço próprio com InsightFace), funciona sem internet no portão, fila zero |
| **Repasse D+1** | `ReleaseRetainedPayoutsUseCase` automático após término do evento |
| **Taxa única e transparente** | 10% adicionados ao comprador, sem mensalidade, sem setup |
| **Programa de promoters integrado** | Vínculo, link rastreável e comissionamento dentro da plataforma (já existe no produto) |
| **Antifraude por biometria** | Cambismo combatido pela vinculação facial do ingresso ao comprador |

### Objeções esperadas
- "Já uso Sympla" → fricção de migração baixa, importação CSV/Excel (`[BACKLOG]`).
- "Não quero biometria" → toggle por evento (`Event.operationalSettings.facialRequired` já existe).
- "Taxa é alta" → 10% é mercado; o diferencial é o **bundle** (facial + D+1 + sem mensalidade). Concorrência cobra entre 8% e 12% + taxa de saque.

## 2. ICP (Ideal Customer Profile) — Produtoras

### Persona principal — "Produtor Médio Independente"
- Faixa: **R$ 50k a R$ 500k de GMV por evento** (1k a 10k ingressos)
- Tipo: festas universitárias, baladas com selo próprio, shows de médio porte, festivais regionais
- Geografia inicial: **São Paulo capital + Grande SP + Campinas + Curitiba + Florianópolis + Belo Horizonte**
- Dor primária: fila de check-in lenta, fraude/cambismo, dependência total da bilheteria atual, dificuldade com repasse demorado (D+30 em alguns players)

### Persona secundária — "Selo Boutique"
- 5 a 20 eventos/ano, fidelizado, marca consolidada local
- Já usa concorrente, mas insatisfeito com taxa ou suporte
- Aceita inovação como diferencial competitivo

### Não-ICP nesta fase
- Mega-eventos (Rock in Rio, Lollapalooza) — operações próprias, taxa negociada
- Eventos corporativos B2B (Sympla domina por integrações ERP)
- Cinema, museu, esporte profissional — não é o foco do produto

## 3. Fases de rollout

### Fase 0 — Hardening interno (já em curso)
- Trilha A técnica encerrada (Sentry, Upstash, R2, PII).
- Trilha B jurídica em revisão (advogado + contador).
- Status: ~80% para fase 1.

### Fase 1 — Piloto Fechado (4–6 semanas)
**Objetivo**: validar funil end-to-end com 3–5 produtoras parceiras, GMV total capado em R$ 250k.

- **Critério de entrada na fase 1**:
  - Sentry recebendo eventos de produção sem ruído > 24h.
  - Smoke test de pagamento Pix + Cartão por 2 produtores em ambiente real (cartão de teste).
  - Contratos jurídicos com advogado finalizados.
  - DPO + e-mails institucionais publicados.

- **Critérios de sucesso para sair**:
  - NPS pós-evento ≥ 50
  - Taxa de checkin facial > 70% (adoption do diferencial)
  - Zero incidentes de pagamento duplicado / dado vazado
  - Pelo menos 1 evento com > 500 ingressos vendidos

- **Vagas**: 3–5 produtoras hand-picked (ver `piloto-produtoras.md`)
- **Aquisição**: 100% outbound do fundador (você) — LinkedIn + Instagram + indicação direta. Sem ads pagos.

### Fase 2 — Beta Privado (8–12 semanas)
- 15–30 produtoras curadas, mantendo controle qualitativo
- **Aquisição**: outbound + 1–2 referrals já no programa de indicação
- **Mídia paga**: começar Google Ads de baixo budget (R$ 50/dia) apenas em keywords de marca para defender SEO

### Fase 3 — Soft Launch (público)
- Liberação para qualquer produtor após aceitar termos e completar KYC
- **Aquisição**: Google Ads search escalado (R$ 200–500/dia), Meta Ads para retargeting, programa de promoters ativo
- Programa de indicação aberto (B2B): produtor indica produtor → bônus
- Conteúdo orgânico (Instagram + LinkedIn): 3 posts/semana, mínimo

### Fase 4 — GA com mídia paga full
- Performance Max + Search no Google
- Meta Ads escalado (R$ 1.000–3.000/dia)
- TikTok Ads experimental
- PR / mídia: Press kit lançado, demo days

## 4. Métricas-chave por fase

| Métrica | F1 (Piloto) | F2 (Beta) | F3 (Soft) | F4 (GA) |
|---|---|---|---|---|
| GMV mensal | R$ 100k | R$ 500k | R$ 2M | R$ 10M |
| Produtoras ativas | 5 | 30 | 100 | 500 |
| Eventos publicados | 8 | 50 | 200 | 1000 |
| Conversão Visitante→Compra (checkout) | n/a | n/a | 4-6% | 6-9% |
| NPS produtor | 50 | 55 | 60 | 60 |
| Custo médio aquisição produtor (CAC) | R$ 0 | R$ 200 | R$ 800 | R$ 1.500 |
| LTV produtor (12m de GMV × 10%) | n/a | R$ 5k | R$ 8k | R$ 12k |

## 5. Riscos e mitigações

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Produtora piloto cancela na semana do evento | Alta | Contrato com aviso 15 dias; cláusula de transição |
| Cambismo em escala antes do facial estar maduro | Média | Limite 6 ingressos/CPF + 1 transferência/ingresso (já implementado) |
| Sympla / Ingresse retalia com taxa promocional | Alta | Diferencial é o bundle, não preço puro. Não entrar em guerra de preço |
| Gateway (Pagar.me/Stripe) bloqueia conta por chargeback | Média | Multi-PSP já implementado; failover documentado |
| Antecipação não-regulamentada | Alta | **Remover do brand-kit até validação BCB** (decisão pendente — ver `legal/PROXIMOS-PASSOS.md`) |

## 6. Calendar de lançamento (referência)

| Mês | Marco |
|---|---|
| Junho/2026 | Fase 1 — piloto fechado com 3 produtoras |
| Julho/2026 | Fase 2 — beta para 15 produtoras |
| Setembro/2026 | Fase 3 — soft launch público |
| Novembro/2026 | Fase 4 — GA, primeira campanha de mídia escalada |

**Sazonalidade BR**: pico de eventos universitários (calourada, atléticas) abril–junho e agosto–outubro. Pico de festivais novembro–março. Calibrar campanhas para anteceder.

## 7. Próximos passos imediatos (esta semana)

- [ ] Criar conta GA4 + GTM (instalação técnica pronta — ver `tracking-plan.md`)
- [ ] Criar Meta Business Manager + Pixel
- [ ] Criar Google Ads (pode aguardar fase 2)
- [ ] Outbound: lista de 20 produtoras conhecidas + roteiro DM (template em `piloto-produtoras.md`)
- [ ] Press kit base: 1 deck + 1 release + 5 screenshots (já existem em `pulse-brand-kit/`)
