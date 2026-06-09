'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Check,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SiteLogo } from '@/components/brand/site-logo'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function passwordScore(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong']
  const colors = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-yellow-400', 'bg-green-500', 'bg-green-400']
  return { score, label: labels[score], color: colors[score] }
}

export function Register() {
  const router = useRouter()
  const [step, setStep] = useState<'register' | 'verify'>('register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendIn, setResendIn] = useState(0)
  const otpInputRef = useRef<HTMLInputElement>(null)

  const pw = passwordScore(password)

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [resendIn])

  useEffect(() => {
    if (step === 'verify') otpInputRef.current?.focus()
  }, [step])

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) return setError('Please enter your name')
    if (!EMAIL_RE.test(email)) return setError('Please enter a valid email address')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    if (password !== confirm) return setError('Passwords do not match')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
        toast.error(data.error || 'Registration failed')
      } else {
        setStep('verify')
        setResendIn(30)
        if (data.devOtp) {
          setOtp(data.devOtp)
          toast.success(`Dev mode: your code is ${data.devOtp}`)
        } else {
          toast.success('Account created. Check your email for the code.')
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code: otp }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Verification failed')
        toast.error(data.error || 'Verification failed')
        setLoading(false)
        return
      }

      toast.success('Email verified! Signing you in…')
      // Auto sign-in with the password they just set
      const signInRes = await signIn('credentials', { redirect: false, email, password })
      if (signInRes?.ok) {
        router.push('/')
        router.refresh()
      } else {
        // Fall back to the sign-in page if auto login didn't take
        router.push('/auth/signin')
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  async function handleResend() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to resend code')
        toast.error(data.error || 'Failed to resend code')
      } else {
        setResendIn(30)
        if (data.devOtp) {
          setOtp(data.devOtp)
          toast.success(`Dev mode: your code is ${data.devOtp}`)
        } else {
          toast.success('A new code has been sent')
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ---------- VERIFY STEP ----------
  if (step === 'verify') {
    return (
      <AuthShell
        title="Verify your email"
        subtitle={
          <>
            We sent a 6-digit code to <strong className="text-foreground">{email}</strong>
          </>
        }
      >
        {error && <ErrorBanner message={error} />}
        <form onSubmit={handleVerify} className="space-y-5">
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
            <p className="text-xs text-muted-foreground mt-2">Code expires in 10 minutes</p>
          </div>
          <Button type="submit" disabled={otp.length !== 6 || loading} className="w-full glow-cyan" size="lg">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & continue'}
          </Button>
        </form>
        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => { setStep('register'); setOtp(''); setError(null) }}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendIn > 0 || loading}
            className="text-primary hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
          </button>
        </div>
      </AuthShell>
    )
  }

  // ---------- REGISTER STEP ----------
  return (
    <AuthShell title="Create your account" subtitle="Join UNIBAY to build, buy, and track your systems">
      {error && <ErrorBanner message={error} />}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <div className="relative mt-1.5">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              className="pl-10"
              disabled={loading}
              autoFocus
            />
          </div>
        </div>

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
              placeholder="At least 6 characters"
              className="pl-10 pr-10"
              disabled={loading}
              autoComplete="new-password"
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
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${i < pw.score ? pw.color : 'bg-secondary'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{pw.label}</p>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirm"
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              className="pl-10 pr-10"
              disabled={loading}
              autoComplete="new-password"
            />
            {confirm.length > 0 && password === confirm && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          {confirm.length > 0 && password !== confirm && (
            <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !name || !email || !password || password !== confirm}
          className="w-full glow-cyan"
          size="lg"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create account'}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        By creating an account you agree to our{' '}
        <Link href="/legal/terms" className="underline hover:text-foreground">Terms</Link> and{' '}
        <Link href="/legal/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
      </p>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/auth/signin" className="text-primary font-medium hover:underline">
          Sign in
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
