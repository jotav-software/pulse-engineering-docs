# Pulse — Brand Assets (fonte canônica)

Única fonte de verdade para **todos os assets de marca** do ecossistema Pulse: logotipos, ícones, wordmarks, avatares, splash screens, app icons, swatches de cor e vetores SVG.

## Por que `brand/assets/` (e não `logos/`)

O kit exportado (`pulse-brand-kit-ultima-versao`) inclui muito mais que logotipos — ícones de app, telas de splash, avatares para Instagram, paleta de cores e variantes contornadas. O nome `assets/` reflete essa amplitude e evita confusão com a pasta `brand/kit/` (HTMLs interativos de apresentação).

| Pasta | Conteúdo |
|---|---|
| `brand/assets/` | Arquivos exportados (PNG/SVG) — **fonte canônica para apps e CDN** |
| `brand/kit/` | Kits HTML (pitch, Instagram, brand guide) + `tokens.css` |
| `brand/screenshots/` | Capturas de tela do app para marketing |

## Estrutura

```
assets/
├── svg/                    # Vetores para web e apps (preferir estes)
│   ├── logo-horizontal.svg
│   ├── logo-horizontal-white.svg
│   ├── logo-mark.svg
│   └── logo-stacked.svg
├── 01-logo/                # Logo vertical (PNG)
├── 02-simbolo/             # Ícone / símbolo
├── 03-wordmark/            # Wordmark isolado
├── 04-avatar-instagram/
├── 05-splash/
├── 06-app-icon-preenchido/
├── 07-app-icon-contornado/
└── 08-cores/               # Swatches de cor
```

## Uso recomendado

| Contexto | Arquivo |
|---|---|
| Header web (fundo escuro) | `svg/logo-horizontal-white.svg` |
| Header web (fundo claro) | `svg/logo-horizontal.svg` com `color: #7b2cbf` |
| App / favicon mark | `svg/logo-mark.svg` |
| Splash / login empilhado | `svg/logo-stacked.svg` |
| App Store icon (cliente) | `06-app-icon-preenchido/pulse-app-icon-1024.png` |
| Favicon PNG (apps) | `03-wordmark/pulse-wordmark-branco.png` |
| Avatar Instagram | `04-avatar-instagram/pulse-avatar-roxo-1080.png` |
| Referência de cor | `08-cores/cor-pulse-purple.png` |

## CDN (Railway)

Assets publicados em produção via serviço `pulse-brand-assets` no projeto Railway **Pulse**.

Base URL produção: `https://pulse-brand-assets-production.up.railway.app` — detalhes em `ops/brand-cdn.md`.

Exemplo:
```
https://<host>/assets/svg/logo-horizontal-white.svg
https://<host>/assets/06-app-icon-preenchido/pulse-app-icon-1024.png
```

## Sincronizar para repos de código (cópias locais)

Apps mobile e builds offline precisam de cópias locais. Para propagar da fonte canônica:

```bash
./scripts/sync-brand-assets.sh
```

## HTML kits

Os kits interativos em `../kit/` usam SVG inline; os vetores exportados ficam em `svg/` para consumo nos apps e na CDN.
