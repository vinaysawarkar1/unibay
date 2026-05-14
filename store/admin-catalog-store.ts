'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductOverride } from '@/lib/catalog'

export interface PlacedOrderLine {
  name: string
  quantity: number
  lineTotalGBP: number
}

export interface PlacedOrder {
  id: string
  email: string
  name: string
  lines: PlacedOrderLine[]
  totalGBP: number
  status: 'received' | 'building' | 'dispatched' | 'delivered'
  createdAt: string
}

interface AdminCatalogState {
  productOverrides: Record<string, ProductOverride>
  /** Replaces public gallery for a product (e.g. uploaded data URLs) */
  productImageOverlays: Record<string, string[]>
  featuredProductIds: string[] | null
  newsletterEmails: string[]
  orders: PlacedOrder[]
  setProductOverride: (id: string, patch: ProductOverride) => void
  clearProductOverride: (id: string) => void
  setProductImageOverlay: (id: string, images: string[]) => void
  clearProductImageOverlay: (id: string) => void
  setFeaturedProductIds: (ids: string[] | null) => void
  addNewsletterEmail: (email: string) => boolean
  addOrder: (order: PlacedOrder) => void
  updateOrderStatus: (id: string, status: PlacedOrder['status']) => void
}

export const useAdminCatalogStore = create<AdminCatalogState>()(
  persist(
    (set, get) => ({
      productOverrides: {},
      productImageOverlays: {},
      featuredProductIds: null,
      newsletterEmails: [],
      orders: [],

      setProductOverride: (id, patch) =>
        set((s) => ({
          productOverrides: {
            ...s.productOverrides,
            [id]: { ...s.productOverrides[id], ...patch },
          },
        })),

      clearProductOverride: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.productOverrides
          return { productOverrides: rest }
        }),

      setProductImageOverlay: (id, images) =>
        set((s) => ({
          productImageOverlays: { ...s.productImageOverlays, [id]: images },
        })),

      clearProductImageOverlay: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.productImageOverlays
          return { productImageOverlays: rest }
        }),

      setFeaturedProductIds: (ids) => set({ featuredProductIds: ids }),

      addNewsletterEmail: (email) => {
        const normalized = email.trim().toLowerCase()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return false
        const existing = get().newsletterEmails
        if (existing.includes(normalized)) return true
        set({ newsletterEmails: [...existing, normalized] })
        return true
      },

      addOrder: (order) =>
        set((s) => ({
          orders: [order, ...s.orders],
        })),

      updateOrderStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    }),
    { name: 'unibay-admin-catalog' }
  )
)
