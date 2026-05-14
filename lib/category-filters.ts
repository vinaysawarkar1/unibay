import type { Product } from '@/types'

export function laptopPredicate(
  segments: string[] | undefined
): (p: Product) => boolean {
  const key = segments?.[0]
  if (!key) return (p) => p.category === 'laptop'
  if (key === 'gaming')
    return (p) => p.category === 'laptop' && p.subcategory === 'gaming'
  if (key === 'creator')
    return (p) => p.category === 'laptop' && p.subcategory === 'creator'
  if (key === 'ultraportable')
    return (p) => p.category === 'laptop' && p.subcategory === 'ultraportable'
  return () => false
}

export function desktopPredicate(
  segments: string[] | undefined
): (p: Product) => boolean {
  const key = segments?.[0]
  if (!key) return (p) => p.category === 'desktop'
  if (key === 'gaming')
    return (p) => p.category === 'desktop' && p.subcategory === 'gaming'
  if (key === 'workstation')
    return (p) => p.category === 'desktop' && p.subcategory === 'workstation'
  if (key === 'compact')
    return (p) =>
      p.category === 'desktop' && p.subcategory === 'small-form-factor'
  if (key === 'enthusiast')
    return (p) => p.category === 'desktop' && p.subcategory === 'enthusiast'
  return () => false
}

export function gamingPredicate(
  segments: string[] | undefined
): (p: Product) => boolean {
  const key = segments?.[0]
  const isSystem = (p: Product) =>
    p.category === 'laptop' || p.category === 'desktop'
  if (!key) return isSystem
  if (key === 'games') return isSystem
  if (key === 'esports')
    return (p) =>
      isSystem(p) && p.subcategory === 'gaming' && p.basePrice <= 2600
  if (key === 'streaming')
    return (p) =>
      isSystem(p) &&
      (p.subcategory === 'creator' || p.subcategory === 'workstation')
  return () => false
}

export function accessoriesPredicate(): (p: Product) => boolean {
  return (p) => p.category === 'accessory'
}
