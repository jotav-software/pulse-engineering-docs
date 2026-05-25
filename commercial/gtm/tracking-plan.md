# Tracking Plan — Pulse (GTM + GA4 + Meta Pixel)

**Versão:** 1.0 — 2026-05-25
**Owner:** Marketing + Engenharia

Plano único de eventos analíticos compartilhado entre **client-web**, **producer-web**, **landing-page** e (futuramente) apps mobile via Firebase Analytics.

---

## 1. Arquitetura

```
[Frontend] ──pushDataLayer──▶ [GTM container] ──┬──▶ GA4
                                                 ├──▶ Meta Pixel (browser) + Conversions API (server)
                                                 ├──▶ Google Ads Conversion (importado via GA4)
                                                 └──▶ TikTok Pixel (Fase 4)

[Backend] ──HTTPS──▶ [Meta Conversions API]   (server-side, bypass iOS 14)
       └─▶ [GA4 Measurement Protocol]          (server-side, validação)
```

**Princípios**:
- **1 source of truth**: dataLayer no browser; server-side espelha eventos críticos (`purchase`, `producer_signup`)
- **PII nunca em parâmetros simples** — só via hash SHA256 server-side
- **Consent Mode v2** ativo (LGPD) — cookies só após aceite
- **Eventos GA4 standard quando disponível** (`view_item`, `add_to_cart`, `purchase`) — facilita ML do GA

---

## 2. Eventos (38 total)

### B2C — Cliente / Comprador (client-web + apps)

| Event | Quando dispara | Parâmetros | GA4 | Pixel | CAPI |
|---|---|---|---|---|---|
| `page_view` | Toda navegação | `page_path`, `page_title` | auto | auto | – |
| `view_item_list` | Home com lista de eventos | `item_list_id`, `items[]` | ✅ | – | – |
| `view_item` | Detalhe do evento | `currency`, `value`, `items[]` | ✅ | `ViewContent` | ✅ |
| `select_item` | Click em um evento da home | `items[]` | ✅ | – | – |
| `view_promotion` | Banner / push promocional visualizado | `promotion_id`, `creative_name` | ✅ | – | – |
| `add_to_cart` | Lote/setor selecionado | `currency`, `value`, `items[]` | ✅ | `AddToCart` | ✅ |
| `begin_checkout` | Tela de pagamento aberta | `currency`, `value`, `items[]` | ✅ | `InitiateCheckout` | ✅ |
| `add_payment_info` | Cartão/Pix selecionado | `payment_type` | ✅ | – | – |
| `purchase` | Pagamento confirmado (webhook) | `transaction_id`, `currency`, `value`, `items[]` | ✅ | `Purchase` | ✅ |
| `refund` | Reembolso processado | `transaction_id` | ✅ | – | ✅ |
| `share` | Compartilhar evento | `method`, `content_id` | ✅ | – | – |
| `sign_up` | Cadastro cliente concluído | `method` | ✅ | `CompleteRegistration` | ✅ |
| `login` | Login bem-sucedido | `method` | ✅ | – | – |
| `search` | Busca por evento | `search_term` | ✅ | – | – |
| `app_download_modal_open` | Modal "baixe o app" aberto | `source` | ✅ | – | – |
| `app_download_click` | Click no link da app store | `os` (`ios` / `android`) | ✅ | – | – |

### B2B — Produtor (producer-web)

| Event | Quando dispara | Parâmetros |
|---|---|---|
| `producer_signup_started` | Form de cadastro aberto | `source` |
| `producer_signup_completed` | OTP confirmado | `producer_id` |
| `producer_kyc_started` | Upload primeiro doc KYC | `producer_id` |
| `producer_kyc_completed` | Status muda para `APPROVED` | `producer_id` |
| `producer_first_event_created` | Primeiro evento publicado | `producer_id`, `event_id` |
| `producer_event_published` | Qualquer evento publicado | `producer_id`, `event_id`, `gmv_estimate` |
| `producer_payout_received` | Repasse marcado RELEASED | `producer_id`, `amount` |
| `producer_team_invite_sent` | Convite STAFF/PROMOTER | `producer_id`, `role` |
| `producer_dashboard_viewed` | Dashboard aberto | – |

### Landing / SEO / Marketing

| Event | Quando dispara | Parâmetros |
|---|---|---|
| `lead_form_submit` | Form contato submetido | `form_id`, `source` |
| `pricing_page_view` | `/precos` carregada | – |
| `pricing_cta_click` | "Quero ser produtor" clicado | – |
| `whatsapp_click` | Botão WhatsApp | – |
| `newsletter_signup` | E-mail capturado | – |

### Operação (apps mobile — Firebase Analytics, próxima sprint)

| Event | Onde |
|---|---|
| `ticket_qr_displayed` | Carteira do cliente |
| `ticket_transferred` | Transferência |
| `checkin_success` | App produtor — porteiro |
| `checkin_facial_attempt` | App produtor — facial |
| `checkin_facial_success` | App produtor — facial |
| `biometric_consent_given` | App cliente — onboarding biometria |
| `biometric_capture_completed` | App cliente — captura |

---

## 3. dataLayer schema

### Padrão geral

```ts
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'event_name',
  // demais parâmetros...
});
```

### Exemplo — `purchase`

```ts
window.dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'ord_abc123',
    currency: 'BRL',
    value: 110.00,             // total pago pelo cliente
    tax: 10.00,                // taxa Pulse (10%)
    items: [
      {
        item_id: 'tkt_001',
        item_name: 'Festa X — Pista Lote 2',
        item_category: 'Festa',
        item_brand: 'Produtora Y',
        price: 100.00,
        quantity: 1,
      },
    ],
  },
  user: {
    id_hash: 'a3f...c92',       // SHA256 do user.id (opcional, para LAL)
  },
});
```

### Exemplo — `producer_signup_completed`

```ts
window.dataLayer.push({
  event: 'producer_signup_completed',
  producer: {
    id: 'prod_xyz789',
    plan: 'standard',
    source: 'organic',          // ou 'google_ads', 'meta', 'referral'
  },
});
```

---

## 4. Contas a criar

| Conta | Quando | Detalhes |
|---|---|---|
| **GTM (Google Tag Manager)** | Antes de fase 2 | 1 container "Pulse Web" — instalar em landing, client-web, producer-web |
| **GA4** | Antes de fase 2 | 1 property "Pulse" — usar Enhanced Measurement |
| **Google Ads** | Fase 3 | Conta única (ver `plano-google-ads.md`) |
| **Meta Business Manager** | Fase 2 (B2B inicial) | 1 BM, 1 Pixel, 1 Page |
| **Meta Conversions API token** | Fase 2 | Server-side backend |
| **TikTok Ads** | Fase 4 (opcional) | Avaliar ROI após GA |
| **Firebase / GA4 Mobile** | Fase 3 | Adicionar apps Expo |

---

## 5. Instalação técnica (passos)

### 5.1. Adicionar GTM container nos 3 frontends

**Cada frontend Next.js precisa do snippet**. Vou criar como componente reutilizável.

Próximo passo (engenharia, esta sprint):

1. Adicionar `NEXT_PUBLIC_GTM_ID` aos `.env.example` de `producer-web/`, `client-web/`.
2. Criar `src/components/analytics/GtmScript.tsx` em cada um.
3. Importar em `app/layout.tsx`.

Código pronto está em [`./snippets/gtm-script.tsx`](./snippets/gtm-script.tsx) — só copiar.

### 5.2. Adicionar landing-page (HTML estático)

```html
<!-- antes de </head> -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

<!-- após <body> -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

### 5.3. Helper de dataLayer (Next.js)

Arquivo `src/lib/analytics.ts` (criar em cada frontend):

```ts
type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
```

Uso:
```ts
import { track } from '@/lib/analytics';
track('view_item', { ecommerce: { currency: 'BRL', value: 100, items: [...] } });
```

### 5.4. Server-side (Meta CAPI + GA4 MP)

Backend Pulse precisa de:
- `backend/src/infrastructure/marketing/MetaConversionsApi.ts` (próxima sprint)
- `backend/src/infrastructure/marketing/GA4MeasurementProtocol.ts` (próxima sprint)
- Disparar de `ConfirmPaymentUseCase` quando `purchase` ocorre

Envs:
```
META_PIXEL_ID=
META_CAPI_TOKEN=
GA4_MEASUREMENT_ID=G-XXXXXXX
GA4_API_SECRET=
```

---

## 6. Consent Mode (LGPD)

**Antes do aceite de cookies, NÃO disparar Pixel/GA4** — apenas armazenar pending no dataLayer.

GTM resolve isso via:
1. Trigger condicional: `cookie_consent_given == true`
2. Antes do consent: `gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' })`
3. Após aceite: `gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' })`

Componente Banner: implementação pendente (próxima sprint — `client-web` + `landing-page`). Não bloqueia tracking de eventos `essenciais` (security, fraud detection — base legal: legítimo interesse), só os de marketing.

---

## 7. UTMs padrão

Convencionar:

```
utm_source     = google | meta | tiktok | linkedin | email | direct
utm_medium     = cpc | cpm | social | email | referral
utm_campaign   = nome-da-campanha (kebab-case)
utm_content    = variacao-criativo (ex: video-15s-v2)
utm_term       = palavra-chave (search only)
```

GA4 já parsa automaticamente. Adicionar UTM em todos os links de outbound (DM, email, WhatsApp).

---

## 8. Dashboards mínimos

GA4 Explorations para configurar (Fase 3):

1. **Funil B2C** — `view_item` → `add_to_cart` → `begin_checkout` → `purchase`
2. **Funil B2B** — `pricing_page_view` → `producer_signup_started` → `producer_signup_completed` → `producer_first_event_created`
3. **Por canal** — Source/Medium × conversões
4. **Por evento** — qual evento gera mais GMV (`item_brand` = produtora)

Looker Studio (opcional): conectar GA4 + Google Ads + Meta Ads num único dashboard. Template gratuito do Google funciona.

---

## 9. Checklist de implementação

### Antes da Fase 2 (beta privado)
- [ ] GTM container criado, ID copiado
- [ ] GA4 property criado, ID copiado
- [ ] Meta BM + Pixel criado, ID copiado
- [ ] `NEXT_PUBLIC_GTM_ID` adicionado nos 2 Next.js e na landing
- [ ] Componente `GtmScript` em produção (já tem código em `./snippets/gtm-script.tsx`)
- [ ] Helper `track()` em `src/lib/analytics.ts` dos 2 Next.js
- [ ] 5 eventos mínimos disparando: `page_view`, `view_item`, `begin_checkout`, `purchase`, `producer_signup_completed`
- [ ] Validar com **GTM Preview Mode**

### Antes da Fase 3 (soft launch)
- [ ] Todos os 38 eventos implementados
- [ ] Conversions API server-side ativa
- [ ] Consent banner em produção
- [ ] Dashboards GA4 publicados
- [ ] Google Ads + Meta Ads contas ativas e auditadas

### Antes da Fase 4 (GA)
- [ ] Firebase Analytics nos apps mobile
- [ ] Google Merchant Center com feed de eventos
- [ ] TikTok Pixel (opcional)
- [ ] Server-side GTM (recomendado para escala)
