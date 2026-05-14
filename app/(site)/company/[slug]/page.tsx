import { notFound } from 'next/navigation'
import { SimpleArticle } from '@/components/marketing/simple-article'
import { getCompanyPage } from '@/lib/marketing-content'

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = getCompanyPage(slug)
  if (!doc) notFound()
  return <SimpleArticle title={doc.title} paragraphs={doc.body} />
}
