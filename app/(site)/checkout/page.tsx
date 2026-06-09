'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { CheckCircle, ShoppingBag, Truck, Shield, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartStore } from '@/store'
import { useAdminCatalogStore } from '@/store/admin-catalog-store'
import type { PlacedOrder } from '@/store/admin-catalog-store'
import { formatGBP } from '@/lib/currency'

function generateOrderId() {
  return `UB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
}

type SavedAddress = {
  id: string
  label?: string | null
  fullName: string
  phone: string
  line1: string
  line2?: string | null
  city: string
  state?: string | null
  postcode: string
  country: string
  isDefault: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.getTotalPrice())
  const clearCart = useCartStore((s) => s.clearCart)
  const addOrder = useAdminCatalogStore((s) => s.addOrder)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [line1, setLine1] = useState('')
  const [city, setCity] = useState('')
  const [postcode, setPostcode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  // Pull email from session and load saved addresses for signed-in users
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email)
      if (session.user.name && !name) setName(session.user.name)
      fetch('/api/user/addresses')
        .then((r) => r.json())
        .then((data) => {
          const list: SavedAddress[] = data.addresses || []
          setSavedAddresses(list)
          // Auto-select default address
          const def = list.find((a) => a.isDefault) || list[0]
          if (def) applyAddress(def)
        })
        .catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email])

  function applyAddress(a: SavedAddress) {
    setSelectedAddressId(a.id)
    setName(a.fullName)
    setLine1([a.line1, a.line2].filter(Boolean).join(', '))
    setCity(a.city)
    setPostcode(a.postcode)
  }

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-md">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-3">Your basket is empty</h1>
        <p className="text-muted-foreground mb-6">Add products before proceeding to checkout.</p>
        <Button asChild className="glow-cyan">
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !line1.trim() || !city.trim() || !postcode.trim()) {
      toast.error('Please complete all fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error('Please enter a valid email address.')
      return
    }

    setSubmitting(true)

    try {
      const orderId = generateOrderId()
      const lines = items.map((i) => ({
        name: i.configuration.name,
        quantity: i.quantity,
        lineTotalGBP: i.configuration.totalPrice * i.quantity,
      }))

      // Always persist locally for guest tracking
      const guestOrder: PlacedOrder = {
        id: orderId,
        email: email.trim(),
        name: name.trim(),
        lines,
        totalGBP: total,
        status: 'received',
        createdAt: new Date().toISOString(),
      }
      addOrder(guestOrder)

      // Also try to save to DB (succeeds when signed in)
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            items: items.map((i) => ({
              configuration: i.configuration,
              quantity: i.quantity,
              price: i.configuration.totalPrice,
            })),
            total,
            shippingAddress: {
              name: name.trim(),
              email: email.trim(),
              line1: line1.trim(),
              city: city.trim(),
              postcode: postcode.trim(),
            },
          }),
        })
      } catch {
        // Non-fatal: order is already saved locally
      }

      clearCart()
      toast.success(`Order ${orderId} placed! Confirmation details sent to ${email.trim()}.`)
      router.push(`/track-order?order=${encodeURIComponent(orderId)}`)
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 lg:py-28 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-muted-foreground mb-10">Complete your order below.</p>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Shipping form */}
        <div className="lg:col-span-3">
          {status === 'unauthenticated' && (
            <div className="rounded-xl border border-border bg-card/50 p-4 mb-6 flex items-center justify-between gap-3 flex-wrap">
              <div className="text-sm">
                <p className="font-medium">Have an account?</p>
                <p className="text-xs text-muted-foreground">Sign in for faster checkout with saved addresses.</p>
              </div>
              <Link href={`/auth/signin?callbackUrl=${encodeURIComponent('/checkout')}`}>
                <Button variant="outline" size="sm">Sign in</Button>
              </Link>
            </div>
          )}

          {savedAddresses.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Use a saved address
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {savedAddresses.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => applyAddress(a)}
                    className={`text-left rounded-lg border p-3 text-xs transition-colors ${
                      selectedAddressId === a.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-medium text-sm">{a.label || a.fullName}</p>
                    <p className="text-muted-foreground truncate">{a.line1}, {a.city} {a.postcode}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-lg font-semibold mb-6">Shipping details</h2>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="line1">Address line 1</Label>
              <Input
                id="line1"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="123 High Street"
                required
                className="mt-1.5"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Town / city</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="London"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="postcode">UK postcode</Label>
                <Input
                  id="postcode"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  placeholder="SW1A 1AA"
                  required
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Shield, label: 'Secure checkout' },
                { icon: Truck, label: 'Free UK delivery' },
                { icon: CheckCircle, label: '1-year warranty' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary/50 text-center">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full glow-cyan"
              size="lg"
              disabled={submitting}
            >
              {submitting ? 'Placing order…' : `Place order · ${formatGBP(total)}`}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By placing your order you agree to our{' '}
              <Link href="/legal/terms" className="underline hover:text-foreground">Terms</Link>
              {' '}and{' '}
              <Link href="/legal/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
            </p>
          </form>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-5">Order summary</h2>
            <ul className="space-y-4 mb-6">
              {items.map((line) => (
                <li key={line.id} className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{line.configuration.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {line.configuration.type} · Qty {line.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">
                    {formatGBP(line.configuration.totalPrice * line.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatGBP(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VAT (20%)</span>
                <span>{formatGBP(total * 0.2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatGBP(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">VAT included in price</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
