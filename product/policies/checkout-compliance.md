# Integração do Compliance Gate (HU06) — Checkout / B2C

O gate de termos bloqueia rotas autenticadas até o usuário aceitar documentos ativos com `forceAcceptance = true`.

## API (app cliente / checkout)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/client/v1/compliance/pending` | Lista termos pendentes (conteúdo completo) |
| `POST` | `/api/client/v1/compliance/accept` | Body: `{ "termId": "<uuid>" }` — registra IP e auditoria |

Rotas legadas espelhadas na raiz: `/compliance/pending`, `/compliance/accept`.

## Resposta 403 ao contornar o modal

Qualquer rota protegida (ex.: `/checkout`, `/payment`) retorna:

```json
{
  "success": false,
  "code": "TERMS_NOT_ACCEPTED",
  "error": "É necessário aceitar os Termos de Uso e Política de Privacidade vigentes.",
  "pendingTerms": [{ "id": "...", "type": "TERMS_OF_USE", "version": "2.4", "title": "..." }]
}
```

## Padrão recomendado no app checkout (repo separado)

1. Após login, chamar `GET /compliance/pending`.
2. Se `pending.length > 0`, exibir overlay full-screen (não dismissível) com markdown e checkbox «Li e concordo».
3. `POST /compliance/accept` por documento até `pending` esvaziar.
4. Tratar `403` + `TERMS_NOT_ACCEPTED` no client HTTP global e reabrir o overlay.

## Login com hint

O login do produtor já retorna `pendingTerms: [{ id, type, version, title }]` para evitar round-trip inicial no `producer-web`.

## Roles isentas

`PULSE_ADMIN` não é bloqueado (operadores internos).
