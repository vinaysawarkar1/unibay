# Email OTP Authentication System

This project now includes a complete authentication system with **email-based OTP (One-Time Password)** verification and login capabilities.

## Features

✅ **User Registration with Email Verification**
- Sign up with name, email, and password
- Automatic OTP generation and email delivery
- Email verification required before account activation
- Password strength validation (minimum 6 characters)

✅ **Email-Based Login**
- Traditional password-based login
- OTP-based login as alternative or 2FA method
- Session management with NextAuth

✅ **OTP Management**
- 6-digit OTP codes
- 10-minute expiration time
- Maximum 3 incorrect attempts before OTP reset
- Rate limiting (1 OTP per minute per email)
- Automatic cleanup of expired OTPs

✅ **Email Service**
- Free email sending via Gmail SMTP
- No third-party email service subscription required
- Professional HTML email templates

## Setup Instructions

### 1. Install Dependencies

Nodemailer should already be installed. If not:
```bash
npm install nodemailer @types/nodemailer
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root (or update your existing one) with:

```env
# Database (already configured, ensure it's set)
DATABASE_URL=postgresql://user:password@localhost:5432/unibay

# NextAuth
NEXTAUTH_SECRET=generate-a-random-secret-key
NEXTAUTH_URL=http://localhost:3000  # or your deployment URL

# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

#### Setting up Gmail App Password (FREE):

1. Go to https://myaccount.google.com
2. Enable 2-Factor Authentication if not already enabled
3. Go to https://myaccount.google.com/apppasswords
4. Select "Mail" and "Windows Computer" (or your OS)
5. Google will generate a 16-character password
6. Copy this password and set it as `EMAIL_PASSWORD` in `.env.local`
7. ✅ Done! Gmail SMTP is now configured

### 3. Update Database Schema

Run Prisma migrations to add the EmailVerification model:

```bash
npm run prisma:migrate
# Or manually:
npx prisma generate
npx prisma migrate dev --name add-email-verification
```

### 4. Test the System

Start the development server:
```bash
npm run dev
```

- **Registration**: Visit `/auth/register`
- **Login**: Visit `/auth/signin`
- **Test email verification**: Create an account and verify the OTP sent to your email

## API Endpoints

### POST /api/auth/register

#### Register a New User
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "success": true,
  "message": "Account created. Please verify your email with the OTP sent to your inbox.",
  "userId": "user-id",
  "email": "john@example.com"
}
```

#### Send OTP
```json
{
  "action": "send",
  "email": "john@example.com",
  "type": "verification"  // or "login" for login OTP
}
```

#### Verify OTP
```json
{
  "action": "verify",
  "email": "john@example.com",
  "code": "123456"
}
```

Response:
```json
{
  "success": true,
  "message": "Email verified successfully",
  "email": "john@example.com"
}
```

## User Flow

### Registration Flow
```
1. User enters name, email, password → /auth/register
2. Account created, OTP generated and emailed
3. User enters OTP code
4. Email marked as verified
5. User redirected to signin
6. User can now login with password
```

### Login Flows

#### Password-Based Login
```
1. User enters email and password → /auth/signin
2. NextAuth validates credentials
3. Email must be verified (emailVerified set)
4. Session created
5. User authenticated
```

#### OTP-Based Login
```
1. User selects "Sign in with OTP"
2. Enters email → OTP sent
3. Enters OTP code
4. Email verified in database
5. User authenticated
```

## Database Schema

### User Model (Extended)
```prisma
model User {
  id             String
  email          String      @unique
  emailVerified  DateTime?   // Marked as verified after OTP verification
  hashedPassword String?     // For credential auth
  name           String?
  image          String?
  createdAt      DateTime
  emailVerifications EmailVerification[]
  // ... other relations
}
```

### EmailVerification Model (New)
```prisma
model EmailVerification {
  id          String
  email       String
  code        String      // 6-digit OTP
  attempts    Int         // Failed verification attempts
  maxAttempts Int         // Default: 3
  expires     DateTime    // 10 minutes from creation
  verified    Boolean     // Whether this OTP was verified
  userId      String?     // Linked to user if exists
  createdAt   DateTime
}
```

## Security Considerations

✅ **Implemented**
- Password hashing with bcrypt
- OTP rate limiting (1 per minute)
- Maximum 3 failed attempts before OTP expires
- OTP expiration (10 minutes)
- Email verification required before login
- NextAuth session management
- Environment variables for sensitive data

🔒 **Additional Recommendations**
- Use HTTPS in production
- Set strong `NEXTAUTH_SECRET` in production
- Implement rate limiting on signup endpoint
- Monitor failed login attempts
- Consider adding email confirmation resend limits
- Regularly audit auth logs

## Troubleshooting

### "Failed to send OTP. Please try again."
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct in `.env.local`
- Check Gmail app password is 16 characters
- Ensure 2FA is enabled on Gmail account
- Restart dev server after changing env variables

### "Please verify your email first"
- User exists but `emailVerified` is NULL
- User must complete OTP verification from registration
- Send OTP and verify to set `emailVerified` timestamp

### Email not received
- Check spam/junk folder
- Verify email address is spelled correctly
- Check that Gmail SMTP credentials are correct
- Gmail may block automated login attempts; use App Password instead

### OTP Code Expired
- OTP valid for 10 minutes only
- User can request a new OTP using "Resend" button
- Previous OTP codes become invalid

## Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Random secret for NextAuth |
| `NEXTAUTH_URL` | ✅ | Application URL (http://localhost:3000 for dev) |
| `EMAIL_USER` | ✅ | Gmail address for sending OTPs |
| `EMAIL_PASSWORD` | ✅ | Gmail App Password (16 characters) |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth (optional) |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth (optional) |

## Next Steps

1. ✅ Setup `.env.local` with email credentials
2. ✅ Run Prisma migrations
3. ✅ Test registration flow
4. ✅ Test email OTP delivery
5. ✅ Test login flows
6. Consider adding:
   - Password reset via OTP
   - Two-factor authentication (OTP for existing sessions)
   - Email change confirmation
   - Account deletion
   - Activity logging

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all environment variables are set
3. Check application logs for error details
4. Ensure database migrations have run successfully
