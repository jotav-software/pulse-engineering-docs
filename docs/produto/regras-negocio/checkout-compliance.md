# Aceite legal e compliance de documentos (HU06)

> Fonte interna de produto/engenharia para o funcionamento de documentos legais versionados, aceite global e aceite contextual da Política de Reembolso no checkout. Os textos públicos continuam em `juridico/contratos/` e `juridico/politicas-publicas/`.

**Última revisão:** 2026-05-27

## 1. Objetivo e escopo

O fluxo de aceite legal garante que clientes, produtores e gestores aceitem a versão vigente dos documentos exigidos antes de usar partes protegidas da plataforma. O objetivo é manter trilha auditável de versão, hash do conteúdo, data/hora e evidência técnica mínima, sem transformar a documentação de produto em texto jurídico final.

O escopo cobre:

- aceite global de Termos de Uso, Termos do Produtor e Política de Privacidade;
- reaceite global quando uma nova versão ativa é publicada com `forceAcceptance = true`;
- aceite contextual da Política de Reembolso em cada sessão de checkout;
- consulta e exportação de logs no Pulse Admin.

Fora do escopo: redação jurídica substantiva dos contratos/políticas, retenção definitiva de logs e decisão sobre base legal final. Esses pontos devem ser validados por jurídico/DPO.

## 2. Documentos legais

Os documentos são versionados em `LegalDocument` e publicados pelo Pulse Admin. Cada versão guarda `type`, `version`, `title`, `content`, `contentHash`, `publishedAt`, `isActive` e `forceAcceptance`.

| Tipo | Público | Quando é exigido | Observação |
| --- | --- | --- | --- |
| `TERMS_OF_USE` | Cliente B2C, promoter e papéis de compra | Cadastro/login e reaceite por versão ativa forçada | Aceite global em `UserTermsAcceptance`. |
| `PRIVACY_POLICY` | Cliente B2C e produtor | Cadastro/login e reaceite por versão ativa forçada | Aceite global em `UserTermsAcceptance`. |
| `PRODUCER_TERMS_OF_USE` | Produtor e gestor da produtora | Login/onboarding do produtor e reaceite por versão ativa forçada | Aceite global em `UserTermsAcceptance`; snapshot legado pode refletir em `users.terms_*`. |
| `REFUND_POLICY` | Comprador no checkout | Sempre por sessão de checkout antes de Pix, cartão ou cortesia | Aceite contextual em `RefundPolicyAcceptance`; não entra no aceite global. |

## 3. Fluxo cadastro/login e reaceite global

1. Admin publica uma versão em `/api/admin/v1/compliance/documents`.
2. O backend desativa a versão anterior do mesmo `type`, calcula `contentHash` e marca a nova versão como ativa.
3. Para `TERMS_OF_USE`, `PRIVACY_POLICY` e `PRODUCER_TERMS_OF_USE`, `forceAcceptance = true` torna a versão obrigatória para usuários do público correspondente.
4. `GET /api/client/v1/compliance/pending` retorna documentos pendentes com conteúdo completo para o cliente autenticado.
5. `POST /api/client/v1/compliance/accept` registra o aceite de cada documento.
6. O middleware retorna `403 TERMS_NOT_ACCEPTED` se o usuário tentar acessar rota protegida antes de aceitar tudo que está pendente.

Resposta esperada ao contornar o gate:

```json
{
  "success": false,
  "code": "TERMS_NOT_ACCEPTED",
  "error": "É necessário aceitar os Termos de Uso e Política de Privacidade vigentes.",
  "pendingTerms": [{ "id": "...", "type": "TERMS_OF_USE", "version": "2.4", "title": "..." }]
}
```

Padrão de UI: exibir gate/modal não dismissível, mostrar título/versão/conteúdo do documento dinâmico e exigir ação explícita de aceite. O cliente deve tratar `403 TERMS_NOT_ACCEPTED` no handler HTTP global e reabrir o gate.

`PULSE_ADMIN` é isento do bloqueio para conseguir operar o backoffice. Rotas de compliance/legal também são isentas para permitir que o usuário leia e aceite os documentos.

## 4. Fluxo checkout e Política de Reembolso

A Política de Reembolso é exigida por compra/sessão, mesmo que o usuário já tenha aceitado termos globais. Isso evita depender de aceite antigo para uma condição diretamente ligada ao pedido.

Fluxo canônico:

1. Cliente inicia sessão em `POST /api/client/v1/checkout/initialize`.
2. App Cliente ou Client Web busca/exibe a `REFUND_POLICY` vigente no gate de checkout.
3. Usuário marca o checkbox de aceite da política para aquela sessão.
4. Cliente chama `POST /api/client/v1/checkout/:id/refund-policy/accept`.
5. Backend registra `RefundPolicyAcceptance` com `checkoutSessionId`, documento, versão, hash, IP, user-agent e `source = CHECKOUT`.
6. Pix, cartão e cortesia chamam `ensureRefundPolicyAcceptedForCheckout` antes de concluir pagamento/emissão.

Se o aceite contextual não existir, Pix/cartão/cortesia retornam:

```json
{
  "success": false,
  "code": "REFUND_POLICY_NOT_ACCEPTED",
  "error": "É necessário aceitar a Política de Reembolso vigente antes de concluir o pedido."
}
```

Se não houver política de reembolso ativa/publicada, o backend retorna `REFUND_POLICY_NOT_PUBLISHED`. Este erro é operacionalmente bloqueante: não iniciar go-live de checkout real sem uma versão publicada.

## 5. Auditoria e modelo de dados

O aceite global é idempotente e append-only por usuário/documento: se já existe `UserTermsAcceptance` para o par `userId + termId`, o backend retorna o registro existente e não sobrescreve IP, data/hora ou hash.

Campos principais de `UserTermsAcceptance`:

| Campo | Uso |
| --- | --- |
| `userId` | Usuário que aceitou. |
| `termId` | Versão de `LegalDocument`. |
| `ipAddress` | IP técnico capturado no momento do aceite. |
| `contentHash` | Hash do conteúdo aceito. |
| `acceptedAt` | Data/hora do aceite. |

O aceite contextual da Política de Reembolso é idempotente por `checkoutSessionId + documentId`.

Campos principais de `RefundPolicyAcceptance`:

| Campo | Uso |
| --- | --- |
| `userId` | Comprador responsável pela sessão. |
| `checkoutSessionId` | Sessão/pedido em que a política foi aceita. |
| `documentId`, `documentType`, `version`, `contentHash` | Snapshot da política vigente aceita. |
| `ipAddress`, `userAgent` | Evidência técnica mínima para auditoria. |
| `source` | Origem do aceite, hoje `CHECKOUT`. |
| `context`, `metadata` | Contexto estruturado opcional; não deve guardar dado pessoal desnecessário. |
| `acceptedAt` | Data/hora do aceite. |

Além da tabela contextual, o backend cria `AuditLog` com `action = ACCEPT_REFUND_POLICY` e `entity = CheckoutSession`.

## 6. Pulse Admin

Superfície: `/admin/compliance` e API `/api/admin/v1/compliance`.

Capacidades implementadas:

- listar documentos legais ativos/versionados e KPIs;
- abrir detalhe de documento em `GET /api/admin/v1/compliance/documents/:id`;
- publicar nova versão em `POST /api/admin/v1/compliance/documents`;
- consultar logs granulares em `GET /api/admin/v1/compliance/acceptance-logs`;
- exportar logs em `GET /api/admin/v1/compliance/acceptance-logs/export?format=csv|json`.

Filtros dos logs: `type`, `documentId`, `user`, `startDate`, `endDate`, `source`, `checkoutSessionId`, `limit` e `offset`.

O resultado unifica:

- `GLOBAL`: aceites em `UserTermsAcceptance`;
- `CHECKOUT_REFUND`: aceites em `RefundPolicyAcceptance`.

Campos expostos nos logs: usuário, documento, versão, hash, data/hora, origem, contexto, `checkoutSessionId`, `orderCode`, IP e user-agent. IP/user-agent só devem aparecer nessa superfície administrativa restrita.

## 7. Privacidade, LGPD e retenção

Regras operacionais:

- Não coletar geolocalização no aceite legal. IP não deve ser convertido para cidade/país nesse fluxo.
- IP e user-agent são evidências técnicas; evitar exibição fora do Pulse Admin e evitar envio para analytics/telemetria.
- Não sobrescrever evidência de aceite existente. Idempotência deve preservar o primeiro registro.
- `context` e `metadata` devem ser mínimos e estruturados; não inserir CPF, cartão, endereço ou texto livre com PII.
- O hash do conteúdo aceito deve acompanhar a versão para permitir prova sem depender apenas do texto ativo atual.
- Retenção e base legal final devem seguir `juridico/lgpd/ROPA.md` e `juridico/lgpd/base-legal-por-tratamento.md`; confirmar prazos com DPO/jurídico antes do go-live.

## 8. Backfill, legado e limitações

Há usuários com snapshots legados em `users.terms_accepted_at`, `users.terms_accepted_ip` e `users.terms_version_accepted`. O script `backend/scripts/backfill-legacy-legal-acceptances.ts` cria linhas em `UserTermsAcceptance` apenas quando consegue casar a versão legada com uma versão publicada; fallback para versão ativa atual exige opt-in (`--allow-current-version-fallback`).

Limitações conhecidas:

- aceitar termos globais não substitui aceite contextual de `REFUND_POLICY`;
- `REFUND_POLICY` publicada pelo Admin força `forceAcceptance = false` no backend, pois o requisito é por checkout, não por login;
- usuário sem evidência legada confiável deve ser tratado como pendente no próximo acesso;
- se a sessão expirar ou fechar, o aceite de reembolso daquela sessão não deve ser reaproveitado em nova compra;
- textos jurídicos públicos continuam em draft técnico até revisão por advogado(a)/DPO.

## 9. Critérios operacionais e QA

Checklist mínimo para release:

1. Publicar versões ativas de `TERMS_OF_USE`, `PRIVACY_POLICY`, `PRODUCER_TERMS_OF_USE` e `REFUND_POLICY`.
2. Criar cliente novo e validar aceite automático/pendente no cadastro/login conforme versão ativa.
3. Publicar nova versão de Termos/Privacidade com `forceAcceptance = true` e validar bloqueio `TERMS_NOT_ACCEPTED`.
4. Publicar `REFUND_POLICY` e validar que ela aparece no checkout, não no gate global.
5. Tentar Pix/cartão/cortesia sem aceitar reembolso e confirmar `REFUND_POLICY_NOT_ACCEPTED`.
6. Aceitar reembolso na sessão e concluir Pix/cartão/cortesia.
7. Repetir `POST /checkout/:id/refund-policy/accept` e confirmar idempotência sem sobrescrever evidência.
8. Ver logs em `/admin/compliance`, filtrar por usuário/documento/sessão e exportar CSV/JSON.
9. Confirmar que IP/user-agent não aparecem nas telas públicas dos usuários.
10. Rodar backfill em `--dry-run` antes de qualquer execução real em base legada.

## 10. Referências

- Jurídico público: [`juridico/contratos/termos-de-uso-cliente.md`](../../juridico/contratos/termos-de-uso-cliente.md), [`juridico/contratos/contrato-adesao-produtor.md`](../../juridico/contratos/contrato-adesao-produtor.md), [`juridico/politicas-publicas/politica-privacidade.md`](../../juridico/politicas-publicas/politica-privacidade.md), [`juridico/politicas-publicas/politica-reembolso.md`](../../juridico/politicas-publicas/politica-reembolso.md)
- LGPD: [`juridico/lgpd/ROPA.md`](../../juridico/lgpd/ROPA.md), [`juridico/lgpd/base-legal-por-tratamento.md`](../../juridico/lgpd/base-legal-por-tratamento.md)
- Admin: [`produto/especificacao-funcional/pulse-admin.md`](../especificacao-funcional/pulse-admin.md), [`produto/especificacao-funcional/fluxos/admin/compliance-termos/`](../especificacao-funcional/fluxos/admin/compliance-termos/)
- Checkout técnico: [`engenharia/arquitetura/payments/especificacao.md`](../../engenharia/arquitetura/payments/especificacao.md)
