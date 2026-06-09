// Seed the database with the curated product catalogue from data/products.json.
//
// Replicates lib/catalog.getRawProducts(): flatten laptops/desktops/accessories,
// strip empty migration stubs, then merge enrichment from product-enrichment.json
// (same as lib/enrich-products.enrichProduct). Images are NOT resolved here —
// the read layer (lib/products-db.mapDbProduct) resolves them at query time.
//
// Idempotent: upserts by unique `slug`, so running it repeatedly is safe.
//
// Usage:  node scripts/seed-products.mjs
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const catalogue = JSON.parse(readFileSync(join(root, 'data/products.json'), 'utf8'))
const enrichment = JSON.parse(
  readFileSync(join(root, 'data/product-enrichment.json'), 'utf8')
)

const prisma = new PrismaClient()

function enrich(p) {
  const extra = enrichment[p.id]
  return extra ? { ...p, ...extra } : p
}

async function main() {
  const flat = [
    ...(catalogue.laptops || []),
    ...(catalogue.desktops || []),
    ...(catalogue.accessories || []),
  ]
    // Strip empty migration stubs (no price, no real name)
    .filter(
      (p) =>
        p.basePrice > 0 &&
        p.name &&
        p.name.length > 2 &&
        !String(p.id).startsWith('migrated-')
    )
    .map(enrich)

  console.log(`Seeding ${flat.length} products...`)

  let created = 0
  let updated = 0

  for (let i = 0; i < flat.length; i++) {
    const p = flat[i]
    const data = {
      slug: p.slug,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory ?? null,
      tagline: p.tagline ?? null,
      description: p.description ?? null,
      longDescription: p.longDescription ?? null,
      basePrice: Number(p.basePrice),
      images: Array.isArray(p.images) ? p.images : [],
      badge: p.badge ?? null,
      rating: p.rating != null ? Number(p.rating) : 0,
      reviewCount: p.reviewCount != null ? Number(p.reviewCount) : 0,
      specs: p.specs ?? {},
      features: Array.isArray(p.features) ? p.features : [],
      colors: Array.isArray(p.colors) ? p.colors : [],
      stock: p.stock ?? 'in_stock',
      deliveryDays: p.deliveryDays != null ? Number(p.deliveryDays) : 5,
      technicalSections: p.technicalSections ?? null,
      whatsInTheBox: Array.isArray(p.whatsInTheBox) ? p.whatsInTheBox : null,
      warrantySummary: p.warrantySummary ?? null,
      complianceNotes: p.complianceNotes ?? null,
      featured: !!p.featured,
      hidden: false,
      sortOrder: i,
    }

    const existing = await prisma.product.findUnique({ where: { slug: p.slug } })
    if (existing) {
      await prisma.product.update({ where: { slug: p.slug }, data })
      updated++
    } else {
      await prisma.product.create({ data })
      created++
    }
  }

  const total = await prisma.product.count()
  console.log(`Done. Created: ${created}, Updated: ${updated}, Total in DB: ${total}`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
