'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useUIStore } from '@/store'
import { useMergedProducts } from '@/hooks/use-merged-catalog'
import { formatGBP } from '@/lib/currency'

export function GlobalSearchDialog() {
  const { isSearchOpen, closeSearch } = useUIStore()
  const products = useMergedProducts()
  const [q, setQ] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!isSearchOpen) setQ('')
  }, [isSearchOpen])

  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (t.length < 2) return []
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(t) ||
          p.tagline.toLowerCase().includes(t) ||
          p.subcategory.toLowerCase().includes(t)
      )
      .slice(0, 8)
  }, [products, q])

  return (
    <Dialog open={isSearchOpen} onOpenChange={(open) => !open && closeSearch()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Search UNIBAY</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          placeholder="Search laptops, desktops, accessories…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) {
              router.push(`/products/${results[0].slug}`)
              closeSearch()
            }
          }}
        />
        <ul className="max-h-72 overflow-y-auto space-y-1 pt-2">
          {results.map((p) => (
            <li key={p.id}>
              <Link
                href={`/products/${p.slug}`}
                onClick={closeSearch}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-secondary"
              >
                <span>{p.name}</span>
                <span className="text-muted-foreground">{formatGBP(p.basePrice)}</span>
              </Link>
            </li>
          ))}
          {q.trim().length >= 2 && results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No matches. Try another keyword.
            </li>
          )}
          {q.trim().length < 2 && (
            <li className="px-3 py-4 text-xs text-muted-foreground">
              Type at least 2 characters to search the live catalogue (including admin
              overrides on this device).
            </li>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
