'use client'

import { useState, useEffect } from 'react'
import { BlogForm } from '@/components/admin/blog-form'
import { toast } from 'sonner'

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/blog/${params.id}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const { post } = await res.json()
        setPost(post)
      } catch (err) {
        toast.error('Failed to load post')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

  if (loading) return <div>Loading...</div>
  if (!post) return <div>Post not found</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
        <p className="text-muted-foreground mt-2">{post.title}</p>
      </div>

      <BlogForm post={post} />
    </div>
  )
}
