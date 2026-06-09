# Quick Start: Email OTP Authentication

## ⚡ 5-Minute Setup

### Step 1: Get Gmail App Password (2 minutes)

1. Open https://myaccount.google.com in your browser
2. Click **Security** on the left
3. Scroll to **App passwords**
4. Select: Mail → Windows Computer
5. Copy the 16-character password

### Step 2: Update .env.local (1 minute)

Create or update `.env.local`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-password-from-step-1
NEXTAUTH_SECRET=my-random-secret-key-12345
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://...existing...
```

### Step 3: Run Database Migration (1 minute)

```bash
npx prisma generate
npx prisma migrate dev --name add-email-verification
```

### Step 4: Test (1 minute)

```bash
npm run dev
```

Then visit:
- **Sign Up**: http://localhost:3000/auth/register
- **Sign In**: http://localhost:3000/auth/signin

## 🎯 Features Ready

✅ Email signup with OTP verification
✅ Password login (requires verified email)
✅ OTP-based login alternative
✅ Email sending via Gmail (FREE)

## 📝 Email Configuration

Gmail requires an **App Password**, not your real password:
- Secure (dedicated for this app only)
- Revokable anytime
- You can create multiple app passwords
- Free to use

## 🐛 Not Working?

| Problem | Solution |
|---------|----------|
| Email not sent | Check EMAIL_USER and EMAIL_PASSWORD in .env.local |
| "Migrate dev" error | Make sure PostgreSQL is running and DATABASE_URL is correct |
| OTP not arriving | Check spam folder, try resending |
| Login fails | Email must be verified first via OTP |

## 📚 Full Documentation

See `AUTH_OTP_SETUP.md` for complete setup guide and troubleshooting.

## 🚀 What's Implemented

### Database
- `User` model (extended with emailVerified field)
- `EmailVerification` model (stores OTP data)

### API Endpoints
- `POST /api/auth/register` - Register user or handle OTP actions
  - `{name, email, password}` - Create account
  - `{action: "send", email}` - Request OTP
  - `{action: "verify", email, code}` - Verify OTP

### Components
- `Register` component with 2-step flow (signup → OTP verify)
- `SignIn` component with password & OTP login options

### Email Service
- `lib/email.ts` - Gmail SMTP integration
- HTML email templates for verification and login OTPs
- `lib/otp.ts` - OTP generation and validation utilities

## ✨ Next Features

Consider implementing:
- Password reset via OTP
- 2FA for existing accounts
- Email change confirmation
- Account deletion
- Login activity logs

---

**Ready?** Update `.env.local` and run `npm run dev`! 🎉
