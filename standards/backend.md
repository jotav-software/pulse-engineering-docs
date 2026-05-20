# Padrões backend

## Stack

- **Runtime:** Bun ≥ 1.2
- **Framework:** Elysia
- **ORM:** Prisma (MySQL)
- **Auth:** Better Auth + sessões Prisma
- **Validação de I/O:** TypeBox via `t` do Elysia (não Zod no backend)

## Controller

- Um arquivo por contexto: `src/presentation/controllers/{admin|producer|client}/v1/...`
- Prefix Elysia + rotas com `body`/`params`/`query` tipados
- `detail` para Swagger (`tags`, `security`, descrição)
- Use case instanciado no topo do módulo (sem container DI)

## Use case

- Classe com `execute(input): Promise<output>`
- DTOs co-localizados (`*DTO`, `*Response`)
- Erros de negócio: `throw new AppError(message, status, code)` ou subclasses
- Transações: `prisma.$transaction` em checkout, transferência, KYC, repasse

## Validação

```typescript
// Exemplo de rota
.post("/login", async ({ body }) => { ... }, {
  body: t.Object({
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 8 }),
  }),
})
```

Validação de negócio adicional em `application/services/` (ex.: upload KYC).

## Resposta de sucesso (convenção)

```json
{ "success": true, "data": { ... } }
```

Alguns endpoints legados retornam payload direto — tratar como dívida técnica.

## Lint

- Biome 2.4 (`bun run lint`)
- `tests/` e `scripts/` excluídos do lint principal

## Gaps prioritários

1. Contrato de erro unificado (ver [errors.md](./errors.md))
2. Repositórios de domínio subutilizados
3. Dependências não usadas no `package.json` (Drizzle, TypeORM)
4. OpenAPI não documenta rotas legadas na raiz
