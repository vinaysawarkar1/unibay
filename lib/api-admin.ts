import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

function adminEmailList(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return adminEmailList().includes(email.toLowerCase())
}

/**
 * Guard for admin-only API routes. Returns the admin user, or a 401/403
 * NextResponse. An account is admin if its DB role is 'admin' OR its email is
 * in the ADMIN_EMAILS env list (which also self-heals the DB role).
 *
 *   const auth = await requireAdmin()
 *   if (auth instanceof NextResponse) return auth
 *   const { user } = auth
 */
export async function requireAdmin() {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allowed = user.role === 'admin' || isAdminEmail(user.email)
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 })
  }

  // Self-heal: persist admin role for env-listed admins
  if (user.role !== 'admin' && isAdminEmail(user.email)) {
    await prisma.user.update({ where: { id: user.id }, data: { role: 'admin' } })
  }

  return { user, session }
}
