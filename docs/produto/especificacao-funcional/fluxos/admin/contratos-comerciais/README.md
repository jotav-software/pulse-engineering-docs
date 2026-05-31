# Contratos comerciais por produtora (HU07)

> Escopo: visibilidade operacional de contratos comerciais Pulse ↔ produtora | Público: `PULSE_ADMIN` | Plataforma: Producer Web `/admin/compliance` + API `/api/admin/v1/commercial-contracts` | Última revisão: 2026-05-25

**Mock de referência:** seção *Contratos comerciais por produtora* em [admin-dashboard-mock.html](../../../../../../producer-web/prototypes/admin/admin-dashboard-mock.html) (Compliance & Legal).

**Relacionado:** [pulse-admin.md](../../pulse-admin.md) · [kyc-aprovacao/](../kyc-aprovacao/) · [compliance-termos/](../compliance-termos/) · [contrato-adesao-produtor.md](../../../../juridico/contratos/contrato-adesao-produtor.md)

---

## 1. Contexto e problema

Hoje o Pulse Admin expõe taxa negociada (`pulseFeeBps`) na criação/edição de produtoras, aceite de termos da plataforma (HU06) e fila KYC documental (HU02), mas **não há visão consolidada do contrato comercial** entre Pulse e cada produtora:

- Início e fim de vigência
- PDF assinado anexado
- Aceite dos termos de adesão pelo produtor
- Status documental (KYC) vs contrato comercial
- Alertas de renovação iminente ou vencimento

Operadores jurídicos/financeiros precisam de uma **visão operacional única** na seção Compliance, alinhada ao mock.

---

## 2. User stories / histórias de usuário

### HU07 — Contratos comerciais (visão operacional)

| ID | Como… | Quero… | Para… |
| --- | --- | --- | --- |
| HU07.1 | Operador Pulse (PULSE_ADMIN) | Ver todos os contratos comerciais agrupados por abas (Vigentes / Próx. vencimento / Vencidos) | Priorizar renovações e identificar produtoras sem contrato válido |
| HU07.2 | Operador Pulse | Ver por produtora: nome, CNPJ, taxa negociada vs default, vigência, dias restantes, status e PDF | Auditar condições comerciais sem abrir múltiplas telas |
| HU07.3 | Operador Pulse | Saber se o produtor aceitou os termos de adesão (`PRODUCER_TERMS_OF_USE`) e se o KYC está aprovado | Validar elegibilidade operacional (publicação de eventos, repasse) |
| HU07.4 | Operador Pulse | Anexar ou substituir o PDF do contrato comercial assinado | Manter registro documental centralizado |
| HU07.5 | Operador Pulse | Registrar vigência (início/fim), taxa negociada e referência do contrato (ex.: CT-2025-0142) | Formalizar condições distintas do default da plataforma |
| HU07.6 | Operador Pulse | Criar registro de contrato para produtora existente sem contrato | Cobrir produtoras onboardadas antes desta feature |
| HU07.7 | Sistema | Enviar alertas por e-mail quando contrato entrar em janela de renovação (≤30 dias) ou vencer | Antecipar ação jurídica/comercial *(fase 2 — job + Brevo)* |

### Critérios de aceite (Gherkin resumido)

```gherkin
Feature: Contratos comerciais no Pulse Admin

  Background:
    Given operador autenticado com role PULSE_ADMIN
    And produtora "Ross Produções" com CNPJ e pulseFeeBps=800

  Scenario: Listar contratos vigentes
    Given contrato com PDF, signedAt preenchido, vigência futura >30 dias
    When GET /api/admin/v1/commercial-contracts?tab=active
    Then retorna item com status VIGENTE e daysRemaining > 30

  Scenario: Contrato próximo do vencimento
    Given contrato com endsAt em 27 dias
    When GET /api/admin/v1/commercial-contracts?tab=expiring_soon
    Then retorna item com status RENOVAR

  Scenario: Contrato vencido
    Given contrato com endsAt no passado
    When GET /api/admin/v1/commercial-contracts?tab=expired
    Then retorna item com status VENCIDO

  Scenario: Contrato pendente
    Given produtora sem PDF ou sem signedAt ou sem datas de vigência
    When listagem inclui pendentes
    Then retorna status PENDENTE e vigência "aguardando assinatura"

  Scenario: Anexar PDF
    When POST multipart /commercial-contracts/:id/pdf com application/pdf ≤10MB
    Then storageKey persistido e originalFileName retornado

  Scenario: Produtor sem aceite de termos
    Given termsAcceptedAt null na produtora
    Then coluna operacional indica termsAccepted=false

  Scenario: KYC não aprovado
    Given producerKycStatus != KYC_APPROVED
    Then documentationOk=false mesmo com PDF anexado
```

---

## 3. Regras de negócio

### 3.1 Ciclo de vida do contrato

| Status | Condição | UI (mock) |
| --- | --- | --- |
| **PENDENTE** | Falta `signedAt` OU falta PDF (`storageKey`) OU falta `startsAt`/`endsAt` | Badge amarelo "Pendente"; vigência "aguardando assinatura" |
| **VIGENTE** | PDF + datas + `signedAt`; `endsAt` ≥ hoje; dias restantes **> 30** | Badge verde "Vigente" |
| **RENOVAR** | Mesmo que vigente, mas dias restantes **≤ 30** e `endsAt` ≥ hoje | Badge laranja "Renovar"; destaque na aba "Próx. vencimento" |
| **VENCIDO** | `endsAt` < hoje (independente de PDF) | Aba "Vencidos" |

Constante configurável (MVP): `RENEWAL_WINDOW_DAYS = 30`.

### 3.2 Taxa negociada vs default da plataforma

| Campo | Origem | Regra |
| --- | --- | --- |
| `pulseFeeBps` (produtora) | `users.pulse_fee_bps` | Taxa **efetiva** aplicada no checkout/repasse; default **1000 bps (10%)** |
| `negotiatedFeeBps` (contrato) | `producer_commercial_contracts.negotiated_fee_bps` | Taxa pactuada no contrato comercial; se null, exibir taxa da produtora |
| `feeTierLabel` | Texto livre opcional | Ex.: "enterprise", "padrão", "com cláusula antifraude" — apenas display |

**Regra MVP:** alterar `negotiatedFeeBps` no contrato **não altera automaticamente** `users.pulse_fee_bps`. Sincronização explícita fica para issue filha (evita efeitos colaterais financeiros).

### 3.3 Aceite de termos (distinto do contrato PDF)

- Aceite eletrônico de `PRODUCER_TERMS_OF_USE` (HU06) fica em `users.terms_accepted_at` + histórico `producer_terms_acceptances`.
- Contrato comercial PDF é documento **bilateral assinado** arquivado pelo admin; `signedAt` registra data de assinatura informada/registrada.
- **documentationOk** (computed): `producerKycStatus === KYC_APPROVED` **AND** `storageKey` presente.

### 3.4 Renovação

- Renovação cria **novo registro** (histórico) ou atualiza vigência + novo PDF — MVP: **update in-place** do registro atual; histórico em fase 2.
- Produtora pode ter apenas **um contrato "corrente"** por vez (último `createdAt` ou único registro — ver modelo).

### 3.5 Vínculo com KYC

- KYC documental (`/admin/compliance/kyc`) permanece fluxo separado.
- Na tabela de contratos, link/ação rápida para fila KYC da produtora.
- Aprovação KYC **não** altera status do contrato comercial automaticamente.

### 3.6 Permissões

- Apenas `PULSE_ADMIN` — mesmo gate de `/api/admin/v1/*`.

### 3.7 Storage de PDF

- Reutilizar `FileStoragePort` (local / R2-S3) com prefixo `commercial-contract` por `producerId`.
- MIME permitido: `application/pdf`; tamanho máx. 10 MB (mesmo limite KYC).

---

## 4. Modelo de dados proposto

### 4.1 Tabela `producer_commercial_contracts`

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | UUID | sim | PK |
| `producer_id` | UUID FK → users | sim | Produtora (`role=PRODUCER`) |
| `contract_reference` | VARCHAR(64) | não | Ex.: CT-2025-0142 |
| `negotiated_fee_bps` | INT | não | Taxa pactuada no contrato |
| `fee_tier_label` | VARCHAR(64) | não | Rótulo comercial |
| `starts_at` | DATETIME | não* | Início vigência |
| `ends_at` | DATETIME | não* | Fim vigência |
| `signed_at` | DATETIME | não | Assinatura registrada |
| `storage_key` | VARCHAR(512) | não | Chave R2/local |
| `original_file_name` | VARCHAR(255) | não | Nome do PDF |
| `mime_type` | VARCHAR(128) | não | application/pdf |
| `size_bytes` | INT | não | Tamanho |
| `notes` | TEXT | não | Observações internas |
| `created_by_admin_id` | UUID | não | Auditoria |
| `created_at` / `updated_at` | DATETIME | sim | Timestamps |

\* Obrigatórios para status ≠ PENDENTE.

**Índices:** `(producer_id, created_at DESC)`, `(ends_at)`.

**Enum de status:** calculado em runtime — `VIGENTE | RENOVAR | PENDENTE | VENCIDO` (não persistido no MVP).

### 4.2 Campos enriquecidos na API (join)

| Campo | Fonte |
| --- | --- |
| `producer.name`, `producer.cnpj` | users |
| `producer.pulseFeeBps` | users |
| `producer.producerKycStatus` | users |
| `producer.termsAcceptedAt` | users |
| `producer.termsVersionAccepted` | users |
| `daysRemaining` | computed from `ends_at` |
| `documentationOk` | computed |
| `effectiveFeeBps` | `negotiatedFeeBps ?? producer.pulseFeeBps` |

---

## 5. API endpoints

Base: `/api/admin/v1/commercial-contracts` — auth `PULSE_ADMIN`.

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/` | Lista contratos correntes por produtora. Query: `tab=active\|expiring_soon\|expired\|all`, `search`, `limit`, `offset` |
| GET | `/stats` | Contagens por aba (47 / 4 / 3 no mock) |
| GET | `/:id` | Detalhe + campos operacionais |
| POST | `/` | Criar registro (`producerId`, datas, taxa, referência) |
| PATCH | `/:id` | Atualizar metadados (vigência, taxa, signedAt, notes) |
| POST | `/:id/pdf` | Multipart upload/replace PDF |
| GET | `/:id/pdf` | Download PDF (bytes) |
| DELETE | `/:id/pdf` | Remover anexo (opcional MVP) |

**Backend repo:** `pulse-backend` (Prisma + Elysia). **Frontend:** `pulse-producer-web`.

---

## 6. UI Admin (Compliance)

**Rota:** `/admin/compliance` — nova seção abaixo de *Documentos da plataforma*.

### 6.1 Componentes

| Elemento | Comportamento |
| --- | --- |
| Título | "Contratos comerciais por produtora" |
| Abas | Vigentes · Próx. vencimento · Vencidos (+ contadores) |
| Tabela | PRODUTORA, CONTRATO PDF, TAXA NEGOCIADA, VIGÊNCIA, FALTAM (dias), STATUS, AÇÕES |
| Ações | Download PDF, menu (editar vigência, link KYC, abrir produtora) |
| CTA | "Anexar PDF" / criar contrato para produtora sem registro |

### 6.2 Drawer detalhe (fase 2)

Visão expandida: histórico de aceites de termos, status KYC por documento, notas internas.

---

## 7. Integrações

| Integração | Fase | Detalhe |
| --- | --- | --- |
| KYC | MVP | Link para `/admin/compliance/kyc?producerId=…` |
| Termos HU06 | MVP | Exibir `termsAcceptedAt` / versão na linha ou tooltip |
| E-mail Brevo | Fase 2 | Job diário: contratos com `RENOVAR` ou `VENCIDO` → template alerta ops |
| Sincronizar taxa → `pulseFeeBps` | Fase 2 | Ação explícita "Aplicar taxa ao cadastro" |
| Histórico de versões de contrato | Fase 2 | Múltiplos registros por produtora |
| Assinatura eletrônica (Clicksign/D4Sign) | Backlog | Fora do MVP |

---

## 8. Implementação MVP vs follow-up

| Entrega | MVP | Follow-up |
| --- | --- | --- |
| Modelo Prisma + migration | ✅ | — |
| CRUD + listagem com abas | ✅ | — |
| Upload/download PDF | ✅ | — |
| Seção UI na compliance | ✅ | — |
| Stats por aba | ✅ | — |
| Alertas e-mail | — | Issue filha |
| Drawer detalhe operacional | — | Issue filha |
| Sync taxa negociada → produtora | — | Issue filha |
| Job status diário persistido | — | Opcional |
| Seed/demo data | — | Opcional |

---

## 9. Referências técnicas existentes

- `users.pulse_fee_bps`, `producer_kyc_status`, `terms_accepted_at`
- `ProducerKycDocument` + storage R2 (`createFileStorage`)
- `ProducerTermsAcceptance` + `LegalDocument` type `PRODUCER_TERMS_OF_USE`
- Mock: `producer-web/prototypes/admin/admin-dashboard-mock.html` linhas ~1856–1917
