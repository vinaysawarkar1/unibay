'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdminCatalogStore } from '@/store/admin-catalog-store'
import { formatGBP } from '@/lib/currency'

export function TrackOrderClient() {
  const orders = useAdminCatalogStore((s) => s.orders)
  const search = useSearchParams()
  const initial = search.get('order') ?? ''
  const [query, setQuery] = useState(initial)

  const match = useMemo(
    () => orders.find((o) => o.id.toLowerCase() === query.trim().toLowerCase()),
    [orders, query]
  )

  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 max-w-lg">
      <h1 className="text-3xl font-bold mb-4">Track your order</h1>
      <p className="text-muted-foreground mb-8">
        Enter the UNIBAY order reference from your confirmation (demo orders stay in this browser).
      </p>
      <div className="flex gap-2 mb-8">
        <Input
          placeholder="e.g. UB-A1B2C3D4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {!match && query.trim() && (
        <p className="text-sm text-muted-foreground mb-6">No order found for that reference.</p>
      )}
      {match && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <p className="text-sm text-muted-foreground">Order</p>
          <p className="text-xl font-bold">{match.id}</p>
          <p className="text-sm">
            Status: <span className="font-semibold capitalize">{match.status}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Placed {new Date(match.createdAt).toLocaleString('en-GB')}
          </p>
          <ul className="text-sm border-t border-border pt-3 space-y-1">
            {match.lines.map((l) => (
              <li key={l.name} className="flex justify-between gap-4">
                <span>
                  {l.name} ×{l.quantity}
                </span>
                <span>{formatGBP(l.lineTotalGBP)}</span>
              </li>
            ))}
          </ul>
          <p className="font-bold pt-2">Total {formatGBP(match.totalGBP)}</p>
        </div>
      )}
      <Button asChild variant="outline" className="mt-10">
        <Link href="/support/contact">Need help? Contact us</Link>
      </Button>
    </div>
  )
}
