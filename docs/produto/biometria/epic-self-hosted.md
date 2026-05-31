# Épico — Biometria facial self-hosted (Pulse)

**Épico:** Reconhecimento facial ponta a ponta sem API externa (Azure/AWS), usando serviço próprio de inferência **Face (Python + ONNX / InsightFace)** operado pela Pulse.

**Visão:** O comprador cadastra o rosto no app após a compra; na portaria, o staff valida identidade por reconhecimento facial (1:N no evento) com fallback em QR e busca manual. Templates são **embeddings** (vetores), não fotos armazenadas na nuvem.

**Personas:**
- **Comprador** — usuário do app-client que comprou ingresso com facial obrigatório
- **Staff / Portaria** — operador do app-producer no evento
- **Produtor** — configura evento com `facialRequired`
- **Sistema** — backend Bun + serviço Face (Python) + apps mobile

**Premissas técnicas (decisão de arquitetura):**
- **Cadastro:** app-client extrai embedding no device; envia só vetor + metadados de qualidade ao backend
- **Armazenamento:** `biometricVector` criptografado; sem persistência de foto por padrão
- **Check-in:** app-producer captura rosto → embedding → `POST /operation/:eventId/facial-match` → 1:N **somente** entre participantes do evento com biometria ativa e ingresso `ISSUED`
- **Inferência pesada:** microserviço **pulse-face** (Python/FastAPI + ONNX), não no processo Bun
- **Fallback obrigatório:** QR e busca manual (já existentes no produto)
- **Meta de performance:** &lt; 3 s por pessoa na portaria (CHK-008), com galeria **por evento**

---

## US-FAC-001 — Evento com entrada facial obrigatória

**Como** produtor,  
**quero** marcar no evento que a entrada exige biometria facial,  
**para** garantir que só quem cadastrou o rosto entre na portaria.

### Critérios de aceite
- [ ] Campo `facialRequired` no evento (producer-web / app-producer) persiste no backend
- [ ] Ingressos vendidos para esse evento herdam `requiresFacial = true`
- [ ] Eventos sem facial não exibem fluxo de cadastro nem bloqueiam check-in facial
- [ ] Documentação do produtor deixa claro: QR continua como contingência operacional

### Regras de negócio
- Alterar `facialRequired` **depois** de vendas iniciadas exige política definida (bloquear ou avisar que compradores já cadastrados precisam revalidar)

---

## US-FAC-002 — Compra de ingresso com obrigação de cadastro facial

**Como** comprador,  
**quero** saber na compra que precisarei cadastrar meu rosto antes do evento,  
**para** não ser barrado na entrada.

### Critérios de aceite
- [ ] Checkout / confirmação de pagamento informa claramente: “Cadastro facial obrigatório para este evento”
- [ ] Após pagamento aprovado, app-client direciona para fluxo de cadastro facial (ou destaca pendência na área do ingresso)
- [ ] Ingresso em `Meus ingressos` mostra status: **Facial pendente** / **Facial ok** / **Facial rejeitada**
- [ ] Sem cadastro facial válido, ingresso permanece `ISSUED` mas check-in facial na porta **não** é permitido (QR/manual conforme política)

### Fluxo resumido
```
Compra → Pagamento OK → requiresFacial? → Sim → CTA "Cadastrar rosto"
```

---

## US-FAC-003 — Consentimento LGPD para dado biométrico

**Como** comprador,  
**quero** aceitar termo específico antes de usar a câmera,  
**para** entender finalidade, retenção e meus direitos (Art. 11 LGPD).

### Critérios de aceite
- [ ] Tela de consentimento **antes** da câmera, com link para política biométrica versionada
- [ ] Registro de: `termsVersion`, `consentedAt`, `consentIp` (ou device id), `userId`
- [ ] Campos de consentimento existem no Prisma e são gravados em `POST /biometry/update`
- [ ] Usuário pode recusar; nesse caso não cadastra e vê consequência (“entrada só via QR se permitido pelo produtor”)
- [ ] Texto informa: processamento na infraestrutura Pulse; **não** enviamos foto para Azure/AWS; armazenamos **template matemático (embedding)**

### Regras de negócio
- Consentimento é **específico** para biometria, separado do termo geral do app
- Re-cadastro após exclusão exige novo consentimento

---

## US-FAC-004 — Cadastro facial no app (enrollment)

**Como** comprador,  
**quero** cadastrar meu rosto de forma guiada no celular,  
**para** entrar rápido na portaria sem fila de documento.

### Critérios de aceite

**Captura e qualidade**
- [ ] App usa câmera frontal com guia visual (rosto centralizado, iluminação mínima)
- [ ] Detecção de rosto no device (MediaPipe ou equivalente) antes de capturar
- [ ] Rejeita captura se: sem rosto, múltiplos rostos, blur extremo, rosto muito pequeno
- [ ] Opcional MVP: desafio simples (piscar / virar cabeça) — documentar limitação anti-spoof

**Extração de template**
- [ ] Modelo leve no device (ONNX/TFLite) ou captura de frame enviado **uma vez** ao serviço Face só no cadastro — **preferência:** embedding extraído no device
- [ ] Gera vetor **512-d** (float32), normalizado
- [ ] Pode usar 2–3 capturas e fazer **média** dos embeddings para robustez
- [ ] Calcula `qualityScore` (0–1) e envia ao backend

**Envio ao backend**
- [ ] `POST /biometry/update` com payload:
  ```json
  {
    "biometricVector": [ ...512 floats... ],
    "biometricQuality": 0.92,
    "termsVersionAccepted": "facial-v1",
    "deviceInfo": { "platform", "model", "appVersion" }
  }
  ```
- [ ] **Não** envia `biometricHash` aleatório (remover mock atual)
- [ ] Backend persiste vetor **criptografado** em repouso
- [ ] `biometricHash` = HMAC/SHA do vetor para dedupe e auditoria (não substitui o vetor)
- [ ] `hasBio = true`, `biometricStatus = ACTIVE`
- [ ] Registro em `BiometricAudit`: `ENROLLMENT_SUCCESS` | `ENROLLMENT_FAILED`

**Serviço Face (Python) — papel no cadastro**
- [ ] Endpoint opcional `POST /v1/embedding/extract` se extração for server-side
- [ ] Endpoint `POST /v1/embedding/quality-check` para validar vetor recebido
- [ ] Modelos versionados: `recognition_04` / `detection_03` documentados em config

**Feedback ao usuário**
- [ ] Sucesso: “Rosto cadastrado! Na entrada, aproxime-se da câmera da portaria.”
- [ ] Falha: mensagem acionável + tentar novamente (limite de tentativas/hora)

### Regras de negócio
- Um usuário = um template ativo global (`userId`); re-cadastro **substitui** template anterior e invalida caches de evento
- Cadastro permitido até X horas antes do evento (configurável) ou até o fim do evento — definir com produto

---

## US-FAC-005 — Re-cadastro e exclusão de biometria

**Como** comprador,  
**quero** refazer ou apagar meu cadastro facial,  
**para** exercer controle sobre meu dado sensível.

### Critérios de aceite
- [ ] `DELETE /biometry` remove vetor, zera `hasBio`, status `DELETED`, audit `DELETION`
- [ ] Re-cadastro disponível em Configurações → Privacidade → Biometria
- [ ] Após exclusão, ingressos com `requiresFacial` voltam a status **pendente** na UI
- [ ] Galerias de evento em cache são invalidadas para esse `userId`

---

## US-FAC-006 — Sincronização da galeria facial por evento

**Como** sistema,  
**quero** montar a galeria 1:N apenas com compradores do evento que têm biometria ativa,  
**para** busca rápida na portaria sem varrer toda a base Pulse.

### Critérios de aceite
- [ ] Ao publicar evento ou periodicamente: job `BuildEventFaceGallery(eventId)`
- [ ] Galeria inclui: `userId`, `ticketId`, `embedding`, `sectorId`, flags VIP, `biometricStatus = ACTIVE`
- [ ] Somente tickets: `status = ISSUED`, `requiresFacial = true`, titular com `hasBio = true`
- [ ] Índice vetorial (FAISS / hnswlib) por `eventId`, armazenado em Redis ou disco do serviço Face
- [ ] Rebuild incremental quando: novo cadastro facial, re-cadastro, cancelamento de ingresso, transferência de titular
- [ ] Endpoint interno: `POST /internal/events/:eventId/gallery/rebuild`
- [ ] Métrica: tamanho da galeria, tempo de build, última atualização

### Regras de negócio
- **Nunca** fazer 1:N global na plataforma inteira em produção
- Galeria expira Y dias após o evento (retenção LGPD)

---

## US-FAC-007 — Operação de portaria: modo facial

**Como** staff,  
**quero** abrir o modo de check-in facial no app-producer,  
**para** liberar entrada por reconhecimento sem digitar nome.

### Critérios de aceite
- [ ] Tela `operation/[eventId]/facial` substitui simulação atual
- [ ] Exige operação ativa (`operationId`) e permissão RBAC de check-in
- [ ] UI: preview câmera, contador de tentativas, botão “Escanear rosto”
- [ ] Banner de rede: se offline, avisar “Use QR ou busca manual” (offline completo = fase 2)
- [ ] Exibe resultado: nome, setor, tipo ingresso, foto do perfil (se houver — não do template)

---

## US-FAC-008 — Check-in facial na portaria (1:N)

**Como** staff,  
**quero** apontar a câmera para o rosto do participante e confirmar o match,  
**para** validar entrada em menos de 3 segundos.

### Critérios de aceite

**Captura (app-producer)**
- [ ] Extrai embedding do frame (mesmo pipeline/modelo do cadastro)
- [ ] Envia `POST /operation/:operationId/facial-match`:
  ```json
  {
    "embedding": [ ... ],
    "capturedAt": "ISO8601",
    "deviceInfo": { ... }
  }
  ```

**Backend (Bun)**
- [ ] Valida operação, evento, staff autorizado
- [ ] Encaminha ao serviço Face: `POST /v1/identify` com `{ eventId, embedding, topK: 3 }`
- [ ] Serviço retorna candidatos ordenados por score (cosseno)
- [ ] Backend aplica regras:
  - score ≥ `PULSE_FACE_IDENTIFY_THRESHOLD` (ex. 0.45, calibrado em campo)
  - gap entre 1º e 2º ≥ margem mínima (ex. 0.05) para evitar homônimos
  - ticket do candidato: `ISSUED`, mesmo `eventId`, `requiresFacial`
  - usuário `biometricStatus = ACTIVE`
- [ ] Se único candidato válido → chama `ExecuteCheckInUseCase` existente → ticket `USED`
- [ ] Resposta:
  ```json
  {
    "match": true,
    "confidence": 0.87,
    "participant": { "name", "ticketId", "sector", "batchName" },
    "checkIn": { "id", "checkedInAt" }
  }
  ```

**Serviço Face (Python)**
- [ ] `POST /v1/identify` — busca no índice FAISS do `eventId`
- [ ] `POST /v1/verify` — 1:1 quando staff já identificou participante (fase alternativa)
- [ ] Health: `GET /health` + versão do modelo
- [ ] Timeout configurável; degradação graciosa se serviço indisponível

**UI staff — confirmação**
- [ ] Match com score alto (&gt; 0.55): check-in **automático** + tela verde 2s
- [ ] Match médio (0.45–0.55): exige **confirmação manual** do staff (“É João Silva?”)
- [ ] Sem match / ambíguo: tela vermelha + CTAs “Ler QR” | “Buscar nome”

**Auditoria**
- [ ] `BiometricAudit`: `CHECKIN_SUCCESS`, `CHECKIN_FAILED`, `CHECKIN_AMBIGUOUS`, score, `ticketId`, `staffUserId`, `operationId`

### Regras de negócio
- Um ingresso `USED` não pode ser usado novamente
- Tentativas falhas: rate limit por device (anti-bruteforce)
- Não armazenar frame da portaria por padrão; opcional flag `DEBUG_SAVE_FRAMES` só em homologação

---

## US-FAC-009 — Check-in facial 1:1 (após QR ou busca)

**Como** staff,  
**quero** após ler o QR confirmar que o rosto é do titular,  
**para** evitar transferência indevida de ingresso.

### Critérios de aceite (fase 1.5 — se produto exigir)
- [ ] Após `POST /operation/:id/validate` (QR), opcionalmente pedir “Confirmar rosto”
- [ ] `POST /v1/verify` com `{ userId, embedding }` contra template do titular
- [ ] Falha na verificação: staff decide override com motivo auditado

---

## US-FAC-010 — Fallback QR e busca manual

**Como** staff,  
**quero** usar QR ou busca quando o facial falhar,  
**para** não parar a fila por falha de luz, óculos ou modelo.

### Critérios de aceite
- [ ] Botões sempre visíveis na tela facial
- [ ] QR usa fluxo atual `POST /operation/:id/validate` (sem regressão)
- [ ] Busca manual lista participantes; check-in manual registra motivo `MANUAL_OVERRIDE`
- [ ] Métricas: % check-in facial vs QR vs manual por evento

---

## US-FAC-011 — Estados de erro e mensagens operacionais

**Como** staff/comprador,  
**quero** mensagens claras quando algo falhar,  
**para** saber o que fazer sem chamar suporte.

| Situação | Mensagem / ação |
|----------|-----------------|
| Comprador sem cadastro | “Cadastre o rosto no app Pulse antes da entrada” |
| Cadastro com qualidade baixa | “Melhore a iluminação e mantenha o rosto centralizado” |
| Serviço Face indisponível | “Reconhecimento facial temporariamente indisponível. Use QR.” |
| Score abaixo do limiar | “Rosto não reconhecido. Tente novamente ou use QR.” |
| Dois candidatos próximos | “Match ambíguo. Confirme identidade ou use busca manual.” |
| Ingresso já usado | “Ingresso já utilizado às HH:MM” |
| Evento sem galeria pronta | “Aguarde sincronização (N s)” — spinner no staff app |

---

## US-FAC-012 — Observabilidade e calibração

**Como** time Pulse,  
**quero** monitorar acurácia e latência do facial,  
**para** calibrar thresholds e melhorar o modelo.

### Critérios de aceite
- [ ] Logs estruturados: latência identify, tamanho galeria, score distribuído, taxa FAR/FRR estimada
- [ ] Dashboard admin (fase 2): tentativas por evento, % sucesso, motivos de fallback
- [ ] Feature flags: `FACIAL_ENABLED`, `FACIAL_AUTO_CHECKIN_THRESHOLD`, `FACIAL_REQUIRE_CONFIRMATION_BELOW`
- [ ] Ambiente de homologação com galeria de teste e faces sintéticas

---

## US-FAC-013 — Infraestrutura do serviço Face (Python/ONNX)

**Como** time de plataforma,  
**quero** deploy do microserviço `pulse-face`,  
**para** inferência isolada do backend Bun.

### Critérios de aceite
- [x] Repositório ou pasta `pulse-face/` com FastAPI (MVP: cosseno NumPy; ONNX documentado)
- [x] Docker image; deploy Railway documentado em `pulse-face/README.md`
- [ ] Variáveis:
  ```bash
  PULSE_FACE_MODEL_PATH=/models
  PULSE_FACE_IDENTIFY_THRESHOLD=0.45
  PULSE_FACE_VERIFY_THRESHOLD=0.50
  PULSE_FACE_MIN_SCORE_GAP=0.05
  PULSE_FACE_GALLERY_BACKEND=redis  # ou local
  REDIS_URL=...
  ```
- [ ] Backend Bun:
  ```bash
  PULSE_FACE_SERVICE_URL=http://pulse-face:8080
  PULSE_FACE_SERVICE_API_KEY=...  # mTLS ou API key interna
  BIOMETRIC_ENCRYPTION_KEY=...    # AES para vetores em repouso
  ```
- [x] Testes pytest cosseno; carga 10k &lt; 500ms = fase posterior (FAISS)
- [x] Sem chamadas a Azure Face / AWS Rekognition no código

---

## US-FAC-014 — Segurança e LGPD (não funcionais)

### Critérios de aceite
- [x] Vetores biométricos criptografados em repouso (MySQL) — `BIOMETRIC_ENCRYPTION_KEY`
- [x] TLS em trânsito (documentado); API key entre Bun ↔ pulse-face
- [x] Checklist RIPD operacional em `docs/produto/facial-lgpd-security.md`
- [x] Retenção galeria: `PurgeExpiredEventFaceGalleryUseCase` + cron/script
- [x] Exclusão titular: `DELETE /biometry` + invalidação galeria
- [x] Finalidade limitada a controle de acesso (documentado)
- [x] DPA apenas Railway (host), sem provedor de visão

---

## Mapa de dependências (ordem de implementação)

```
1. Prisma: consent fields + garantir biometricVector
2. pulse-face: extract + identify + FAISS gallery
3. Backend: /biometry/update real + gallery jobs + /facial-match
4. app-client: remover mock hash → enrollment real
5. app-producer: tela facial real + fallbacks
6. Testes de campo → calibrar thresholds
7. (Fase 2) Liveness forte, offline parcial, 1:1 pós-QR
```

---

## Definition of Done (épico completo)

- [ ] Comprador com ingresso `requiresFacial` consegue cadastrar rosto e ver status **ok**
- [ ] Staff consegue check-in facial para participante cadastrado em &lt; 3 s (p95, galeria até 15k, rede 4G estável)
- [ ] Falso positivo em testes de campo &lt; 0,1% (meta inicial; calibrar)
- [ ] QR e manual funcionam como fallback sem regressão
- [ ] Exclusão LGPD remove template e entrada na galeria
- [ ] Zero dependência de API de reconhecimento facial de terceiros em produção
- [ ] Documentação `04-facial.md` e `07-checkin-operation.md` atualizadas para refletir arquitetura self-hosted

---

## Fora de escopo (MVP explícito)

- Treinamento de rede neural própria do zero
- Reconhecimento 100% offline na portaria sem sync prévio
- Liveness nível bancário / anti-deepfake avançado
- Reconhecimento em client-web ou producer-web (somente mobile)
- Identificação cross-evento (“achar usuário em qualquer evento da plataforma”)


---

## Rollout e impacto em produção

### Ordem técnica vs rollout em produção

A ordem de implementação no mapa de dependências (Prisma → pulse-face → backend → apps → campo) **não** precisa coincidir com a ordem de ativação em produção. Recomenda-se:

1. **Deploy** do serviço `pulse-face` e endpoints internos em homologação, sem expor fluxo facial aos usuários finais.
2. **Backend** com feature flags desligadas: manter comportamento atual (mock/legado) até validação.
3. **Habilitar** cadastro real (`FACIAL_ENROLLMENT_ENABLED`) em eventos piloto antes de check-in facial na portaria.
4. **Habilitar** `FACIAL_CHECKIN_ENABLED` somente quando galeria por evento e thresholds estiverem calibrados em testes de campo.

### Estratégia de feature flags

| Flag | Efeito |
|------|--------|
| `FACIAL_ENABLED` | Master switch do épico |
| `FACIAL_ENROLLMENT_ENABLED` | `POST /biometry/update` com vetor real (sem mock hash) |
| `FACIAL_CHECKIN_ENABLED` | `POST .../facial-match` e UI staff real |
| `FACIAL_AUTO_CHECKIN_THRESHOLD` | Score para check-in automático |
| `FACIAL_REQUIRE_CONFIRMATION_BELOW` | Faixa de confirmação manual do staff |

Flags devem ser avaliadas no backend e, quando aplicável, refletidas no app via config remota ou versão mínima.

### Produção não quebra com rollout incremental

- **QR** e **busca manual** permanecem fluxos primários de contingência; não remover nem alterar contratos existentes de `validate` até o facial estar estável.
- Eventos **sem** `facialRequired` não entram em galeria nem exibem CTA de cadastro.
- Staff com facial indisponível recebe mensagem operacional (US-FAC-011) e CTAs para QR/manual.

### Riscos ao remover mock sem flags

- Remover `biometricHash` aleatório ou simulação na portaria **sem** flags e sem serviço Face pronto **quebra** cadastro e check-in para eventos com facial obrigatório.
- Deploy parcial (só app-client) pode enviar payloads que o backend antigo rejeita — exigir compatibilidade de API versionada ou flags sincronizadas.
- **Mitigação:** manter mock atrás de `FACIAL_USE_MOCK=false` default `true` em produção até cutover explícito; monitorar taxa de fallback QR/manual após ligar check-in facial.

