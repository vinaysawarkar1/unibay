'use client'

import Link from 'next/link'
import { useAdminCatalogStore } from '@/store/admin-catalog-store'
import { formatGBP } from '@/lib/currency'

export default function AccountPage() {
  const orders = useAdminCatalogStore((s) => s.orders)

  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Your UNIBAY account</h1>
      <p className="text-muted-foreground mb-10">
        Demo profile: order history is stored in this browser after checkout. Sign-in with passwords
        is not wired in this sample storefront.
      </p>
      <div className="flex flex-wrap gap-3 mb-12">
        <Link
          href="/configure"
          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
        >
          Open configurator
        </Link>
        <Link
          href="/cart"
          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
        >
          View basket
        </Link>
        <Link
          href="/track-order"
          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
        >
          Track an order
        </Link>
      </div>
      <h2 className="text-xl font-semibold mb-4">Recent orders (this device)</h2>
      {!orders.length && (
        <p className="text-muted-foreground text-sm">No orders yet — configure a system and checkout.</p>
      )}
      <ul className="space-y-4">
        {orders.map((o) => (
          <li key={o.id} className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-mono text-sm">{o.id}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(o.createdAt).toLocaleString('en-GB')} · {o.status}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">{formatGBP(o.totalGBP)}</p>
              <Link href={`/track-order?order=${encodeURIComponent(o.id)}`} className="text-xs text-primary hover:underline">
                Track
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
