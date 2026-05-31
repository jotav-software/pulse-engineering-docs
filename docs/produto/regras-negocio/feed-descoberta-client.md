# Feed de descoberta do cliente

> Escopo: App Cliente, Client Web e backend B2C | Público: engenharia/produto | Última revisão: 2026-05-28

## 1. Objetivo

O feed de descoberta apresenta eventos públicos ao comprador final com um contrato único e compatível com clientes existentes. O endpoint base continua sendo `GET /events/feed` e seu espelho canônico `GET /api/client/v1/events/feed`.

O Client Web deve continuar funcionando com os campos atuais (`featured`, `trending`, `nearby`, `upcoming`). O App Cliente pode usar campos extras opcionais para personalização quando houver sessão válida.

## 2. Regras por estado

| Estado | Quando aparece | O que aparece | O que não aparece |
| --- | --- | --- | --- |
| D1 — default sem ingresso ativo | Usuário sem login ou logado sem ingresso ativo hoje; há eventos disponíveis. | Saudação, busca, categorias, card de curadoria (`hero` ou primeiro destaque), seções `trending` e `upcoming`. | Não mostra bloco "Seu ingresso" nem qualquer dado dependente de login. |
| D2 — cover promovido pela curadoria | Há evento promovido elegível para destaque. | `hero` com evento promovido, CTA "Ver evento" e metadados públicos. | Não força promoção se o evento não for público/listável. |
| D3 — usuário tem ingresso para hoje | Usuário autenticado possui ingresso `ISSUED` ou `RESERVED`/pendente de pagamento para evento que acontece hoje e ainda não terminou. | Bloco `todayTicket` com evento, horário e CTA para apresentar entrada/mapa. O restante do feed continua público. | Não retorna ingresso de outro usuário, ingresso cancelado, transferido, usado como único critério de entrada, ou evento passado. |
| Empty city | Não há eventos elegíveis na cidade/estado solicitados. | Empty state da cidade e fallback `fallbackNearby` com eventos de outras cidades, se houver. | Não inventa eventos locais e não mistura fallback dentro de `upcoming` local. |
| Empty saved | Aba "Salvos" do App Cliente sem favoritos mockados. | Empty state local do app e recomendações públicas já retornadas pelo feed. | Não consulta backend de favoritos/salvos nesta fase. |
| Loading | Requisição em andamento. | Skeleton local do app. | Não depende de resposta parcial do backend. |

## 3. Matriz logged out / logged in

| Situação | Entrada HTTP | Resposta permitida |
| --- | --- | --- |
| Sem login | Sem `Authorization` ou token ausente. | Apenas dados públicos: `featured`, `trending`, `nearby`, `upcoming`, `hero`, `fallbackNearby`, `meta`. |
| Login inválido/expirado | Token inválido resolvido como sem sessão em rota pública. | Deve degradar para resposta pública; não deve vazar erro de autorização para o feed. |
| Login válido sem ingressos | `Authorization: Bearer <token>` com `user.id`. | Dados públicos + `personalization.isAuthenticated=true`; `todayTicket=null`. |
| Login válido com ingresso hoje | `Authorization: Bearer <token>` com `user.id`. | Dados públicos + `todayTicket` somente do próprio usuário. |
| Usuário recém-logado e sem eventos | Sessão válida, mas sem eventos públicos/listáveis. | Arrays vazios, `todayTicket=null`, `meta.emptyReason="NO_EVENTS"` ou `"NO_LOCAL_EVENTS"` conforme filtros. |

Regra inviolável: sem login nunca retorna variação dependente de login. Com login o endpoint pode retornar mais opções, mas todos os campos personalizados são opcionais e devem ser ignoráveis por clientes antigos.

## 4. Precedência de variações no App Cliente

1. Loading local.
2. Aba "Salvos" selecionada: usa favoritos mockados locais; se vazio, Empty saved.
3. `todayTicket` presente: mostra bloco D3 acima da curadoria.
4. `hero` promovido presente: usa layout D2.
5. Eventos públicos sem `hero` promovido: usa D1 com primeiro destaque/upcoming como curadoria.
6. Sem eventos locais: Empty city com `fallbackNearby`.
7. Sem nenhum evento público: Empty city sem recomendações.

## 5. Contrato do endpoint híbrido

### Request

`GET /events/feed` e `GET /api/client/v1/events/feed`

Query atual preservada:

- `latitude?: string`
- `longitude?: string`
- `city?: string`
- `state?: string`
- `category?: string`

Header opcional:

- `Authorization?: Bearer <session-token>`

### Response

Campos existentes continuam obrigatórios no payload de sucesso:

```json
{
  "success": true,
  "data": {
    "featured": [],
    "trending": [],
    "nearby": [],
    "upcoming": []
  }
}
```

Campos novos são opcionais e backward-compatible:

```json
{
  "success": true,
  "data": {
    "featured": [],
    "trending": [],
    "nearby": [],
    "upcoming": [],
    "hero": null,
    "todayTicket": null,
    "fallbackNearby": [],
    "personalization": {
      "isAuthenticated": false,
      "reason": "ANONYMOUS"
    },
    "meta": {
      "variant": "D1_DEFAULT",
      "emptyReason": null,
      "city": "São Paulo",
      "state": "SP"
    }
  }
}
```

Valores esperados:

- `meta.variant`: `"D1_DEFAULT" | "D2_PROMOTED_COVER" | "D3_TICKET_TODAY" | "EMPTY_CITY"`.
- `meta.emptyReason`: `null | "NO_EVENTS" | "NO_LOCAL_EVENTS" | "CATEGORY_EMPTY"`.
- `personalization.reason`: `"ANONYMOUS" | "AUTHENTICATED" | "NO_ACTIVE_TICKET"`.
- `todayTicket`: `null` ou objeto com `ticketId`, `event`, `startsAt`, `endsAt`, `status`.

## 6. Garantias de fallback

- `featured`, `trending`, `nearby` e `upcoming` sempre são arrays.
- `upcoming` representa eventos locais quando há `city/state`; fallback de outras cidades deve ir em `fallbackNearby`.
- Se não houver promovido, `hero` pode ser o primeiro evento elegível de `featured`/`upcoming` ou `null`, sem quebrar D1.
- `fallbackNearby` deve ser limitado para não substituir paginação futura; alvo inicial: até 5 eventos.
- Em erro de personalização, o endpoint deve responder feed público sem `todayTicket`, não falhar a vitrine.

## 7. Segurança e autorização

- O feed continua público; autenticação é opcional.
- Dados de ingresso só podem ser derivados de `context.user.id` resolvido pelo backend. O cliente não envia `userId`.
- `todayTicket` não inclui QR Code, hash de QR, CPF, e-mail, preço pago, buyerId ou dados financeiros.
- Ingressos `CANCELED`, `REFUNDED`, `REFUND_PENDING`, `TRANSFERRED` e eventos já encerrados não entram em D3.
- Evento associado ao ingresso deve continuar público/listável para aparecer no bloco do feed; caso contrário, o app deve usar a carteira.

## 8. Client Web

O Client Web consome `pulseClient.feed.get()` na rota legada raiz e usa somente:

- `featured[0]`
- `trending`
- `upcoming || nearby`

Decisão: manter endpoint único. Novos campos são aditivos, opcionais e ignoráveis. Criar endpoint específico de app só será necessário se a personalização passar a exigir payload incompatível, paginação própria ou dados sensíveis não adequados ao feed público.

## 9. Plano de validação

- Backend: testes focados do `GetEventFeedUseCase` para D1, D2, D3 autenticado, sem login, cidade vazia e fallback.
- Backend: typecheck/build após mudança de contrato.
- App Cliente: typecheck e validação manual visual contra artefatos D1/D2/D3/empty/loading.
- Client Web: garantir que `EventFeed` atual continua aceitando payload com campos extras e que `upcoming || nearby` permanece preenchido.

## 10. Riscos

- Se D3 usar carteira completa sem filtro, pode vazar ingresso passado ou cancelado no feed.
- Se fallback for misturado em `upcoming`, o app pode dizer que há evento local quando não há.
- Se o endpoint retornar 401 para token expirado em rota pública, a home perde resiliência.
- Favoritos mockados no app devem ser claramente locais para não criar expectativa de persistência entre dispositivos.
