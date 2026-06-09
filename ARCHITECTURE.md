# Email OTP Authentication Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │   Register Comp  │         │    SignIn Comp   │              │
│  │ (2-step: signup  │         │ (password/OTP)   │              │
│  │  → OTP verify)   │         │                  │              │
│  └────────┬─────────┘         └────────┬─────────┘              │
│           │                            │                        │
│           └────────────┬───────────────┘                        │
│                        │                                        │
│              POST /api/auth/register                           │
│              { name, email, password }                         │
│              or { action, email, code }                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   NEXT.JS BACKEND                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │        app/api/auth/register/route.ts                     │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │ 1. Registration Handler                              │ │  │
│  │  │    - Validate email & password                       │ │  │
│  │  │    - Hash password with bcrypt                       │ │  │
│  │  │    - Create user in database                         │ │  │
│  │  │    - Generate OTP (6 digits)                         │ │  │
│  │  │    - Send OTP email                                  │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │ 2. OTP Send Handler                                  │ │  │
│  │  │    - Validate email                                  │ │  │
│  │  │    - Check rate limiting (1/min)                     │ │  │
│  │  │    - Clean up expired OTPs                           │ │  │
│  │  │    - Generate new OTP (expires in 10 min)            │ │  │
│  │  │    - Send via email                                  │ │  │
│  │  │    - Store in database                               │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │ 3. OTP Verify Handler                                │ │  │
│  │  │    - Validate email & OTP code                       │ │  │
│  │  │    - Check expiration                                │ │  │
│  │  │    - Track failed attempts (max 3)                   │ │  │
│  │  │    - Mark as verified                                │ │  │
│  │  │    - Set user.emailVerified timestamp                │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          │                                       │
│  ┌─────────────────────┬─┴─┬─────────────────────┐              │
│  │                     │   │                     │              │
│  ▼                     ▼   ▼                     ▼              │
│                                                                   │
│  ┌──────────────────┐ ┌──────────────┐ ┌─────────────────────┐ │
│  │  lib/email.ts    │ │  lib/otp.ts  │ │  lib/auth.ts        │ │
│  │  (Nodemailer)    │ │ (OTP logic)  │ │ (NextAuth config)   │ │
│  │                  │ │              │ │                     │ │
│  │ • Gmail SMTP     │ │ • Generate   │ │ • Credentials       │ │
│  │ • HTML templates │ │ • Validate   │ │   provider          │ │
│  │ • Error handling │ │ • Expiry     │ │ • Session callback  │ │
│  └────────┬─────────┘ └──────────────┘ │ • Email verified    │ │
│           │                             │   check             │ │
│           │                             └─────────────────────┘ │
│           │                                                       │
└─────────────────────────────────────────────────────────────────┘
           │
           └─────────────────────────┬─────────────────┐
                                     │                 │
                    ┌────────────────▼┐       ┌────────▼──────┐
                    │ Gmail SMTP      │       │  PostgreSQL   │
                    │ (Email service) │       │   Database    │
                    │                 │       │               │
                    │ EMAIL_USER      │       │ • User        │
                    │ EMAIL_PASSWORD  │       │ • Session     │
                    │                 │       │ • EmailVerif  │
                    └─────────────────┘       │ • Account     │
                                              │ • Order       │
                                              │ • CartItem    │
                                              └───────────────┘
```

## Data Flow Diagrams

### Registration Flow
```
User                API                  Email               DB
│                   │                    │                   │
├──POST register──>│                    │                   │
│  {name, email,   │                    │                   │
│   password}      │                    │                   │
│                  ├─Validate email─────────────────────────>│
│                  │<─User not exists───────────────────────┤
│                  │                    │                   │
│                  ├─Hash password──────────────────────────>│
│                  │                    │                   │
│                  ├─Create User───────────────────────────>│
│                  │<─User created──────────────────────────┤
│                  │                    │                   │
│                  ├─Generate OTP                           │
│                  │                    │                   │
│                  ├─Create EmailVerif──────────────────────>│
│                  │<─Verification ID───────────────────────┤
│                  │                    │                   │
│                  ├─Send OTP email───────────────────────>│
│                  │<─Email sent────────────────────────────┤
│                  │                    │                   │
│<─201 + user ID──┤                    │                   │
│  + message      │                    │                   │
```

### OTP Verification Flow
```
User                API                  DB
│                   │                    │
├─POST verify OTP->│                    │
│  {email, code}  │                    │
│                  ├─Find EmailVerif────>│
│                  │<─OTP record─────────┤
│                  │                    │
│                  ├─Check expiration    │
│                  ├─Check attempts      │
│                  ├─Validate code       │
│                  │                    │
│                  ├─Mark verified──────>│
│                  │<─Updated────────────┤
│                  │                    │
│                  ├─Update User────────>│
│                  │  emailVerified───────────────────────>│
│                  │<─User updated───────────────────────┤
│                  │                    │
│<─200 OK────────┤                    │
│  + success msg  │                    │
```

### Login Flow (Password-Based)
```
User                NextAuth            API              DB
│                   │                   │                │
├──POST /sign-in──>│                   │                │
│  {email,pwd}    │                   │                │
│                  ├─Call Credentials───>│                │
│                  │  provider         │                │
│                  │                   ├─Find User────>│
│                  │                   │<─User record──┤
│                  │                   │                │
│                  │                   ├─Check email    │
│                  │                   │  Verified      │
│                  │                   │                │
│                  │                   ├─Compare pwd    │
│                  │                   │                │
│                  │<─User object──────┤                │
│                  │                   │                │
│                  ├─Create Session────────────────────>│
│                  │<─Session token─────────────────────┤
│                  │                   │                │
│<─Redirect home──┤                   │                │
│  + set cookie    │                   │                │
```

### Login Flow (OTP-Based)
```
User                API                 Email           DB
│                   │                   │               │
├─Request OTP───>│                   │               │
│  {email}       │                   │               │
│                │                   │               │
│                ├─Generate OTP       │               │
│                │                   │               │
│                ├─Store OTP─────────────────────────>│
│                │<─Stored───────────────────────────┤
│                │                   │               │
│                ├─Send OTP email───────────────────>│
│                │<─Email sent────────────────────────┤
│                │                   │               │
│<─200 OK─────>│                   │               │
│                │                   │               │
│                │                   │ User reads...  │
│                │                   │                │
├─Verify OTP────>│                   │               │
│  {email, code} │                   │               │
│                ├─Validate OTP──────────────────────>│
│                │<─Valid + Update──────────────────┤
│                │                   │               │
│<─200 OK─────>│                   │               │
│  (verified)    │                   │               │
│                │                   │               │
│ [User now can login with credentials or remain logged in]
```

## Database Schema

```
┌──────────────────────┐
│      User            │
├──────────────────────┤
│ id (UUID)            │◄──────┐
│ email (unique)       │       │
│ name                 │       │
│ emailVerified (date) │       │
│ hashedPassword       │       │
│ createdAt            │       │
└──────────────────────┘       │
                               │
┌──────────────────────────────┤
│  EmailVerification           │
├──────────────────────────────┤
│ id (CUID)                    │
│ email (indexed)              │
│ code (6 digits)              │
│ attempts (0-3)               │
│ maxAttempts (default: 3)     │
│ expires (date)               │
│ verified (boolean)           │
│ createdAt (date)             │
│ userId (FK, nullable)────────┘
└──────────────────────────────┘
```

## Request/Response Examples

### Register Request/Response
```
REQUEST:
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}

RESPONSE (201):
{
  "success": true,
  "message": "Account created. Please verify your email...",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com"
}
```

### Send OTP Request/Response
```
REQUEST:
POST /api/auth/register
{
  "action": "send",
  "email": "john@example.com",
  "type": "verification"
}

RESPONSE (200):
{
  "success": true,
  "message": "OTP sent to email",
  "verificationId": "cjld8n7w6000012qn..."
}
```

### Verify OTP Request/Response
```
REQUEST:
POST /api/auth/register
{
  "action": "verify",
  "email": "john@example.com",
  "code": "123456"
}

RESPONSE (200):
{
  "success": true,
  "message": "Email verified successfully",
  "email": "john@example.com"
}
```

## Key Components Relationships

```
┌─────────────────────────────────────┐
│   Frontend Components               │
├─────────────────────────────────────┤
│ • Register (register.tsx)           │
│ • SignIn (sign-in.tsx)              │
│ • Both use Sonner for toasts        │
│ • Form validation in component      │
└─────────────┬───────────────────────┘
              │
              ├─────────────┬─────────────────────┐
              │             │                     │
              ▼             ▼                     ▼
    ┌──────────────────┐  ┌─────────────┐  ┌───────────────┐
    │ API Routes       │  │ Auth Config  │  │ Email Service │
    │ (/api/auth/...)  │  │ (lib/auth.ts)│  │ (lib/email.ts)│
    │                  │  │              │  │               │
    │ • Register       │  │ NextAuth     │  │ Nodemailer    │
    │ • OTP Send       │  │ • Session    │  │ + Gmail SMTP  │
    │ • OTP Verify     │  │ • Callback   │  │ + Templates   │
    │                  │  │ • Provider   │  │               │
    └────────┬─────────┘  └──────┬───────┘  └───────┬───────┘
             │                   │                   │
             └──────────┬────────┴───────────────────┘
                        │
                        ▼
              ┌───────────────────────┐
              │   Utilities           │
              ├───────────────────────┤
              │ • lib/otp.ts          │
              │   - generateOTP()     │
              │   - getOTPExpiryTime()│
              │   - isOTPExpired()    │
              │                       │
              │ • lib/prisma.ts       │
              │   - PrismaClient      │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Database            │
              ├───────────────────────┤
              │ PostgreSQL            │
              │ • User table          │
              │ • EmailVerif table    │
              │ • Session table       │
              │ • Account table       │
              └───────────────────────┘
```

## Security Layers

```
┌────────────────────────────────────────────────────────┐
│ INPUT VALIDATION                                       │
│ • Email format validation (regex)                      │
│ • Password length (min 6 chars)                        │
│ • OTP format (6 digits only)                          │
│ • Request rate limiting                               │
└────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│ AUTHENTICATION CHECKS                                  │
│ • Email verification required for password login       │
│ • OTP expiration (10 minutes)                         │
│ • Failed attempt tracking (max 3)                      │
│ • Unique email constraint                             │
└────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│ ENCRYPTION & HASHING                                  │
│ • Password: bcrypt (10 salt rounds)                   │
│ • Session: NextAuth JWT/session tokens                │
│ • Email: Transmitted via SMTP TLS                     │
│ • Sensitive vars: Environment variables only          │
└────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│ SESSION MANAGEMENT                                    │
│ • Database-backed sessions                            │
│ • Secure cookies (httpOnly)                           │
│ • Automatic cleanup of expired sessions               │
│ • CSRF protection via NextAuth                        │
└────────────────────────────────────────────────────────┘
```
