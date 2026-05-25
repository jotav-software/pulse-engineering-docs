#!/usr/bin/env bash
# Sincroniza brand assets canônicos de pulse-engineering-docs/marca/assets/ para os repos de código.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
DOCS="$(cd "$(dirname "$0")/../.." && pwd)"
ASSETS="$DOCS/marca/assets"

if [[ ! -d "$ASSETS/svg" ]]; then
  echo "Erro: $ASSETS/svg não encontrado. Execute a consolidação do brand kit primeiro." >&2
  exit 1
fi

copy() {
  local src="$1" dest="$2"
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
  echo "  → $dest"
}

echo "Sincronizando SVGs..."
for repo in client-web/public producer-web/public \
  app-client/assets/images app-producer/assets/images; do
  target="$ROOT/$repo"
  [[ -d "$target" ]] || continue
  for svg in logo-horizontal.svg logo-horizontal-white.svg logo-mark.svg logo-stacked.svg; do
    copy "$ASSETS/svg/$svg" "$target/$svg"
  done
done

landing_assets="$ROOT/landing-page/assets"
if [[ -d "$landing_assets" ]]; then
  for svg in logo-horizontal.svg logo-mark.svg logo-stacked.svg logo-horizontal-white.svg; do
    copy "$ASSETS/svg/$svg" "$landing_assets/$svg"
  done
fi

proto="$ROOT/producer-web/_apenas-git/prototipos/landing-page/assets"
if [[ -d "$proto" ]]; then
  copy "$ASSETS/svg/logo-horizontal.svg" "$proto/logo-horizontal.svg"
fi

echo "Sincronizando PNGs essenciais..."
for app_dir in app-client/assets/images app-producer/assets/images; do
  target="$ROOT/$app_dir"
  [[ -d "$target" ]] || continue
  copy "$ASSETS/03-wordmark/pulse-wordmark-branco.png" "$target/logo-pulse-branco.png"
  copy "$ASSETS/06-app-icon-preenchido/pulse-app-icon-1024.png" "$target/app-icon-pulse-roxo-fundo.png"
  copy "$ASSETS/02-simbolo/pulse-icon-roxo.png" "$target/pulse-fallback.png"
  copy "$ASSETS/02-simbolo/pulse-icon-branco.png" "$target/pulse-icon-branco.png"
  copy "$ASSETS/02-simbolo/pulse-icon-roxo.png" "$target/pulse-icon-roxo.png"
  copy "$ASSETS/01-logo/pulse-logo-vertical-branco.png" "$target/pulse-logo-vertical-branco.png"
  copy "$ASSETS/01-logo/pulse-logo-vertical-roxo.png" "$target/pulse-logo-vertical-roxo.png"
  copy "$ASSETS/03-wordmark/pulse-wordmark-roxo.png" "$target/pulse-wordmark-roxo.png"
  copy "$ASSETS/03-wordmark/pulse-wordmark-branco.png" "$target/pulse-wordmark-branco.png"
  copy "$ASSETS/05-splash/pulse-splash-branco-1080x1920.png" "$target/pulse-splash-branco-1080x1920.png"
  copy "$ASSETS/05-splash/pulse-splash-roxo-1080x1920.png" "$target/pulse-splash-roxo-1080x1920.png"
done

echo "Concluído."
