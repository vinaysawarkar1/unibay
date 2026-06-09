'use client'

import Link from 'next/link'
import { ArrowRight, Star, ShoppingCart, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types'
import { formatGBP } from '@/lib/currency'
import { useCartStore } from '@/store'
import { buildFromProduct } from '@/lib/build'

const STOCK_LABELS: Record<string, { label: string; class: string }> = {
  in_stock:    { label: 'In stock',    class: 'text-green-500' },
  low_stock:   { label: 'Low stock',   class: 'text-yellow-500' },
  out_of_stock:{ label: 'Out of stock',class: 'text-red-500' },
  pre_order:   { label: 'Pre-order',   class: 'text-blue-400' },
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)

  const stockInfo = STOCK_LABELS[product.stock] ?? STOCK_LABELS.in_stock

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem(buildFromProduct(product))
    toast.success(`${product.name} added to basket.`)
  }

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group relative h-full">
        <div className="relative h-full rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 flex flex-col">
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-primary text-primary-foreground text-[10px] px-2">
                {product.badge}
              </Badge>
            </div>
          )}

          {/* Image */}
          <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary to-muted overflow-hidden shrink-0">
            <img
              src={product.images[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-card/10 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
              {product.subcategory || product.category}
            </p>
            <h3 className="font-semibold text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">
              {product.tagline}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-3">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
              <span className="ml-auto flex items-center gap-1">
                <Zap className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{product.deliveryDays}d delivery</span>
              </span>
            </div>

            {/* Stock */}
            <p className={`text-[10px] font-medium mb-3 ${stockInfo.class}`}>
              {stockInfo.label}
            </p>

            {/* Price + CTA */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground">from</p>
                <p className="text-lg font-bold gradient-text">
                  {formatGBP(product.basePrice)}
                </p>
              </div>
              <div className="flex gap-1.5">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 shrink-0"
                  onClick={handleAddToCart}
                  disabled={product.stock === 'out_of_stock'}
                  title="Add to basket"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 pointer-events-none group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  View
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Glow on hover */}
        <div className="absolute inset-0 rounded-2xl bg-primary/15 blur-xl opacity-0 group-hover:opacity-40 transition-opacity -z-10" />
      </div>
    </Link>
  )
}
