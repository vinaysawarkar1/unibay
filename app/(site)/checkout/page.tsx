'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartStore } from '@/store'
import { useAdminCatalogStore } from '@/store/admin-catalog-store'
import type { PlacedOrder } from '@/store/admin-catalog-store'
import { formatGBP } from '@/lib/currency'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.getTotalPrice())
  const clearCart = useCartStore((s) => s.clearCart)
  const addOrder = useAdminCatalogStore((s) => s.addOrder)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [line1, setLine1] = useState('')
  const [city, setCity] = useState('')
  const [postcode, setPostcode] = useState('')

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Nothing to checkout</h1>
        <Button asChild>
          <Link href="/cart">Return to basket</Link>
        </Button>
      </div>
    )
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !line1.trim() || !city.trim() || !postcode.trim()) {
      toast.error('Please complete all fields.')
      return
    }
    const id = `UB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
    const order: PlacedOrder = {
      id,
      email: email.trim(),
      name: name.trim(),
      lines: items.map((i) => ({
        name: i.configuration.name,
        quantity: i.quantity,
        lineTotalGBP: i.configuration.totalPrice * i.quantity,
      })),
      totalGBP: total,
      status: 'received',
      createdAt: new Date().toISOString(),
    }
    addOrder(order)
    clearCart()
    toast.success(`Order ${id} placed. You will receive a confirmation email shortly.`)
    router.push(`/track-order?order=${encodeURIComponent(id)}`)
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 lg:py-28 max-w-lg">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-muted-foreground mb-8">
        UK delivery addresses only in this demo. Total {formatGBP(total)}.
      </p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="line1">Address line 1</Label>
          <Input id="line1" value={line1} onChange={(e) => setLine1(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="city">Town / city</Label>
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="postcode">UK postcode</Label>
          <Input
            id="postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value.toUpperCase())}
            required
          />
        </div>
        <Button type="submit" className="w-full glow-cyan" size="lg">
          Place order
        </Button>
      </form>
    </div>
  )
}
