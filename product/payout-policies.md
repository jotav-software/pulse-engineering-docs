# Políticas de repasse e cancelamento de evento

> **Canônico (código):** liberação automática `RETAINED` → `AVAILABLE` via job D+1 após o término do evento.  
> Detalhe técnico: [architecture/job-repasse.md](../architecture/job-repasse.md) · `ReleaseRetainedPayoutsUseCase`.

**Última revisão:** 2026-05-20

---

## 1. Ciclo de status do repasse (implementado)

| Status | Significado | Gatilho no código |
| :--- | :--- | :--- |
| `RETAINED` | Saldo retido após venda paga | Default em `Event` após emissão |
| `AVAILABLE` | Elegível a repasse/saque | Job `ReleaseRetainedPayoutsUseCase` quando `now >= getPayoutEligibleAt(eventEnd)` |
| `PAID_OUT` | Repasse concluído | Fluxos admin/financeiro (fora do job automático) |
| `CANCELLED` | Evento cancelado / saldo zerado | Cancelamento de evento |

### 1.1 Job de liberação (fonte de verdade)

- **Não depende de check-in** nem de contagem de entradas.
- Elegibilidade: **24 horas após o término oficial** do evento (`getEventEndAt` → `endDate` ou `date + 24h`).
- Eventos com `status = CANCELLED` ou `payoutBlocked = true` ficam fora do `findMany`.
- Variáveis: `ENABLE_PAYOUT_RELEASE_JOB`, `PAYOUT_RELEASE_JOB_INTERVAL_MS` (ver [job-repasse.md](../architecture/job-repasse.md)).

```
fim do evento ──► +24h ──► elegível ──► job pode setar AVAILABLE
```

---

## 2. Cancelamento de evento pelo produtor

Quando o produtor cancela um evento, a Pulse prioriza proteção do comprador (CDC).

**Comportamento esperado / implementado no ecossistema:**

1. Ingressos `ISSUED` invalidados.
2. Estornos via gateway (Pagar.me ou Stripe conforme `PAYMENT_PROVIDER`) para pedidos `PAID`.
3. Saldo retido do evento zerado / status financeiro de cancelamento.

Taxa de conveniência: política de reembolso parcial da taxa ao produtor em caso de custo de gateway já processado — **caso a caso** (não automatizado no job de repasse).

---

## 3. Check-in (validação de acesso)

Independente do gatilho de repasse.

| Método | Implementação |
| :--- | :--- |
| **QR** | Payload = `Ticket.qrCodeHash` (UUID), **não** número TKT |
| **Facial 1:N** | `POST .../operation/:id/facial-match` quando `facialRequired` + flags |
| **Facial pós-QR** | `facial-verify` após leitura de QR (quando habilitado) |
| **Manual** | Exige **`cpfLast3`** (3 últimos dígitos do CPF do titular) + `ManualCheckinUseCase` |

**Estados do ingresso na validação:**

- Início: `ISSUED`, `isUsed = false`
- Conclusão: `USED`, `usedAt`, auditoria do staff (`recordOperationCheckinAudit`)

Referência operacional: [especificação App Produtor — Access](./especificacao-funcional/app-produtor.md#37-access-check-in--implementado) · [facial/como-funciona-biometria-facial.md](./facial/como-funciona-biometria-facial.md).

---

## 4. KYC e repasse

| Gate | Status no código |
| :--- | :--- |
| Publicar evento (`PUBLISH`) | **Bloqueado** até `producerKycStatus = KYC_APPROVED` (`shouldBlockPublishUntilKycApproved`) |
| Repasse até KYC | Helper `shouldBlockPayoutUntilKycApproved` existe; **uso no fluxo de saque ainda não aplicado** — ver [kyc-blocking-matrix.md](./kyc-blocking-matrix.md) |

---

## 5. Legado (pré-spec v1.0 — não implementado)

> Texto histórico de `PAYOUT_POLICIES.md` (26/mar/2026). **Não** reflete o job atual.

| Regra legada | Texto antigo | Situação |
| :--- | :--- | :--- |
| Gatilho por check-ins | Liberar `AVAILABLE` com **10 check-ins** OU data + 6h | **Não implementado** — prevalece D+1 do job |
| Anti-fraude por horário | Sem check-in em 2h após início → alerta «Evento Suspeito» | **Não implementado** no backend |
| Transferência D+2 | `PAID_OUT` D+2 após liberação | Processo manual / roadmap; não no job |

Alinhar com produto antes de reintroduzir gatilhos por check-in ou alertas automáticos.

---

## Referências

- [architecture/payments/especificacao.md](../architecture/payments/especificacao.md) — checkout, multi-PSP, taxas
- [global-business-rules.md](./global-business-rules.md) — regras invioláveis transversais
- [especificacao-funcional/README.md](./especificacao-funcional/README.md) — mapa por sistema
