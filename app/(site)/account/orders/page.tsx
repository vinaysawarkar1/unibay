'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Loader2, Package, Search, Filter, CheckCircle, Clock, Truck, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatGBP } from '@/lib/currency'

type Order = {
  id: string
  total: number
  status: string
  createdAt: string
  items: { id: string; productSnap: any; quantity: number; price: number }[]
}

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false))
  }, [])

  const visible = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false
      if (query.trim() && !o.id.toLowerCase().includes(query.trim().toLowerCase())) return false
      return true
    })
  }, [orders, filter, query])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Your orders</h2>
        <p className="text-sm text-muted-foreground">{orders.length} order{orders.length === 1 ? '' : 's'} on this account</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order reference"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap border transition-colors ${
                filter === s
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card className="p-8 flex items-center gap-3 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /> Loading orders…</Card>
      ) : visible.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="font-medium mb-1">
            {orders.length === 0 ? 'No orders yet' : 'No orders match your filter'}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {orders.length === 0 ? 'Place your first order to see it here.' : 'Try a different status or search term.'}
          </p>
          {orders.length === 0 && (
            <Link href="/products">
              <Button className="glow-cyan">Browse products</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  )
}

function OrderRow({ order }: { order: Order }) {
  const itemNames = order.items.slice(0, 2).map((i) => i.productSnap?.name || 'Custom build').join(', ')
  const more = order.items.length > 2 ? ` +${order.items.length - 2} more` : ''
  return (
    <Link href={`/account/orders/${order.id}`}>
      <Card className="p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <p className="font-mono text-sm font-semibold">{order.id}</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground truncate">{itemNames}{more}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Placed {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              {' · '}
              {order.items.length} item{order.items.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 lg:justify-end shrink-0">
            <p className="text-lg font-bold">{formatGBP(order.total)}</p>
            <Button variant="outline" size="sm">View details</Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; icon: any; label: string }> = {
    pending:    { color: 'bg-primary/15 text-primary',       icon: Clock,        label: 'Pending' },
    processing: { color: 'bg-yellow-500/15 text-yellow-500', icon: Clock,        label: 'Processing' },
    shipped:    { color: 'bg-blue-500/15 text-blue-400',     icon: Truck,        label: 'Shipped' },
    delivered:  { color: 'bg-green-500/15 text-green-400',   icon: CheckCircle,  label: 'Delivered' },
    cancelled:  { color: 'bg-red-500/15 text-red-400',       icon: XCircle,      label: 'Cancelled' },
  }
  const s = map[status] || map.pending
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>
      <Icon className="w-3 h-3" /> {s.label}
    </span>
  )
}
