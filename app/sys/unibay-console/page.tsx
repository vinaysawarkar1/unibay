'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdminAuthStore } from '@/store/admin-auth-store'
import {
  useAdminCatalogStore,
  type PlacedOrder,
} from '@/store/admin-catalog-store'
import { getRawProducts, mergeCatalog } from '@/lib/catalog'
import { formatGBP } from '@/lib/currency'
import type { Product } from '@/types'

type Tab = 'catalog' | 'media' | 'orders' | 'newsletter' | 'featured'

export default function AdminConsolePage() {
  const ok = useAdminAuthStore((s) => s.ok)
  const login = useAdminAuthStore((s) => s.login)
  const logout = useAdminAuthStore((s) => s.logout)
  const [pin, setPin] = useState('')
  const [tab, setTab] = useState<Tab>('catalog')

  if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form
          className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8"
          onSubmit={(e) => {
            e.preventDefault()
            if (!login(pin)) {
              toast.error('Invalid PIN')
              return
            }
            toast.success('Console unlocked')
            setPin('')
          }}
        >
          <h1 className="text-2xl font-bold tracking-tight">UNIBAY control</h1>
          <p className="text-sm text-muted-foreground">
            Hidden operations console. Set <code className="text-xs">NEXT_PUBLIC_UNIBAY_ADMIN_PIN</code>{' '}
            in production. Default PIN is <span className="font-mono">782291</span>.
          </p>
          <Input
            type="password"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
          />
          <Button type="submit" className="w-full">
            Unlock
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            <Link href="/" className="text-primary hover:underline">
              Back to storefront
            </Link>
          </p>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-6xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">UNIBAY admin</h1>
          <p className="text-sm text-muted-foreground">
            Changes persist in this browser only (local demo data layer).
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/">View site</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout()
              toast.message('Locked console')
            }}
          >
            Lock
          </Button>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2">
        {(
          [
            ['catalog', 'Catalogue'],
            ['media', 'Images'],
            ['orders', 'Orders'],
            ['newsletter', 'Newsletter'],
            ['featured', 'Featured'],
          ] as const
        ).map(([id, label]) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={tab === id ? 'default' : 'outline'}
            onClick={() => setTab(id)}
          >
            {label}
          </Button>
        ))}
      </nav>

      {tab === 'catalog' && <CatalogTab />}
      {tab === 'media' && <MediaTab />}
      {tab === 'orders' && <OrdersTab />}
      {tab === 'newsletter' && <NewsletterTab />}
      {tab === 'featured' && <FeaturedTab />}
    </div>
  )
}

function CatalogTab() {
  const overrides = useAdminCatalogStore((s) => s.productOverrides)
  const imageOverlays = useAdminCatalogStore((s) => s.productImageOverlays)
  const setOverride = useAdminCatalogStore((s) => s.setProductOverride)
  const clearOverride = useAdminCatalogStore((s) => s.clearProductOverride)
  const merged = mergeCatalog(overrides, imageOverlays)
  const raw = getRawProducts()

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Override prices (GBP), stock, lead time, or hide SKUs from the public catalogue on this device.
      </p>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Base</th>
              <th className="p-3">Price £</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Days</th>
              <th className="p-3">Hide</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {raw.map((p) => {
              const eff = merged.find((m) => m.id === p.id) as Product | undefined
              const o = overrides[p.id]
              return (
                <tr
                  key={`${p.id}-${JSON.stringify(overrides[p.id] ?? null)}-${imageOverlays[p.id]?.length ?? 0}`}
                  className="border-t border-border"
                >
                  <td className="p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.slug}</div>
                  </td>
                  <td className="p-3 text-muted-foreground">{formatGBP(p.basePrice)}</td>
                  <td className="p-3">
                    <Input
                      className="h-8 w-24"
                      type="number"
                      min={0}
                      defaultValue={eff?.basePrice ?? p.basePrice}
                      onBlur={(e) => {
                        const v = Number(e.target.value)
                        if (!Number.isFinite(v) || v < 0) return
                        setOverride(p.id, { basePrice: v })
                        toast.success(`${p.name} price updated`)
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <select
                      className="bg-secondary border border-border rounded-md px-2 py-1 text-xs h-8"
                      defaultValue={eff?.stock ?? p.stock}
                      onChange={(e) => {
                        setOverride(p.id, {
                          stock: e.target.value as Product['stock'],
                        })
                        toast.success(`${p.name} stock updated`)
                      }}
                    >
                      {(['in_stock', 'low_stock', 'out_of_stock', 'pre_order'] as const).map(
                        (s) => (
                          <option key={s} value={s}>
                            {s.replaceAll('_', ' ')}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                  <td className="p-3">
                    <Input
                      className="h-8 w-16"
                      type="number"
                      min={1}
                      defaultValue={eff?.deliveryDays ?? p.deliveryDays}
                      onBlur={(e) => {
                        const v = Number(e.target.value)
                        if (!Number.isFinite(v)) return
                        setOverride(p.id, { deliveryDays: Math.max(1, Math.round(v)) })
                        toast.success(`${p.name} lead time updated`)
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      defaultChecked={Boolean(o?.hidden)}
                      onChange={(e) => {
                        setOverride(p.id, { hidden: e.target.checked })
                        toast.message(
                          e.target.checked ? `${p.name} hidden` : `${p.name} visible`
                        )
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        clearOverride(p.id)
                        toast.message(`Cleared overrides for ${p.name}`)
                      }}
                    >
                      Reset
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OrdersTab() {
  const orders = useAdminCatalogStore((s) => s.orders)
  const updateOrderStatus = useAdminCatalogStore((s) => s.updateOrderStatus)

  if (!orders.length) {
    return <p className="text-muted-foreground text-sm">No orders yet.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60 text-left">
          <tr>
            <th className="p-3">Order</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t border-border">
              <td className="p-3 font-mono text-xs">{o.id}</td>
              <td className="p-3">
                <div>{o.name}</div>
                <div className="text-xs text-muted-foreground">{o.email}</div>
              </td>
              <td className="p-3 font-semibold">{formatGBP(o.totalGBP)}</td>
              <td className="p-3">
                <select
                  className="bg-secondary border border-border rounded-md px-2 py-1 text-xs"
                  value={o.status}
                  onChange={(e) =>
                    updateOrderStatus(o.id, e.target.value as PlacedOrder['status'])
                  }
                >
                  {(['received', 'building', 'dispatched', 'delivered'] as const).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MediaTab() {
  const raw = getRawProducts()
  const imageOverlays = useAdminCatalogStore((s) => s.productImageOverlays)
  const setProductImageOverlay = useAdminCatalogStore((s) => s.setProductImageOverlay)
  const clearProductImageOverlay = useAdminCatalogStore((s) => s.clearProductImageOverlay)

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground max-w-3xl">
        Upload up to five images per SKU (JPEG, PNG, WebP, or GIF). Keep each file under about
        1.5&nbsp;MB so localStorage is not exhausted. These uploads override the storefront gallery for
        this browser only.
      </p>
      <div className="space-y-6">
        {raw.map((p) => {
          const gallery = imageOverlays[p.id] ?? p.images
          return (
            <div key={p.id} className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{p.id}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {gallery.length === 0 && (
                    <span className="text-xs text-muted-foreground">No gallery yet</span>
                  )}
                  {gallery.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-md border object-cover bg-secondary"
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="max-w-xs cursor-pointer"
                  onChange={async (e) => {
                    const input = e.target
                    const files = Array.from(input.files ?? []).slice(0, 5)
                    const urls: string[] = []
                    try {
                      for (const f of files) {
                        if (f.size > 1.5 * 1024 * 1024) {
                          toast.error(`${f.name} is larger than 1.5MB — skipped`)
                          continue
                        }
                        const dataUrl = await new Promise<string>((resolve, reject) => {
                          const reader = new FileReader()
                          reader.onload = () => resolve(String(reader.result))
                          reader.onerror = () => reject(new Error('read'))
                          reader.readAsDataURL(f)
                        })
                        urls.push(dataUrl)
                      }
                      if (urls.length) {
                        setProductImageOverlay(p.id, urls)
                        toast.success(`Stored ${urls.length} image(s) for ${p.name}`)
                      }
                    } catch {
                      toast.error('Could not read one or more files')
                    }
                    input.value = ''
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearProductImageOverlay(p.id)
                    toast.message(`Reverted ${p.name} to default catalogue images`)
                  }}
                >
                  Clear uploads
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function NewsletterTab() {
  const emails = useAdminCatalogStore((s) => s.newsletterEmails)
  if (!emails.length) {
    return <p className="text-muted-foreground text-sm">No subscribers yet.</p>
  }
  return (
    <ul className="rounded-xl border border-border divide-y divide-border max-w-md">
      {emails.map((e) => (
        <li key={e} className="px-4 py-2 text-sm font-mono">
          {e}
        </li>
      ))}
    </ul>
  )
}

function FeaturedTab() {
  const featuredProductIds = useAdminCatalogStore((s) => s.featuredProductIds)
  const setFeatured = useAdminCatalogStore((s) => s.setFeaturedProductIds)
  const [text, setText] = useState(featuredProductIds?.join(', ') ?? '')

  useEffect(() => {
    setText(featuredProductIds?.join(', ') ?? '')
  }, [featuredProductIds])

  return (
    <div className="max-w-xl space-y-3">
      <p className="text-sm text-muted-foreground">
        Comma-separated product IDs for the home page featured strip. Leave blank to use the
        default mix.
      </p>
      <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="unibay-phantom-17, unibay-vortex" />
      <Button
        type="button"
        onClick={() => {
          const ids = text
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
          setFeatured(ids.length ? ids : null)
          toast.success('Featured list updated')
        }}
      >
        Save featured IDs
      </Button>
    </div>
  )
}
