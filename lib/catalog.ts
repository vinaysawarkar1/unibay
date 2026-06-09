import type { Product } from '@/types'
import raw from '@/data/products.json'
import { enrichProduct } from '@/lib/enrich-products'
import { resolveProductImageUrls } from '@/lib/product-assets'

export type ProductsFile = typeof raw


const file = raw as ProductsFile

export function getRawProducts(): Product[] {
  const flat = [
    ...file.laptops,
    ...file.desktops,
    ...file.accessories,
  ] as Product[]

  return flat
    // Strip empty migration stubs (no price, no real name, no specs)
    .filter((p) => p.basePrice > 0 && p.name && p.name.length > 2 && !p.id.startsWith('migrated-'))
    .map((p) => {
      const enriched = enrichProduct(p)
      const { images } = resolveProductImageUrls(enriched)
      return { ...enriched, images }
    })
}


export function getProductBySlug(slug: string): Product | undefined {
  return getRawProducts().find((p) => p.slug === slug)
}

export function filterProducts(
  predicate: (p: Product) => boolean
): Product[] {
  return getRawProducts().filter(predicate)
}

export type ProductOverride = {
  basePrice?: number
  stock?: Product['stock']
  deliveryDays?: number
  hidden?: boolean
}

export function applyProductOverride(
  product: Product,
  overrides: Record<string, ProductOverride>
): Product | null {
  const o = overrides[product.id]
  if (o?.hidden) return null
  if (!o) return product
  return {
    ...product,
    ...(o.basePrice != null ? { basePrice: o.basePrice } : {}),
    ...(o.stock != null ? { stock: o.stock } : {}),
    ...(o.deliveryDays != null ? { deliveryDays: o.deliveryDays } : {}),
  }
}

export function applyImageOverlay(
  product: Product,
  imageOverlays: Record<string, string[]>
): Product {
  const imgs = imageOverlays[product.id]
  if (imgs?.length) return { ...product, images: imgs }
  return product
}

export function mergeCatalog(
  overrides: Record<string, ProductOverride>,
  imageOverlays: Record<string, string[]> = {}
): Product[] {
  return getRawProducts()
    .map((p) => applyProductOverride(p, overrides))
    .filter((p): p is Product => p != null)
    .map((p) => applyImageOverlay(p, imageOverlays))
}
