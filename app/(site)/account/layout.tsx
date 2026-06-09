'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  User,
  MapPin,
  Package,
  Lock,
  LogOut,
  LayoutDashboard,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/account', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/account/profile', label: 'Personal details', icon: User },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/security', label: 'Security', icon: Lock },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`)
    }
  }, [status, router, pathname])

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!session?.user?.email) {
    return null // redirecting
  }

  const userName = (session.user as any)?.name || session.user.email?.split('@')[0]
  const initials = (userName || 'U')
    .split(' ')
    .map((s: string) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  function handleSignOut() {
    if (typeof window !== 'undefined' && (window as any).signOutWithSync) {
      ;(window as any).signOutWithSync()
    } else {
      signOut({ callbackUrl: '/' })
    }
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 pt-24 pb-16">
      {/* Account header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-lg text-primary-foreground shadow-lg shadow-primary/30">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-tight">Hi, {userName}</h1>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="rounded-2xl border border-border bg-card overflow-hidden">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm border-l-2 transition-colors',
                    active
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4 shrink-0" />}
                </Link>
              )
            })}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm border-l-2 border-transparent text-muted-foreground hover:bg-red-500/10 hover:text-red-400 hover:border-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Sign out</span>
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}
