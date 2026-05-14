import { notFound } from 'next/navigation'
import { SimpleArticle } from '@/components/marketing/simple-article'
import { getInfoPage } from '@/lib/marketing-content'

export default function EducationPage() {
  const doc = getInfoPage('education')
  if (!doc) notFound()
  return <SimpleArticle title={doc.title} paragraphs={doc.body} />
}
