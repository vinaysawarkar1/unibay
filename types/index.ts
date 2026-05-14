export interface ProductTechnicalRow {
  label: string
  value: string
}

export interface ProductTechnicalSection {
  title: string
  rows: ProductTechnicalRow[]
}

export interface Product {
  id: string
  name: string
  slug: string
  category: 'laptop' | 'desktop' | 'accessory'
  subcategory: string
  tagline: string
  description: string
  basePrice: number
  images: string[]
  badge?: string
  rating: number
  reviewCount: number
  specs: Record<string, string>
  features: string[]
  colors?: string[]
  stock: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order'
  deliveryDays: number
  /** Richer narrative — UK market tone, original copy */
  longDescription?: string
  /** Structured technical blocks (similar depth to major UK configurators) */
  technicalSections?: ProductTechnicalSection[]
  whatsInTheBox?: string[]
  warrantySummary?: string
  complianceNotes?: string
}

// Component Types
export interface Processor {
  id: string
  name: string
  brand: 'Intel' | 'AMD'
  series: string
  cores: number
  threads: number
  baseClock: number
  boostClock: number
  tdp: number
  socket: string
  price: number
  performance: number
  tier: string
}

export interface GraphicsCard {
  id: string
  name: string
  brand: 'NVIDIA' | 'AMD'
  series: string
  vram: number
  vramType: string
  coreClock: number
  boostClock: number
  tdp: number
  price: number
  performance: number
  tier: string
  rayTracing: boolean
  dlss: string | null
}

export interface Memory {
  id: string
  name: string
  type: string
  speed: number
  capacity: number
  modules: string
  latency: string
  rgb: boolean
  price: number
  tier: string
}

export interface Storage {
  id: string
  name: string
  type: 'NVMe' | 'HDD' | 'SATA'
  generation: string
  capacity: number
  readSpeed: number
  writeSpeed: number
  price: number
  tier: string
}

export interface Cooling {
  id: string
  name: string
  type: 'Custom Loop' | 'AIO' | 'Air'
  radiatorSize: number | null
  fans: number
  rgb: boolean
  tdpSupport: number
  price: number
  tier: string
}

export interface Case {
  id: string
  name: string
  formFactor: string
  motherboardSupport: string[]
  gpuClearance: number
  cpuClearance: number
  radiatorSupport: number[]
  driveBays: { '3.5': number; '2.5': number }
  rgb: boolean
  tempered_glass: boolean
  price: number
  tier: string
}

export interface PowerSupply {
  id: string
  name: string
  wattage: number
  efficiency: string
  modular: string
  fanSize: number
  price: number
  tier: string
}

// Configuration Types
export interface BuildConfiguration {
  id: string
  name: string
  type: 'laptop' | 'desktop'
  baseProduct?: Product
  components: {
    processor?: Processor
    graphics?: GraphicsCard
    memory?: Memory
    storage?: Storage[]
    cooling?: Cooling
    case?: Case
    powerSupply?: PowerSupply
  }
  customizations: {
    color?: string
    rgbProfile?: RGBProfile
    engraving?: string
    warranty?: WarrantyOption
  }
  totalPrice: number
  estimatedPerformance: PerformanceEstimate
}

export interface RGBProfile {
  id: string
  name: string
  colors: string[]
  effect: 'static' | 'breathing' | 'rainbow' | 'wave' | 'reactive'
  speed: number
  brightness: number
}

export interface WarrantyOption {
  id: string
  name: string
  duration: number // months
  coverage: string[]
  price: number
}

export interface PerformanceEstimate {
  gaming1080p: number
  gaming1440p: number
  gaming4k: number
  productivity: number
  streaming: number
  contentCreation: number
}

// Cart Types
export interface CartItem {
  id: string
  configuration: BuildConfiguration
  quantity: number
  addedAt: string
}

// Compatibility Types
export interface CompatibilityResult {
  compatible: boolean
  warnings: CompatibilityWarning[]
  errors: CompatibilityError[]
}

export interface CompatibilityWarning {
  type: string
  message: string
  severity: 'low' | 'medium' | 'high'
}

export interface CompatibilityError {
  type: string
  message: string
  component1: string
  component2: string
}

// Game Performance Types
export interface GameBenchmark {
  id: string
  name: string
  image: string
  requirements: {
    minimum: GameRequirements
    recommended: GameRequirements
    ultra: GameRequirements
  }
}

export interface GameRequirements {
  cpu: string
  gpu: string
  ram: number
  storage: number
}

export interface FPSEstimate {
  game: string
  resolution: '1080p' | '1440p' | '4K'
  settings: 'low' | 'medium' | 'high' | 'ultra'
  fps: number
  rayTracing: boolean
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  savedBuilds: BuildConfiguration[]
  orders: Order[]
  wishlist: Product[]
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  status: 'pending' | 'processing' | 'building' | 'testing' | 'shipping' | 'delivered'
  totalPrice: number
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  createdAt: Date
  estimatedDelivery: Date
  trackingNumber?: string
}

export interface Address {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

// Review Types
export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  productId: string
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  images?: string[]
  verified: boolean
  helpful: number
  createdAt: Date
}

// Navigation Types
export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
  badge?: string
  icon?: string
}

// Filter Types
export interface FilterOption {
  id: string
  label: string
  value: string | number | boolean
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  type: 'checkbox' | 'range' | 'radio'
  options: FilterOption[]
}

export interface SortOption {
  id: string
  label: string
  value: string
  direction: 'asc' | 'desc'
}
