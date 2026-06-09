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

// List ALL products (including hidden) for the admin table
export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await req.json()

    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!body.category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }
    if (body.basePrice == null || isNaN(Number(body.basePrice))) {
      return NextResponse.json({ error: 'Valid base price is required' }, { status: 400 })
    }

    let slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.name)
    // Ensure unique slug
    let suffix = 0
    let finalSlug = slug
    while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
      suffix++
      finalSlug = `${slug}-${suffix}`
    }

    const product = await prisma.product.create({
      data: {
        slug: finalSlug,
        name: body.name.trim(),
        category: body.category,
        subcategory: body.subcategory || null,
        tagline: body.tagline || null,
        description: body.description || null,
        longDescription: body.longDescription || null,
        basePrice: Number(body.basePrice),
        images: Array.isArray(body.images) ? body.images : [],
        badge: body.badge || null,
        rating: body.rating != null ? Number(body.rating) : 0,
        reviewCount: body.reviewCount != null ? Number(body.reviewCount) : 0,
        specs: body.specs || {},
        features: Array.isArray(body.features) ? body.features : [],
        colors: Array.isArray(body.colors) ? body.colors : [],
        stock: body.stock || 'in_stock',
        deliveryDays: body.deliveryDays != null ? Number(body.deliveryDays) : 5,
        technicalSections: body.technicalSections || null,
        whatsInTheBox: Array.isArray(body.whatsInTheBox) ? body.whatsInTheBox : null,
        warrantySummary: body.warrantySummary || null,
        complianceNotes: body.complianceNotes || null,
        featured: !!body.featured,
        hidden: !!body.hidden,
        sortOrder: body.sortOrder != null ? Number(body.sortOrder) : 999,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (err) {
    console.error('Create product error:', err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
