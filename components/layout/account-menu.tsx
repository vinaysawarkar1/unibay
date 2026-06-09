'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AccountMenu() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const isAuthed = status === 'authenticated' && !!session?.user
  const name = (session?.user as any)?.name || session?.user?.email?.split('@')[0] || 'Account'
  const initials = (name || 'U')
    .split(' ')
    .map((s: string) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  function handleSignOut() {
    setOpen(false)
    if (typeof window !== 'undefined' && (window as any).signOutWithSync) {
      ;(window as any).signOutWithSync()
    } else {
      signOut({ callbackUrl: '/' })
    }
  }

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-full hidden sm:flex items-center justify-center w-9 h-9 hover:bg-secondary transition-colors"
        aria-label="Account menu"
      >
        {isAuthed ? (
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
            {initials}
          </span>
        ) : (
          <User className="w-5 h-5" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full pt-2 w-64 z-50"
          >
            <div className="glass rounded-xl border border-border/50 p-2 shadow-xl shadow-black/20">
              {isAuthed ? (
                <>
                  <div className="px-3 py-2.5 border-b border-border/50 mb-1">
                    <p className="text-sm font-semibold truncate">{name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                  </div>
                  {[
                    { href: '/account', label: 'Dashboard', icon: LayoutDashboard },
                    { href: '/account/orders', label: 'Your orders', icon: Package },
                    { href: '/account/addresses', label: 'Addresses', icon: MapPin },
                    { href: '/account/profile', label: 'Personal details', icon: User },
                    { href: '/account/security', label: 'Security', icon: Lock },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-border/50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <div className="px-3 py-2.5 border-b border-border/50 mb-2">
                    <p className="text-sm font-semibold">Welcome</p>
                    <p className="text-xs text-muted-foreground">Sign in to manage orders & addresses</p>
                  </div>
                  <div className="space-y-2 px-1 pb-1">
                    <Link href="/auth/signin" onClick={() => setOpen(false)}>
                      <Button className="w-full glow-cyan" size="sm">
                        <LogIn className="w-4 h-4 mr-2" /> Sign in
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full" size="sm">
                        <UserPlus className="w-4 h-4 mr-2" /> Create account
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
