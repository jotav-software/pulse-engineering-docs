# Padrões frontend

## Matriz de apps

| App | React | Auth storage | Erros UI | Forms |
|-----|-------|--------------|----------|-------|
| producer-web | 18 | Cookies | Sonner | RHF + zod (amplo) |
| client-web | 18 | Cookies (chaves produtor*) | Sonner | RHF + zod (auth) |
| app-producer | 19 | SecureStore | Alert | Manual / Alert |
| app-client | 19 | SecureStore | Alert | RHF + zod (2 telas) |

\* **Dívida:** client-web reutiliza nomes de cookie do produtor — renomear para `pulse_client_*`.

## Estrutura recomendada (web)

```
src/
  app/           # rotas Next.js
  hooks/         # useQuery / useMutation por domínio
  services/      # chamadas Eden + unwrap
  types/
  lib/
    api/         # client Eden
    errors.ts
    toast.ts
  providers/     # QueryClient
```

## Estrutura mobile (clean architecture)

```
src/
  domain/        # entities, repository interfaces
  data/          # implementations, zustand stores
  infrastructure/# eden, auth, treatyErrors
  presentation/  # screens, hooks
  shared/        # DI, theme, providers
```

## Data fetching

- **Web:** hook → service → Eden → `unwrap()`
- **Mobile:** hook/screen → repository → Eden
- Query keys centralizadas em web (`hooks/query-keys.ts`)

## Inconsistências a alinhar

1. React 18 (web) vs 19 (mobile)
2. better-auth 1.5.x (web) vs 1.6.x (mobile)
3. `axios` em mobile sem uso — remover ou documentar
4. Ausência de Error Boundaries em todos os apps
5. Vitest listado em devDependencies web mas scripts usam `bun test`

## Convenções de hook (web)

```typescript
// Padrão atual em producer-web
export function useEvents() {
  return useQuery({
    queryKey: queryKeys.events.list(),
    queryFn: () => eventsService.list(),
  });
}
```

Mutations: `onError: toast.apiError` quando aplicável.
