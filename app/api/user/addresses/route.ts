import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/api-auth'

const REQUIRED_FIELDS = ['fullName', 'phone', 'line1', 'city', 'postcode'] as const

function validateBody(body: any): { ok: true; data: any } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid payload' }
  for (const f of REQUIRED_FIELDS) {
    const v = body[f]
    if (!v || typeof v !== 'string' || !v.trim()) {
      return { ok: false, error: `${f} is required` }
    }
  }
  if (body.phone && !/^\+?[\d\s\-()]{7,20}$/.test(body.phone)) {
    return { ok: false, error: 'Invalid phone number' }
  }
  return {
    ok: true,
    data: {
      label: body.label?.trim() || null,
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      line1: body.line1.trim(),
      line2: body.line2?.trim() || null,
      city: body.city.trim(),
      state: body.state?.trim() || null,
      postcode: body.postcode.trim().toUpperCase(),
      country: body.country?.trim() || 'United Kingdom',
      isDefault: !!body.isDefault,
    },
  }
}

export async function GET() {
  const auth = await requireUser()
  if (auth instanceof NextResponse) return auth

  const addresses = await prisma.address.findMany({
    where: { userId: auth.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json({ addresses })
}

export async function POST(req: NextRequest) {
  const auth = await requireUser()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await req.json()
    const v = validateBody(body)
    if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 })

    // If isDefault requested OR this is the user's first address, mark it default
    const existingCount = await prisma.address.count({ where: { userId: auth.user.id } })
    const willBeDefault = v.data.isDefault || existingCount === 0

    if (willBeDefault) {
      await prisma.address.updateMany({
        where: { userId: auth.user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: { ...v.data, isDefault: willBeDefault, userId: auth.user.id },
    })

    return NextResponse.json({ address }, { status: 201 })
  } catch (err) {
    console.error('Create address error:', err)
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 })
  }
}
