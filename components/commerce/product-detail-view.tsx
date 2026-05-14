'use client'

import { useMemo, useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMergedProducts } from '@/hooks/use-merged-catalog'
import { useCartStore } from '@/store'
import { buildFromProduct } from '@/lib/build'
import { formatGBP } from '@/lib/currency'
import { Cpu, Monitor, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProductDetailView() {
  const { slug } = useParams<{ slug: string }>()
  const products = useMergedProducts()
  const product = products.find((p) => p.slug === slug)
  const addItem = useCartStore((s) => s.addItem)
  const [activeImage, setActiveImage] = useState(0)

  const gallery = useMemo(() => product?.images ?? [], [product])

  useEffect(() => {
    setActiveImage(0)
  }, [product?.id, gallery.length])

  if (!product) notFound()

  const safeIdx = gallery.length > 0 ? Math.min(activeImage, gallery.length - 1) : 0
  const mainSrc = gallery[safeIdx]

  const configureHref =
    product.category === 'laptop'
      ? `/configure/laptop?base=${product.slug}`
      : product.category === 'desktop'
        ? `/configure/desktop?base=${product.slug}`
        : '/configure'

  const addPrebuilt = () => {
    addItem(buildFromProduct(product))
    toast.success(`${product.name} added to your basket.`)
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 lg:py-28">
      <p className="text-xs text-muted-foreground max-w-3xl mb-10 border-l-2 border-primary/40 pl-3">
        UNIBAY technical descriptions are original demonstration material for this configurator. They
        are written to reflect typical UK SI practice (warranty lead times, plugs, compliance) and are
        not copied from third-party retailers. Product photos below use curated placeholder imagery
        unless you replace them in the admin console.
      </p>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl border border-border bg-secondary/30 overflow-hidden">
            {mainSrc ? (
              <img
                src={mainSrc}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            ) : product.category === 'laptop' ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Monitor className="w-40 h-40 text-primary/25" />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="w-40 h-40 text-primary/25" />
              </div>
            )}
            {product.badge && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                {product.badge}
              </Badge>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors',
                    activeImage === i ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {product.subcategory} · UK pricing (GBP)
          </p>
          <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
          <p className="text-xl text-primary font-medium mb-4">{product.tagline}</p>
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted-foreground text-sm">
              ({product.reviewCount} verified owners)
            </span>
          </div>
          <p className="text-muted-foreground mb-4 leading-relaxed">{product.description}</p>
          {product.longDescription && (
            <p className="text-muted-foreground mb-8 leading-relaxed border-l-2 border-border pl-4">
              {product.longDescription}
            </p>
          )}
          {product.features && product.features.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-8">
              {product.features.map((f) => (
                <li
                  key={f}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary"
                >
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-3 mb-10">
            <span className="text-3xl font-bold">{formatGBP(product.basePrice)}</span>
            <span className="text-sm text-muted-foreground self-end pb-1">
              From · excludes bespoke upgrades
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="glow-cyan">
              <Link href={configureHref}>Configure this line</Link>
            </Button>
            <Button size="lg" variant="outline" onClick={addPrebuilt}>
              Add base configuration to basket
            </Button>
          </div>

          <div className="mt-12 rounded-xl border border-border bg-card/50 p-6">
            <h2 className="font-semibold mb-4">Key specifications</h2>
            <dl className="grid sm:grid-cols-2 gap-3 text-sm">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-muted-foreground capitalize">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {product.technicalSections && product.technicalSections.length > 0 && (
            <div className="mt-10 space-y-8">
              <h2 className="text-xl font-bold">Technical deep dive</h2>
              {product.technicalSections.map((section) => (
                <div key={section.title} className="rounded-xl border border-border bg-card/40 p-5">
                  <h3 className="font-semibold text-primary mb-3">{section.title}</h3>
                  <dl className="space-y-2 text-sm">
                    {section.rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-border/60 pb-2 last:border-0 last:pb-0"
                      >
                        <dt className="text-muted-foreground shrink-0">{row.label}</dt>
                        <dd className="font-medium sm:text-right">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}

          {(product.whatsInTheBox?.length ||
            product.warrantySummary ||
            product.complianceNotes) && (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {product.whatsInTheBox && product.whatsInTheBox.length > 0 && (
                <div className="rounded-xl border border-border p-5">
                  <h3 className="font-semibold mb-3">In the box</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    {product.whatsInTheBox.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="rounded-xl border border-border p-5 space-y-4 text-sm text-muted-foreground">
                {product.warrantySummary && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Warranty</h3>
                    <p>{product.warrantySummary}</p>
                  </div>
                )}
                {product.complianceNotes && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Compliance & recycling</h3>
                    <p>{product.complianceNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              Stock:{' '}
              <span className="text-foreground font-medium">
                {product.stock.replaceAll('_', ' ')}
              </span>{' '}
              · Typical lead time:{' '}
              <span className="text-foreground font-medium">
                {product.deliveryDays} working days
              </span>{' '}
              (UK mainland).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
