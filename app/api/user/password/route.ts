import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/api-auth'

export async function PUT(req: NextRequest) {
  const auth = await requireUser()
  if (auth instanceof NextResponse) return auth

  try {
    const { currentPassword, newPassword } = await req.json()
    const u = auth.user

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
    }

    // If the user already has a password, require current password
    if (u.hashedPassword) {
      if (!currentPassword || typeof currentPassword !== 'string') {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 })
      }
      const valid = await bcrypt.compare(currentPassword, u.hashedPassword)
      if (!valid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
      }
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: u.id },
      data: { hashedPassword: hashed },
    })

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (err) {
    console.error('Password change error:', err)
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
  }
}
