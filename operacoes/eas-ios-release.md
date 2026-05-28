# EAS iOS — TestFlight, OTA e App Store

Guia operacional para publicar builds iOS dos apps Expo da Pulse (`app-client/` e `app-producer/`) usando EAS Build, EAS Submit e EAS Update.

> Rode os comandos dentro do diretório do app correspondente (`app-client/` ou `app-producer/`).

## Perfis existentes no repo

| App | Build profiles em `eas.json` | Submit profiles | Observações |
|-----|-------------------------------|-----------------|-------------|
| `app-client` | `development`, `preview`, `production` | `production` | `production` tem `channel: "production"` e `autoIncrement: true`; `preview` é distribuição interna. |
| `app-producer` | `development`, `preview`, `production` | `production` | `production` tem `autoIncrement: true`; nenhum profile declara `channel` explicitamente no arquivo local. |

Hoje não existe profile `preview-store` no repo. O profile `preview` atual é `distribution: "internal"` e, portanto, não é o profile correto para enviar uma build ao TestFlight/App Store Connect.

## Quando usar cada fluxo

Use **EAS Build + EAS Submit** quando precisar instalar uma build nova pelo TestFlight ou enviar uma versão para revisão na App Store. Isso é necessário para mudanças nativas, alteração de permissões, mudança de `app.json`, nova versão nativa, troca de runtime version ou qualquer dependência que exija rebuild.

Use **EAS Update (OTA)** quando a build instalada já é compatível e você quer enviar uma correção rápida de JavaScript/assets. OTA não cria build nova no TestFlight: ele publica JS/assets para builds já instaladas que escutam o canal informado e têm runtime version compatível.

## TestFlight com ambiente de preview

O fluxo desejado para validar em TestFlight com ambiente/canal de preview é:

```sh
eas build --platform ios --profile preview-store
eas submit --platform ios --latest --profile production
```

Ou, se o profile permitir auto-submit:

```sh
eas build --platform ios --profile preview-store --auto-submit
```

No estado atual do repo, esses comandos só devem ser usados depois de criar e versionar um profile `preview-store` em `eas.json` com distribuição de loja (`distribution` ausente ou store), canal de preview e variáveis/ambiente de preview. Não substitua por `--profile preview`, porque o profile `preview` atual gera build interna e não é o fluxo de TestFlight.

Depois que a build `preview-store` estiver instalada pelo TestFlight, correções rápidas compatíveis podem ir por OTA:

```sh
eas update --channel preview --environment preview --message "Correção rápida"
```

Também é válido usar uma mensagem mais específica:

```sh
eas update --channel preview --environment preview --message "Correção biometria"
```

Antes de confiar no OTA de preview, confirme no Expo Dashboard/EAS que a build instalada realmente escuta o canal `preview`. O comando publica no canal; ele não altera o canal de uma build já instalada.

## TestFlight usando os profiles reais atuais

Com os profiles versionados hoje, o caminho de loja disponível é o profile `production`:

```sh
eas build --platform ios --profile production
eas submit --platform ios --latest --profile production
```

Se as credenciais e o submit profile estiverem configurados para auto-submit:

```sh
eas build --platform ios --profile production --auto-submit
```

Esse fluxo envia a build mais recente para o App Store Connect/TestFlight usando o submit profile `production`. No `app-client`, o profile `production` também aponta a build para o canal `production`.

## Loja oficial em produção

Para mandar uma versão final para a App Store, gere uma build de produção e submeta a build ao App Store Connect:

```sh
eas build --platform ios --profile production
eas submit --platform ios --latest --profile production
```

Se o projeto estiver configurado para auto-submit:

```sh
eas build --platform ios --profile production --auto-submit
```

Depois do upload, a promoção de TestFlight para revisão/loja continua no App Store Connect: selecionar a build, preencher metadados, compliance/export compliance, screenshots quando necessário e enviar para revisão da Apple.

Para correções rápidas em produção, publique OTA no canal de produção somente quando a mudança for JS/assets e compatível com a runtime version da build já instalada:

```sh
eas update --channel production --environment production --message "Correção rápida em produção"
```

Cuidados para produção:

- `app-client/eas.json` declara `channel: "production"` no profile `production`, então o OTA em `production` é o canal esperado para builds de produção desse app.
- `app-producer/eas.json` não declara `channel` explicitamente nos profiles atuais. Antes de depender de OTA em produção no app produtor, confirme o canal da build no Expo Dashboard ou padronize o profile com `channel: "production"` em `eas.json`.
- Variáveis `EXPO_PUBLIC_*` usadas pela build devem estar no ambiente/profile correto do EAS antes do build. Alterar variável pública depois da build normalmente exige nova build, não apenas OTA.
- Mudanças nativas, permissões, plugins, `app.json`, bundle identifier, capabilities ou dependências nativas exigem nova build e submit.

## Scripts úteis do `app-client`

O `app-client/package.json` tem scripts que também fazem bump de versão antes de build/update:

```sh
bun run build:ios:production
bun run build:ios:preview
bun run update:production -- --message "Correção rápida em produção"
bun run update:preview -- --message "Correção rápida"
```

Esses scripts usam os profiles reais `production` e `preview`. Para TestFlight com preview, continue usando `preview-store` somente depois de criar esse profile store no `eas.json`.

## Checklist antes de submeter

1. Confirmar app correto (`app-client/` ou `app-producer/`).
2. Confirmar profile (`production` para loja; `preview-store` apenas se existir e for store).
3. Confirmar ambiente EAS (`--environment preview` ou `--environment production`) e variáveis públicas.
4. Confirmar que a mudança precisa de build nova ou pode ir por OTA.
5. Rodar build iOS.
6. Submeter com `eas submit --platform ios --latest --profile production` ou `--auto-submit`.
7. Finalizar revisão no App Store Connect quando for loja oficial.
