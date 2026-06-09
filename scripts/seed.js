#!/usr/bin/env node
/**
 * Seeds the database from the static JSON catalogue + marketing content.
 *
 *  - Products: from data/products.json merged with data/product-enrichment.json
 *  - Blog posts: from the marketing content
 *  - Promotes ADMIN_EMAILS (or a default) to role 'admin'
 *
 * Idempotent: upserts by slug, so it is safe to run repeatedly.
 *
 *   node scripts/seed.js
 */
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const products = require(path.resolve(__dirname, '..', 'data', 'products.json'))
const enrichment = require(path.resolve(__dirname, '..', 'data', 'product-enrichment.json'))

function flatProducts() {
  const all = [
    ...(products.laptops || []),
    ...(products.desktops || []),
    ...(products.accessories || []),
  ]
  return all.filter((p) => p.basePrice > 0 && p.name && p.name.length > 2)
}

async function seedProducts() {
  const list = flatProducts()
  let count = 0
  for (let i = 0; i < list.length; i++) {
    const p = list[i]
    const extra = enrichment[p.id] || {}
    const data = {
      slug: p.slug,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory || null,
      tagline: p.tagline || null,
      description: p.description || null,
      longDescription: extra.longDescription || p.longDescription || null,
      basePrice: p.basePrice,
      images: Array.isArray(p.images) ? p.images : [],
      badge: p.badge || null,
      rating: p.rating || 0,
      reviewCount: p.reviewCount || 0,
      specs: p.specs || {},
      features: p.features || [],
      colors: p.colors || [],
      stock: p.stock || 'in_stock',
      deliveryDays: p.deliveryDays || 5,
      technicalSections: extra.technicalSections || p.technicalSections || null,
      whatsInTheBox: extra.whatsInTheBox || p.whatsInTheBox || null,
      warrantySummary: extra.warrantySummary || p.warrantySummary || null,
      complianceNotes: extra.complianceNotes || p.complianceNotes || null,
      sortOrder: i,
    }
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    })
    count++
  }
  console.log(`Seeded ${count} products`)
}

async function seedBlogs() {
  // Mirror the two posts that existed in marketing-content, with cover images
  const posts = [
    {
      slug: 'ddr5-timing-explained',
      title: 'DDR5 timings explained for gamers',
      excerpt: 'What CAS latency really means when frame pacing matters.',
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop&auto=format',
      author: 'UNIBAY Team',
      date: new Date('2026-04-02'),
      body: [
        'Memory latency interacts with CPU cache behaviour more than raw MHz alone.',
        'For gaming workloads we prioritise stable XMP profiles validated on UNIBAY motherboards.',
        'See the configurator memory step for kits tuned to each platform.',
      ],
    },
    {
      slug: 'ai-assist-configuration',
      title: 'How UNIBAY uses AI-assist recommendations',
      excerpt: 'Balancing automation with human experts in the sales loop.',
      coverImage: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&q=85&fit=crop&auto=format',
      author: 'UNIBAY Team',
      date: new Date('2026-04-18'),
      body: [
        'Our quick-build flow samples popular component combinations tuned for UK inventory.',
        'Human specialists review every order before parts are picked to catch edge cases.',
        'Feedback from customers improves the ranking signals over time.',
      ],
    },
  ]
  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    })
  }
  console.log(`Seeded ${posts.length} blog posts`)
}

async function seedAdmin() {
  const adminEmails = (process.env.ADMIN_EMAILS || 'vinaysawarkar19@gmail.com')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  for (const email of adminEmails) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      await prisma.user.update({ where: { id: user.id }, data: { role: 'admin' } })
      console.log(`Promoted ${email} to admin`)
    } else {
      console.log(`Admin email ${email} not found yet — will be promoted on next seed after they register`)
    }
  }
}

async function main() {
  await seedProducts()
  await seedBlogs()
  await seedAdmin()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
