'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { X, Plus } from 'lucide-react'

interface BlogFormProps {
  post?: any
  isNew?: boolean
}

export function BlogForm({ post, isNew = false }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [coverImage, setCoverImage] = useState(post?.coverImage || '')
  const [body, setBody] = useState<string[]>(post?.body || [])
  const [newParagraph, setNewParagraph] = useState('')

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: post || {
      title: '',
      excerpt: '',
      author: '',
      published: false,
    },
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        coverImage,
        body,
      }

      const url = isNew ? '/api/admin/blog' : `/api/admin/blog/${post.id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to save post')

      toast.success(isNew ? 'Post created' : 'Post updated')
      router.push('/admin/blog')
    } catch (err) {
      toast.error('Error saving post')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Post Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title', { required: true })} />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" {...register('excerpt')} rows={3} />
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" {...register('author')} />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('published')} />
              <span className="text-sm">Publish Post</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              placeholder="https://example.com/image.jpg"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          {coverImage && (
            <div className="relative">
              <img src={coverImage} alt="Cover" className="w-full h-48 object-cover rounded" />
              <button
                type="button"
                onClick={() => setCoverImage('')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="paragraph">Add Paragraph</Label>
            <Textarea
              id="paragraph"
              placeholder="Enter paragraph text..."
              value={newParagraph}
              onChange={(e) => setNewParagraph(e.target.value)}
              rows={5}
            />
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={() => {
                if (newParagraph) {
                  setBody([...body, newParagraph])
                  setNewParagraph('')
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Paragraph
            </Button>
          </div>

          <div className="space-y-4">
            {body.map((paragraph, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-slate-50">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm flex-1 whitespace-pre-wrap">{paragraph}</p>
                  <button
                    type="button"
                    onClick={() => setBody(body.filter((_, i) => i !== idx))}
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isNew ? 'Create Post' : 'Update Post'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/blog')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
