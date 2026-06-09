'use client'

import { useMemo } from 'react'
import useSWR from 'swr'
import { mergeCatalog } from '@/lib/catalog'
import { useAdminCatalogStore } from '@/store/admin-catalog-store'
import type { Product } from '@/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/**
 * Storefront product source. Returns DB-backed products (managed via the admin
 * panel) and uses the static JSON catalogue as instant fallback data so the UI
 * never flashes empty and keeps working if the API is briefly unavailable.
 */
export function useMergedProducts(): Product[] {
  const overrides = useAdminCatalogStore((s) => s.productOverrides)
  const imageOverlays = useAdminCatalogStore((s) => s.productImageOverlays)

  // Synchronous fallback from the bundled JSON catalogue
  const fallback = useMemo(
    () => mergeCatalog(overrides, imageOverlays),
    [overrides, imageOverlays]
  )

  const { data } = useSWR<{ products: Product[] }>('/api/products', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  })

  return data?.products && data.products.length > 0 ? data.products : fallback
}

export function useFeaturedProducts(): Product[] {
  const merged = useMergedProducts()
  const featuredIds = useAdminCatalogStore((s) => s.featuredProductIds)
  return useMemo(() => {
    if (featuredIds?.length) {
      const list = featuredIds
        .map((id) => merged.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
      if (list.length) return list
    }
    const laptops = merged.filter((p) => p.category === 'laptop')
    const desktops = merged.filter((p) => p.category === 'desktop')
    return [...laptops.slice(0, 2), ...desktops.slice(0, 2)]
  }, [merged, featuredIds])
}
