# Biometria facial — Segurança e LGPD (US-FAC-014)

Checklist operacional para produção do épico facial self-hosted.

## RIPD / tratamento de dados sensíveis

| Item | Status MVP | Notas |
|------|------------|-------|
| Base legal Art. 11 LGPD (consentimento específico) | Implementado | `biometricTermsVersion`, `biometricConsentAt` no cadastro |
| Finalidade limitada (controle de acesso ao evento) | Implementado | Sem uso de embedding para marketing/analytics |
| Minimização (vetor, não foto) | Implementado | App envia 512-d; foto não persiste no backend |
| Direito de exclusão | Implementado | `DELETE /biometry` + invalidação de galeria |
| Retenção pós-evento | Implementado | `PurgeExpiredEventFaceGalleryUseCase` + cron/script |
| Subprocessador de visão (Azure/AWS) | N/A | **Não utilizado** |
| Subprocessador de infra | Railway | Apenas host; DPA com Railway |

## Segurança técnica

### Em repouso

- Vetores em MySQL: **AES-256-GCM** via `BIOMETRIC_ENCRYPTION_KEY` (`biometricCrypto.ts`).
- `biometricHash`: HMAC-SHA256 para dedupe/auditoria (não substitui o vetor).
- Galeria por evento (`event_face_gallery_entries`): embeddings em JSON no MySQL durante o evento; purge após retenção.

### Em trânsito

- Apps ↔ backend: **HTTPS/TLS** (terminação no Railway / CDN).
- Backend ↔ pulse-face: **HTTPS** + header `x-api-key` (`PULSE_FACE_SERVICE_API_KEY`).
- Rotas internas: `x-pulse-internal-key` (`PULSE_INTERNAL_API_KEY`).

### Autenticação serviços

| Fluxo | Mecanismo |
|-------|-----------|
| App cliente → backend | Sessão Better Auth / Bearer |
| Staff → facial-match | RBAC evento + operação |
| Backend → pulse-face | API key |
| Cron purge / rebuild | API interna |

## Retenção

| Dado | Política default | Configuração |
|------|------------------|--------------|
| Template global (`user.biometricVector`) | Até exclusão pelo titular | `DELETE /biometry` |
| Galeria do evento | 30 dias após `endDate` (ou `date` se sem fim) | `FACE_GALLERY_RETENTION_DAYS` |
| Índice pulse-face (Redis/memória) | Removido no purge + `DELETE /v1/gallery/{eventId}` | sync via rebuild |

### Executar purge

**Cron Railway (recomendado):**

```http
POST https://<backend>/internal/facial/purge-expired
x-pulse-internal-key: <PULSE_INTERNAL_API_KEY>
```

**Script:**

```bash
cd backend && bun run scripts/purge-expired-face-galleries.ts
```

**Job embutido (opcional):**

```bash
ENABLE_FACE_GALLERY_PURGE_JOB=true
FACE_GALLERY_PURGE_JOB_INTERVAL_MS=86400000
```

## Auditoria (`BiometricAudit`)

Ações registradas (via `deviceInfo` JSON quando aplicável):

| Ação | Origem |
|------|--------|
| `ENROLLMENT_SUCCESS` / `ENROLLMENT_FAILED` | Cadastro |
| `DELETION` | Exclusão LGPD |
| `CHECKIN_SUCCESS` / `CHECKIN_FAILED` / `CHECKIN_AMBIGUOUS` | Portaria facial |
| `VERIFY_*` / `QR_CHECKIN_SUCCESS` / `MANUAL_OVERRIDE` | QR, 1:1, manual |

Campos sensíveis em `deviceInfo`: `score`, `ticketId`, `staffUserId`, `operationId`, `channel`.

## Checklist go-live produção

- [ ] `BIOMETRIC_ENCRYPTION_KEY` definida (32 bytes, não commitar)
- [ ] `PULSE_FACE_SERVICE_API_KEY` igual em backend e pulse-face
- [ ] TLS em todos os endpoints públicos
- [ ] `FACIAL_*` flags alinhadas ao rollout
- [ ] Cron purge configurado
- [ ] RIPD do produto atualizado com self-hosted + Railway
- [ ] Política de privacidade biométrica publicada (`facial-v1`)

## Subprocessadores

| Fornecedor | Papel | Dado tratado |
|------------|-------|--------------|
| Railway | Host backend + pulse-face + MySQL | Infra; não processa biometria além de armazenar blobs criptografados |
| (nenhum) | Reconhecimento facial cloud | — |
