import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  BuildConfiguration, 
  CartItem, 
  Product, 
  Processor, 
  GraphicsCard, 
  Memory, 
  Storage, 
  Cooling, 
  Case, 
  PowerSupply,
  RGBProfile 
} from '@/types'

// Configuration Store
interface ConfiguratorState {
  currentBuild: Partial<BuildConfiguration>
  step: number
  isLoading: boolean
  
  // Actions
  setBaseProduct: (product: Product) => void
  setProcessor: (processor: Processor) => void
  setGraphics: (graphics: GraphicsCard) => void
  setMemory: (memory: Memory) => void
  addStorage: (storage: Storage) => void
  removeStorage: (storageId: string) => void
  setCooling: (cooling: Cooling) => void
  setCase: (caseComponent: Case) => void
  setPowerSupply: (psu: PowerSupply) => void
  setColor: (color: string) => void
  setRGBProfile: (profile: RGBProfile) => void
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  resetBuild: () => void
  calculateTotalPrice: () => number
}

export const useConfiguratorStore = create<ConfiguratorState>()((set, get) => ({
  currentBuild: {
    id: crypto.randomUUID(),
    name: 'My Custom Build',
    type: 'desktop',
    components: {},
    customizations: {},
    totalPrice: 0,
    estimatedPerformance: {
      gaming1080p: 0,
      gaming1440p: 0,
      gaming4k: 0,
      productivity: 0,
      streaming: 0,
      contentCreation: 0,
    },
  },
  step: 0,
  isLoading: false,

  setBaseProduct: (product) =>
    set((state) => ({
      currentBuild: {
        ...state.currentBuild,
        baseProduct: product,
        type: product.category === 'laptop' ? 'laptop' : 'desktop',
      },
    })),

  setProcessor: (processor) =>
    set((state) => ({
      currentBuild: {
        ...state.currentBuild,
        components: {
          ...state.currentBuild.components,
          processor,
        },
      },
    })),

  setGraphics: (graphics) =>
    set((state) => ({
      currentBuild: {
        ...state.currentBuild,
        components: {
          ...state.currentBuild.components,
          graphics,
        },
      },
    })),

  setMemory: (memory) =>
    set((state) => ({
      currentBuild: {
        ...state.currentBuild,
        components: {
          ...state.currentBuild.components,
          memory,
        },
      },
    })),

  addStorage: (storage) =>
    set((state) => ({
      currentBuild: {
        ...state.currentBuild,
        components: {
          ...state.currentBuild.components,
          storage: [...(state.currentBuild.components?.storage || []), storage],
        },
      },
    })),

  removeStorage: (storageId) =>
    set((state) => ({
      currentBuild: {
        ...state.currentBuild,
        components: {
          ...state.currentBuild.components,
          storage: state.currentBuild.components?.storage?.filter(
            (s) => s.id !== storageId
          ),
        },
      },
    })),

  setCooling: (cooling) =>
    set((state) => ({
      currentBuild: {
        ...state.currentBuild,
        components: {
          ...state.currentBuild.components,
          cooling,
        },
      },
    })),

  setCase: (caseComponent) =>
    set((state) => ({
      currentBuild: {
        ...state.currentBuild,
        components: {
          ...state.currentBuild.components,
          case: caseComponent,
        },
      },
    })),

  setPowerSupply: (psu) =>
    set((state) => ({
      currentBuild: {
        ...state.currentBuild,
        components: {
          ...state.currentBuild.components,
          powerSupply: psu,
        },
      },
    })),

  setColor: (color) =>
    set((state) => ({
      currentBuild: {
        ...state.currentBuild,
        customizations: {
          ...state.currentBuild.customizations,
          color,
        },
      },
    })),

  setRGBProfile: (profile) =>
    set((state) => ({
      currentBuild: {
        ...state.currentBuild,
        customizations: {
          ...state.currentBuild.customizations,
          rgbProfile: profile,
        },
      },
    })),

  setStep: (step) => set({ step }),
  
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  
  prevStep: () => set((state) => ({ step: Math.max(0, state.step - 1) })),

  resetBuild: () =>
    set({
      currentBuild: {
        id: crypto.randomUUID(),
        name: 'My Custom Build',
        type: 'desktop',
        components: {},
        customizations: {},
        totalPrice: 0,
        estimatedPerformance: {
          gaming1080p: 0,
          gaming1440p: 0,
          gaming4k: 0,
          productivity: 0,
          streaming: 0,
          contentCreation: 0,
        },
      },
      step: 0,
    }),

  calculateTotalPrice: () => {
    const { currentBuild } = get()
    let total = currentBuild.baseProduct?.basePrice || 0

    if (currentBuild.components?.processor) {
      total += currentBuild.components.processor.price
    }
    if (currentBuild.components?.graphics) {
      total += currentBuild.components.graphics.price
    }
    if (currentBuild.components?.memory) {
      total += currentBuild.components.memory.price
    }
    if (currentBuild.components?.storage) {
      total += currentBuild.components.storage.reduce((sum, s) => sum + s.price, 0)
    }
    if (currentBuild.components?.cooling) {
      total += currentBuild.components.cooling.price
    }
    if (currentBuild.components?.case) {
      total += currentBuild.components.case.price
    }
    if (currentBuild.components?.powerSupply) {
      total += currentBuild.components.powerSupply.price
    }

    return total
  },
}))

// Cart Store
interface CartState {
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (configuration: BuildConfiguration) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  // Sync with server for authenticated users
  loadFromServer: () => Promise<void>
  pushLocalToServer: () => Promise<void>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (configuration) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              id: crypto.randomUUID(),
              configuration,
              quantity: 1,
              addedAt: new Date().toISOString(),
            },
          ],
        })),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      openCart: () => set({ isOpen: true }),
      
      closeCart: () => set({ isOpen: false }),

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce(
          (total, item) => total + item.configuration.totalPrice * item.quantity,
          0
        )
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },
      loadFromServer: async () => {
        try {
          const res = await fetch('/api/cart')
          if (!res.ok) return
          const data = await res.json()
          if (data?.items) set({ items: data.items })
        } catch (err) {
          // ignore
        }
      },
      pushLocalToServer: async () => {
        try {
          const { items } = get()
          for (const item of items) {
            await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ configuration: item.configuration, quantity: item.quantity }) })
          }
        } catch (err) {
          // ignore
        }
      },
    }),
    {
      name: 'unibay-cart',
    }
  )
)

// UI Store
interface UIState {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  activeModal: string | null
  theme: 'dark' | 'light'
  
  // Actions
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  toggleSearch: () => void
  closeSearch: () => void
  openModal: (modalId: string) => void
  closeModal: () => void
  setTheme: (theme: 'dark' | 'light') => void
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  activeModal: null,
  theme: 'dark',

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  
  closeSearch: () => set({ isSearchOpen: false }),
  
  openModal: (modalId) => set({ activeModal: modalId }),
  
  closeModal: () => set({ activeModal: null }),
  
  setTheme: (theme) => set({ theme }),
}))

// Comparison Store
interface ComparisonState {
  items: Product[]
  maxItems: number
  
  // Actions
  addToComparison: (product: Product) => void
  removeFromComparison: (productId: string) => void
  clearComparison: () => void
  isInComparison: (productId: string) => boolean
}

export const useComparisonStore = create<ComparisonState>()((set, get) => ({
  items: [],
  maxItems: 4,

  addToComparison: (product) =>
    set((state) => {
      if (state.items.length >= state.maxItems) {
        return state
      }
      if (state.items.some((p) => p.id === product.id)) {
        return state
      }
      return { items: [...state.items, product] }
    }),

  removeFromComparison: (productId) =>
    set((state) => ({
      items: state.items.filter((p) => p.id !== productId),
    })),

  clearComparison: () => set({ items: [] }),

  isInComparison: (productId) => {
    const { items } = get()
    return items.some((p) => p.id === productId)
  },
}))
