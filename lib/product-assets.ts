import type { Product } from '@/types'

export type AssetSource = 'local' | 'curated' | 'fallback'

// Curated Unsplash photo pools per category/subcategory.
// Each ID maps to a stable, high-quality tech-product photo.
const UNSPLASH_POOLS: Record<string, string[]> = {
  'laptop/gaming': [
    'photo-1593642632559-0c6d3fc62b89', // dark gaming laptop RGB keyboard
    'photo-1603302576837-37561b2e2302', // gaming laptop angled shot
    'photo-1542751371-adc38448a05e',    // gaming setup neon ambience
    'photo-1602080858428-57174f9431cf', // modern gaming laptop open
    'photo-1531297484001-80022131f5a1', // laptop on dark surface
  ],
  'laptop/creator': [
    'photo-1496181133206-80ce9b88a853', // laptop on clean desk
    'photo-1541807084-5c52b6b3adef',    // slim laptop side view
    'photo-1517336714731-489689fd1ca8', // creator-style laptop
    'photo-1611532736597-de2d4265fba3', // laptop open creative
    'photo-1588702547923-7093a6c3ba33', // laptop keyboard close-up
  ],
  'laptop/ultraportable': [
    'photo-1525547719571-a2d4ac8945e2', // thin laptop side profile
    'photo-1611532736597-de2d4265fba3', // slim laptop open
    'photo-1496181133206-80ce9b88a853', // laptop floating minimal
    'photo-1517336714731-489689fd1ca8', // ultrabook thin
    'photo-1541807084-5c52b6b3adef',    // closed slim laptop
  ],
  'laptop/other': [
    'photo-1593642632559-0c6d3fc62b89',
    'photo-1603302576837-37561b2e2302',
    'photo-1496181133206-80ce9b88a853',
    'photo-1541807084-5c52b6b3adef',
    'photo-1517336714731-489689fd1ca8',
    'photo-1531297484001-80022131f5a1',
    'photo-1588702547923-7093a6c3ba33',
    'photo-1610465299996-30f240ac2b1c', // laptop dark ambient
  ],
  'desktop/gaming': [
    'photo-1591488320449-011701bb6704', // RGB gaming PC tower
    'photo-1547082299-de196ea013d6',    // gaming tower setup
    'photo-1518770660439-4636190af475', // circuit board / internals
    'photo-1587202372775-e229f172b9d7', // gaming rig lit
    'photo-1640955011254-39734e60b16f', // PC build with RGB
  ],
  'desktop/workstation': [
    'photo-1629429407759-01cd3d7cfb38', // workstation dual monitor
    'photo-1587202372775-e229f172b9d7', // powerful PC build
    'photo-1591488320449-011701bb6704', // tower PC professional
    'photo-1518770660439-4636190af475', // internals / components
    'photo-1547082299-de196ea013d6',    // desk workstation setup
  ],
  'desktop/enthusiast': [
    'photo-1591488320449-011701bb6704',
    'photo-1640955011254-39734e60b16f',
    'photo-1547082299-de196ea013d6',
    'photo-1587202372775-e229f172b9d7',
    'photo-1518770660439-4636190af475',
  ],
  'desktop/small-form-factor': [
    'photo-1591488320449-011701bb6704',
    'photo-1518770660439-4636190af475',
    'photo-1547082299-de196ea013d6',
    'photo-1587202372775-e229f172b9d7',
    'photo-1640955011254-39734e60b16f',
  ],
  'desktop/other': [
    'photo-1591488320449-011701bb6704',
    'photo-1547082299-de196ea013d6',
    'photo-1587202372775-e229f172b9d7',
    'photo-1518770660439-4636190af475',
    'photo-1640955011254-39734e60b16f',
    'photo-1629429407759-01cd3d7cfb38',
    'photo-1531297484001-80022131f5a1',
    'photo-1496181133206-80ce9b88a853',
  ],
  'accessory/keyboard': [
    'photo-1618384887929-16ec33fab9ef', // mechanical keyboard RGB
    'photo-1587829741301-dc798b83add3', // keyboard close-up
    'photo-1541140532154-b024d705b90a', // gaming keyboard lit
    'photo-1615869442320-fd02a129c77c', // keyboard side view
    'photo-1517420879524-86d64ac2f339', // minimal keyboard
  ],
  'accessory/mouse': [
    'photo-1527864550417-7fd91fc51a46', // gaming mouse lit
    'photo-1613141411244-0e4ac259d217', // mouse on mousepad
    'photo-1625842268584-8f3296236761', // gaming mouse top view
    'photo-1527219525722-f9767a7f2884', // mouse RGB
    'photo-1604754742629-3e5728249d73', // mouse on desk
  ],
  'accessory/headset': [
    'photo-1505740420928-5e560c06d30e', // headphones premium
    'photo-1484704849700-f032a568e944', // headphones side
    'photo-1558618666-fcd25c85cd64', // gaming headset
    'photo-1524678714210-9917a6c619c2', // headset on desk
    'photo-1613040809024-b4ef7ba99bc3', // gaming headphones lit
  ],
  'accessory/monitor': [
    'photo-1527443195645-1133f7f28990', // monitor on desk setup
    'photo-1629429407759-01cd3d7cfb38', // dual monitor setup
    'photo-1593305841991-05c297ba4575', // gaming monitor curved
    'photo-1616763355548-1b606f439f86', // widescreen monitor
    'photo-1547082299-de196ea013d6',    // monitor in gaming setup
  ],
  'accessory/other': [
    'photo-1505740420928-5e560c06d30e',
    'photo-1527864550417-7fd91fc51a46',
    'photo-1618384887929-16ec33fab9ef',
    'photo-1527443195645-1133f7f28990',
    'photo-1484704849700-f032a568e944',
  ],
  'other/other': [
    'photo-1518770660439-4636190af475',
    'photo-1591488320449-011701bb6704',
    'photo-1593642632559-0c6d3fc62b89',
    'photo-1547082299-de196ea013d6',
    'photo-1505740420928-5e560c06d30e',
  ],
}

// Stable hash so every product consistently picks from the same position in the pool
function simpleHash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function unsplashUrl(photoId: string, w = 1200, q = 85): string {
  return `https://images.unsplash.com/${photoId}?w=${w}&q=${q}&fit=crop&auto=format`
}

function isWorkingUrl(s: unknown): s is string {
  return typeof s === 'string' && /^https?:\/\//i.test(s)
}

function isLocalPath(s: unknown): s is string {
  return typeof s === 'string' && /^\//.test(s) && !/\.(jpg|jpeg|png|webp)$/.test(s) === false
}

function poolKey(product: Product): string {
  const sub = product.subcategory?.toLowerCase() || 'other'
  const cat = product.category?.toLowerCase() || 'other'
  const key = `${cat}/${sub}`
  if (key in UNSPLASH_POOLS) return key
  if (`${cat}/other` in UNSPLASH_POOLS) return `${cat}/other`
  return 'other/other'
}

export function resolveProductImageUrls(product: Product): {
  images: string[]
  assetSource: AssetSource
} {
  // 1. Use any existing valid HTTP images (e.g. admin-uploaded overlays)
  const existingHttp = (product.images ?? []).filter(isWorkingUrl)
  if (existingHttp.length > 0) {
    return { images: existingHttp, assetSource: 'local' }
  }

  // 2. Serve curated Unsplash images for this product's category
  const key = poolKey(product)
  const pool = UNSPLASH_POOLS[key]
  const hash = simpleHash(product.id)
  const primaryIdx = hash % pool.length
  const secondaryIdx = (hash + 1) % pool.length
  const tertiaryIdx = (hash + 2) % pool.length

  const images = [
    unsplashUrl(pool[primaryIdx]),
    unsplashUrl(pool[secondaryIdx]),
    unsplashUrl(pool[tertiaryIdx]),
  ]

  return { images, assetSource: 'curated' }
}

export function getProductPrimaryImage(product: Product): string {
  const { images } = resolveProductImageUrls(product)
  return images[0]
}
