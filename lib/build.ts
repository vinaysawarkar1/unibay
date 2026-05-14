import type { BuildConfiguration, PerformanceEstimate, Product } from '@/types'

export const zeroPerformance: PerformanceEstimate = {
  gaming1080p: 0,
  gaming1440p: 0,
  gaming4k: 0,
  productivity: 0,
  streaming: 0,
  contentCreation: 0,
}

export function buildFromProduct(product: Product): BuildConfiguration {
  return {
    id: crypto.randomUUID(),
    name: product.name,
    type: product.category === 'laptop' ? 'laptop' : 'desktop',
    baseProduct: product,
    components: {},
    customizations: {},
    totalPrice: product.basePrice,
    estimatedPerformance: zeroPerformance,
  }
}

export function estimatePerformanceFromComponents(
  build: Partial<BuildConfiguration>
): PerformanceEstimate {
  const gpu = build.components?.graphics?.performance ?? 0
  const cpu = build.components?.processor?.performance ?? 0
  const base = gpu && cpu ? (gpu + cpu) / 2 : Math.max(gpu, cpu, 40)
  return {
    gaming1080p: Math.min(100, Math.round(base * 0.95)),
    gaming1440p: Math.min(100, Math.round(base * 0.85)),
    gaming4k: Math.min(100, Math.round(base * 0.72)),
    productivity: Math.min(100, Math.round(cpu * 0.92 || base * 0.8)),
    streaming: Math.min(100, Math.round(base * 0.82)),
    contentCreation: Math.min(
      100,
      Math.round((cpu || base * 0.6) * 0.55 + (gpu || base * 0.6) * 0.45)
    ),
  }
}

export function finalizeBuild(
  partial: Partial<BuildConfiguration>
): BuildConfiguration {
  const base = partial.baseProduct
  const total =
    (base?.basePrice ?? 0) +
    (partial.components?.processor?.price ?? 0) +
    (partial.components?.graphics?.price ?? 0) +
    (partial.components?.memory?.price ?? 0) +
    (partial.components?.storage?.reduce((s, x) => s + x.price, 0) ?? 0) +
    (partial.components?.cooling?.price ?? 0) +
    (partial.components?.case?.price ?? 0) +
    (partial.components?.powerSupply?.price ?? 0)

  return {
    id: partial.id ?? crypto.randomUUID(),
    name: partial.name ?? 'Custom UNIBAY build',
    type: partial.type ?? 'desktop',
    baseProduct: base,
    components: partial.components ?? {},
    customizations: partial.customizations ?? {},
    totalPrice: total,
    estimatedPerformance:
      partial.estimatedPerformance ?? estimatePerformanceFromComponents(partial),
  }
}
