# Plano de Prontidão para Lançamento — Trilhas A / B / C

Documento mestre consolidando o que precisa estar resolvido antes do **GA** (general availability) da plataforma Pulse. Baseado na auditoria completa de 2026-05-24.

> **Status atual (resumo)**
> - Tecnicamente: ~70% pronto. Backend DDD maduro, app-producer cobre operação ponta-a-ponta, docs de engenharia em estado avançado.
> - Comercial/jurídico/operacional: ~15% pronto. Maior parte das lacunas concentra-se aqui.

O lançamento depende de **três trilhas paralelas**. Este documento detalha a **Trilha A** (hardening técnico). As trilhas B e C estão referenciadas para contexto.

> **Variáveis de ambiente (canônico):** matriz completa por projeto, placeholders e onde obter valores — [variaveis-ambiente.md](./variaveis-ambiente.md).

---

## Trilhas paralelas

| Trilha | Escopo | Owner | Bloqueia GA? |
|---|---|---|---|
| **A — Hardening técnico** | Idempotência, observabilidade, distribuição, storage, criptografia PII, mobile compliance | Engenharia | Sim |
| **B — Jurídico / Fiscal** | Contratos, ToS, Privacy, NF, regime tributário, LGPD geral | Jurídico + Contábil | Sim |
| **C — GTM / Comercial** | Pricing fechado, plano de ads, piloto, tracking de marketing | Produto + Marketing | Sim |

Rollout proposto:
1. **Piloto fechado** (1-2 produtoras conhecidas, GMV capado) — exige Trilha A itens 1-4.
2. **Soft launch** público — exige Trilha B completa + Trilha A completa.
3. **GA com mídia paga** — exige todas as trilhas + itens de frontend (checkout web ou decisão app-only, analytics, push).

---

## Trilha A — Hardening técnico (esta sprint)

Status convenção: ⬜ pendente · 🟨 em andamento · ✅ pronto · ⏭️ aguardando dependência externa.

### A1. Rotação de credenciais expostas — ⏭️ adiado (fora do escopo desta sprint)
Adiado a pedido. `backend/.env` contém creds reais (MySQL Railway, Better-Auth, Brevo, Stripe). Deve ser feito **antes do piloto fechado**.

### A2. Idempotência no checkout — ✅
**Problema**: `POST /payment/pix` e `/payment/card` (`backend/src/presentation/controllers/payment/PaymentController.ts`) não tratam `Idempotency-Key`. Retry de cliente em timeout pode gerar **cobrança duplicada**.

**Solução**:
- Aceitar header `Idempotency-Key` (UUID v4) em endpoints de iniciação de pagamento.
- Persistir em tabela `IdempotencyKey { key, scope, userId, requestHash, responseBody, status, createdAt, expiresAt }` (TTL 24h).
- Se key existe + mesmo hash → retornar resposta original. Se hash difere → 409 Conflict.
- Se key inexistente → processa, salva resposta, retorna.

**Entregue**:
- Migration `20260524220000_idempotency_keys` (tabela `idempotency_keys` com UNIQUE(scope, key)).
- Helper `backend/src/infrastructure/idempotency/idempotency.ts` (`withIdempotency`).
- Aplicado em `POST /payment/pix` e `POST /payment/card`.
- Erros `IDEMPOTENCY_CONFLICT` / `IDEMPOTENCY_IN_FLIGHT` registrados no ErrorHandler (status 409).
- Header `Idempotency-Key` adicionado ao allowlist do CORS.
- TTL default 24h; entradas FAILED permitem nova tentativa apagando a key e re-executando.

**Pendente (próxima sprint)**: integração nos clientes (app-client / app-producer) — passar UUID v4 em todo retry de checkout; tarefa Cron para purgar `expires_at < now`.

### A3. Error tracking — Sentry — 🟨 backend ativo, falta frontends/mobile
**Backend (entregue)**:
- `@sentry/bun` instalado.
- `infrastructure/observability/observability.ts` com `initObservability`, `captureException`, `flushObservability`.
- Inicialização no boot (`src/index.ts`) — no-op se `SENTRY_DSN` ausente.
- Captura automática de 5xx em `ErrorHandler.ts`.
- Flush no graceful shutdown.
- Filtro de PII em headers (Authorization, Cookie, Idempotency-Key redacted).

**Configurado**: DSN ativo no backend local (projeto `o4511447142563840` em `ingest.de.sentry.io`). Smoke test (`bun _apenas-git/scripts/smoke-observability.ts`) confirmou envio de message + exception.

**Frontends e mobile (entregue)**:
- `producer-web/` e `client-web/`: `@sentry/nextjs` instalado, `sentry.client.config.ts` / `sentry.server.config.ts` / `sentry.edge.config.ts` / `instrumentation.ts` criados; `next.config.mjs` envolto em `withSentryConfig`. DSN copiado para `.env.local`.
- `app-client/` e `app-producer/`: `@sentry/react-native` instalado, helper `src/shared/observability/sentry.ts` importado no topo de `app/_layout.tsx`; plugin `@sentry/react-native/expo` registrado em `app.json`. DSN no `.env` via `EXPO_PUBLIC_SENTRY_DSN`.

**Pendente**:
- Setar `SENTRY_DSN` no Railway para o backend + nas plataformas de deploy de cada frontend (Vercel/Railway).
- Configurar `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT` em CI para upload de source maps (Next.js) e symbolication mobile (EAS Build).
- Validar visualmente no dashboard Sentry após primeiro deploy de cada um.
- (Opcional) criar projetos separados no Sentry por app (recomendado em vez de DSN único compartilhado).

### A4. Rate-limit distribuído — Upstash Redis — ✅
**Entregue**:
- `infrastructure/rate-limit/RateLimitStore.ts` com interface + `MemoryRateLimitStore` + `UpstashRateLimitStore` (via REST API, sem dependência TCP).
- Factory `createRateLimitStore()` escolhe Upstash se `UPSTASH_REDIS_REST_URL` + `_TOKEN` presentes, senão memória.
- `httpRateLimitMiddleware.ts` agora usa o store (async).
- Fail-open em caso de falha do store (não derruba login).
- Header `Retry-After` adicionado.

**Configurado**: database `intense-haddock-135718` ativo. Smoke test (pipeline INCR + PEXPIRE + PTTL) verde — contagens 1/2/3 retornadas atomicamente.

**Pendente**: setar `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` no Railway + expandir `RATE_LIMITED_PATHS` para incluir busca pública de eventos, criação de evento e OTP.

### A5. Graceful shutdown + workers — ✅ fase 1
**Entregue (fase 1)**:
- Handler `SIGTERM`/`SIGINT` em `src/index.ts` que:
  - Limpa todos os `setInterval` agendados;
  - Para o servidor Elysia (`app.stop()`);
  - Aguarda jobs em flight (default 25s, configurável via `SHUTDOWN_TIMEOUT_MS`);
  - Faz flush do Sentry (até 2s);
  - Desconecta Prisma.
- `runTracked()` rastreia execuções in-flight num `Set<Promise>`.

**Pendente (fase 2)**: separar entrypoint `worker.ts` para rodar `ReleaseRetainedPayoutsUseCase` e `PurgeExpiredEventFaceGalleryUseCase` em service Railway dedicado, deixando o backend Web stateless.

### A6. Storage KYC em Cloudflare R2 — ✅
**Entregue**:
- `@aws-sdk/client-s3` instalado.
- `infrastructure/storage/S3FileStorage.ts` implementa `FileStoragePort` para qualquer endpoint S3-compatible (R2 / S3 / MinIO).
- `createFileStorage.ts` atualizado: `STORAGE_DRIVER=r2|s3|local` decide o backend.
- Content-Type inferido por extensão.

**Configurado**: bucket `pulse-kyc` no R2 (account `6b8a2ff73a289319f96437d9921ed21d`), token Account API `pulse-backend-kyc` com Object Read & Write restrito a `pulse-kyc`. Smoke test (`bun _apenas-git/scripts/smoke-storage.ts`) verde — PUT → GET byte-exact → DELETE.

**Pendente**:
- Mirror das 4 envs (`STORAGE_DRIVER`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, `S3_BUCKET`) no Railway.
- Script one-shot de migração `./storage/kyc/*` (volume Railway atual) → R2.
- Presigned URLs para download (próxima iteração).
- Decidir destino do bucket sobressalente `pulse-backend-kyc` (manter como staging ou deletar).

### A7. Criptografia PII em repouso — ✅ fase 2 entregue (cutover dual-write)
**Problema**: `User.cpf`, `User.cnpj`, `BankAccount.holderDoc`, `BankAccount.agency`, `BankAccount.accountNumber` em claro.

**Entregue nesta sprint (primitivas)**:
- `shared/crypto/piiVault.ts` com `encryptPii`, `decryptPii`, `hashPiiForLookup`, `serializeEncryptedPii`, `deserializeEncryptedPii`.
- AES-256-GCM (mesmo padrão do `biometricCrypto.ts`).
- HMAC-SHA256 com pepper independente para colunas de lookup.
- Envs `PII_ENCRYPTION_KEY` e `PII_HASH_PEPPER` documentadas em `.env.example`.

**Fase 2 entregue (cutover dual-write)** — base atual era de teste, então fizemos em uma janela:
- Migration `20260524230000_pii_encryption_columns` adicionou `cpf_cipher/cpf_hash`, `cnpj_cipher/cnpj_hash` em `users` (UNIQUE) e `holder_doc_cipher/holder_doc_hash` em `bank_accounts`.
- `PiiService` (`src/shared/services/PiiService.ts`) com `piiTriple(doc)` e `hashForLookup(doc)`.
- Dual-write aplicado em: `CompleteProfileUseCase`, `RegisterUseCase`, `UpdateProducerBasicProfileUseCase`, `CreateProducerByAdminUseCase`, `UpdateProducerBankDataUseCase`.
- Backfill: `bun _apenas-git/scripts/backfill-pii.ts` rodou em produção — 21 CPFs + 6 CNPJs + 6 holderDoc cifrados. Idempotente (re-run varre 0).
- Smoke (`bun _apenas-git/scripts/smoke-pii.ts`): decrypt byte-exact + hash determinístico + lookup por `cpfHash` retornando o user correto. ✅

**Pendente (próximas sprints)**:
- Mirror das envs `PII_ENCRYPTION_KEY` + `PII_HASH_PEPPER` no Railway. **Crítico**: perder essas chaves = dados criptografados não recuperáveis.
- Trocar lookups que ainda buscam por `cpf` plaintext (login, busca admin) para usar `cpf_hash` — diminui exposição a queries com PII e melhora index efficiency.
- Estender para `BankAccount.account` e `BankAccount.branch` (não cobertos nesta fase).
- Plano de rotação de chave (versionar payload `v:2`, dual-decrypt durante transição).
- Drop dos plaintexts: só após o gateway de pagamento (Pagar.me/Stripe) usar exclusivamente os valores em memória vindos do decrypt sob demanda. Hoje plaintext ainda é necessário para o payload do checkout.

### A8. iOS ATS — app-producer — ✅
**Entregue**: `app-producer/app.json` agora tem `NSAllowsArbitraryLoads: false` + `NSAllowsLocalNetworking: true` (Apple-friendly para dev em LAN; produção já usa HTTPS, dispensa exceções). `app-client` já estava limpo.

### A9. Otimização AuthMiddleware — ✅
**Entregue**: `AuthMiddleware.ts` agora rastreia se a session foi carregada via Bearer (Prisma com `include: user` — já tem `mustChangePassword`) ou via cookie (Better Auth — não tem). No primeiro caso pula a segunda query. Testes existentes passam (19/19 em `tests/unit/presentation/middlewares/`).

**Marco futuro**: cache de sessão em Redis com TTL curto (60s) reduz para 0 queries no caminho quente.

---

## Itens fora desta sprint (registrados aqui para tracking)

### Bloqueadores remanescentes
- **Self-service de reembolso** para cliente (hoje só admin).
- **Cupons / códigos de desconto** — modelo `Coupon/Discount` inexistente.
- **Push notifications** em ambos os apps mobile (`expo-notifications`).
- ✅ **Checkout web** em `client-web` — entregue 2026-05-25 (rotas `/checkout/[sessionId]/{,pix,card,success}` + `/tickets/{,[id]}`, Stripe Elements, Idempotency-Key, polling Pix 3s, GA4 ecommerce events instrumentados).
- 🟨 **Analytics/Pixels** — GTM instalado em todos os frontends + Consent Mode v2; 7 eventos B2C instrumentados (`page_view`, `view_item_list`, `view_item`, `login`, `sign_up`, `app_download_*`) + 4 eventos checkout (`add_to_cart`, `begin_checkout`, `add_payment_info`, `purchase`). Falta: criar contas GTM/GA4/Meta + setar envs.
- ✅ **Banner consent cookies (LGPD)** — entregue 2026-05-25 (`CookieConsentBanner` + `CookiePreferencesModal` granular, localStorage + cookie 1y, link permanente no footer, página `/cookies` shell).
- **JSON-LD Schema.org Event** em `client-web` (rich snippets Google).
- **NFS-e** emissão e split fiscal.
- **3DS2 / antifraude** em pagamentos com cartão.

### Trilha B — Jurídico/Fiscal — 🟨 Drafts técnicos entregues, aguardando revisão profissional

**Drafts produzidos (19 documentos)** em [`juridico/`](../juridico/README.md):
- 3 contratos (adesão produtor, ToS B2C, EULA mobile)
- 5 políticas (privacidade, cookies, reembolso, anti-cambismo, meia-entrada)
- 6 docs LGPD (ROPA, base legal, procedimento titular, DPA subprocessadores, DPO, RIPD geral)
- 3 docs fiscais (regime tributário, plano NFS-e, retenções no repasse)
- 2 docs compliance (PCI-DSS scoping, Lei 14.046/2020 do ingresso)

**Polimento da sessão 2026-05-25** (após auditoria interna):
- ✅ Substituição em massa dos placeholders de empresa (razão social, CNPJ 55.346.033/0001-80, sede Av. Paulista 1106, foro SP).
- ✅ DPO nomeado: Jhonatan Vitor Lopes Camargo (e-mail/telefone ainda a preencher quando dedicados forem criados).
- ✅ Decisão pricing fechada: **10% sobre preço unitário do ingresso, adicionado ao consumidor no checkout**. Aplicada no contrato.
- ✅ Padronizações: biometria retenção = 30 dias, idade mínima = 18+ estrita, prazo notificação ANPD = 3 dias úteis (Res. ANPD 15/2024).
- ✅ Correções factuais: CDC art. 27 (5 anos), referência CNPD-EU substituída por Guia ANPD, Lei 14.046 como piso voluntário (não obrigação direta hoje), item LC 116 alternativas atualizadas (1.05/10.05/17.12), ANPD Res. 19/2024 publicada (não em consulta).

**Pendente para go-live** (todos detalhados em [`juridico/proximos-passos.md`](../juridico/proximos-passos.md)):
- 🔴 Revisão por advogado(a) habilitado em CDC/LGPD/ticketing
- 🔴 Revisão por contador(a) com prática SaaS/marketplace (regime tributário, item LC 116 final, alíquota ISS SP)
- 🔴 Criar e-mails institucionais (`privacidade@`, `juridico@`, `suporte@`, `contato@` em `pulse.com.br`)
- 🔴 Setar provedor NFS-e (recomendação na análise: Nuvem Fiscal); habilitar emissão real
- 🔴 Confirmar URLs de DPA dos subprocessadores (Pagar.me, Railway, Upstash)
- Avaliar antecipação de recebíveis (precisa validação BCB) ou remover do brand-kit
- Alinhar bundle ID `com.jotav.pulse.producer` vs `com.pulse.producer` no EULA mobile

### Trilha C — GTM/Comercial — ✅ docs prontos + GTM instalado

**Drafts em [`comercial/lancamento/`](../comercial/lancamento/README.md)**:
- ✅ Go-to-Market plan: ICP, 4 fases de rollout, métricas-chave por fase, riscos
- ✅ Pricing público (taxa 10% fechada, tabela publicável)
- ✅ Piloto produtoras: critérios, shortlist template, templates de outbound (DM + email), funil
- ✅ Plano Google Ads completo: keywords, headlines, budgets por fase (R$ 50/dia → R$ 3k/dia), Performance Max, KPIs
- ✅ Plano Meta Ads completo: públicos (B2C 12M + B2B 80k), criativos, CBO, Conversions API
- ✅ Tracking plan: 38 eventos mapeados, dataLayer schema, integração GTM/GA4/Meta Pixel
- ✅ Playbook promoters: estrutura de comissão, fluxo, KPIs, anti-fraude
- 🟨 Programa indicação B2B (outline — falta decisão de modelo flat vs recorrente)

**Instalação técnica (entregue)**:
- `client-web/src/components/analytics/GtmScript.tsx` + `lib/analytics.ts` (helper `track()`)
- `producer-web/src/components/analytics/GtmScript.tsx` + `lib/analytics.ts`
- Wire em ambos `app/layout.tsx` (Consent Mode v2 default = denied, LGPD-friendly)
- Snippet GTM no `<head>` de `landing-page/index.html`
- Env vars `NEXT_PUBLIC_GTM_ID` documentadas nos 2 `.env.example`

**Pendente para go-live**:
- 🔴 Criar GTM container + GA4 property + Meta BM (5–10 min cada) e popular envs no Vercel/Railway
- 🔴 Implementar `track()` calls nos pontos críticos do código (purchase, view_item, begin_checkout, producer_signup)
- 🔴 Conversions API server-side (`MetaConversionsApi.ts` + `GA4MeasurementProtocol.ts` no backend — backlog)
- 🔴 Banner de consent cookies (LGPD)
- Outbound piloto: lista de 20 produtoras + templates já estão prontos em `piloto-produtoras.md`
- Decisão flat vs recorrente do programa de indicação
- Programa de indicação.
- Press kit / comunicação de lançamento.

### ADRs faltantes (escrever antes do GA)
- ADR multi-PSP (Pagar.me + Stripe).
- ADR custódia centralizada vs split (Fase 1 vs Fase 2).
- ADR facial self-hosted vs cloud.
- ADR Railway como infra.
- ADR app-only vs checkout web.
- ADR pricing model.

---

## Critérios de "pronto" para esta sprint

A Trilha A será considerada **completa** quando:

1. Todos os itens A2, A5, A7, A8, A9 mergeados, com testes passando. → **A2 / A5(fase1) / A8 / A9 ok; A7 entregue só primitivas (schema adiado por risco).**
2. Itens A3, A4, A6 com abstração implementada + plug pronto, aguardando apenas creds do provedor. → **ok.**
3. Variáveis novas documentadas em `backend/.env.example`. → **ok.**
4. Este documento atualizado com checkmarks reais conforme cada item fecha. → **ok.**
5. Sem regressão visível em smoke test manual do checkout (Pix + Cartão) no app-client. → **pendente (esta verificação fica para o time).**

## Próximos passos imediatos

1. **Criar contas e passar credenciais** (usuário):
   - Sentry → `SENTRY_DSN`
   - Upstash Redis → `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
   - Cloudflare R2 → `S3_ENDPOINT` + `S3_ACCESS_KEY_ID` + `S3_SECRET_ACCESS_KEY` + `S3_BUCKET`
2. Setar essas vars no Railway (staging primeiro).
3. Gerar `PII_ENCRYPTION_KEY` e `PII_HASH_PEPPER` (`openssl rand -hex 32`) — armazenar em vault, NÃO em git.
4. Aplicar migration `20260524220000_idempotency_keys` em staging → produção.
5. Smoke test de pagamento Pix e cartão.
6. Planejar janela para A7 (schema PII) e A5 fase 2 (worker separado).

## Riscos & mitigações

- **Migração de PII (A7)** pode ser pesada com base de dados em produção — fazer em janela controlada, com rollback testado.
- **Mudança de storage (A6)** exige cutover atômico; manter local + R2 em paralelo por algumas horas e validar.
- **Idempotência (A2)** muda contrato da API — coordenar release com mobile (versão mínima do app).

---

**Última atualização**: 2026-05-24
**Próxima revisão**: ao fim da sprint A.
