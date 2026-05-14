'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdminCatalogStore } from '@/store/admin-catalog-store'

export function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const addNewsletterEmail = useAdminCatalogStore((s) => s.addNewsletterEmail)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = addNewsletterEmail(email)
    if (!ok) {
      toast.error('Enter a valid email address.')
      return
    }
    toast.success('Thanks — you are on the list for UNIBAY updates.')
    setEmail('')
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="bg-secondary border-border"
        required
      />
      <Button type="submit" className="shrink-0">
        Subscribe
      </Button>
    </form>
  )
}
