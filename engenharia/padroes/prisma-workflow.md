# Prisma Workflow (PULSE!)

This document defines the standard procedure for working with Prisma in the Pulse! Pro project. These steps ensure that the database and the generated types remain synchronized and that development stays efficient.

## 🛠️ Modifying the Data Model

Whenever you add or change a model in `prisma/schema.prisma`, follow these steps exactly:

### 1. Update the Schema
Edit your `prisma/schema.prisma` file with the desired changes.

### 2. Synchronization
Depending on your current task, choose one of these two paths:

#### Option A: Fast Prototyping (Non-production)
Use this if you are developing locally and don't care about existing data. This is faster and skips the migration files.
```bash
bun x prisma db push
```
> [!WARNING]
> This may prompt you to reset the database if there are breaking changes. Confirm only if you are okay with losing local test data.

#### Option B: Formal Migration (Recommended)
Use this for production-grade development or when you want to keep a history of database changes.
```bash
bun x prisma migrate dev --name <description_of_change>
```

### 3. Generate the Client
After the sync or migration, ensure your TypeScript types are updated.
```bash
bun x prisma generate
```

## 🐛 Troubleshooting "Ghost" Type Errors
If TypeScript complains that a property (e.g., `event`) "does not exist on type PrismaClient", but you clearly see it in the schema:

1.  **Stop the dev server** (Bun/Elysia).
2.  **Force a clean re-generation:**
    ```bash
    rm -rf node_modules/.prisma
    bun x prisma generate
    ```
3.  **Restart the TS Server:** In VS Code, run the command `TypeScript: Restart TS Server`.

## 📌 Rules for Repository Implementation
- **Always import the `prisma` instance from `@/infrastructure/prisma/db`**.
- Use DTOs for data passing; avoid exposing the raw Prisma types directly outside the repository layer when possible.
- If you encounter naming conflicts (e.g., models with the same name as global types), use strict naming conventions in the schema.

---
*Created per ADR-003 guidance to ensure architectural consistency.*
