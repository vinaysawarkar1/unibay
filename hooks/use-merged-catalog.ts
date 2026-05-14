'use client'

import { useMemo } from 'react'
import { mergeCatalog } from '@/lib/catalog'
import { useAdminCatalogStore } from '@/store/admin-catalog-store'
import type { Product } from '@/types'

export function useMergedProducts(): Product[] {
  const overrides = useAdminCatalogStore((s) => s.productOverrides)
  const imageOverlays = useAdminCatalogStore((s) => s.productImageOverlays)
  return useMemo(
    () => mergeCatalog(overrides, imageOverlays),
    [overrides, imageOverlays]
  )
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
