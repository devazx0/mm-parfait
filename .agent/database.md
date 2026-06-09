# Database (Prisma)

## Setup

Prisma is configured in the backend app (`apps/api`). The schema lives at `apps/api/prisma/schema.prisma`.

## Commands

```bash
# Generate Prisma client after schema changes
pnpm --filter api prisma generate

# Create a migration
pnpm --filter api prisma migrate dev --name <description>

# Apply migrations to production
pnpm --filter api prisma migrate deploy

# Reset database (drops, re-runs all migrations, runs seed)
pnpm --filter api prisma migrate reset

# Open Prisma Studio
pnpm --filter api prisma studio

# Seed the database
pnpm --filter api prisma db seed
```

## Conventions

- **Plural table names** in snake_case: `user_profiles`, `order_items`.
- **Relations** use implicit many-to-many unless explicit fields are needed.
- **Soft deletes** use a `deleted_at` timestamp column (nullable).
- **Timestamps**: every model gets `created_at` and `updated_at`.

## Schema example

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  @@map("users")
}
```

## Seeding

The seed file `prisma/seed.ts` uses `PrismaClient` directly. Run it with `prisma db seed`. Keep seed data idempotent (use `upsert`).

## Migration workflow

1. Edit `schema.prisma`
2. Run `prisma migrate dev --name <desc>` locally
3. Review the generated SQL in the migration folder
4. Commit both the schema change and the migration folder
5. In CI/production, run `prisma migrate deploy`
