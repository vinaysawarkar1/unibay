'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2, CheckCircle, Save } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Profile = {
  name: string | null
  email: string
  emailVerified: string | null
  phone: string | null
  dateOfBirth: string | null
  gender: string | null
  image: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')

  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((d) => {
        const p: Profile = d.profile
        setProfile(p)
        setName(p.name || '')
        setPhone(p.phone || '')
        setDob(p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '')
        setGender(p.gender || '')
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
          dateOfBirth: dob || null,
          gender: gender || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to update profile')
      } else {
        toast.success('Profile updated')
        setProfile(data.profile)
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Card className="p-8 flex items-center gap-3 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /> Loading…</Card>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Personal details</h2>
        <p className="text-sm text-muted-foreground">Update your name, phone, and other personal information.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" required />
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="relative mt-1.5">
                <Input id="email" value={profile?.email || ''} disabled className="pr-10" />
                {profile?.emailVerified && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Email changes are not supported. Contact support if needed.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7700 900000"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="dob">Date of birth</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex justify-end pt-2 border-t border-border">
            <Button type="submit" disabled={saving || !name.trim()} className="glow-cyan">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save changes</>}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
