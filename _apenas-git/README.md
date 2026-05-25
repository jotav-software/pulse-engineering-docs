# _apenas-git — conteúdo local (não deploya)

Esta pasta contém arquivos versionados no git que **não sobem** para o Railway (`.railwayignore`).

| Subpasta | Conteúdo | Motivo |
|----------|----------|--------|
| `prototipos/` | Mocks HTML + PNG de referência | Binários pesados (~50 MB) |
| `capturas-marca/` | Screenshots App Store | Binários pesados (~150 MB) |
| `scripts/` | Automação Python/shell dos docs | Ferramentas de dev, não runtime |
| `midia/` | Vídeos `.mp4` locais | Não necessários em produção |
| `historico/` | Logs de migração | Referência histórica |

Para sincronizar assets de marca com os apps:

```bash
./_apenas-git/scripts/sync-brand-assets.sh
```
