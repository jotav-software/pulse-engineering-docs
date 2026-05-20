# Job de liberação de repasse (RETAINED → AVAILABLE)

Documentação do **fluxo automatizado no processo HTTP** que altera `Event.payoutStatus` de **`RETAINED`** para **`AVAILABLE`**, quando já passou o marco temporal **D+1 após o término do evento** (interpretação contínua: +24h após `eventEnd`, ver abaixo).

## Onde está no código

| Peça | Arquivo |
|------|---------|
| Agendamento (intervalo no `setInterval`) | `src/index.ts` (apenas se `NODE_ENV !== "test"`) |
| Caso de uso | `src/application/use-cases/payouts/ReleaseRetainedPayoutsUseCase.ts` |
| Cálculo do “término” e da elegibilidade D+1 | `src/shared/utils/eventEnd.ts` (`getEventEndAt`, `getPayoutEligibleAt`) |

Não há worker dedicado só para repasse: o job roda **no mesmo processo** do servidor Bun/Elysia (`setInterval`).

## Comportamento do job

1. Busca todos os **`Event`** com:
   - `payoutStatus = "RETAINED"`;
   - `status` **diferente** de **`CANCELLED`**.
2. Para cada evento, calcula:
   - **Término oficial** → `getEventEndAt({ date, endDate })`:
     - se existe `endDate`, usa esse instante;
     - senão, usa **`date` + 24 horas**.
   - **Momento elegível ao repasse** → `getPayoutEligibleAt(eventEndAt)` =
     **`eventEndAt + 24 horas`** (MVP descrito como D+1 contínuo no código).
3. Se `now >= payoutEligibleAt`, atualiza:
   - `payoutStatus` → **`AVAILABLE`**;
   - `payoutReleasedAt` → horário atual.
4. Se `released > 0`, log informativo com quantidade liberada e total analisado.

Pontos declarados no código:

- **Não depende de check-in**; roda no job periódico.
- Cancelados ficam de fora do `findMany`.

Este passo apenas **troca estado** no modelo; transferência bancária real é responsabilidade de outros fluxos (ex.: histórico, antecipações, políticas financeiras já existentes).

## Variáveis de ambiente

| Variável | Efeito | Padrão |
|----------|--------|--------|
| `ENABLE_PAYOUT_RELEASE_JOB` | Se igual a **`"false"`**, o job **não** inicia (`setInterval` não registra). | ausente ou outro valor → job ligado |
| `PAYOUT_RELEASE_JOB_INTERVAL_MS` | Intervalo em ms entre execuções | `3600000` (1 hora) |

Na inicialização há **uma execução imediata** além das periódicas.

## Modelo de dados (Prisma)

`Event`:

- `payoutStatus` — comentário no schema: **RETAINED**, **AVAILABLE**, **PAID_OUT**, **CANCELLED** (lista de negócio; este job só faz **RETAINED → AVAILABLE**).
- `payoutReleasedAt` — preenchido quando o job marca disponível.

## Erros

Falhas em `execute()` são logadas no startup em `index.ts` sem derrubar o processo principal.

## API financeira do produtor

Overview de repasses, export CSV etc. combinam esse status com outros campos (`payoutBlocked`, datas, etc.). O job descrito aqui é **somente** a liberação automática **RETAINED → AVAILABLE**.

## Linha do tempo (referência)

```
fim do evento (endDate ou início+24h)  ──►  +24h  ──►  elegível  ──►  job pode setar AVAILABLE
```

Em **várias réplicas** do mesmo serviço, o intervalo roda em cada uma; o update é idempotente para quem ainda estiver `RETAINED` no momento do `update`.
