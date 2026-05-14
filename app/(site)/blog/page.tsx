import Link from 'next/link'
import { blogPosts } from '@/lib/marketing-content'

export default function BlogIndexPage() {
  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">UNIBAY Journal</h1>
      <ul className="space-y-6">
        {blogPosts.map((post) => (
          <li key={post.slug} className="border-b border-border pb-6">
            <Link href={`/blog/${post.slug}`} className="group">
              <p className="text-xs text-muted-foreground mb-1">
                {new Date(post.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground mt-2">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
