# Plano Google Ads — Pulse

**Versão:** 1.0 — 2026-05-25
**Owner:** Marketing
**Status:** plano detalhado pronto para execução. Configurar contas e ativar campanhas conforme as fases do GTM.

## Objetivo

Capturar **demanda existente** (search) e **conversão direta** (Performance Max) para dois públicos:

1. **B2B — produtores buscando alternativa**: "plataforma venda ingresso", "alternativa sympla", "sistema de bilheteria"
2. **B2C — consumidores buscando evento específico**: "ingresso [nome do evento]", "show [artista] são paulo"

> O B2C é onde concentra-se o volume; o B2B traz LTV alto.

## Estrutura de contas

```
Conta Google Ads (única)
├── Campanha 1: Search — B2B (produtores)
│   └── Ad groups por intent: alternativa, sistema, plataforma, ticketing
├── Campanha 2: Search — B2C (consumidores procurando evento)
│   └── Ad groups dinâmicos (DSA) por título do evento publicado
├── Campanha 3: Performance Max — B2C catálogo de eventos
│   └── Feed de eventos via Google Merchant Center
├── Campanha 4: Discovery — Brand defense
│   └── Keywords de marca + branded image ads
└── Campanha 5: YouTube — Awareness (apenas Fase 4)
    └── Em-stream + Shorts para produtoras
```

## Fase 2 — Beta (R$ 50/dia, ~R$ 1.500/mês)

**Apenas campanha 4** (brand defense + concorrente):
- Keywords: "Pulse ingressos", "Pulse eventos" (proteção da marca)
- Keywords: "Pulse vs Sympla", "alternativa Pulse" (defensiva)
- CPC alvo: R$ 1,50–3,00
- Conversão alvo: clique → /precos → cadastro produtor

## Fase 3 — Soft Launch (R$ 200/dia, ~R$ 6.000/mês)

**Adicionar campanhas 1 e 2.**

### Campanha 1 — B2B (R$ 100/dia)

**Ad groups e keywords (exact match priorizado)**:

#### Ad Group A — Alternativa a concorrentes
- `[alternativa sympla]`
- `[alternativa eventbrite]`
- `[alternativa ingresse]`
- `[bilheteria online alternativa]`

**Headlines (15 — rotate):**
- "Alternativa ao Sympla — Taxa 10%"
- "Pulse — Repasse D+1 e Check-in Facial"
- "Plataforma de Ingressos para Produtores"
- "Crie seu Evento em 5 Minutos"
- "Sem Mensalidade. Sem Setup. Taxa 10%"
- (10 mais para preencher slots Google)

**Descriptions (4):**
- "Plataforma de venda de ingressos com check-in facial nativo. Repasse no dia seguinte ao evento. Taxa única de 10%."
- "Migre seu evento em 5 minutos. Importação de mailing. Painel financeiro completo. Suporte direto com o time."
- "Programa de promoters integrado. KYC automatizado. Pix + cartão em 4x sem juros."
- "Comece grátis em pulse.com.br/produtor"

**Landing**: `pulse.com.br/produtor`

#### Ad Group B — Sistema de bilheteria
- `[sistema de bilheteria]`
- `[plataforma venda ingresso]`
- `[software vender ingresso evento]`
- `[criar evento vender ingresso]`

#### Ad Group C — Long tail produtor
- `como vender ingressos online`
- `plataforma para produtor de evento`
- `vender ingresso para festa`
- `bilheteria online taxa baixa`

### Campanha 2 — B2C DSA (R$ 100/dia)

**Dynamic Search Ads** indexando o site público de eventos (`pulse.com.br/eventos/*`).

- Estratégia de lance: Maximize Conversions
- Landing dinâmica: página do evento
- Headline dinâmico: título do evento + "Compre Ingresso Pulse"
- Description: "Pix em 2 minutos. Cartão em 4x. Entrega imediata por e-mail."

Conversão configurada: `purchase` (ver `tracking-plan.md`).

## Fase 4 — GA com mídia paga full (R$ 1.000–3.000/dia)

**Adicionar campanhas 3 e 5.**

### Campanha 3 — Performance Max B2C

**Requisito**: feed de eventos no **Google Merchant Center** + tag conversão completa.

Implementação (backend):
```ts
// Adicionar endpoint público de feed XML/JSON em backend/src/presentation/controllers/events/
// GET /api/client/v1/events/google-merchant-feed
// Retorna formato compatível com Merchant Center (id, title, link, image_link, price, availability, etc.)
```

**Asset groups (mínimo 1, recomendado 3):**
- Asset Group 1: Festas universitárias (público: 18–25 anos universitários)
- Asset Group 2: Baladas eletrônicas (público: 22–35 anos urbano)
- Asset Group 3: Shows e festivais (público: 25–45 anos)

Cada asset group recebe: 5+ headlines, 5+ descriptions, 4+ imagens (1.91:1, 1:1, 4:5), 1+ vídeo (15s opcional mas alavanca).

### Campanha 5 — YouTube (apenas escala já provada)

- In-stream skippable (15s + CTA) → landing `pulse.com.br/produtor`
- Shorts vertical 9:16 — testimonial de produtor piloto
- Budget inicial: 20% do orçamento total apenas

## Conversões a configurar no Google Ads

Importadas via GA4 (configuração em [`tracking-plan.md`](tracking-plan.md)):

| Conversão | Valor de conversão | Tipo |
|---|---|---|
| `producer_signup_complete` | R$ 800 (CAC alvo) | Lead |
| `producer_first_event_published` | R$ 2.000 | Lead qualificado |
| `purchase` | dynamic_value (preço do ingresso × 0,10) | Sale |
| `add_to_cart` | 0 | Engagement |
| `begin_checkout` | 0 | Micro |

## KPIs e thresholds

| Métrica | Alvo Fase 3 | Alarme |
|---|---|---|
| CTR Search B2B | > 4% | < 2% |
| CTR Search B2C DSA | > 6% | < 3% |
| CPA `producer_signup_complete` | < R$ 800 | > R$ 1.200 |
| ROAS `purchase` (em fee Pulse) | > 3x | < 1,5x |
| Quality Score médio | ≥ 7 | < 5 |

## Negativas obrigatórias (todas as campanhas)

```
grátis
gratis
free
emprego
vaga
trabalho
estágio
sympla [exact match negativa só nas campanhas não-defensivas]
torrent
crack
```

## Configuração técnica (checklist)

- [ ] Conta Google Ads ativa + faturamento configurado (cartão BR ou boleto)
- [ ] Vincular GA4 ao Google Ads
- [ ] Importar conversões do GA4 no Google Ads
- [ ] Instalar Google Tag (gtag) ou GTM (já documentado em `tracking-plan.md`)
- [ ] Configurar **Enhanced Conversions** (envia hash de email/phone para melhorar match)
- [ ] **Consent Mode v2** ativado (LGPD/GDPR) — usuário precisa aceitar cookies para envio
- [ ] Configurar **Google Merchant Center** + feed de eventos (apenas Fase 4)
- [ ] Conectar Search Console ao Google Ads
- [ ] Configurar 2FA na conta Google Ads
- [ ] Auditoria de keywords negativas universais (lista acima)

## Estimativa de impacto (Fase 3, 90 dias)

Premissas: R$ 200/dia × 90 dias = R$ 18.000 de mídia.

| Trilha | Cliques | Conversões | CAC | Produtores ganhos |
|---|---|---|---|---|
| Campanha 1 (B2B) — R$ 100/dia | 3.600 (CPC R$ 2,5) | 18 (CR 0,5%) | R$ 500 | 18 |
| Campanha 2 (B2C DSA) — R$ 100/dia | 4.500 (CPC R$ 2,0) | 270 vendas (CR 6%) | n/a | n/a (fee Pulse: R$ 27k acumulados se ticket médio R$ 100) |

ROI Fase 3 esperado em horizonte 12m: positivo se LTV produtor > R$ 800. (LTV estimado fase 3: R$ 5–8k em 12 meses.)
