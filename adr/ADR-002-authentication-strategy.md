# ADR-002: Authentication & RBAC Strategy

## Status
Proposed

## Context
The Pulse! platform needs a secure way to manage different user types (CLIENT, PRODUCER, ADMIN) and ensure that sensitive routes are only accessible to authenticated and authorized users.

## Decisions

### 1. Unified Auth Middleware
We will implement a custom Elysia middleware that wraps `better-auth`. This middleware will:
- Check for a valid session token in the `Authorization` header or cookies.
- Populate the `user` and `session` objects into the Elysia context.
- **Fail Fast:** If no session is found on a protected route, it will immediately return a `401 Unauthorized` response.

### 2. Role-Based Access Control (RBAC)
Authorizations will be handled by a higher-order middleware:
- `requireRole(['PRODUCER', 'ADMIN'])`
- If the user's role does not match the required list, return a `403 Forbidden`.

### 3. Response Standardization
- **401 Unauthorized:** Missing or invalid session.
- **403 Forbidden:** Authenticated but insufficient permissions for the resource.
- **400 Bad Request:** Validation errors (e.g., invalid CPF).

## Implementation Rules
1. Every route that is NOT public (`/auth/*`, `/swagger`, `/health`) must use the `isAuthenticated` middleware.
2. Business logic (Use Cases) must receive the `userId` from the context, never from the client-side body (to prevent ID spoofing).

## Middleware Usage Example
```typescript
const app = new Elysia()
    .use(authMiddleware)
    .get("/protected", () => "Safe!", {
        detail: { security: [{ bearerAuth: [] }] }
    })
```
