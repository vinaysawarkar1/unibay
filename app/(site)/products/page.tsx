'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useMergedProducts } from '@/hooks/use-merged-catalog'
import { ProductCard } from '@/components/commerce/product-card'
import { Button } from '@/components/ui/button'

export default function AllProductsPage() {
  const products = useMergedProducts()
  const sorted = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  )

  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 lg:py-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-3">Full catalogue</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Laptops, desktops, and accessories with UK pricing. Use the header search or jump
            into a category.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/laptops">Laptops</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/desktops">Desktops</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/accessories">Accessories</Link>
          </Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sorted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
