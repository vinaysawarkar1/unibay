import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/api-auth'

const CANCELLABLE = new Set(['pending', 'processing'])

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser()
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id } })
  if (!order || order.userId !== auth.user.id) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  if (!CANCELLABLE.has(order.status)) {
    return NextResponse.json(
      { error: `Cannot cancel an order in "${order.status}" status` },
      { status: 400 }
    )
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status: 'cancelled' },
    include: { items: true },
  })
  return NextResponse.json({ order: updated })
}
