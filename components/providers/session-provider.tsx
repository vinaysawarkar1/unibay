'use client'

import { SessionProvider } from 'next-auth/react'
import type { SessionProviderProps } from 'next-auth/react'

export function AppSessionProvider({
  children,
  ...props
}: SessionProviderProps & { children: React.ReactNode }) {
  return <SessionProvider {...props}>{children}</SessionProvider>
}

