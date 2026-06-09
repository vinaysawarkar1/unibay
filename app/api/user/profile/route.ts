import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/api-auth'

const PHONE_RE = /^\+?[\d\s\-()]{7,20}$/

export async function GET() {
  const auth = await requireUser()
  if (auth instanceof NextResponse) return auth
  const u = auth.user
  return NextResponse.json({
    profile: {
      id: u.id,
      name: u.name,
      email: u.email,
      emailVerified: u.emailVerified,
      image: u.image,
      phone: u.phone,
      dateOfBirth: u.dateOfBirth,
      gender: u.gender,
      createdAt: u.createdAt,
      hasPassword: !!u.hashedPassword,
    },
  })
}

export async function PUT(req: NextRequest) {
  const auth = await requireUser()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await req.json()
    const { name, phone, dateOfBirth, gender, image } = body

    const updates: Record<string, any> = {}

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 1 || name.length > 100) {
        return NextResponse.json({ error: 'Name must be 1–100 characters' }, { status: 400 })
      }
      updates.name = name.trim()
    }

    if (phone !== undefined) {
      if (phone === '' || phone === null) {
        updates.phone = null
      } else if (typeof phone !== 'string' || !PHONE_RE.test(phone)) {
        return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
      } else {
        updates.phone = phone.trim()
      }
    }

    if (dateOfBirth !== undefined) {
      if (dateOfBirth === '' || dateOfBirth === null) {
        updates.dateOfBirth = null
      } else {
        const d = new Date(dateOfBirth)
        if (isNaN(d.getTime()) || d > new Date()) {
          return NextResponse.json({ error: 'Invalid date of birth' }, { status: 400 })
        }
        updates.dateOfBirth = d
      }
    }

    if (gender !== undefined) {
      const allowed = ['male', 'female', 'other', 'prefer_not_to_say', null, '']
      if (!allowed.includes(gender)) {
        return NextResponse.json({ error: 'Invalid gender value' }, { status: 400 })
      }
      updates.gender = gender || null
    }

    if (image !== undefined) {
      if (image && (typeof image !== 'string' || image.length > 500)) {
        return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 })
      }
      updates.image = image || null
    }

    const updated = await prisma.user.update({
      where: { id: auth.user.id },
      data: updates,
    })

    return NextResponse.json({
      profile: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        emailVerified: updated.emailVerified,
        image: updated.image,
        phone: updated.phone,
        dateOfBirth: updated.dateOfBirth,
        gender: updated.gender,
        createdAt: updated.createdAt,
        hasPassword: !!updated.hashedPassword,
      },
    })
  } catch (err: any) {
    console.error('Profile update error:', err)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
