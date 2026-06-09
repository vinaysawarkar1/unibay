'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SiteLogo } from '@/components/brand/site-logo'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Mode = 'password' | 'otp-request' | 'otp-verify'

export function SignIn() {
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get('callbackUrl') || '/'

  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendIn, setResendIn] = useState(0)
  const otpInputRef = useRef<HTMLInputElement>(null)

  // Resend cooldown timer
  useEffect(() => {
    if (resendIn <= 0) return
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [resendIn])

  useEffect(() => {
    if (mode === 'otp-verify') otpInputRef.current?.focus()
  }, [mode])

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    setLoading(true)
    try {
      const res = await signIn('credentials', { redirect: false, email, password })
      if (res?.error) {
        const msg =
          res.error === 'CredentialsSignin'
            ? 'Incorrect email or password'
            : res.error
        setError(msg)
        toast.error(msg)
      } else if (res?.ok) {
        toast.success('Signed in successfully')
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function sendLoginOtp() {
    setError(null)
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email, type: 'login' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to send code')
        toast.error(data.error || 'Failed to send code')
      } else {
        setMode('otp-verify')
        setResendIn(30)
        if (data.devOtp) {
          setOtp(data.devOtp)
          toast.success(`Dev mode: code is ${data.devOtp}`)
        } else {
          toast.success('A login code has been sent to your email')
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // 1. Verify the OTP server-side (marks the verification row verified:true)
      const verifyRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code: otp }),
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok) {
        setError(verifyData.error || 'Invalid code')
        toast.error(verifyData.error || 'Invalid code')
        setLoading(false)
        return
      }

      // 2. Establish the session via the OTP-aware credentials provider
      const res = await signIn('credentials', {
        redirect: false,
        email,
        otp,
      })
      if (res?.ok) {
        toast.success('Signed in successfully')
        router.push(callbackUrl)
        router.refresh()
      } else {
        setError('Could not complete sign in. Please try again.')
        toast.error('Could not complete sign in')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleGoogle() {
    setGoogleLoading(true)
    signIn('google', { callbackUrl })
  }

  // ---------- OTP VERIFY SCREEN ----------
  if (mode === 'otp-verify') {
    return (
      <AuthShell
        title="Enter your code"
        subtitle={
          <>
            We sent a 6-digit code to <strong className="text-foreground">{email}</strong>
          </>
        }
      >
        {error && <ErrorBanner message={error} />}
        <form onSubmit={handleOtpLogin} className="space-y-5">
          <div>
            <Label htmlFor="otp">Verification code</Label>
            <Input
              id="otp"
              ref={otpInputRef}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="mt-1.5 text-center text-2xl font-mono tracking-[0.5em] h-14"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={otp.length !== 6 || loading} className="w-full glow-cyan" size="lg">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
          </Button>
        </form>
        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => { setMode('otp-request'); setOtp(''); setError(null) }}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <button
            type="button"
            onClick={sendLoginOtp}
            disabled={resendIn > 0 || loading}
            className="text-primary hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
          </button>
        </div>
      </AuthShell>
    )
  }

  // ---------- OTP REQUEST SCREEN ----------
  if (mode === 'otp-request') {
    return (
      <AuthShell title="Sign in with a code" subtitle="We'll email you a one-time login code — no password needed.">
        {error && <ErrorBanner message={error} />}
        <form onSubmit={(e) => { e.preventDefault(); sendLoginOtp() }} className="space-y-4">
          <div>
            <Label htmlFor="otp-email">Email address</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="otp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-10"
                disabled={loading}
                autoFocus
              />
            </div>
          </div>
          <Button type="submit" disabled={!email || loading} className="w-full glow-cyan" size="lg">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send login code'}
          </Button>
        </form>
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => { setMode('password'); setError(null) }}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to password sign in
          </button>
        </div>
      </AuthShell>
    )
  }

  // ---------- PASSWORD SCREEN ----------
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your UNIBAY account">
      {error && <ErrorBanner message={error} />}

      <form onSubmit={handlePasswordLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-10"
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="pl-10 pr-10"
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" disabled={!email || !password || loading} className="w-full glow-cyan" size="lg">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => { setMode('otp-request'); setError(null) }}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 text-sm text-primary hover:underline"
      >
        <KeyRound className="w-4 h-4" />
        Sign in with a one-time code instead
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full"
        size="lg"
      >
        {googleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <GoogleIcon /> Continue with Google
          </>
        )}
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-primary font-medium hover:underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  )
}

/* ---------- Shared presentation ---------- */

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <SiteLogo />
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-black/20">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-1">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground inline-flex items-center justify-center gap-1.5 w-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secured with industry-standard encryption
        </p>
      </div>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
      {message}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  )
}
