'use client'

import { useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/store'

export function AuthListener() {
  const { status } = useSession()
  const loadFromServer = useCartStore((s) => s.loadFromServer)
  const pushLocalToServer = useCartStore((s) => s.pushLocalToServer)

  useEffect(() => {
    if (status === 'authenticated') {
      // when user signs in, load their server-side cart
      loadFromServer().catch(() => {})
    }
  }, [status, loadFromServer])

  useEffect(() => {
    // expose a window helper so sign-out can sync first
    // usage: window.signOutWithSync()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.signOutWithSync = async () => {
      try {
        await pushLocalToServer()
      } catch (e) {
        // ignore
      }
      signOut({ callbackUrl: '/' })
    }

    return () => {
      // @ts-ignore
      delete window.signOutWithSync
    }
  }, [pushLocalToServer])

  return null
}
