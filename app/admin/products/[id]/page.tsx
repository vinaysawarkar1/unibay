'use client'

import { useState, useEffect } from 'react'
import { ProductForm } from '@/components/admin/product-form'
import { toast } from 'sonner'

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${params.id}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const { product } = await res.json()
        setProduct(product)
      } catch (err) {
        toast.error('Failed to load product')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground mt-2">{product.name}</p>
      </div>

      <ProductForm product={product} />
    </div>
  )
}
