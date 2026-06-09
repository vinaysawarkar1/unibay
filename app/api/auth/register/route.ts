import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { generateOTP, getOTPExpiryTime, isOTPExpired } from '@/lib/otp'
import { sendOTPEmail, sendLoginOTPEmail, isEmailConfigured } from '@/lib/email'

// In development without SMTP configured, surface the OTP to the client so the
// flow stays testable. Never enabled in production.
const exposeDevOtp = !isEmailConfigured() && process.env.NODE_ENV !== 'production'

// POST /api/auth/register - Register a new user
async function handleRegister(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user without email verification initially
    const user = await prisma.user.create({
      data: {
        name: name || email.split('@')[0],
        email,
        hashedPassword,
      },
    })

    // Generate and send OTP
    const otp = generateOTP(6)
    const expiryTime = getOTPExpiryTime(10)

    await prisma.emailVerification.create({
      data: {
        email,
        code: otp,
        expires: expiryTime,
        userId: user.id,
      },
    })

    // Send OTP email
    await sendOTPEmail(email, otp)

    return NextResponse.json(
      {
        success: true,
        message: 'Account created. Please verify your email with the OTP sent to your inbox.',
        userId: user.id,
        email: user.email,
        ...(exposeDevOtp ? { devOtp: otp } : {}),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register. Please try again.' },
      { status: 500 }
    )
  }
}

// POST /api/auth/register - Handle OTP operations (send, verify)
async function handleOTP(req: NextRequest) {
  try {
    const { action, email, code, type = 'verification' } = await req.json()

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    // SEND OTP
    if (action === 'send') {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
      }

      const existingUser = await prisma.user.findUnique({ where: { email } })

      if (type === 'verification' && existingUser?.emailVerified) {
        return NextResponse.json(
          { error: 'Email already registered and verified' },
          { status: 409 }
        )
      }

      // OTP login requires an existing account
      if (type === 'login' && !existingUser) {
        return NextResponse.json(
          { error: 'No account found for this email. Please create an account first.' },
          { status: 404 }
        )
      }

      // Clean up expired records
      await prisma.emailVerification.deleteMany({
        where: {
          email,
          expires: { lt: new Date() },
        },
      })

      // Rate limiting
      const recentAttempt = await prisma.emailVerification.findFirst({
        where: {
          email,
          createdAt: { gt: new Date(Date.now() - 60 * 1000) },
        },
      })

      if (recentAttempt) {
        return NextResponse.json(
          { error: 'Please wait before requesting another OTP' },
          { status: 429 }
        )
      }

      const otp = generateOTP(6)
      const expiryTime = getOTPExpiryTime(10)

      const existingVerification = await prisma.emailVerification.findFirst({
        where: { email },
        orderBy: { createdAt: 'desc' },
      })

      const verification = existingVerification
        ? await prisma.emailVerification.update({
            where: { id: existingVerification.id },
            data: {
              code: otp,
              expires: expiryTime,
              attempts: 0,
              verified: false,
              userId: existingUser?.id,
            },
          })
        : await prisma.emailVerification.create({
            data: {
              email,
              code: otp,
              expires: expiryTime,
              userId: existingUser?.id,
            },
          })

      if (type === 'login') {
        await sendLoginOTPEmail(email, otp)
      } else {
        await sendOTPEmail(email, otp)
      }

      return NextResponse.json(
        {
          success: true,
          message: 'OTP sent to email',
          verificationId: verification.id,
          ...(exposeDevOtp ? { devOtp: otp } : {}),
        },
        { status: 200 }
      )
    }

    // VERIFY OTP
    if (action === 'verify') {
      if (!email || !code) {
        return NextResponse.json(
          { error: 'Email and OTP code are required' },
          { status: 400 }
        )
      }

      const verification = await prisma.emailVerification.findFirst({
        where: { email, verified: false },
        orderBy: { createdAt: 'desc' },
      })

      if (!verification) {
        return NextResponse.json(
          { error: 'No pending verification found for this email' },
          { status: 404 }
        )
      }

      if (isOTPExpired(verification.expires)) {
        await prisma.emailVerification.delete({ where: { id: verification.id } })
        return NextResponse.json(
          { error: 'OTP has expired. Please request a new one.' },
          { status: 410 }
        )
      }

      if (verification.attempts >= verification.maxAttempts) {
        await prisma.emailVerification.delete({ where: { id: verification.id } })
        return NextResponse.json(
          { error: 'Too many incorrect attempts. Please request a new OTP.' },
          { status: 429 }
        )
      }

      if (verification.code !== code) {
        await prisma.emailVerification.update({
          where: { id: verification.id },
          data: { attempts: verification.attempts + 1 },
        })

        const attemptsLeft = verification.maxAttempts - verification.attempts - 1
        return NextResponse.json(
          { error: 'Invalid OTP code', attemptsLeft },
          { status: 401 }
        )
      }

      // Mark as verified
      await prisma.emailVerification.update({
        where: { id: verification.id },
        data: { verified: true },
      })

      // Update user's emailVerified
      if (verification.userId) {
        await prisma.user.update({
          where: { id: verification.userId },
          data: { emailVerified: new Date() },
        })
      }

      return NextResponse.json(
        { success: true, message: 'Email verified successfully', email },
        { status: 200 }
      )
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('OTP error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const body = await req.clone().json()
  
  // Route based on request body - if it has 'action', it's an OTP operation
  if (body.action) {
    return handleOTP(req)
  }
  
  // Otherwise, it's a registration request
  return handleRegister(req)
}
