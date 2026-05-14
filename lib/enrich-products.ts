import type { Product } from '@/types'
import enrichment from '@/data/product-enrichment.json'

const map = enrichment as Record<string, Partial<Product>>

export function enrichProduct(p: Product): Product {
  const extra = map[p.id]
  if (!extra) return p
  return { ...p, ...extra }
}
