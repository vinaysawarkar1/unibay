'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Clock, Package, Truck, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdminCatalogStore } from '@/store/admin-catalog-store'
import type { PlacedOrder } from '@/store/admin-catalog-store'
import { formatGBP } from '@/lib/currency'

type ApiOrder = {
  id: string
  status: string
  total: number
  createdAt: string
  user?: { email?: string; name?: string }
  items: { id: string; productSnap: any; quantity: number; price: number }[]
}

const STATUS_STEPS: Record<string, { label: string; icon: typeof Clock; step: number }> = {
  received: { label: 'Order received', icon: CheckCircle, step: 1 },
  pending:  { label: 'Order received', icon: CheckCircle, step: 1 },
  building: { label: 'Building your system', icon: Package, step: 2 },
  dispatched:{ label: 'Dispatched', icon: Truck, step: 3 },
  delivered: { label: 'Delivered', icon: CheckCircle, step: 4 },
}

function StatusBar({ status }: { status: string }) {
  const current = STATUS_STEPS[status]?.step ?? 1
  const stages = [
    { label: 'Received', icon: CheckCircle },
    { label: 'Building', icon: Package },
    { label: 'Dispatched', icon: Truck },
    { label: 'Delivered', icon: CheckCircle },
  ]
  return (
    <div className="flex items-center gap-0 my-6">
      {stages.map((s, i) => {
        const done = current > i + 1
        const active = current === i + 1
        return (
          <div key={s.label} className="flex items-center flex-1 last:flex-none">
            <div className={`flex flex-col items-center gap-1 ${done || active ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${done ? 'bg-primary border-primary' : active ? 'border-primary bg-primary/20' : 'border-border'}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium hidden sm:block">{s.label}</span>
            </div>
            {i < stages.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${current > i + 1 ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function OrderCard({ order }: { order: PlacedOrder | ApiOrder }) {
  const isLocal = 'lines' in order
  const status = order.status
  const total = isLocal ? (order as PlacedOrder).totalGBP : (order as ApiOrder).total

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Order reference</p>
          <p className="text-xl font-bold font-mono">{order.id}</p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            status === 'delivered' ? 'bg-green-500/20 text-green-400' :
            status === 'dispatched' ? 'bg-blue-500/20 text-blue-400' :
            status === 'building' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-primary/20 text-primary'
          }`}>
            {status}
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <StatusBar status={status} />

      <div className="border-t border-border pt-4">
        <p className="text-sm font-medium mb-3">Items</p>
        <ul className="space-y-2">
          {isLocal
            ? (order as PlacedOrder).lines.map((l) => (
                <li key={l.name} className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{l.name} ×{l.quantity}</span>
                  <span className="font-medium">{formatGBP(l.lineTotalGBP)}</span>
                </li>
              ))
            : (order as ApiOrder).items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {(item.productSnap as any)?.name ?? 'Custom build'} ×{item.quantity}
                  </span>
                  <span className="font-medium">{formatGBP(item.price * item.quantity)}</span>
                </li>
              ))}
        </ul>
        <div className="flex justify-between font-bold text-lg pt-4 border-t border-border mt-4">
          <span>Total</span>
          <span>{formatGBP(total)}</span>
        </div>
      </div>
    </div>
  )
}

export function TrackOrderClient() {
  const localOrders = useAdminCatalogStore((s) => s.orders)
  const search = useSearchParams()
  const initial = search.get('order') ?? ''
  const [query, setQuery] = useState(initial)
  const [searching, setSearching] = useState(false)
  const [apiOrder, setApiOrder] = useState<ApiOrder | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const localMatch = useMemo(
    () => localOrders.find((o) => o.id.toLowerCase() === query.trim().toLowerCase()),
    [localOrders, query]
  )

  // When query arrives via URL param on mount, fetch immediately
  useEffect(() => {
    if (initial.trim()) fetchOrder(initial.trim())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchOrder(id: string) {
    if (!id.trim()) return
    setSearching(true)
    setApiOrder(null)
    setApiError(null)
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setApiOrder(data.order)
      } else if (res.status === 404) {
        setApiError('not_found')
      } else {
        setApiError('error')
      }
    } catch {
      setApiError('error')
    } finally {
      setSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrder(query)
  }

  const found = apiOrder || localMatch

  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 max-w-2xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Track your order</h1>
        <p className="text-muted-foreground">
          Enter the UNIBAY order reference from your confirmation email (e.g. UB-A1B2C3D4).
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          placeholder="UB-A1B2C3D4"
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          className="font-mono"
        />
        <Button type="submit" disabled={searching || !query.trim()} className="glow-cyan shrink-0">
          <Search className="w-4 h-4 mr-2" />
          {searching ? 'Searching…' : 'Track'}
        </Button>
      </form>

      {!found && query.trim() && !searching && (
        <div className="rounded-xl border border-border bg-card/50 p-6 text-center">
          <p className="text-muted-foreground mb-2">No order found for <span className="font-mono font-semibold">{query.trim()}</span></p>
          <p className="text-sm text-muted-foreground">Check the reference in your confirmation email.</p>
        </div>
      )}

      {found && <OrderCard order={found} />}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/support/contact">Need help? Contact us</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>
    </div>
  )
}
