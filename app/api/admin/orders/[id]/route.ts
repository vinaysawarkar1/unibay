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
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        items: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (err) {
    console.error('Get order error:', err)
    return NextResponse.json({ error: 'Failed to get order' }, { status: 500 })
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

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: body.status !== undefined ? body.status : undefined,
        trackingNumber: body.trackingNumber !== undefined ? body.trackingNumber : undefined,
        notes: body.notes !== undefined ? body.notes : undefined,
      },
      include: {
        user: true,
        items: true,
      },
    })

    return NextResponse.json({ order })
  } catch (err) {
    console.error('Update order error:', err)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
