# Cadastro facial — limitações do MVP (US-FAC-004)

## O que está implementado

- Consentimento LGPD específico antes da câmera (`facial-v1`).
- Captura guiada com `expo-face-detector` (sem rosto, múltiplos rostos, rosto pequeno).
- Heurística de blur via tamanho/resolução da imagem.
- Desafio simples de liveness (timer + piscar) — **não** anti-spoof bancário.
- Embedding 512-d: hash determinístico da captura + média de 2 frames **ou**, com `PULSE_FACE_EXTRACT_ENABLED`, InsightFace via backend/pulse-face.
- Backend: vetor criptografado (AES-256-GCM), `biometricHash` = HMAC de auditoria.

## Feature flag

| Ambiente | Variável | Default |
|----------|----------|---------|
| Backend | `FACIAL_ENROLLMENT_V2` ou `FACIAL_ENROLLMENT_ENABLED` | `false` |
| app-client | `EXPO_PUBLIC_FACIAL_ENROLLMENT_V2` | `false` |
| Backend | `PULSE_FACE_EXTRACT_ENABLED` | `false` |
| Apps | `EXPO_PUBLIC_PULSE_FACE_EXTRACT` | `false` |

Com flag **desligada**, o app envia hash derivado do vetor (compatível com backend legado).  
Com **V2 ligado**, envia `biometricVector` + `biometricQuality` + consentimento.  
Com **extract ligado**, o app chama `POST /biometry/extract` (imagem → pulse-face) antes de `POST /biometry/update`.

## Produção — checklist segurança (US-FAC-014)

Ver [facial-lgpd-security.md](./facial-lgpd-security.md): criptografia em repouso, API key Bun↔pulse-face, retenção de galeria, purge e auditoria.

## pulse-face (US-FAC-013)

- Serviço em `pulse-face/` com identify/verify/rebuild (cosseno NumPy; FAISS/ONNX opcional).
- Deploy Railway separado; `PULSE_FACE_GALLERY_SYNC=true` + `PULSE_FACE_USE_IDENTIFY=true` para delegar 1:N.
- Extração ONNX (`buffalo_l`): `POST /v1/embedding/extract` — incluída no Docker (build baixa modelos).

## Próximas fases

- ONNX on-device nos apps (opcional; hoje preferência é extrair no pulse-face).
- Índice FAISS para galerias >15k.
- Liveness forte e calibração de thresholds em campo.
