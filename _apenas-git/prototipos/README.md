# Índice de mocks e referências visuais

Catálogo central de HTMLs de referência do ecossistema Pulse. Os arquivos ficam nos repositórios de produto (`_apenas-git/prototipos/`) ou em `marca/kits/` e `comercial/` neste repositório.

**Convenção de nomes:** kebab-case em inglês, prefixo por produto (`brand-`, `admin-`, `producer-`, `client-`, `commercial-`).

## Como encontrar mocks

| Categoria | Onde abrir | Índice local |
|-----------|------------|--------------|
| Brand / pitch / Instagram | `pulse-engineering-docs/marca/kits/` | — |
| Apresentação comercial | `pulse-engineering-docs/comercial/` | — |
| Portal produtor + admin | `producer-web/_apenas-git/prototipos/` | [README](../../producer-web/_apenas-git/prototipos/README.md) |
| Site / app cliente (web) | `client-web/_apenas-git/prototipos/` | [README](../../client-web/_apenas-git/prototipos/README.md) |
| Landing deployável | `landing-page/` (repo separado) | [README](../../landing-page/README.md) |

Abra os `.html` diretamente no navegador ou sirva a pasta com `npx serve .`.

---

## Brand (`pulse-engineering-docs/marca/kits/`)

| Arquivo | Produto | Propósito | Status |
|---------|---------|-----------|--------|
| [brand-kit.html](../marca/kits/brand-kit.html) | Marca | Kit interativo: cores, tipografia, logos, componentes | Referência ativa |
| [brand-pitch-producers.html](../marca/kits/brand-pitch-producers.html) | Marca | Pitch deck para produtores | Referência ativa |
| [brand-client-web-v2.html](../marca/kits/brand-client-web-v2.html) | Client Web | Proposta visual v2 (home comprador) | Referência ativa |
| [brand-instagram-kit.html](../marca/kits/brand-instagram-kit.html) | Marca | Templates Instagram (produtores) | Referência ativa |
| [brand-instagram-kit-print.html](../marca/kits/brand-instagram-kit-print.html) | Marca | Versão para impressão/export do Instagram kit | Referência ativa |

Assets compartilhados: `marca/kits/assets/` (`tokens.css`, logos SVG). Deck slides: `deck-stage.js`.

---

## Commercial (`pulse-engineering-docs/comercial/`)

| Arquivo | Produto | Propósito | Status |
|---------|---------|-----------|--------|
| [commercial-payments-client.html](../comercial/apresentacoes/pagamentos-cliente.html) | Comercial | Apresentação pagamentos e repasses (cliente) | Referência ativa |

---

## Producer Web (`producer-web/_apenas-git/prototipos/`)

| Arquivo | Produto | Propósito | Status |
|---------|---------|-----------|--------|
| [producer-dashboard-mock.html](../../producer-web/_apenas-git/prototipos/producer-dashboard-mock.html) | Producer Web | Painel do produtor — dashboard principal | **Protótipo ativo** (roadmap) |
| [producer-create-vip-mock.html](../../producer-web/_apenas-git/prototipos/producer-create-vip-mock.html) | Producer Web | Criar plano VIP / membership | **Protótipo ativo** (roadmap) |
| [producer-create-event-mock.html](../../producer-web/_apenas-git/prototipos/producer-create-event-mock.html) | Producer Web | Fluxo criar evento (refinado) | Referência |
| [producer-design-proposal-mock.html](../../producer-web/_apenas-git/prototipos/producer-design-proposal-mock.html) | Producer Web | Proposta de design premium | Referência |
| [producer-dashboard-alt-mock.html](../../producer-web/_apenas-git/prototipos/producer-dashboard-alt-mock.html) | Producer Web | Iteração alternativa do dashboard | Referência (supersedida pelo dashboard principal) |
| [producer-create-event-alt-mock.html](../../producer-web/_apenas-git/prototipos/producer-create-event-alt-mock.html) | Producer Web | Iteração alternativa criar evento ("Architect") | Referência |
| [admin/admin-dashboard-mock.html](../../producer-web/_apenas-git/prototipos/admin/admin-dashboard-mock.html) | Pulse Admin | Painel administrativo global | Referência |

**Nota:** `producer-web/_apenas-git/prototipos/landing-page/` é clone do repo [pulse-landing-page](https://github.com/jotav-software/pulse-landing-page) (site estático deployável), não mock isolado.

---

## Client Web (`client-web/_apenas-git/prototipos/`)

| Arquivo | Produto | Propósito | Status |
|---------|---------|-----------|--------|
| [client-app-mock.html](../../client-web/_apenas-git/prototipos/client-app-mock.html) | Client Web / App | App cliente (layout web/desktop) | **Protótipo ativo** (roadmap, tokens) |
| [client-landing-page-mock.html](../../client-web/_apenas-git/prototipos/client-landing-page-mock.html) | Client Web | Landing page B2C | Referência |
| [client-home-dark-mock.html](../../client-web/_apenas-git/prototipos/client-home-dark-mock.html) | Client Web | Home escura "Ingressos e Eventos" | Referência |

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

- Removido `ui-kit/` na raiz do workspace — duplicata obsoleta de `marca/kits/`.
- Removidos `producer-web/_apenas-git/prototipos/app.html` e `landing-page.html` — idênticos aos de `client-web/_apenas-git/prototipos/`.
- HTMLs soltos na raiz de `producer-web/` consolidados em `_apenas-git/prototipos/`.
