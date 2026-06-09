'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  User,
  MapPin,
  Package,
  Lock,
  ChevronRight,
  CheckCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { formatGBP } from '@/lib/currency'

type Profile = {
  name: string | null
  email: string
  emailVerified: string | null
  phone: string | null
  createdAt: string
  hasPassword: boolean
}

export default function AccountDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [counts, setCounts] = useState({ addresses: 0, orders: 0, pendingOrders: 0 })
  const [recent, setRecent] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/user/profile').then(r => r.json()).then(d => setProfile(d.profile))
    fetch('/api/user/addresses').then(r => r.json()).then(d => setCounts(c => ({ ...c, addresses: d.addresses?.length || 0 })))
    fetch('/api/orders').then(r => r.json()).then(d => {
      const orders = d.orders || []
      setCounts(c => ({
        ...c,
        orders: orders.length,
        pendingOrders: orders.filter((o: any) => ['pending', 'processing'].includes(o.status)).length,
      }))
      setRecent(orders.slice(0, 3))
    })
  }, [])

  const tiles = [
    {
      href: '/account/profile',
      icon: User,
      title: 'Personal details',
      desc: profile?.phone ? 'Manage name, phone, DOB' : 'Complete your profile',
      cta: profile?.phone ? 'Edit' : 'Complete',
      highlight: !profile?.phone,
    },
    {
      href: '/account/addresses',
      icon: MapPin,
      title: 'Addresses',
      desc: counts.addresses === 0
        ? 'No addresses saved yet'
        : `${counts.addresses} saved address${counts.addresses === 1 ? '' : 'es'}`,
      cta: counts.addresses === 0 ? 'Add address' : 'Manage',
      highlight: counts.addresses === 0,
    },
    {
      href: '/account/orders',
      icon: Package,
      title: 'Your orders',
      desc: counts.orders === 0
        ? 'No orders yet'
        : `${counts.orders} order${counts.orders === 1 ? '' : 's'}${counts.pendingOrders > 0 ? ` · ${counts.pendingOrders} active` : ''}`,
      cta: counts.orders === 0 ? 'Start shopping' : 'View all',
      highlight: false,
    },
    {
      href: '/account/security',
      icon: Lock,
      title: 'Security',
      desc: 'Password & verification',
      cta: 'Manage',
      highlight: false,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Account status callouts */}
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="font-medium">Account is verified</p>
            <p className="text-xs text-muted-foreground">
              Email confirmed
              {profile?.createdAt && ` · member since ${new Date(profile.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`}
            </p>
          </div>
        </div>
      </Card>

      {/* Tile grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="group">
            <Card className="p-5 h-full hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.highlight ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                  <t.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold mb-0.5">{t.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{t.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {t.cta}
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          {recent.length > 0 && (
            <Link href="/account/orders" className="text-sm text-primary hover:underline">
              View all →
            </Link>
          )}
        </div>
        {recent.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">No orders yet — your shopping history will show up here.</p>
            <Link href="/products" className="text-sm text-primary hover:underline">Browse products</Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {recent.map((o: any) => (
              <Link key={o.id} href={`/account/orders/${o.id}`}>
                <Card className="p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-mono text-sm">{o.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}{o.items?.length || 0} item{o.items?.length === 1 ? '' : 's'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={o.status} />
                      <p className="font-bold">{formatGBP(o.total)}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; icon: any; label: string }> = {
    pending:    { color: 'bg-primary/15 text-primary',     icon: Clock,        label: 'Pending' },
    processing: { color: 'bg-yellow-500/15 text-yellow-500', icon: Clock,      label: 'Processing' },
    shipped:    { color: 'bg-blue-500/15 text-blue-400',   icon: Package,      label: 'Shipped' },
    delivered:  { color: 'bg-green-500/15 text-green-400', icon: CheckCircle,  label: 'Delivered' },
    cancelled:  { color: 'bg-red-500/15 text-red-400',     icon: Clock,        label: 'Cancelled' },
  }
  const s = map[status] || map.pending
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>
      <Icon className="w-3 h-3" /> {s.label}
    </span>
  )
}
