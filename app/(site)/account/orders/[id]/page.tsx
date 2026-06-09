'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  Package,
  Truck,
  Clock,
  XCircle,
  MapPin,
  Receipt,
  ShoppingBag,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatGBP } from '@/lib/currency'

type Order = {
  id: string
  total: number
  status: string
  createdAt: string
  updatedAt?: string
  shippingAddress?: any
  trackingNumber?: string | null
  items: { id: string; productSnap: any; quantity: number; price: number }[]
}

const STAGES = ['received', 'processing', 'shipped', 'delivered'] as const
const STAGE_INDEX: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [notFound, setNotFound] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${id}`)
      if (res.status === 404) { setNotFound(true); return }
      const data = await res.json()
      setOrder(data.order)
    } finally { setLoading(false) }
  }

  useEffect(() => { if (id) load() }, [id])

  async function handleCancel() {
    if (!confirm('Cancel this order? This cannot be undone.')) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/orders/${id}/cancel`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to cancel order')
      } else {
        toast.success('Order cancelled')
        setOrder(data.order)
      }
    } finally { setCancelling(false) }
  }

  if (loading) {
    return <Card className="p-8 flex items-center gap-3 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /> Loading order…</Card>
  }
  if (notFound || !order) {
    return (
      <Card className="p-12 text-center">
        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="font-medium mb-1">Order not found</p>
        <p className="text-sm text-muted-foreground mb-6">It may have been removed or you don't have access.</p>
        <Button onClick={() => router.push('/account/orders')}>Back to orders</Button>
      </Card>
    )
  }

  const cancellable = ['pending', 'processing'].includes(order.status)
  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <div className="space-y-6">
      <div>
        <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="w-3.5 h-3.5" /> All orders
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold">Order details</h2>
            <p className="text-sm font-mono text-muted-foreground">{order.id}</p>
          </div>
          {cancellable && (
            <Button variant="outline" onClick={handleCancel} disabled={cancelling} className="text-red-400 border-red-500/30 hover:bg-red-500/10">
              {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 mr-2" /> Cancel order</>}
            </Button>
          )}
        </div>
      </div>

      {/* Status tracker */}
      <Card className="p-6">
        <OrderTracker status={order.status} placedAt={order.createdAt} />
        {order.trackingNumber && (
          <div className="mt-4 pt-4 border-t border-border text-sm">
            <span className="text-muted-foreground">Tracking number:</span>{' '}
            <span className="font-mono font-medium">{order.trackingNumber}</span>
          </div>
        )}
      </Card>

      {/* Items + Summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Items
            </h3>
            <ul className="space-y-4">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.productSnap?.name || 'Custom build'}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {item.productSnap?.type || ''} · Qty {item.quantity}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold">{formatGBP(item.price * item.quantity)}</p>
                    <p className="text-xs text-muted-foreground">{formatGBP(item.price)} each</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {order.shippingAddress && (
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Shipping address
              </h3>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p className="text-foreground font-medium">
                  {order.shippingAddress.fullName || order.shippingAddress.name}
                </p>
                {order.shippingAddress.line1 && <p>{order.shippingAddress.line1}</p>}
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}
                  {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}{' '}
                  {order.shippingAddress.postcode}
                </p>
                {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                {order.shippingAddress.phone && <p className="pt-1">{order.shippingAddress.phone}</p>}
              </div>
            </Card>
          )}
        </div>

        <Card className="p-6 lg:sticky lg:top-24 lg:self-start">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Receipt className="w-4 h-4" /> Summary
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatGBP(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="text-green-500">Free</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 font-bold text-base">
              <dt>Total</dt>
              <dd>{formatGBP(order.total)}</dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
            Placed {new Date(order.createdAt).toLocaleString('en-GB')}
          </p>
        </Card>
      </div>
    </div>
  )
}

function OrderTracker({ status, placedAt }: { status: string; placedAt: string }) {
  if (status === 'cancelled') {
    return (
      <div className="text-center py-2">
        <XCircle className="w-10 h-10 mx-auto text-red-400 mb-2" />
        <p className="font-semibold text-red-400">Order cancelled</p>
        <p className="text-xs text-muted-foreground">This order was cancelled and will not be fulfilled.</p>
      </div>
    )
  }

  const current = STAGE_INDEX[status] ?? 0
  const stages = [
    { label: 'Placed', icon: CheckCircle, sub: new Date(placedAt).toLocaleDateString('en-GB') },
    { label: 'Processing', icon: Clock },
    { label: 'Shipped', icon: Truck },
    { label: 'Delivered', icon: CheckCircle },
  ]

  return (
    <div>
      <div className="flex items-center">
        {stages.map((s, i) => {
          const Icon = s.icon
          const done = current > i
          const active = current === i
          return (
            <div key={s.label} className="flex items-center flex-1 last:flex-none">
              <div className={`flex flex-col items-center gap-1.5 ${done || active ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  done ? 'bg-primary border-primary text-primary-foreground' :
                  active ? 'border-primary bg-primary/20' :
                  'border-border'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium">{s.label}</p>
                  {s.sub && <p className="text-[10px] text-muted-foreground">{s.sub}</p>}
                </div>
              </div>
              {i < stages.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 -mt-6 ${done ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
