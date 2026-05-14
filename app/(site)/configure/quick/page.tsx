'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useMergedProducts } from '@/hooks/use-merged-catalog'
import { useConfiguratorStore, useCartStore } from '@/store'
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

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

export default function QuickBuildPage() {
  const router = useRouter()
  const products = useMergedProducts()
  const desktops = products.filter((p) => p.category === 'desktop')
  const addItem = useCartStore((s) => s.addItem)

  const generate = useCallback(() => {
    const reset = useConfiguratorStore.getState().resetBuild
    const setBase = useConfiguratorStore.getState().setBaseProduct
    const setProcessor = useConfiguratorStore.getState().setProcessor
    const setGraphics = useConfiguratorStore.getState().setGraphics
    const setMemory = useConfiguratorStore.getState().setMemory
    const addStorage = useConfiguratorStore.getState().addStorage
    const setCooling = useConfiguratorStore.getState().setCooling
    const setCase = useConfiguratorStore.getState().setCase
    const setPsu = useConfiguratorStore.getState().setPowerSupply

    reset()
    if (!desktops.length) {
      toast.error('No desktop bases available.')
      return
    }
    const base = pick(desktops)
    setBase(base)
    setProcessor(pick(processorCatalog))
    setGraphics(pick(graphicsCatalog))
    setMemory(pick(memoryCatalog))
    const st = pick(storageCatalog)
    addStorage(st)
    setCooling(pick(coolingCatalog))
    setCase(pick(caseCatalog))
    setPsu(pick(powerSupplyCatalog))

    const built = finalizeBuild(useConfiguratorStore.getState().currentBuild)
    addItem(built)
    toast.success(
      `Added ${built.name} (${formatGBP(built.totalPrice)}) — tweak it in your basket flow.`
    )
    router.push('/cart')
  }, [addItem, desktops, router])

  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 lg:py-28 max-w-xl text-center">
      <h1 className="text-3xl font-bold mb-4">Quick build</h1>
      <p className="text-muted-foreground mb-8">
        Instantly roll a balanced desktop configuration using UK catalogue pricing. You can remove
        it from your basket or run the full configurator afterwards.
      </p>
      <Button size="lg" className="glow-cyan" onClick={generate}>
        Generate desktop &amp; add to basket
      </Button>
    </div>
  )
}
