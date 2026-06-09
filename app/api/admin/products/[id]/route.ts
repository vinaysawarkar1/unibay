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
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (err) {
    console.error('Get product error:', err)
    return NextResponse.json({ error: 'Failed to get product' }, { status: 500 })
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

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        category: body.category !== undefined ? body.category : undefined,
        subcategory: body.subcategory !== undefined ? body.subcategory : undefined,
        tagline: body.tagline !== undefined ? body.tagline : undefined,
        description: body.description !== undefined ? body.description : undefined,
        longDescription: body.longDescription !== undefined ? body.longDescription : undefined,
        basePrice: body.basePrice !== undefined ? Number(body.basePrice) : undefined,
        images: Array.isArray(body.images) ? body.images : undefined,
        badge: body.badge !== undefined ? body.badge : undefined,
        rating: body.rating !== undefined ? Number(body.rating) : undefined,
        reviewCount: body.reviewCount !== undefined ? Number(body.reviewCount) : undefined,
        specs: body.specs !== undefined ? body.specs : undefined,
        features: Array.isArray(body.features) ? body.features : undefined,
        colors: Array.isArray(body.colors) ? body.colors : undefined,
        stock: body.stock !== undefined ? body.stock : undefined,
        deliveryDays: body.deliveryDays !== undefined ? Number(body.deliveryDays) : undefined,
        technicalSections: body.technicalSections !== undefined ? body.technicalSections : undefined,
        whatsInTheBox: Array.isArray(body.whatsInTheBox) ? body.whatsInTheBox : undefined,
        warrantySummary: body.warrantySummary !== undefined ? body.warrantySummary : undefined,
        complianceNotes: body.complianceNotes !== undefined ? body.complianceNotes : undefined,
        featured: body.featured !== undefined ? !!body.featured : undefined,
        hidden: body.hidden !== undefined ? !!body.hidden : undefined,
        sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      },
    })

    return NextResponse.json({ product })
  } catch (err) {
    console.error('Update product error:', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete product error:', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
