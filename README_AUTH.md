Setup for Authentication and Persistence

This project adds NextAuth + Prisma for authentication (Google, Microsoft, email/password) and persistence for user data (profiles, cart items, orders).

1) Install dependencies

```bash
pnpm add next-auth @next-auth/prisma-adapter prisma @prisma/client bcrypt
```

2) Create a database and set `DATABASE_URL` in your `.env` (Postgres recommended):

```
DATABASE_URL=postgresql://user:pass@localhost:5432/unibay
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...
NEXTAUTH_SECRET=your_nextauth_secret
```

3) Run Prisma migrate & generate

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4) Start the dev server

```bash
pnpm dev
```

Files added/changed

- `prisma/schema.prisma` — Prisma models for `User`, `Account`, `Session`, `CartItem`, `Order`, `OrderItem`.
- `lib/prisma.ts` — Prisma client singleton.
- `lib/auth.ts` — NextAuth config with Google, Microsoft and Credentials providers.
- `app/api/auth/[...nextauth]/route.ts` — NextAuth route handler.
- `app/api/auth/register/route.ts` — Registration API for email/password.
- `app/api/cart/route.ts` — Cart API (GET/POST/DELETE) tied to authenticated user.
- `app/api/orders/route.ts` — Orders API to create/list user orders.
- `components/auth/sign-in.tsx` — Simple sign-in component.
- `components/auth/register.tsx` — Simple registration component.
- `store/index.ts` — cart store extended with `loadFromServer` and `pushLocalToServer`.

Notes & next steps

- Configure provider credentials (Google/Microsoft) in the provider consoles and set env vars.
- You may want to add email verification, error handling, and CSRF protections for production.
- Integrate `loadFromServer` and `pushLocalToServer` lifecycle calls where appropriate (on sign-in/out) in the app.

If you want, I can wire the sign-in/register pages into your routing, add server-side session checks for protected pages, and update the cart UI to call the new sync methods on authentication events.