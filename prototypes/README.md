# Índice de mocks e referências visuais

Catálogo central de HTMLs de referência do ecossistema Pulse. Os arquivos ficam nos repositórios de produto (`prototypes/`) ou em `brand/kit/` e `commercial/` neste repositório.

**Convenção de nomes:** kebab-case em inglês, prefixo por produto (`brand-`, `admin-`, `producer-`, `client-`, `commercial-`).

## Como encontrar mocks

| Categoria | Onde abrir | Índice local |
|-----------|------------|--------------|
| Brand / pitch / Instagram | `pulse-engineering-docs/brand/kit/` | — |
| Apresentação comercial | `pulse-engineering-docs/commercial/` | — |
| Portal produtor + admin | `producer-web/prototypes/` | [README](../../producer-web/prototypes/README.md) |
| Site / app cliente (web) | `client-web/prototypes/` | [README](../../client-web/prototypes/README.md) |
| Landing deployável | `landing-page/` (repo separado) | [README](../../landing-page/README.md) |

Abra os `.html` diretamente no navegador ou sirva a pasta com `npx serve .`.

---

## Brand (`pulse-engineering-docs/brand/kit/`)

| Arquivo | Produto | Propósito | Status |
|---------|---------|-----------|--------|
| [brand-kit.html](../brand/kit/brand-kit.html) | Marca | Kit interativo: cores, tipografia, logos, componentes | Referência ativa |
| [brand-pitch-producers.html](../brand/kit/brand-pitch-producers.html) | Marca | Pitch deck para produtores | Referência ativa |
| [brand-client-web-v2.html](../brand/kit/brand-client-web-v2.html) | Client Web | Proposta visual v2 (home comprador) | Referência ativa |
| [brand-instagram-kit.html](../brand/kit/brand-instagram-kit.html) | Marca | Templates Instagram (produtores) | Referência ativa |
| [brand-instagram-kit-print.html](../brand/kit/brand-instagram-kit-print.html) | Marca | Versão para impressão/export do Instagram kit | Referência ativa |

Assets compartilhados: `brand/kit/assets/` (`tokens.css`, logos SVG). Deck slides: `deck-stage.js`.

---

## Commercial (`pulse-engineering-docs/commercial/`)

| Arquivo | Produto | Propósito | Status |
|---------|---------|-----------|--------|
| [commercial-payments-client.html](../commercial/commercial-payments-client.html) | Comercial | Apresentação pagamentos e repasses (cliente) | Referência ativa |

---

## Producer Web (`producer-web/prototypes/`)

| Arquivo | Produto | Propósito | Status |
|---------|---------|-----------|--------|
| [producer-dashboard-mock.html](../../producer-web/prototypes/producer-dashboard-mock.html) | Producer Web | Painel do produtor — dashboard principal | **Protótipo ativo** (roadmap) |
| [producer-create-vip-mock.html](../../producer-web/prototypes/producer-create-vip-mock.html) | Producer Web | Criar plano VIP / membership | **Protótipo ativo** (roadmap) |
| [producer-create-event-mock.html](../../producer-web/prototypes/producer-create-event-mock.html) | Producer Web | Fluxo criar evento (refinado) | Referência |
| [producer-design-proposal-mock.html](../../producer-web/prototypes/producer-design-proposal-mock.html) | Producer Web | Proposta de design premium | Referência |
| [producer-dashboard-alt-mock.html](../../producer-web/prototypes/producer-dashboard-alt-mock.html) | Producer Web | Iteração alternativa do dashboard | Referência (supersedida pelo dashboard principal) |
| [producer-create-event-alt-mock.html](../../producer-web/prototypes/producer-create-event-alt-mock.html) | Producer Web | Iteração alternativa criar evento ("Architect") | Referência |
| [admin/admin-dashboard-mock.html](../../producer-web/prototypes/admin/admin-dashboard-mock.html) | Pulse Admin | Painel administrativo global | Referência |

**Nota:** `producer-web/prototypes/landing-page/` é clone do repo [pulse-landing-page](https://github.com/jotav-software/pulse-landing-page) (site estático deployável), não mock isolado.

---

## Client Web (`client-web/prototypes/`)

| Arquivo | Produto | Propósito | Status |
|---------|---------|-----------|--------|
| [client-app-mock.html](../../client-web/prototypes/client-app-mock.html) | Client Web / App | App cliente (layout web/desktop) | **Protótipo ativo** (roadmap, tokens) |
| [client-landing-page-mock.html](../../client-web/prototypes/client-landing-page-mock.html) | Client Web | Landing page B2C | Referência |
| [client-home-dark-mock.html](../../client-web/prototypes/client-home-dark-mock.html) | Client Web | Home escura "Ingressos e Eventos" | Referência |

---

## Landing deployável (`landing-page/`)

Site estático em produção (privacidade App Store, landing). Não é mock de produto — ver repo `landing-page/`.

| Caminho | Propósito |
|---------|-----------|
| `landing-page/index.html` | Landing principal |
| `landing-page/produtor/privacidade/` | Política app Produtor |
| `landing-page/cliente/privacidade/` | Política app Cliente |

---

## Histórico / limpeza (2026-05)

- Removido `ui-kit/` na raiz do workspace — duplicata obsoleta de `brand/kit/`.
- Removidos `producer-web/prototypes/app.html` e `landing-page.html` — idênticos aos de `client-web/prototypes/`.
- HTMLs soltos na raiz de `producer-web/` consolidados em `prototypes/`.
