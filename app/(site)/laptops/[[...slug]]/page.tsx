'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { CategoryCatalog } from '@/components/commerce/category-catalog'
import { laptopPredicate } from '@/lib/category-filters'

const TITLES: Record<string, { title: string; description: string }> = {
  gaming: {
    title: 'Gaming laptops',
    description:
      'High-refresh displays and desktop-class graphics for competitive play — built and supported in the UK.',
  },
  creator: {
    title: 'Creator laptops',
    description:
      'Colour-accurate panels and sustained performance for video, 3D, and design workloads.',
  },
  ultraportable: {
    title: 'Ultraportable laptops',
    description: 'Thin, light systems you can carry every day without sacrificing performance.',
  },
}

export default function LaptopsPage() {
  const params = useParams()
  const slug = params.slug as string[] | undefined
  const key = slug?.[0]
  const meta = key ? TITLES[key] : undefined
  const predicate = useMemo(() => laptopPredicate(slug), [slug])

  const title = meta?.title ?? 'All laptops'
  const description =
    meta?.description ??
    'Browse every UNIBAY laptop line — gaming, creator, and ultraportable — with UK pricing and delivery estimates.'

  return (
    <CategoryCatalog title={title} description={description} predicate={predicate} />
  )
}
