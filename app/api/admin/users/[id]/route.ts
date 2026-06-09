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
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        addresses: true,
        orders: {
          include: { items: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (err) {
    console.error('Get user error:', err)
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
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

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        role: body.role !== undefined ? body.role : undefined,
        phone: body.phone !== undefined ? body.phone : undefined,
        image: body.image !== undefined ? body.image : undefined,
      },
      include: {
        addresses: true,
        orders: true,
      },
    })

    return NextResponse.json({ user })
  } catch (err) {
    console.error('Update user error:', err)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete user error:', err)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
