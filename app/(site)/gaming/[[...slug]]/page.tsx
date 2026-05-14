'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { CategoryCatalog } from '@/components/commerce/category-catalog'
import { gamingPredicate } from '@/lib/category-filters'

const TITLES: Record<string, { title: string; description: string }> = {
  games: {
    title: 'Systems by game',
    description:
      'Pick a popular title and we will highlight rigs that meet or exceed recommended specs (see product pages for detail).',
  },
  esports: {
    title: 'Esports-focused builds',
    description: 'High frame rates for competitive titles with sensible UK pricing.',
  },
  streaming: {
    title: 'Streaming setups',
    description: 'CPU and GPU headroom for simultaneous gaming and encoding.',
  },
}

export default function GamingHubPage() {
  const params = useParams()
  const slug = params.slug as string[] | undefined
  const key = slug?.[0]
  const meta = key ? TITLES[key] : undefined
  const predicate = useMemo(() => gamingPredicate(slug), [slug])

  const title = meta?.title ?? 'Gaming at UNIBAY'
  const description =
    meta?.description ??
    'Explore laptops and desktops tuned for modern games, streaming, and competitive play.'

  return (
    <CategoryCatalog title={title} description={description} predicate={predicate} />
  )
}
