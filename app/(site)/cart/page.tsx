'use client'

import Link from 'next/link'
import { useCartStore } from '@/store'
import { Button } from '@/components/ui/button'
import { formatGBP } from '@/lib/currency'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const total = useCartStore((s) => s.getTotalPrice())

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Your basket is empty</h1>
        <p className="text-muted-foreground mb-8">
          Explore the catalogue or launch a configurator to create a custom UNIBAY system.
        </p>
        <Button asChild className="glow-cyan">
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 lg:py-28 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Basket</h1>
      <ul className="space-y-6 mb-10">
        {items.map((line) => (
          <li
            key={line.id}
            className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <p className="font-semibold">{line.configuration.name}</p>
              <p className="text-sm text-muted-foreground">
                {line.configuration.type === 'laptop' ? 'Laptop build' : 'Desktop build'}
              </p>
              <p className="text-sm mt-2">
                Line total:{' '}
                <span className="font-bold">
                  {formatGBP(line.configuration.totalPrice * line.quantity)}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                Qty
                <select
                  className="bg-secondary border border-border rounded-md px-2 py-1 text-sm"
                  value={line.quantity}
                  onChange={(e) =>
                    updateQuantity(line.id, Math.max(1, Number(e.target.value)))
                  }
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <Button variant="outline" size="sm" onClick={() => removeItem(line.id)}>
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border pt-8">
        <div>
          <p className="text-sm text-muted-foreground">Estimated total (GBP)</p>
          <p className="text-3xl font-bold">{formatGBP(total)}</p>
          <p className="text-xs text-muted-foreground mt-2">
            VAT is shown where applicable at checkout. Delivery calculated next step.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={clearCart}>
            Clear basket
          </Button>
          <Button asChild className="glow-cyan" size="lg">
            <Link href="/checkout">Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
