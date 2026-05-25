# Plano Meta Ads (Facebook + Instagram) — Pulse

**Versão:** 1.0 — 2026-05-25
**Plataformas:** Facebook, Instagram, Messenger
**Owner:** Marketing

## Estratégia

Meta domina a aquisição B2C no Brasil — especialmente Instagram para o público 18-35 (core do consumo de festas/baladas/shows). Para Pulse, Meta serve **dois funis paralelos**:

1. **B2C — consumidor que ainda não comprou ingresso** (público novo + retargeting de quem visitou página do evento sem comprar)
2. **B2B — produtor procurando alternativa** (Lookalike de produtores que cadastraram)

## Estrutura de contas

```
Meta Business Manager (Pulse)
├── Páginas FB: Pulse (B2C) · Pulse para Produtores (B2B opcional, 1 página é suficiente)
├── Pixel: 1 pixel único compartilhado entre frontends
├── Conjunto de produtos (Catalog) para Advantage+ Shopping (Fase 4)
└── Campanhas:
    ├── 1. B2C — Conversão (compra)
    ├── 2. B2C — Tráfego para evento + retargeting
    ├── 3. B2B — Lead (cadastro de produtor)
    └── 4. B2B — Retargeting de produtor que visitou /precos
```

## Pixel + Conversions API

**Implementado no `tracking-plan.md` — eventos enviados via dataLayer → GTM → Meta Pixel + Conversions API**.

Eventos padronizados (Meta standard):
- `PageView`
- `ViewContent` (página de evento aberta)
- `AddToCart` (ingresso selecionado, checkout iniciado)
- `InitiateCheckout` (formulário de pagamento aberto)
- `Purchase` (pagamento confirmado, com `value` e `currency=BRL`)
- `CompleteRegistration` (cadastro de produtor completo — eventos B2B)
- `Lead` (formulário "fale conosco" submetido)

Conversions API server-side: obrigatório para iOS 14+ e bypass de bloqueadores. Configurar em `backend/src/infrastructure/marketing/MetaConversionsApi.ts` (próxima sprint técnica).

## Públicos (audiences)

### B2C
| Público | Tamanho estimado BR | Como criar |
|---|---|---|
| **18-35 SP + Grande SP + Campinas** com interesses ["festas", "shows", "baladas", "música eletrônica", "rock", "sertanejo"] | ~12M | Saved audience |
| **Visitantes do site últimos 30 dias** | (cresce com tráfego) | Custom audience via Pixel |
| **Engajaram com Instagram/Facebook Pulse últimos 60 dias** | (cresce) | Custom audience |
| **Lookalike 1% de compradores** | ~2M | LAL de `Purchase` events |

### B2B
| Público | Tamanho | Como criar |
|---|---|---|
| **Produtores de evento BR — interesses ["evento corporativo", "Sympla", "Eventbrite", "produção musical", "festa universitária"]** + cargo "Founder", "Owner", "Producer" | ~80k | Saved audience |
| **Lookalike 1% de produtores cadastrados** | ~2M | LAL de `CompleteRegistration` |
| **Visitantes de `/produtor` últimos 60 dias** | (cresce) | Custom audience |

## Criativos por fase

### Fase 2 (R$ 30/dia para B2B apenas)
- 1 carrossel B2B (3 cards): "Taxa 10% adicionada ao consumidor", "Check-in facial sem fila", "Repasse D+1"
- 1 vídeo curto B2B 15s: depoimento do fundador (você) + 3 screenshots do painel

### Fase 3 (R$ 200/dia, dividido 60% B2C / 40% B2B)
- 1 carrossel B2C com últimos 5 eventos (rotacionar semanalmente)
- 1 vídeo testimonial B2C de comprador 15s (após primeiro evento piloto)
- 1 vídeo testimonial B2B de produtora piloto 30s
- 1 reel vertical 9:16 mostrando check-in facial no portão

### Fase 4 (R$ 1.000+/dia)
- **Advantage+ Shopping** com catalog de eventos (similar à Performance Max do Google)
- 5+ variações criativas por trimestre
- A/B test mensal de hook (3 primeiros segundos)
- UGC (user-generated content) de promoters

## Especificações técnicas dos criativos

| Formato | Dimensão | Duração | Onde |
|---|---|---|---|
| Feed quadrado | 1080×1080 | imagem ou vídeo até 60s | FB + IG feed |
| Story | 1080×1920 | vídeo até 15s | IG + FB Story |
| Reels | 1080×1920 | vídeo 9–90s | IG Reels |
| Carrossel | 1080×1080 (até 10 cards) | imagem ou vídeo 15s/card | Feed |

## Copy principal (B2C)

**Headline**: "Compre seu ingresso sem fila com check-in facial"
**Primary text**: "Pulse é a plataforma de venda de ingressos com check-in facial nativo. Pix em 2 minutos. Cartão em até 4x sem juros. Veja eventos da sua cidade →"
**CTA**: `Shop Now` / `See Events`

## Copy principal (B2B)

**Headline**: "Repasse D+1. Taxa única 10%. Sem mensalidade."
**Primary text**: "Pulse é a plataforma de venda de ingressos com check-in facial nativo. Repasse no dia seguinte ao evento. Taxa 10% adicionada ao consumidor (você recebe 100% do anunciado). Migre em 5 min →"
**CTA**: `Sign Up` / `Learn More`

## Configuração de campanhas

### Campanha 1 — B2C Conversão
- **Objetivo**: Sales / Conversions
- **Otimização**: `Purchase` event
- **Bid strategy**: Lowest cost (sem cap inicial; cap por CPA após 7d de dados)
- **Budget**: Campaign Budget Optimization (CBO) — R$ 120/dia Fase 3
- **Ad sets**: 3 (broad, lookalike compradores, retargeting)

### Campanha 2 — B2C Tráfego/Retargeting
- **Objetivo**: Traffic + Engagement
- **Públicos**: Custom audiences de visitantes que não converteram
- **Budget**: R$ 30/dia Fase 3

### Campanha 3 — B2B Lead
- **Objetivo**: Leads / Conversions
- **Otimização**: `CompleteRegistration` event
- **Budget**: R$ 50/dia Fase 3

### Campanha 4 — B2B Retargeting
- **Públicos**: visitantes de `/precos`, `/produtor`
- **Budget**: R$ 20/dia Fase 3

## KPIs e thresholds

| Métrica | Alvo | Alarme |
|---|---|---|
| CTR feed B2C | > 1,5% | < 0,8% |
| CTR Stories/Reels B2C | > 2% | < 1% |
| CPM Brasil | R$ 15–30 | > R$ 50 |
| CPA `Purchase` (B2C) | < 25% do ticket médio | > 40% |
| CPA `CompleteRegistration` (B2B) | < R$ 600 | > R$ 1.200 |
| ROAS B2C (sobre fee Pulse) | > 3x | < 1,5x |

## Política de criativos (qualidade)

- Sempre incluir **closed captions** (vídeos vistos sem áudio)
- Logo Pulse nos primeiros 2s e último frame
- Cores do brand-kit ([../../brand/](../../brand/)) — paleta Pulse
- Sem imagens/screenshots desatualizadas (revalidar trimestralmente)
- Nunca prometer "taxa zero" ou "sem custo" (regras de comunicação Meta + dados regulatórios)

## Compliance Meta + LGPD

- [ ] **Consent Mode** ativado no GTM → Pixel só dispara após aceite de cookies
- [ ] Política de privacidade atualizada e linkada na conta Meta
- [ ] **Data Processing Filtering (DPF)** para dados de menores (configurar `data_processing_options`)
- [ ] **Special Ad Category** não marcado (Pulse não vende crédito/emprego/habitação)
- [ ] Pixel não enviar PII em parâmetros (CPF, email, telefone só via Conversions API com hash SHA256)

## Configuração técnica (checklist)

- [ ] Criar Meta Business Manager (`business.facebook.com`)
- [ ] Configurar **Domain Verification** de `pulse.com.br` (via meta tag)
- [ ] Criar Pixel + obter Pixel ID → setar em `NEXT_PUBLIC_META_PIXEL_ID`
- [ ] Configurar **Conversions API** server-side → obter Access Token → `META_CAPI_TOKEN` no backend
- [ ] Criar Page (1 só — pode ser "Pulse" público)
- [ ] Solicitar verificação da Page (selo azul) após 30 dias de atividade
- [ ] **Aggregate Event Measurement (AEM)** — configurar 8 eventos priorizados (iOS 14.5+)
- [ ] Bloquear edição de eventos prioritários em produção
- [ ] Conta de cobrança BR (cartão ou boleto)
- [ ] Configurar 2FA na conta Business Manager
- [ ] Adicionar 1 admin backup (segurança)

## Estimativa de impacto (Fase 3, 90 dias)

Premissas: R$ 200/dia × 90 dias = R$ 18.000 de mídia (mesma escala que Google Ads).

| Campanha | Budget | Impressões | Cliques (CTR 1,2%) | Conversões | CAC ou ROAS |
|---|---|---|---|---|---|
| Campanha 1 (B2C Conversion) | R$ 10.800 | 600k | 7.200 | 250 vendas (3,5%) | ROAS 2,3x sobre fee Pulse |
| Campanha 2 (B2C Retargeting) | R$ 2.700 | 200k | 4.000 | 80 vendas (2%) | ROAS 3,0x |
| Campanha 3 (B2B Lead) | R$ 4.500 | 200k | 3.000 | 12 cadastros completos | CAC R$ 375 |

> Números são estimativas iniciais para planejamento. Validar com 14 dias de campanha live antes de escalar.
