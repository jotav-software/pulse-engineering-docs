# Checklist — Infraestrutura e deploy (biometria facial Pulse)

Documento operacional para quem **não é engenheiro de ML**: ordem de deploy, variáveis Railway, crons, flags e validações.  
Sintetiza [como-funciona-biometria-facial.md](./como-funciona-biometria-facial.md), [épico facial](./epic-facial-self-hosted.md), [LGPD](./facial-lgpd-security.md) e [enrollment MVP](./facial-enrollment-mvp.md).

**Estado atual (maio/2026):**

- **Pacote 1** (backend + apps + flags) e **Pacote 2** (pulse-face ONNX + extração Opção A) implementados no código.
- Galeria principal no **MySQL** (backend). No pulse-face: **`memory`** em dev; **`persistent`/`sqlite`** + volume em prod (`PULSE_FACE_GALLERY_PATH`).
- **Opção A (extração):** app envia imagem → backend → `POST /v1/embedding/extract` no pulse-face → vetor 512-d real (InsightFace `buffalo_l`).
- Repositórios em **`develop`:** [pulse-backend](https://github.com/jotav-software/pulse-backend), [pulse-face](https://github.com/jotav-software/pulse-face), app-client, app-producer.
- Se o **Railway estiver fora**, adie deploy e ligação de flags; use este doc como roteiro quando voltar.

---

## 1. Visão geral

| Serviço | Stack | Papel |
|---------|-------|--------|
| **backend** | Bun + Elysia + Prisma | Regras de negócio, criptografia de vetores, galeria 1:N no MySQL, proxy para pulse-face |
| **pulse-face** | Python 3.12 + FastAPI + ONNX | Extração de embedding, identify/verify opcional, rebuild de galeria em memória |
| **MySQL** | Railway (plugin) | Usuários, ingressos, `event_face_gallery_entries`, vetores criptografados |
| **app-client** | Expo / EAS | Cadastro facial em casa |
| **app-producer** | Expo / EAS | Portaria: captura + `facial-match` |

**Fluxo Opção A (extração no servidor):**

```
App (foto base64) → backend POST /biometry/extract ou /operation/.../facial-extract
                 → pulse-face POST /v1/embedding/extract
                 → vetor 512-d → cadastro ou match na portaria
```

QR e busca manual **sempre** permanecem como fallback.

---

## 2. Pré-requisitos

### Contas e acesso

- [ ] Conta **Railway** com projeto do Pulse (backend + MySQL já existentes)
- [ ] Permissão para criar **novo serviço** no Railway (pulse-face)
- [ ] Acesso **GitHub** aos repos `jotav-software/pulse-backend`, `pulse-face`, app-client, app-producer (branch `develop`)
- [ ] Conta **Expo / EAS** para builds dos apps
- [ ] CLI opcional: `railway` (`npm i -g @railway/cli`), `gh`, `bun`, `docker`

### Segredos a gerar antes do cutover

- [ ] `BIOMETRIC_ENCRYPTION_KEY` — 32 bytes (ex.: `openssl rand -hex 32` → 64 caracteres hex)
- [ ] `PULSE_FACE_SERVICE_API_KEY` — segredo forte compartilhado **backend ↔ pulse-face** (header `x-api-key`)
- [ ] `PULSE_INTERNAL_API_KEY` — segredo para crons/jobs internos (header `x-pulse-internal-key`)
- [ ] `BIOMETRIC_HASH_SECRET` — opcional; se vazio, usa fallback da encryption key

### O que **não** precisa agora

- [ ] Redis para galeria pulse-face (fase futura)
- [ ] FAISS / índice vetorial externo (fase futura; até ~10k rostos: MySQL + cosseno basta)

---

## 3. Ordem de deploy recomendada

1. [ ] **MySQL** acessível e backup recente
2. [ ] **Backend** — `git pull` em `develop`, rodar migrações Prisma (`bun run db:deploy`)
3. [ ] **pulse-face** — novo serviço Railway (Docker), aguardar build (~5–15 min na 1ª vez por causa dos modelos)
4. [ ] Configurar **variáveis backend** (`PULSE_FACE_SERVICE_URL`, API keys, `BIOMETRIC_ENCRYPTION_KEY`) **sem** ligar flags de usuário ainda
5. [ ] Validar **health** backend (`GET /health`) e pulse-face (`GET /health` → `onnxExtract: configured`)
6. [ ] **Homologação:** testar `POST /v1/embedding/extract` (curl ou app com flags só em preview)
7. [ ] **Apps EAS** — build com `EXPO_PUBLIC_*` alinhados ao backend (ver seção 8)
8. [ ] **Cutover por fases** (seção 9) — extract → enrollment → gallery → checkin → verify pós-QR (opcional)
9. [ ] Configurar **cron purge** e, se necessário, rebuild manual de galeria por evento piloto
10. [ ] Checklist pós-deploy (seção 11)

---

## 4. Migrações Prisma

Rodar **no serviço backend** (diretório `backend/` no monorepo ou repo pulse-backend).

### Migrações relevantes ao facial

| Pasta de migração | Conteúdo |
|-------------------|----------|
| `20260519210000_biometric_consent_fields` | Consentimento LGPD: `biometric_consent_at`, `biometric_consent_ip`, `biometric_terms_version` |
| `20260519220000_event_face_gallery_and_biometric_deleted` | Status `DELETED`, tabelas `event_face_gallery_entries` e `event_face_gallery_builds` |

Outras migrações no histórico devem já estar aplicadas em produção; se o banco for novo, `db:deploy` aplica todas em ordem.

### Comandos

```bash
cd backend
git checkout develop && git pull

# Status (opcional)
bun run db:status

# Deploy em produção/staging (recomendado no Railway ou CI)
bun run db:deploy
```

Equivalente direto: `bunx prisma migrate deploy` (o script `db:deploy` encapsula o fluxo do projeto).

- [ ] `db:status` sem migrações pendentes após deploy
- [ ] Tabelas `event_face_gallery_entries` e `event_face_gallery_builds` existem no MySQL

---

## 5. Railway — backend (Bun)

### Deploy

- [ ] Serviço existente: root **`backend/`** (ou raiz do repo pulse-backend conforme configurado)
- [ ] Branch: **`develop`** (ou tag de release acordada)
- [ ] Start: `bun run start` (ou comando já usado no projeto)

### Health check

| Item | Valor |
|------|--------|
| Método | `GET` |
| Path | `/health` |
| Esperado | JSON com status ok (público, sem auth) |

### Variáveis de ambiente (tabela completa)

Substitua placeholders; **não** commitar valores reais.

| Variável | Obrigatória quando | Valor / placeholder | Notas |
|----------|-------------------|---------------------|--------|
| `DATABASE_URL` | Sempre | `mysql://...` | Plugin MySQL Railway |
| `BETTER_AUTH_SECRET` | Sempre | `<segredo>` | Já existente |
| `BETTER_AUTH_URL` | Sempre | `https://<backend>.up.railway.app` | URL pública do backend |
| `BIOMETRIC_ENCRYPTION_KEY` | Enrollment V2 | `<64 hex chars>` | `openssl rand -hex 32` |
| `BIOMETRIC_HASH_SECRET` | Opcional | `<segredo>` | HMAC auditoria |
| `PULSE_INTERNAL_API_KEY` | Crons internos | `<segredo>` | Header `x-pulse-internal-key` |
| `PULSE_FACE_SERVICE_URL` | Extract / identify | `https://<pulse-face>.up.railway.app` | Sem barra final |
| `PULSE_FACE_SERVICE_API_KEY` | Extract / identify | `<igual ao pulse-face>` | Header `x-api-key` |
| `PULSE_FACE_HEALTH_TIMEOUT_MS` | Opcional | `3000` | |
| `PULSE_FACE_IDENTIFY_TIMEOUT_MS` | Opcional | `5000` | |
| `PULSE_FACE_EXTRACT_TIMEOUT_MS` | Extract | `15000` | |
| `PULSE_FACE_EXTRACT_ENABLED` | Fase extract | `false` → `true` | Opção A |
| `PULSE_FACE_GALLERY_SYNC` | Identify no pulse-face | `false` | Só se delegar 1:N |
| `PULSE_FACE_USE_IDENTIFY` | Identify no pulse-face | `false` | Requer sync + serviço |
| `PULSE_FACE_IDENTIFY_THRESHOLD` | Match | `0.45` | Calibrar em campo |
| `PULSE_FACE_VERIFY_THRESHOLD` | Verify 1:1 | `0.50` | |
| `PULSE_FACE_MIN_SCORE_GAP` | Anti-ambíguo | `0.05` | |
| `FACIAL_ENABLED` | Opcional | não definido ou `true` | Master kill switch |
| `FACIAL_ENROLLMENT_V2` | Cadastro real | `false` → `true` | Alias: `FACIAL_ENROLLMENT_ENABLED` |
| `FACIAL_GALLERY_ENABLED` | Galeria 1:N | `false` → `true` | |
| `FACIAL_CHECKIN_ENABLED` | Portaria facial | `false` → `true` | |
| `FACIAL_AUTO_CHECKIN_THRESHOLD` | Opcional | `0.55` | |
| `FACIAL_REQUIRE_CONFIRMATION_BELOW` | Opcional | `0.55` | |
| `FACIAL_VERIFY_AFTER_QR_ENABLED` | Fase opcional | `false` | US-FAC-009 |
| `FACE_GALLERY_RETENTION_DAYS` | Purge LGPD | `30` | |
| `ENABLE_FACE_GALLERY_PURGE_JOB` | Alternativa ao cron | `false` | Job embutido no processo |
| `FACE_GALLERY_PURGE_JOB_INTERVAL_MS` | Se job embutido | `86400000` | 24h |

Referência completa: `backend/.env.example` (seção biometria facial).

### Cron no Railway (purge galerias) — HTTP alternativo

Use **cron HTTP** **ou** job embutido (`ENABLE_FACE_GALLERY_PURGE_JOB=true`), não os dois sem necessidade.

Criar **Cron Job** no serviço **backend** (Railway → Cron):

| Campo | Valor |
|-------|--------|
| Schedule | `0 4 * * *` (ex.: 04:00 UTC diário — ajustar fuso) |
| Comando | `curl -sS -X POST` (ver abaixo) |

```bash
curl -sS -X POST "https://<BACKEND_HOST>/internal/facial/purge-expired" \
  -H "x-pulse-internal-key: ${PULSE_INTERNAL_API_KEY}"
```

Equivalente no painel: método `POST`, URL `https://<BACKEND_HOST>/internal/facial/purge-expired`, header `x-pulse-internal-key`.

- [ ] Cron criado e testado manualmente uma vez (ver seção 7)
- [ ] `PULSE_INTERNAL_API_KEY` definida no backend

---

## 6. Railway — pulse-face (Python)

### Novo serviço

- [ ] **Serviço separado** do backend Bun (nunca no mesmo container)
- [ ] Repositório: monorepo com pasta `pulse-face/` **ou** repo [jotav-software/pulse-face](https://github.com/jotav-software/pulse-face)
- [ ] Branch: **`develop`**
- [ ] **Root directory:** `pulse-face/`
- [ ] **Builder:** Dockerfile (`pulse-face/Dockerfile`)
- [ ] **Port:** Railway injeta `PORT`; app escuta `0.0.0.0:${PORT}`

### Build — expectativas

| Item | Valor |
|------|--------|
| Tamanho imagem final | **~1,2–1,5 GB** (Python slim + ONNX + modelos) |
| Modelos `buffalo_l` | **~280–330 MB**, baixados **no build** Docker |
| Tempo 1º build | **~5–15 min** (download modelos + pip); rebuilds menores com cache |
| CPU | `CPUExecutionProvider` (sem GPU obrigatória) |

### Health check Railway

| Item | Valor |
|------|--------|
| Método | `GET` |
| Path | `/health` |
| Sucesso | `"status": "ok"` e **`"onnxExtract": "configured"`** |
| Falha comum | `"onnxExtract": "not_configured"` → build sem modelos ou path errado |

### Variáveis pulse-face

| Variável | Valor / placeholder | Notas |
|----------|---------------------|--------|
| `PULSE_FACE_SERVICE_API_KEY` | `<igual backend>` | Obrigatória |
| `PULSE_FACE_MODEL_PATH` | `/models` | Default no Dockerfile |
| `PULSE_FACE_GALLERY_BACKEND` | `memory` (dev) / `persistent` (prod) | `memory`, `persistent`, `sqlite`, `filesystem`, `redis` |
| `PULSE_FACE_GALLERY_PATH` | `/data/gallery` (prod) | Obrigatório com `persistent`/`sqlite`/`filesystem`; montar **volume** Railway |
| `PULSE_FACE_IDENTIFY_THRESHOLD` | `0.45` | Alinhar com backend |
| `PULSE_FACE_VERIFY_THRESHOLD` | `0.50` | |
| `PULSE_FACE_MIN_SCORE_GAP` | `0.05` | |
| `PORT` | (Railway) | Automático |

Copiar URL pública → `PULSE_FACE_SERVICE_URL` no backend.

**Prod (galeria sobrevive restart):**

```env
PULSE_FACE_GALLERY_BACKEND=persistent
PULSE_FACE_GALLERY_PATH=/data/gallery
```

Montar volume Railway em `/data` no serviço pulse-face. `GET /health` deve retornar `"galleryBackend": "sqlite"`.

- [ ] Deploy verde
- [ ] `GET /health` OK com `onnxExtract: configured` e `galleryBackend` esperado
- [ ] Backend consegue alcançar URL (mesma região Railway reduz latência)

---

## 7. Cron / jobs internos

Autenticação: header **`x-pulse-internal-key`** = valor de `PULSE_INTERNAL_API_KEY` no backend.  
Alternativa aceita: `Authorization: Bearer <mesma chave>`.

### Purge galerias expiradas (LGPD)

```http
POST https://<BACKEND_HOST>/internal/facial/purge-expired
x-pulse-internal-key: <PULSE_INTERNAL_API_KEY>
```

Resposta esperada: `{ "success": true, "data": { ... } }`

### Rebuild galeria de um evento

Disparar após cadastros ou antes de abrir portaria facial no evento piloto:

```http
POST https://<BACKEND_HOST>/internal/events/<EVENT_ID>/gallery/rebuild
x-pulse-internal-key: <PULSE_INTERNAL_API_KEY>
```

- [ ] Evento com `facialRequired` e ingressos `ISSUED` com biometria ativa
- [ ] Com `PULSE_FACE_GALLERY_SYNC=true`, embeddings também vão ao pulse-face

### Script local (sem HTTP)

```bash
cd backend
bun run purge:face-galleries
```

### Job embutido (alternativa ao cron HTTP)

```env
ENABLE_FACE_GALLERY_PURGE_JOB=true
FACE_GALLERY_PURGE_JOB_INTERVAL_MS=86400000
```

- [ ] Escolher **cron HTTP** **ou** job embutido (evitar os dois sem necessidade)

---

## 8. Apps mobile (EAS)

**Regra:** nunca colocar `PULSE_FACE_SERVICE_API_KEY`, `BIOMETRIC_ENCRYPTION_KEY` ou `PULSE_INTERNAL_API_KEY` nos apps.

### Variáveis públicas (build-time)

| Variável | app-client | app-producer | Alinha com backend |
|----------|------------|--------------|-------------------|
| `EXPO_PUBLIC_API_URL` | Sim | Sim | URL do backend Railway |
| `EXPO_PUBLIC_FACIAL_ENROLLMENT_V2` | Sim | — | `FACIAL_ENROLLMENT_V2` |
| `EXPO_PUBLIC_PULSE_FACE_EXTRACT` | Sim | Sim | `PULSE_FACE_EXTRACT_ENABLED` |

Definir no **EAS** (secrets / env por profile) ou `.env` local só para dev — **rebuild obrigatório** após mudança (flags são compile-time).

### Perfis EAS (`eas.json`)

| Profile | Uso |
|---------|-----|
| `development` | Dev client, flags locais |
| `preview` | Homologação interna — **ligar flags faciais aqui primeiro** |
| `production` | Loja — flags só após validação em preview |

### Comandos úteis

```bash
# app-client
cd app-client
eas build --profile preview --platform all

# app-producer
cd app-producer
eas build --profile preview --platform all
```

- [ ] `EXPO_PUBLIC_API_URL` aponta para o backend correto (homolog vs prod)
- [ ] Flags faciais **false** em production até cutover da seção 9
- [ ] Mesma versão de flags entre client e producer na mesma fase

---

## 9. Cutover / rollout de flags (fases)

Ordem recomendada em **produção** (homolog pode antecipar tudo).  
Manter **QR** funcionando em todas as fases.

### Fase 0 — Baseline (sem impacto usuário)

- [ ] Backend deploy + migrações
- [ ] pulse-face no ar, health OK
- [ ] `PULSE_FACE_SERVICE_URL` + `PULSE_FACE_SERVICE_API_KEY` configurados
- [ ] Todas as flags faciais **`false`** (comportamento legado / QR normal)

### Fase 1 — Extração Opção A

| Onde | Variável | Valor |
|------|----------|--------|
| Backend | `PULSE_FACE_EXTRACT_ENABLED` | `true` |
| app-client | `EXPO_PUBLIC_PULSE_FACE_EXTRACT` | `true` |
| app-producer | `EXPO_PUBLIC_PULSE_FACE_EXTRACT` | `true` |

- [ ] Testar cadastro em preview: vetor não é mais só hash heurístico
- [ ] Enrollment V2 ainda pode estar `false` (só extract testável via API)

### Fase 2 — Enrollment V2

| Onde | Variável | Valor |
|------|----------|--------|
| Backend | `BIOMETRIC_ENCRYPTION_KEY` | definida |
| Backend | `FACIAL_ENROLLMENT_V2` | `true` |
| app-client | `EXPO_PUBLIC_FACIAL_ENROLLMENT_V2` | `true` |

- [ ] Evento piloto com `facialRequired`
- [ ] Consentimento `facial-v1` gravado
- [ ] Vetor criptografado no MySQL

### Fase 3 — Galeria por evento

| Onde | Variável | Valor |
|------|----------|--------|
| Backend | `FACIAL_GALLERY_ENABLED` | `true` |

- [ ] `POST /internal/events/:id/gallery/rebuild` no evento piloto
- [ ] Conferir `event_face_gallery_builds.entry_count` > 0

### Fase 4 — Check-in facial portaria

| Onde | Variável | Valor |
|------|----------|--------|
| Backend | `FACIAL_CHECKIN_ENABLED` | `true` |
| Apps | flags extract + enrollment já `true` | |

- [ ] 1:N no **backend/MySQL** (padrão, sem pulse-face identify)
- [ ] Staff vê fallback QR / busca manual

### Fase 5 — Opcional: identify no pulse-face (eventos muito grandes)

| Onde | Variável | Valor |
|------|----------|--------|
| Backend | `PULSE_FACE_GALLERY_SYNC` | `true` |
| Backend | `PULSE_FACE_USE_IDENTIFY` | `true` |

- [ ] Rebuild galeria após sync
- [ ] Monitorar latência p95 na portaria

### Fase 6 — Opcional: verify após QR

| Onde | Variável | Valor |
|------|----------|--------|
| Backend | `FACIAL_VERIFY_AFTER_QR_ENABLED` | `true` |

---

## 10. Comandos úteis

### Git (repos develop)

```bash
# Backend
cd backend && git checkout develop && git pull

# pulse-face (se repo separado)
cd pulse-face && git checkout develop && git pull
```

### Testes backend (facial)

```bash
cd backend
bun test tests/unit/use-cases/biometric
bun test tests/unit/use-cases/facial-gallery
bun test tests/unit/use-cases/operation/IdentifyFacialCheckInUseCase.test.ts
# ou suite completa:
bun test --timeout 120000
```

### Docker pulse-face local

```bash
cd pulse-face
docker build -t pulse-face .
docker run --rm -p 8080:8080 \
  -e PULSE_FACE_SERVICE_API_KEY=dev-secret \
  pulse-face
```

### Health checks

```bash
# Backend
curl -sS "https://<BACKEND_HOST>/health" | jq .

# pulse-face
curl -sS "https://<PULSE_FACE_HOST>/health" | jq .
# Esperado: "onnxExtract": "configured"
```

### Teste extract (pulse-face direto)

```bash
# Substitua IMAGE_B64 por JPEG em base64 (uma linha)
curl -sS -X POST "https://<PULSE_FACE_HOST>/v1/embedding/extract" \
  -H "x-api-key: <PULSE_FACE_SERVICE_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"<IMAGE_B64>"}' | jq '.status, .vectorDim, .quality'
```

### Teste extract via backend (com sessão — usar token real em homolog)

```bash
curl -sS -X POST "https://<BACKEND_HOST>/biometry/extract" \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"<IMAGE_B64>"}'
# Requer PULSE_FACE_EXTRACT_ENABLED=true
```

### Purge manual

```bash
curl -sS -X POST "https://<BACKEND_HOST>/internal/facial/purge-expired" \
  -H "x-pulse-internal-key: <PULSE_INTERNAL_API_KEY>"
```

### Railway CLI (opcional)

```bash
railway login
railway link
railway variables
railway logs
railway up   # deploy a partir da pasta linkada
```

---

## 11. Checklist pós-deploy

### Infra

- [ ] `GET /health` backend — OK
- [ ] `GET /health` pulse-face — `onnxExtract: configured`
- [ ] Migrações Prisma aplicadas (`bun run db:status`)
- [ ] Cron purge configurado ou script agendado

### Funcional (homolog / evento piloto)

- [ ] **QR** ainda funciona (regressão zero)
- [ ] Cadastro facial: consentimento → captura → `POST /biometry/update` com sucesso
- [ ] `hasBio` / status facial OK no app (Meus ingressos)
- [ ] Rebuild galeria: `entry_count` coerente com ingressos facial ativos
- [ ] Portaria: `facial-match` retorna match para usuário cadastrado
- [ ] Portaria: sem match → mensagem clara + QR / busca manual
- [ ] `DELETE /biometry` remove template (teste LGPD em homolog)

### Segurança

- [ ] `BIOMETRIC_ENCRYPTION_KEY` só no Railway backend (não no git)
- [ ] API keys pulse-face e internal diferentes entre si
- [ ] Rotas `/internal/*` não expostas sem chave

---

## 12. Pendências conhecidas / fora deste doc

| Item | Notas |
|------|--------|
| **Calibração em campo** | Thresholds 0.45 / 0.55 são iniciais; ajustar com testes reais (US-FAC-012) |
| **FAISS / Redis** | Roadmap para galerias >> 10k; não bloquear MVP atual |
| **Liveness forte** | MVP: timer + piscar; não anti-spoof bancário |
| **ONNX on-device** | Opcional futuro; hoje Opção A = servidor |
| **Status Railway** | Se plataforma instável, adiar deploy; não ligar flags sem pulse-face saudável |
| **Docs na raiz `docs/`** | Pasta workspace **não** versionada no git do pulse-backend; cópia oficial: `backend/docs/product/` |
| **Treinamento de IA** | Não aplicável — modelos prontos InsightFace |
| **Pacotes 1 e 2** | Código entregue; este doc cobre **operação** de ligar em prod |

---

## 13. Troubleshooting

| Sintoma | Causa provável | Ação |
|---------|----------------|------|
| `onnxExtract: not_configured` | Modelos não no image ou path errado | Rebuild Docker pulse-face; conferir `PULSE_FACE_MODEL_PATH=/models` |
| `POST /v1/embedding/extract` → **501** | Extrator ONNX indisponível | Ver health; refazer deploy Dockerfile |
| App: erro ao extrair / timeout | `PULSE_FACE_EXTRACT_ENABLED` false ou URL errada | Ligar flag backend; conferir `PULSE_FACE_SERVICE_URL` e timeout 15s |
| `BIOMETRIC_ENCRYPTION_KEY não configurada` | Chave ausente com enrollment V2 | Gerar e setar no Railway backend |
| Cadastro rejeita vetor “heurístico” | Extract ligado mas app ainda manda hash | `EXPO_PUBLIC_PULSE_FACE_EXTRACT=true` + rebuild EAS |
| Portaria: galeria vazia | Rebuild não rodou ou sem ingressos elegíveis | `POST .../gallery/rebuild`; conferir `facialRequired`, `ISSUED`, `hasBio` |
| `facial-match` sempre falha | Threshold alto ou cadastro legado | Recadastrar com extract; baixar threshold em homolog |
| `401` em `/internal/*` | `PULSE_INTERNAL_API_KEY` errada ou ausente | Alinhar header do cron com variável Railway |
| `401` backend → pulse-face | API keys diferentes | Mesmo valor em `PULSE_FACE_SERVICE_API_KEY` nos dois serviços |
| Identify lento só com muitos rostos | MySQL 1:N no limite | Considerar fase 5 (`PULSE_FACE_USE_IDENTIFY`) — não obrigatório no MVP |
| Railway build timeout | Image ~1,5 GB + download modelos | Aumentar timeout build; usar Dockerfile com cache |
| Produção “facial off” após deploy | Flags default `false` | Esperado — seguir seção 9 |

### Mensagens operacionais (staff / usuário)

Ver tabela US-FAC-011 no [épico](./epic-facial-self-hosted.md): sem cadastro, qualidade baixa, serviço indisponível → **usar QR**.

---

## Referências rápidas

| Documento | Conteúdo |
|-----------|----------|
| [como-funciona-biometria-facial.md](./como-funciona-biometria-facial.md) | Fluxo produto e tabela de flags |
| [facial-lgpd-security.md](./facial-lgpd-security.md) | LGPD, purge, auditoria |
| [facial-enrollment-mvp.md](./facial-enrollment-mvp.md) | Limitações MVP cadastro |
| [epic-facial-self-hosted.md](./epic-facial-self-hosted.md) | User stories e DoD |
| `backend/.env.example` | Variáveis backend |
| `pulse-face/README.md` | Deploy Docker / Railway |

---

*Última atualização: maio/2026 — alinhar com branch `develop` dos repositórios Pulse.*
