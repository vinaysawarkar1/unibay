import { notFound } from 'next/navigation'
import { SimpleArticle } from '@/components/marketing/simple-article'
import { getInfoPage } from '@/lib/marketing-content'

export default function BusinessPage() {
  const doc = getInfoPage('business')
  if (!doc) notFound()
  return <SimpleArticle title={doc.title} paragraphs={doc.body} />
}
