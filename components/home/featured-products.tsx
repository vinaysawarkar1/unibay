'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Star, Cpu, Zap, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFeaturedProducts } from '@/hooks/use-merged-catalog'
import { formatGBP } from '@/lib/currency'

export function FeaturedProducts() {
  const featured = useFeaturedProducts()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />

      <div className="container mx-auto px-4 lg:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            <Zap className="w-4 h-4" />
            Featured Systems
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Engineered for <span className="gradient-text">Excellence</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular configurations, built with premium components 
            and designed for peak performance.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/products/${product.slug}`}>
                <div className="group relative h-full">
                  {/* Card */}
                  <div className="relative h-full rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10">
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-primary text-primary-foreground">
                          {product.badge}
                        </Badge>
                      </div>
                    )}

                    {/* Product image */}
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
                        className={`absolute inset-0 bg-gradient-to-t from-card/80 to-transparent z-[1] ${product.images[0] ? 'opacity-70' : ''}`}
                      />
                      <div className="relative z-[2] h-full flex items-center justify-center">
                        {!product.images[0] && product.category === 'laptop' ? (
                          <Monitor className="w-24 h-24 text-primary/30 group-hover:text-primary/50 transition-colors" />
                        ) : !product.images[0] ? (
                          <Cpu className="w-24 h-24 text-primary/30 group-hover:text-primary/50 transition-colors" />
                        ) : null}
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Category */}
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                        {product.subcategory}
                      </p>

                      {/* Title */}
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>

                      {/* Tagline */}
                      <p className="text-sm text-muted-foreground mb-3">
                        {product.tagline}
                      </p>

                      {/* Key Specs */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
                          <span
                            key={key}
                            className="px-2 py-1 text-[10px] font-medium bg-secondary rounded-md text-muted-foreground"
                          >
                            {String(value).length > 20 ? String(value).slice(0, 17) + '...' : value}
                          </span>
                        ))}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="ml-1 text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviewCount} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Starting at</p>
                          <p className="text-xl font-bold gradient-text">
                            {formatGBP(product.basePrice)}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          Configure
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/products">
            <Button size="lg" variant="outline" className="group">
              View All Products
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
