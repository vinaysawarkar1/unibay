import { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isAdminEmail } from '@/lib/api-admin'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

async function checkAdminAccess() {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || (user.role !== 'admin' && !isAdminEmail(user.email))) {
    redirect('/')
  }
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await checkAdminAccess()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
