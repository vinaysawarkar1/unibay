import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * Helper used by every authenticated API route.
 * Returns the User row, or a NextResponse with 401 if not signed in.
 *
 * Usage:
 *   const auth = await requireUser()
 *   if (auth instanceof NextResponse) return auth
 *   const { user } = auth
 */
export async function requireUser() {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 })
  }
  return { user, session }
}
