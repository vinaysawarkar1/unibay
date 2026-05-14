'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useConfiguratorStore, useCartStore } from '@/store'
import { useMergedProducts } from '@/hooks/use-merged-catalog'
import type { BuildConfiguration } from '@/types'
import { finalizeBuild } from '@/lib/build'
import { formatGBP } from '@/lib/currency'
import {
  processorCatalog,
  graphicsCatalog,
  memoryCatalog,
  storageCatalog,
  coolingCatalog,
  caseCatalog,
  powerSupplyCatalog,
} from '@/lib/components-data'

export type BuildMode = 'laptop' | 'desktop'

export function BuildWizard({ mode }: { mode: BuildMode }) {
  const router = useRouter()
  const search = useSearchParams()
  const products = useMergedProducts()

  const bases = useMemo(
    () =>
      products.filter((p) =>
        mode === 'laptop' ? p.category === 'laptop' : p.category === 'desktop'
      ),
    [products, mode]
  )

  const stepKeys = useMemo(() => {
    const core = [
      'base',
      'processor',
      'graphics',
      'memory',
      'storage',
      'cooling',
    ] as const
    if (mode === 'desktop')
      return [...core, 'case', 'power', 'review'] as const
    return [...core, 'review'] as const
  }, [mode])

  const [idx, setIdx] = useState(0)
  const step = stepKeys[idx]

  const currentBuild = useConfiguratorStore((s) => s.currentBuild)
  const setBaseProduct = useConfiguratorStore((s) => s.setBaseProduct)
  const setProcessor = useConfiguratorStore((s) => s.setProcessor)
  const setGraphics = useConfiguratorStore((s) => s.setGraphics)
  const setMemory = useConfiguratorStore((s) => s.setMemory)
  const addStorage = useConfiguratorStore((s) => s.addStorage)
  const removeStorage = useConfiguratorStore((s) => s.removeStorage)
  const setCooling = useConfiguratorStore((s) => s.setCooling)
  const setCase = useConfiguratorStore((s) => s.setCase)
  const setPowerSupply = useConfiguratorStore((s) => s.setPowerSupply)
  const resetBuild = useConfiguratorStore((s) => s.resetBuild)
  const addItem = useCartStore((s) => s.addItem)

  const total = useMemo(
    () => useConfiguratorStore.getState().calculateTotalPrice(),
    [currentBuild]
  )

  useEffect(() => {
    resetBuild()
  }, [mode, resetBuild])

  useEffect(() => {
    const slug = search.get('base')
    if (!slug) return
    const p = products.find((x) => x.slug === slug)
    if (!p) return
    const ok =
      mode === 'laptop' ? p.category === 'laptop' : p.category === 'desktop'
    if (!ok) return
    setBaseProduct(p)
    setIdx(1)
  }, [search, products, mode, setBaseProduct])

  const canContinue = useMemo(() => {
    const c = currentBuild
    switch (step) {
      case 'base':
        return Boolean(c.baseProduct)
      case 'processor':
        return Boolean(c.components?.processor)
      case 'graphics':
        return Boolean(c.components?.graphics)
      case 'memory':
        return Boolean(c.components?.memory)
      case 'storage':
        return Boolean(c.components?.storage?.length)
      case 'cooling':
        return Boolean(c.components?.cooling)
      case 'case':
        return Boolean(c.components?.case)
      case 'power':
        return Boolean(c.components?.powerSupply)
      case 'review':
        return true
      default:
        return false
    }
  }, [step, currentBuild])

  const next = () => setIdx((i) => Math.min(i + 1, stepKeys.length - 1))
  const prev = () => setIdx((i) => Math.max(0, i - 1))

  const onAddToBasket = useCallback(() => {
    const built = finalizeBuild(currentBuild as Partial<BuildConfiguration>)
    addItem(built)
    toast.success('Configuration added to your basket.')
    router.push('/cart')
  }, [addItem, currentBuild, router])

  const title =
    mode === 'laptop' ? 'Laptop configurator' : 'Desktop configurator'

  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 lg:py-28 max-w-3xl">
      <div className="mb-10">
        <p className="text-sm text-muted-foreground mb-2">
          Step {idx + 1} of {stepKeys.length}
        </p>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">
          Prices are shown in GBP (UK). Compatibility checks are simplified for this demo —
          contact sales for bespoke validation.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        {step === 'base' && (
          <div className="space-y-3">
            <h2 className="font-semibold">Choose your base</h2>
            <Select
              value={currentBuild.baseProduct?.id ?? ''}
              onValueChange={(id) => {
                const p = bases.find((b) => b.id === id)
                if (p) setBaseProduct(p)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a system…" />
              </SelectTrigger>
              <SelectContent>
                {bases.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — {formatGBP(p.basePrice)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {step === 'processor' && (
          <PickSelect
            label="Processor"
            value={currentBuild.components?.processor?.id}
            options={processorCatalog.map((p) => ({
              id: p.id,
              label: `${p.name} (${formatGBP(p.price)})`,
            }))}
            onPick={(id) => {
              const p = processorCatalog.find((x) => x.id === id)
              if (p) setProcessor(p)
            }}
          />
        )}

        {step === 'graphics' && (
          <PickSelect
            label="Graphics card"
            value={currentBuild.components?.graphics?.id}
            options={graphicsCatalog.map((p) => ({
              id: p.id,
              label: `${p.name} (${formatGBP(p.price)})`,
            }))}
            onPick={(id) => {
              const p = graphicsCatalog.find((x) => x.id === id)
              if (p) setGraphics(p)
            }}
          />
        )}

        {step === 'memory' && (
          <PickSelect
            label="Memory kit"
            value={currentBuild.components?.memory?.id}
            options={memoryCatalog.map((p) => ({
              id: p.id,
              label: `${p.name} (${formatGBP(p.price)})`,
            }))}
            onPick={(id) => {
              const p = memoryCatalog.find((x) => x.id === id)
              if (p) setMemory(p)
            }}
          />
        )}

        {step === 'storage' && (
          <PickSelect
            label="Primary storage"
            value={currentBuild.components?.storage?.[0]?.id}
            options={storageCatalog.map((p) => ({
              id: p.id,
              label: `${p.name} (${formatGBP(p.price)})`,
            }))}
            onPick={(id) => {
              const p = storageCatalog.find((x) => x.id === id)
              if (!p) return
              const existing = currentBuild.components?.storage ?? []
              existing.forEach((s) => removeStorage(s.id))
              addStorage(p)
            }}
          />
        )}

        {step === 'cooling' && (
          <PickSelect
            label="Cooling"
            value={currentBuild.components?.cooling?.id}
            options={coolingCatalog.map((p) => ({
              id: p.id,
              label: `${p.name} (${formatGBP(p.price)})`,
            }))}
            onPick={(id) => {
              const p = coolingCatalog.find((x) => x.id === id)
              if (p) setCooling(p)
            }}
          />
        )}

        {step === 'case' && mode === 'desktop' && (
          <PickSelect
            label="Case"
            value={currentBuild.components?.case?.id}
            options={caseCatalog.map((p) => ({
              id: p.id,
              label: `${p.name} (${formatGBP(p.price)})`,
            }))}
            onPick={(id) => {
              const p = caseCatalog.find((x) => x.id === id)
              if (p) setCase(p)
            }}
          />
        )}

        {step === 'power' && mode === 'desktop' && (
          <PickSelect
            label="Power supply"
            value={currentBuild.components?.powerSupply?.id}
            options={powerSupplyCatalog.map((p) => ({
              id: p.id,
              label: `${p.name} (${formatGBP(p.price)})`,
            }))}
            onPick={(id) => {
              const p = powerSupplyCatalog.find((x) => x.id === id)
              if (p) setPowerSupply(p)
            }}
          />
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Review</h2>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>Base: {currentBuild.baseProduct?.name ?? '—'}</li>
              <li>CPU: {currentBuild.components?.processor?.name ?? '—'}</li>
              <li>GPU: {currentBuild.components?.graphics?.name ?? '—'}</li>
              <li>RAM: {currentBuild.components?.memory?.name ?? '—'}</li>
              <li>
                Storage:{' '}
                {currentBuild.components?.storage?.map((s) => s.name).join(', ') || '—'}
              </li>
              <li>Cooling: {currentBuild.components?.cooling?.name ?? '—'}</li>
              {mode === 'desktop' && (
                <>
                  <li>Case: {currentBuild.components?.case?.name ?? '—'}</li>
                  <li>PSU: {currentBuild.components?.powerSupply?.name ?? '—'}</li>
                </>
              )}
            </ul>
            <p className="text-2xl font-bold">{formatGBP(total)}</p>
            <Button className="glow-cyan" onClick={onAddToBasket}>
              Add configuration to basket
            </Button>
          </div>
        )}
      </div>

      {step !== 'review' && (
        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={prev} disabled={idx === 0}>
            Back
          </Button>
          <Button type="button" onClick={next} disabled={!canContinue}>
            Continue
          </Button>
        </div>
      )}

      {step === 'review' && (
        <div className="mt-8">
          <Button type="button" variant="outline" onClick={prev}>
            Back to edit
          </Button>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground mt-10">
        Prefer a different form factor?{' '}
        <Link
          href={mode === 'laptop' ? '/configure/desktop' : '/configure/laptop'}
          className="text-primary underline"
        >
          Switch to {mode === 'laptop' ? 'desktop' : 'laptop'} configurator
        </Link>
      </p>
    </div>
  )
}

function PickSelect({
  label,
  value,
  options,
  onPick,
}: {
  label: string
  value?: string
  options: { id: string; label: string }[]
  onPick: (id: string) => void
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-semibold">{label}</h2>
      <Select value={value ?? ''} onValueChange={onPick}>
        <SelectTrigger>
          <SelectValue placeholder={`Choose ${label.toLowerCase()}…`} />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {options.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
