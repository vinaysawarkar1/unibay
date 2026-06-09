# Database Setup

## Local development

This project ships its own PostgreSQL 18 binary through the `embedded-postgres`
npm package — no Docker, no system install, no admin rights needed.

```bash
npm install              # installs embedded-postgres (first time)
npm run db:start         # starts PostgreSQL on localhost:5432 (downloads ~70MB on first run)
npm run db:push          # creates / updates tables from prisma/schema.prisma
npm run dev              # starts Next.js — auth, cart, orders all work
```

Open a separate terminal for `npm run db:start` and leave it running. To stop
the database, press Ctrl+C in that terminal (or run `npm run db:stop` from
another shell).

| Script              | What it does                                             |
| ------------------- | -------------------------------------------------------- |
| `npm run db:start`  | Starts PostgreSQL (foreground, must stay open)           |
| `npm run db:stop`   | Stops the running instance                               |
| `npm run db:status` | Reports up/down                                          |
| `npm run db:reset`  | Wipes `.postgres-data/` (must stop first)                |
| `npm run db:push`   | Pushes Prisma schema to the database                     |

**Connection string** (already in `.env`):

```
postgresql://unibay:unibay_local_dev@localhost:5432/unibay
```

Data lives in `.postgres-data/` (gitignored). Delete that folder to start over.

## Production deployment

Use any managed Postgres provider — Render, Neon, Supabase, AWS RDS, etc. Do
**not** ship `embedded-postgres` to production; it's a `devDependency` only.

1. Provision a Postgres database with your hosting provider.
2. Set these environment variables on the deployment platform:
   - `DATABASE_URL` — the full `postgresql://...` connection string (must
     include `?sslmode=require` for most providers).
   - `NEXTAUTH_SECRET` — 32+ random chars (`openssl rand -base64 32`).
   - `NEXTAUTH_URL` — your public URL, e.g. `https://unibay.com`.
   - `EMAIL_USER` / `EMAIL_PASSWORD` — Gmail App Password for OTP delivery.
   - Optional: `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` for Google sign-in.
3. Run `npm run db:push` once against the production DB (or use
   `prisma migrate deploy` if you prefer tracked migrations).
4. `npm run build && npm start`.

The production platform's `DATABASE_URL` env var overrides the local default
in `.env`, so the same code runs against the production database without
changes.

## Troubleshooting

- **"Postgres is already listening on :5432"** — another Postgres is running.
  Stop it or change the port in `scripts/db.js`.
- **Auth fails with database errors** — run `npm run db:push` to (re)create
  the schema after pulling new code.
- **EPERM rename on Prisma generate** — stop the dev server first; it holds a
  file lock on the Prisma engine.
