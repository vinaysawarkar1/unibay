import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions as any) as any
  if (!session?.user?.email) return NextResponse.json({ items: [] })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ items: [] })
  const items = await prisma.cartItem.findMany({ where: { userId: user.id }, orderBy: { addedAt: 'desc' } })
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any) as any
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { configuration, quantity = 1 } = body
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const item = await prisma.cartItem.create({ data: { userId: user.id, configuration, quantity } })
  return NextResponse.json({ item })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions as any) as any
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  await prisma.cartItem.deleteMany({ where: { id } })
  return NextResponse.json({ ok: true })
}
