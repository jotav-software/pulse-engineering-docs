# Matriz de bloqueios pós-KYC (HU-02)

> Fonte canônica: [pulse-backend/docs/product/kyc-blocking-matrix.md](https://github.com/jotav-software/pulse-backend/blob/develop/docs/product/kyc-blocking-matrix.md)

## Status agregado (`users.producer_kyc_status`)

| Valor | Significado |
|-------|-------------|
| `NOT_STARTED` | Nenhum documento enviado |
| `KYC_PENDING` | Documentos em análise ou incompletos |
| `KYC_APPROVED` | Todos os tipos obrigatórios aprovados |
| `KYC_REJECTED` | Algum obrigatório rejeitado; reenvio via HU-01 |

## Bloqueios

Helpers: `src/shared/constants/producerKycBlocks.ts`

- **Repasse / payout:** `shouldBlockPayoutUntilKycApproved` — até `KYC_APPROVED`
- **Publicar evento:** gate conforme produto
