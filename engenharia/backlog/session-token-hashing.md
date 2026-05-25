# M11 — Hash de session tokens no banco

**Status:** backlog  
**Repositório:** [pulse-backend](https://github.com/jotav-software/pulse-backend)  
**Issue:** https://github.com/jotav-software/pulse-backend/issues/29

## Problema

Tokens de sessão (Better Auth, tabela `session`) são armazenados em **texto claro**. Vazamento de backup ou acesso ao DB expõe sessões reutilizáveis.

## OWASP

- A02 Cryptographic Failures
- A07 Identification and Authentication Failures

## Abordagem (resumo)

1. Persistir apenas hash (SHA-256 + pepper ou HMAC) do token.
2. Validar sessão hasheando o token recebido e comparando com timing-safe compare.
3. Migração / invalidação de sessões legadas.
4. Compatibilidade com Better Auth (hooks / adapter).
5. Não logar token nem hash.

## Esforço estimado

3–5 dias (médio–alto).

## Critérios de aceite

Ver issue #29.

## Relacionado

- `engenharia/padroes/security.md` — linha M11
- EPIC melhorias técnicas: `engenharia/backlog/epic-technical-improvements.md`
