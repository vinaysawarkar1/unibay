'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function getExpectedPin(): string {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_UNIBAY_ADMIN_PIN) {
    return process.env.NEXT_PUBLIC_UNIBAY_ADMIN_PIN
  }
  return '782291'
}

interface AdminAuthState {
  ok: boolean
  login: (pin: string) => boolean
  logout: () => void
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      ok: false,

      login: (pin) => {
        if (pin !== getExpectedPin()) return false
        set({ ok: true })
        return true
      },

      logout: () => set({ ok: false }),
    }),
    { name: 'unibay-admin-auth' }
  )
)
