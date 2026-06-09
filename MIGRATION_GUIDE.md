# Prisma Migration Guide

## Running the Migration

After implementing the email OTP authentication system, you need to run Prisma migrations to add the `EmailVerification` table to your database.

### Prerequisites
- PostgreSQL database running and accessible
- `DATABASE_URL` set in `.env.local`
- All dependencies installed (`npm install`)

### Step-by-Step Migration

#### 1. Generate Prisma Client (if not done recently)
```bash
npx prisma generate
```

#### 2. Create and Run Migration
```bash
npx prisma migrate dev --name add-email-verification
```

This command will:
- Create a migration file in `prisma/migrations/`
- Apply the migration to your database
- Generate the Prisma Client

#### 3. Verify Migration Success

Check if the migration was successful by looking for no errors in the output. You should see something like:
```
✔ Your database is now in sync with your schema. ...
✔ Generated Prisma Client to ./node_modules/.prisma/client in 123ms
```

### Migration Details

The migration adds:

```sql
CREATE TABLE "EmailVerification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "maxAttempts" INTEGER NOT NULL DEFAULT 3,
  "expires" TIMESTAMP(3) NOT NULL,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT,
  CONSTRAINT "EmailVerification_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User" ("id") 
    ON DELETE CASCADE
);

CREATE INDEX "EmailVerification_email_idx" ON "EmailVerification"("email");
CREATE INDEX "EmailVerification_userId_idx" ON "EmailVerification"("userId");
```

And updates the User model relationship.

### If Migration Fails

#### Common Issues:

1. **"Error: Can't reach database server"**
   - Ensure PostgreSQL is running
   - Check `DATABASE_URL` in `.env.local` is correct
   - Test connection: `npx prisma db execute --stdin < migration.sql`

2. **"Error: P3018 - Prisma was unable to infer a version"**
   - Remove `prisma/dev.db` if it exists
   - Run `npx prisma generate` first

3. **"Foreign key constraint failed"**
   - Ensure User table exists and has proper structure
   - Previous migrations have run successfully

#### Rollback (if needed):
```bash
npx prisma migrate resolve --rolled-back add-email-verification
```

Then edit the migration file and try again, or:
```bash
npx prisma migrate reset  # WARNING: This deletes all data!
```

### Verify the New Table

After successful migration, verify the table exists:

```bash
# Using Prisma Studio (visual database explorer)
npx prisma studio
```

Then navigate to the `EmailVerification` table to see it's created.

Or using psql:
```sql
\d "EmailVerification"
```

### Next Steps

1. ✅ Migration complete
2. ✅ EmailVerification table created
3. ✅ Update `.env.local` with email credentials
4. Start your dev server: `npm run dev`
5. Test registration and email verification

### Migration File Location

Migration files are stored in:
```
prisma/migrations/{timestamp}-add-email-verification/
```

The `{timestamp}` is when the migration was created. Don't modify these files directly.

### Production Deployment

For production:
```bash
# In production environment
npx prisma migrate deploy
```

This applies all pending migrations without creating new ones.

### Troubleshooting Commands

```bash
# Check migration status
npx prisma migrate status

# View pending migrations
npx prisma migrate status --verbose

# Push schema to database (caution: can lose data)
npx prisma db push

# Create migration from schema changes
npx prisma migrate dev --create-only
```

For more help:
```bash
npx prisma migrate --help
npx prisma db --help
```

### Reference

- [Prisma Migrate Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Schema Documentation](https://www.prisma.io/docs/concepts/components/prisma-schema)
