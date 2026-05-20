# Matriz de bloqueios pós-KYC (HU-02)

Status agregado do titular em `users.producer_kyc_status`:

| Valor | Significado |
|-------|-------------|
| `NOT_STARTED` | Nenhum documento enviado |
| `KYC_PENDING` | Documentos em análise ou incompletos |
| `KYC_APPROVED` | Todos os tipos obrigatórios aprovados |
| `KYC_REJECTED` | Algum obrigatório rejeitado; reenvio via HU-01 |

Helpers: `backend/src/shared/constants/producerKycBlocks.ts`

## Bloqueios (código)

| Ação | Bloqueado até `KYC_APPROVED`? | Onde |
|------|-------------------------------|------|
| **Publicar evento** (`PUBLISH`) | **Sim** | `ChangeProducerEventStatusUseCase`, `GetEventReadinessUseCase` — HTTP 403 com mensagem explícita |
| **Repasse / saque** | Helper `shouldBlockPayoutUntilKycApproved` definido; **gate ainda não aplicado** nos use cases de payout | Confirmar com produto antes de ligar |

## Fluxos

- **Onboarding produtor:** Producer Web `/onboarding/*` + upload; fila em Pulse Admin `/admin/compliance/kyc`
- **Rejeição:** reenvio de documentos (HU-01); notificação ao produtor — canal TBD (hoje log estruturado)

## Referências

- [pulse-admin.md](../especificacao-funcional/pulse-admin.md) — HU02 fila KYC
- [producer-web.md](../especificacao-funcional/producer-web.md) — onboarding
- [payout-policies.md](./payout-policies.md) — repasse e KYC
