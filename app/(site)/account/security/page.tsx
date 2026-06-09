'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Mail,
  Calendar,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

export default function SecurityPage() {
  const [profile, setProfile] = useState<any>(null)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/user/profile').then(r => r.json()).then(d => setProfile(d.profile))
  }, [])

  const score = passwordScore(newPw)
  const hasPassword = profile?.hasPassword

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPw.length < 6) return toast.error('New password must be at least 6 characters')
    if (newPw !== confirmPw) return toast.error('Passwords do not match')
    setSaving(true)
    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(hasPassword ? { currentPassword: currentPw } : {}),
          newPassword: newPw,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to update password')
      } else {
        toast.success('Password updated successfully')
        setCurrentPw('')
        setNewPw('')
        setConfirmPw('')
        // Refresh profile to get hasPassword=true
        fetch('/api/user/profile').then(r => r.json()).then(d => setProfile(d.profile))
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Security</h2>
        <p className="text-sm text-muted-foreground">Manage password and account security.</p>
      </div>

      {/* Account status */}
      <Card className="p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500" /> Account status
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground inline-flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</span>
            <span>{profile?.email} {profile?.emailVerified && <span className="text-green-500 ml-2">✓ Verified</span>}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground inline-flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> Password</span>
            <span>{hasPassword ? '✓ Set' : 'Not set — set one below'}</span>
          </div>
          {profile?.createdAt && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground inline-flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Member since</span>
              <span>{new Date(profile.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Change password */}
      <Card className="p-6">
        <h3 className="font-semibold mb-1">
          {hasPassword ? 'Change password' : 'Set a password'}
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          {hasPassword
            ? 'Enter your current password and choose a new one.'
            : 'You signed in with a provider. Set a password to also be able to log in with email + password.'}
        </p>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          {hasPassword && (
            <div>
              <Label htmlFor="current">Current password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="current"
                  type={showPw ? 'text' : 'password'}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="new">New password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="new"
                type={showPw ? 'text' : 'password'}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="pl-10 pr-10"
                placeholder="At least 6 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPw ? 'Hide passwords' : 'Show passwords'}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPw.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0,1,2,3,4].map(i => (
                    <span
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${i < score.score ? score.color : 'bg-secondary'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{score.label}</p>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="confirm">Confirm new password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirm"
                type={showPw ? 'text' : 'password'}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            {confirmPw.length > 0 && confirmPw !== newPw && (
              <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={saving || newPw.length < 6 || newPw !== confirmPw || (hasPassword && !currentPw)}
            className="glow-cyan"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update password'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
