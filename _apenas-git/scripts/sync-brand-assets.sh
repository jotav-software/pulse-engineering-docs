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

echo "Sincronizando favicons (web)..."
FAVICON_TMP="$(mktemp -d)"
python3 - "$ASSETS/02-simbolo/pulse-icon-roxo.png" "$FAVICON_TMP" <<'PY'
import sys
from pathlib import Path
from PIL import Image

src, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
mark = Image.open(src).convert("RGBA")
padding = 0.12

def composite(size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    inner = int(size * (1 - 2 * padding))
    resized = mark.resize((inner, inner), Image.Resampling.LANCZOS)
    offset = (size - inner) // 2
    canvas.paste(resized, (offset, offset), resized)
    return canvas

for name, size in [("icon-48.png", 48), ("favicon-512.png", 512), ("apple-icon.png", 180)]:
    composite(size).save(out_dir / name, "PNG")

ico_sizes = [16, 32, 48]
ico_images = [composite(s) for s in ico_sizes]
ico_images[0].save(
    out_dir / "favicon.ico",
    format="ICO",
    sizes=[(s, s) for s in ico_sizes],
    append_images=ico_images[1:],
)
PY

for repo in client-web producer-web; do
  target="$ROOT/$repo"
  [[ -d "$target" ]] || continue
  for name in favicon.ico icon.png favicon-512.png apple-icon.png; do
    case "$name" in
      icon.png) src_name="icon-48.png" ;;
      *) src_name="$name" ;;
    esac
    copy "$FAVICON_TMP/$src_name" "$target/public/$name"
    if [[ "$name" != "favicon-512.png" ]]; then
      copy "$FAVICON_TMP/$src_name" "$target/src/app/$name"
    fi
  done
done
rm -rf "$FAVICON_TMP"

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
