'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'
import { useMergedProducts } from '@/hooks/use-merged-catalog'
import { ProductCard } from '@/components/commerce/product-card'

export function CategoryCatalog({
  title,
  description,
  predicate,
}: {
  title: string
  description: string
  predicate: (p: Product) => boolean
}) {
  const all = useMergedProducts()
  const list = useMemo(() => all.filter(predicate), [all, predicate])

  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 lg:py-28">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>
      {list.length === 0 ? (
        <p className="text-muted-foreground">
          No systems match this filter right now. Try another category or{' '}
          <Link href="/products" className="text-primary underline">
            browse the full catalogue
          </Link>
          .
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
