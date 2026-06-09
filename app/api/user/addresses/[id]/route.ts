import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/api-auth'

async function ownAddressOr404(userId: string, id: string) {
  const addr = await prisma.address.findUnique({ where: { id } })
  if (!addr || addr.userId !== userId) return null
  return addr
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser()
  if (auth instanceof NextResponse) return auth
  const { id } = await params
  const address = await ownAddressOr404(auth.user.id, id)
  if (!address) return NextResponse.json({ error: 'Address not found' }, { status: 404 })
  return NextResponse.json({ address })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser()
  if (auth instanceof NextResponse) return auth
  const { id } = await params

  const existing = await ownAddressOr404(auth.user.id, id)
  if (!existing) return NextResponse.json({ error: 'Address not found' }, { status: 404 })

  try {
    const body = await req.json()
    const allowed = ['label', 'fullName', 'phone', 'line1', 'line2', 'city', 'state', 'postcode', 'country', 'isDefault']
    const updates: Record<string, any> = {}

    for (const k of allowed) {
      if (k in body) updates[k] = body[k]
    }

    if (updates.phone && !/^\+?[\d\s\-()]{7,20}$/.test(updates.phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    // String trim + uppercase postcode
    for (const k of ['label', 'fullName', 'phone', 'line1', 'line2', 'city', 'state', 'country']) {
      if (typeof updates[k] === 'string') updates[k] = updates[k].trim() || null
    }
    if (typeof updates.postcode === 'string') {
      updates.postcode = updates.postcode.trim().toUpperCase()
    }

    // Required fields cannot become empty
    for (const k of ['fullName', 'phone', 'line1', 'city', 'postcode']) {
      if (k in updates && !updates[k]) {
        return NextResponse.json({ error: `${k} cannot be empty` }, { status: 400 })
      }
    }

    // Handle default flip
    if (updates.isDefault === true && !existing.isDefault) {
      await prisma.address.updateMany({
        where: { userId: auth.user.id, isDefault: true },
        data: { isDefault: false },
      })
    } else if (updates.isDefault === false && existing.isDefault) {
      // Cannot unset the only default
      const count = await prisma.address.count({ where: { userId: auth.user.id } })
      if (count > 1) {
        // Allow but mark the most recent other address as default
        const other = await prisma.address.findFirst({
          where: { userId: auth.user.id, NOT: { id } },
          orderBy: { createdAt: 'desc' },
        })
        if (other) await prisma.address.update({ where: { id: other.id }, data: { isDefault: true } })
      } else {
        // Single address — keep it default
        updates.isDefault = true
      }
    }

    const address = await prisma.address.update({ where: { id }, data: updates })
    return NextResponse.json({ address })
  } catch (err) {
    console.error('Update address error:', err)
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser()
  if (auth instanceof NextResponse) return auth
  const { id } = await params

  const existing = await ownAddressOr404(auth.user.id, id)
  if (!existing) return NextResponse.json({ error: 'Address not found' }, { status: 404 })

  await prisma.address.delete({ where: { id } })

  // If we just deleted the default, promote the most recent remaining address
  if (existing.isDefault) {
    const next = await prisma.address.findFirst({
      where: { userId: auth.user.id },
      orderBy: { createdAt: 'desc' },
    })
    if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } })
  }

  return NextResponse.json({ success: true })
}
