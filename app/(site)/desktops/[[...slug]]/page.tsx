'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { CategoryCatalog } from '@/components/commerce/category-catalog'
import { desktopPredicate } from '@/lib/category-filters'

const TITLES: Record<string, { title: string; description: string }> = {
  gaming: {
    title: 'Gaming desktops',
    description: 'Full-tower and mid-tower rigs tuned for high FPS and cool, quiet operation.',
  },
  workstation: {
    title: 'Workstations',
    description: 'ECC memory options, pro GPUs, and thermals tuned for long render jobs.',
  },
  compact: {
    title: 'Compact desktops',
    description: 'ITX and small-form-factor builds that fit tight desks without giving up power.',
  },
  enthusiast: {
    title: 'Enthusiast desktops',
    description: 'Custom loops, flagship CPUs, and headroom for overclocking experiments.',
  },
}

export default function DesktopsPage() {
  const params = useParams()
  const slug = params.slug as string[] | undefined
  const key = slug?.[0]
  const meta = key ? TITLES[key] : undefined
  const predicate = useMemo(() => desktopPredicate(slug), [slug])

  const title = meta?.title ?? 'All desktops'
  const description =
    meta?.description ??
    'Configure tower PCs for gaming, creation, or compact spaces — assembled in the UK with transparent pricing.'

  return (
    <CategoryCatalog title={title} description={description} predicate={predicate} />
  )
}
