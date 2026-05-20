# Comentários no backend (Pulse)

Objetivo: o código deve ser legível pelo próprio TypeScript (nomes e funções pequenas). Comentários servem para **contexto que o código não carrega** — contratos, compatibilidade, regras de negócio rastreáveis e armadilhas reais.

## O que comentar

- **Contrato / integração**: prefixos de rota (ex.: compatibilidade com cliente legado), limitações de tipagem (Elysia/Eden), formato esperado por outro sistema.
- **Regra de negócio** quando houver referência explícita (HU, ID de regra, auditoria/LGPD) ou consequência não óbvia em produção.
- **Invariante ou “por que não…”**: race condition evitada, lock pessimista, motivo de não relançar erro em cleanup passivo, etc.

## O que evitar

- Repetir o que a linha seguinte já diz (`// busca o usuário` antes de `findUnique`).
- Listas numeradas (`// 1. … // 2. …`) só para narrar o fluxo passo a passo; preferir extrair métodos com nomes claros.
- Frases genéricas de estilo assistente (“aqui garantimos que…”, “importante notar que…”) sem conteúdo verificável.
- Misturar idiomas no mesmo arquivo; **padronizar em português** (termos técnicos em inglês quando forem os nomes oficiais da API/lib: `Bearer`, `middleware`, nomes de types).

## Testes

- Comentários em `*.spec.ts` podem indicar **por que** há mock (`prisma` isolado do schema). Uma linha curta basta.

## Formato sugerido

- `//` para notas pontuais junto ao código.
- `/** … */` para exports que precisam de contrato (módulos de rota, funções públicas de biblioteca interna).
- Evitar `BUSINESS RULE` em caixa alta salvo se o time já usar isso como tag em auditorias; preferir frase curta: `// Regra HU3: gatekeeper de app.`

## Revisão

Em PRs que tocarem só estilo, remover comentários que falhem nos critérios acima. Novos comentários devem ser revisados com o mesmo checklist.

## Execução por módulo

Ver [BACKEND_COMMENTS_ROADMAP.md](./BACKEND_COMMENTS_ROADMAP.md).
