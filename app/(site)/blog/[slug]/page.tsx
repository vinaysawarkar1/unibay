import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SimpleArticle } from '@/components/marketing/simple-article'
import { getBlogPost } from '@/lib/marketing-content'

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()
  return (
    <div>
      <div className="container mx-auto px-4 pt-10">
        <Link href="/blog" className="text-sm text-primary hover:underline">
          ← Back to Journal
        </Link>
      </div>
      <SimpleArticle title={post.title} paragraphs={[post.excerpt, ...post.body]} />
    </div>
  )
}
