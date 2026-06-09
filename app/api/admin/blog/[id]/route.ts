import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-admin'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (err) {
    console.error('Get blog post error:', err)
    return NextResponse.json({ error: 'Failed to get blog post' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await req.json()

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        excerpt: body.excerpt !== undefined ? body.excerpt : undefined,
        coverImage: body.coverImage !== undefined ? body.coverImage : undefined,
        body: Array.isArray(body.body) ? body.body : undefined,
        author: body.author !== undefined ? body.author : undefined,
        published: body.published !== undefined ? !!body.published : undefined,
        date: body.date !== undefined ? new Date(body.date) : undefined,
      },
    })

    return NextResponse.json({ post })
  } catch (err) {
    console.error('Update blog post error:', err)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    await prisma.blogPost.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete blog post error:', err)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
