'use client'

import { SessionProvider } from 'next-auth/react'
import type { SessionProviderProps } from 'next-auth/react'

export function AuthProvider({ children, ...props }: SessionProviderProps) {
  return <SessionProvider {...props}>{children}</SessionProvider>
}

