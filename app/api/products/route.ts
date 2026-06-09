import { NextResponse } from 'next/server'
import { getDbProducts } from '@/lib/products-db'
import { getRawProducts } from '@/lib/catalog'

// Public catalogue endpoint — DB-backed, falls back to the static JSON
// catalogue if the database is empty or unreachable.
export async function GET() {
  try {
    const products = await getDbProducts()
    if (products.length > 0) {
      return NextResponse.json({ products })
    }
    // DB empty (not seeded) — fall back to JSON
    return NextResponse.json({ products: getRawProducts() })
  } catch (err) {
    console.error('Products API error, falling back to JSON:', err)
    return NextResponse.json({ products: getRawProducts() })
  }
}
