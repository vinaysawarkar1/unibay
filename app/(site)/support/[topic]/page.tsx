import { notFound } from 'next/navigation'
import { SimpleArticle } from '@/components/marketing/simple-article'
import { getSupportTopic } from '@/lib/marketing-content'

export default async function SupportTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>
}) {
  const { topic } = await params
  const doc = getSupportTopic(topic)
  if (!doc) notFound()
  return <SimpleArticle title={doc.title} paragraphs={doc.body} />
}
