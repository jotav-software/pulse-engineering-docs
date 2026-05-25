# App Store Connect API — Pulse Eventos

Credenciais para ferramentas de upload/design (ex.: AppScreens, EAS Submit, CI).

> ⚠️ O arquivo `.p8` **não fica neste repositório** (gitignore). Guarde em 1Password / cofre seguro.
> Só baixa **uma vez** no App Store Connect ao criar a key.

## Conta Apple Developer

| Campo | Valor |
|-------|--------|
| **Team ID** | `SG3S2A4556` |
| **Issuer ID** | `dcec15b1-fb8c-479f-97b6-859ccaadf1a1` |
| **Key ID** (App Store Connect API) | `5T734CQ67S` |
| **Key Name** | AppScreens (ou nome usado na criação) |

## Bundle IDs (iOS)

| App | Bundle ID | Nome na loja |
|-----|-----------|--------------|
| **Pulse Eventos** (app-client) | `com.pulse.fan` | Pulse Eventos |
| **Pulse Produtor** (app-producer) | `com.jotav.pulse.producer` | Pulse Produtor |

## Apple Pay (Stripe — configuração manual no Developer Portal)

O EAS **não deve sincronizar** capabilities automaticamente. Use **uma** destas opções:

| Onde | Como |
|------|------|
| **Build local (recomendado)** | `bun run build:ios` ou `EXPO_NO_CAPABILITY_SYNC=1 eas build --platform ios` |
| **Worker EAS (nuvem)** | Variável `EXPO_NO_CAPABILITY_SYNC=1` no projeto (`eas env`) + `env` no profile `base` em `eas.json` |

> `env` em `eas.json` **não** desliga o sync na máquina onde você roda `eas build` — o eas-cli lê `EXPO_NO_CAPABILITY_SYNC` só do `process.env` ao iniciar. Por isso os scripts `build:ios*` exportam a variável antes do CLI.

`app.config.js` declara **Sign in with Apple** (`com.apple.developer.applesignin`) para alinhar com o portal e evitar patch `APPLE_ID_AUTH OFF` + Apple Pay que falha com `bundle … cannot be deleted`.

Configure manualmente em [developer.apple.com](https://developer.apple.com/account) → Certificates, Identifiers & Profiles:

| Campo | Valor |
|-------|--------|
| **Merchant ID** | `merchant.com.pulse.fan` |
| **App ID** | `com.pulse.fan` |
| **Capability** | Apple Pay Payment Processing |

### Passos

1. **Identifiers → Merchant IDs** → criar (ou confirmar) `merchant.com.pulse.fan`
2. **Identifiers → App IDs** → `com.pulse.fan` → editar → marcar **Apple Pay Payment Processing** → selecionar o Merchant ID acima → salvar
3. **Profiles** → regenerar o provisioning profile de distribuição do app (ou deixar o EAS criar um novo no próximo build)
4. No [Stripe Dashboard](https://dashboard.stripe.com/settings/payments/apple_pay) → adicionar o domínio/certificado Apple Pay se usar web; para app nativo, vincular o Merchant ID à conta Stripe

> Se o build falhar com erro de provisioning profile, apague profiles antigos de `com.pulse.fan` no portal e rode o build de novo.

## Sign In with Apple (OAuth — separado da API Key acima)

| Campo | Valor |
|-------|--------|
| App ID | `com.pulse.fan` |
| Services ID (`APPLE_CLIENT_ID`) | `com.pulse.fan.signin` |
| Key ID (Sign In with Apple) | `2UVTMTPQVA` |

## Onde criar / renovar

- **API Key (AppScreens):** [App Store Connect](https://appstoreconnect.apple.com) → Usuários e Acesso → Integrações → App Store Connect API → Team Keys
- **Sign In with Apple:** [developer.apple.com](https://developer.apple.com/account) → Certificates, Identifiers & Profiles
