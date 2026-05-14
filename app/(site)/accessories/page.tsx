'use client'

import { CategoryCatalog } from '@/components/commerce/category-catalog'
import { accessoriesPredicate } from '@/lib/category-filters'

export default function AccessoriesPage() {
  return (
    <CategoryCatalog
      title="Accessories"
      description="Monitors, keyboards, mice, and upgrades that complete your desk — priced in GBP with UK warranty options."
      predicate={accessoriesPredicate()}
    />
  )
}
