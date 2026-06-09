# Deploy on AWS EC2 (Docker)

This project is a **Next.js + Prisma + PostgreSQL** app.
The recommended deployment method for EC2 is **Docker + docker-compose**.

---

## 1) Prerequisites on the EC2 instance
- Ubuntu/Debian/AL2023 instance with:
  - Docker Engine
  - docker compose plugin
- Security group inbound rules:
  - TCP 22 (SSH) from your IP
  - TCP 3000 from your ALB (or from 0.0.0.0/0 for testing)
  - (Optional) 443 if you terminate TLS on the instance

---

## 2) Upload code to EC2
On EC2, clone/pull this repo into a directory, e.g. `/opt/unibay-custom-pc`.

---

## 3) Create environment file
Create `/opt/unibay-custom-pc/.env.production` (or any name) with at least:

```env
# Required (NextAuth)
NEXTAUTH_URL=https://YOUR_DOMAIN_HERE
NEXTAUTH_SECRET=replace-with-a-long-random-secret

# Required (Prisma)
# If you use the db service from docker-compose.ec2.yml, use:
# DATABASE_URL=postgresql://unibay:unibay_local_dev@db:5432/unibay
DATABASE_URL=replace

# Required (SMTP - Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Optional
ADMIN_EMAILS=you@company.com,another@company.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

If you run Postgres externally (RDS), set `DATABASE_URL` to that endpoint and disable the `db` service in compose.

---

## 4) Start with docker-compose
From the repo root on EC2:

```bash
docker compose -f docker-compose.ec2.yml up -d --build
```

Check logs:

```bash
docker compose -f docker-compose.ec2.yml logs -f web
```

---

## 5) Prisma migrations (important)
This repo does not automatically run migrations in the container on boot.

### Option A (recommended): run migrations once after first deploy
1) Exec into the web container:

```bash
docker compose -f docker-compose.ec2.yml ps
# note container id/name
```

2) Run migrations (choose one):

```bash
docker compose -f docker-compose.ec2.yml exec web pnpm exec prisma generate

docker compose -f docker-compose.ec2.yml exec web pnpm exec prisma migrate deploy
```

If your migrations require `prisma migrate dev`, use it only during development.

### Option B: add an entrypoint script
If you want automatic migrations on each boot, we can add an entrypoint that runs `prisma migrate deploy` before `next start`.

---

## 6) Put it behind HTTPS (recommended)
Recommended architecture:
- ALB terminates TLS (HTTPS)
- ALB forwards to instance port 3000

Set `NEXTAUTH_URL` to the public HTTPS URL.

---

## 7) Updating the app
On code update:

```bash
docker compose -f docker-compose.ec2.yml up -d --build
```

Then re-run migrations if you added schema changes:

```bash
docker compose -f docker-compose.ec2.yml exec web pnpm exec prisma migrate deploy
```

---

## 8) Operational notes
- Email uses Gmail SMTP (`service: gmail`) and requires `EMAIL_PASSWORD` to be a Gmail App Password.
- If you see OTP errors, ensure the SMTP environment vars are correct.
- For production, ensure the EC2 instance has adequate CPU/RAM for Next.js.

---

## 9) Quick checklist
- [ ] Dockerfile + compose working
- [ ] env vars set
- [ ] database reachable
- [ ] Prisma migrations applied
- [ ] `NEXTAUTH_URL` points to the real domain
- [ ] Security group / ALB configured

