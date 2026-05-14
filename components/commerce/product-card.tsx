'use client'

import Link from 'next/link'
import { ArrowRight, Cpu, Monitor, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types'
import { formatGBP } from '@/lib/currency'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group relative h-full">
        <div className="relative h-full rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10">
          {product.badge && (
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-primary text-primary-foreground">
                {product.badge}
              </Badge>
            </div>
          )}
          <div className="relative aspect-square bg-gradient-to-br from-secondary to-muted overflow-hidden">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : null}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-card/90 to-transparent z-[1] ${product.images[0] ? 'opacity-60' : ''}`}
            />
            <div className="relative z-[2] h-full flex items-center justify-center">
              {!product.images[0] && product.category === 'laptop' ? (
                <Monitor className="w-24 h-24 text-primary/30 group-hover:text-primary/50 transition-colors" />
              ) : !product.images[0] && product.category === 'desktop' ? (
                <Cpu className="w-24 h-24 text-primary/30 group-hover:text-primary/50 transition-colors" />
              ) : !product.images[0] ? (
                <Cpu className="w-20 h-20 text-primary/25" />
              ) : null}
            </div>
          </div>
          <div className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              {product.subcategory}
            </p>
            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {product.tagline}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">From</p>
                <p className="text-xl font-bold gradient-text">
                  {formatGBP(product.basePrice)}
                </p>
              </div>
              <Button size="sm" variant="ghost" className="pointer-events-none">
                View
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
