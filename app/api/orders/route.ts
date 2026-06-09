import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session?.user?.email) return NextResponse.json({ orders: [] })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ orders: [] })
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, total, orderId, shippingAddress } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 })
    }

    const session = (await getServerSession(authOptions as any)) as any
    let userId: string | undefined

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } })
      if (user) userId = user.id
    }

    // Guest checkout — shadow user keyed by email
    if (!userId && shippingAddress?.email) {
      let guest = await prisma.user.findUnique({ where: { email: shippingAddress.email } })
      if (!guest) {
        guest = await prisma.user.create({
          data: {
            email: shippingAddress.email,
            name: shippingAddress.name || shippingAddress.fullName || shippingAddress.email.split('@')[0],
          },
        })
      }
      userId = guest.id
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Cannot place order without account or shipping email' },
        { status: 401 }
      )
    }

    const order = await prisma.order.create({
      data: {
        id: orderId || undefined,
        userId,
        total: total || 0,
        status: 'pending',
        shippingAddress: shippingAddress || undefined,
        items: {
          create: items.map((it: any) => ({
            productSnap: it.configuration,
            quantity: it.quantity,
            price: it.price || 0,
          })),
        },
      },
      include: { items: true },
    })

    // Clear server-side cart for authenticated users
    if (session?.user?.email) {
      await prisma.cartItem.deleteMany({ where: { userId } })
    }

    return NextResponse.json({ order })
  } catch (err: any) {
    console.error('Order creation error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
