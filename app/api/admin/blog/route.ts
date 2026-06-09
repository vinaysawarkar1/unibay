import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-admin'

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '10')
    const published = searchParams.get('published')

    const where = published !== null ? { published: published === 'true' } : {}
    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ])

    return NextResponse.json({
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('Get blog posts error:', err)
    return NextResponse.json({ error: 'Failed to get blog posts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await req.json()

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    let slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.title)
    let suffix = 0
    let finalSlug = slug
    while (await prisma.blogPost.findUnique({ where: { slug: finalSlug } })) {
      suffix++
      finalSlug = `${slug}-${suffix}`
    }

    const post = await prisma.blogPost.create({
      data: {
        slug: finalSlug,
        title: body.title.trim(),
        excerpt: body.excerpt || null,
        coverImage: body.coverImage || null,
        body: Array.isArray(body.body) ? body.body : [],
        author: body.author || null,
        published: !!body.published,
        date: body.date ? new Date(body.date) : new Date(),
      },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (err) {
    console.error('Create blog post error:', err)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}
