import prisma from '@/lib/prisma'
import type { Product } from '@/types'
import { resolveProductImageUrls } from '@/lib/product-assets'

/** Map a Prisma Product row to the storefront Product type, resolving images. */
export function mapDbProduct(row: any): Product {
  const base: Product = {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    subcategory: row.subcategory || '',
    tagline: row.tagline || '',
    description: row.description || '',
    basePrice: row.basePrice,
    images: Array.isArray(row.images) ? row.images : [],
    badge: row.badge || undefined,
    rating: row.rating ?? 0,
    reviewCount: row.reviewCount ?? 0,
    specs: (row.specs as Record<string, string>) || {},
    features: Array.isArray(row.features) ? row.features : [],
    colors: Array.isArray(row.colors) ? row.colors : [],
    stock: row.stock,
    deliveryDays: row.deliveryDays ?? 5,
    longDescription: row.longDescription || undefined,
    technicalSections: row.technicalSections || undefined,
    whatsInTheBox: row.whatsInTheBox || undefined,
    warrantySummary: row.warrantySummary || undefined,
    complianceNotes: row.complianceNotes || undefined,
  }
  // Apply curated/uploaded image resolution (DB images win if present)
  const { images } = resolveProductImageUrls(base)
  return { ...base, images }
}

/** All visible products for the storefront, ordered. */
export async function getDbProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { hidden: false },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
  return rows.map(mapDbProduct)
}

export async function getDbProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { slug } })
  if (!row || row.hidden) return null
  return mapDbProduct(row)
}
