import { notFound } from 'next/navigation'
import { SimpleArticle } from '@/components/marketing/simple-article'
import { getLegalDoc } from '@/lib/marketing-content'

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = getLegalDoc(slug)
  if (!doc) notFound()
  return <SimpleArticle title={doc.title} paragraphs={doc.body} />
}
