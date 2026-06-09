'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { X, Plus } from 'lucide-react'

interface ProductFormProps {
  product?: any
  isNew?: boolean
}

export function ProductForm({ product, isNew = false }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [specs, setSpecs] = useState<Record<string, string>>(product?.specs || {})
  const [features, setFeatures] = useState<string[]>(product?.features || [])
  const [colors, setColors] = useState<string[]>(product?.colors || [])
  const [specKey, setSpecKey] = useState('')
  const [specValue, setSpecValue] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [newColor, setNewColor] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: product || {
      name: '',
      category: 'laptop',
      description: '',
      basePrice: '',
      stock: 'in_stock',
      featured: false,
      hidden: false,
    },
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        basePrice: Number(data.basePrice),
        images,
        specs,
        features,
        colors,
      }

      const url = isNew ? '/api/admin/products' : `/api/admin/products/${product.id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to save product')

      toast.success(isNew ? 'Product created' : 'Product updated')
      router.push('/admin/products')
    } catch (err) {
      toast.error('Error saving product')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input id="name" {...register('name', { required: true })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                defaultValue={watch('category')}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="accessory">Accessory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="basePrice">Base Price (£) *</Label>
              <Input id="basePrice" type="number" step="0.01" {...register('basePrice', { required: true })} />
            </div>
          </div>

          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" {...register('tagline')} />
          </div>

          <div>
            <Label htmlFor="description">Short Description</Label>
            <Textarea id="description" {...register('description')} rows={3} />
          </div>

          <div>
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea id="longDescription" {...register('longDescription')} rows={5} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (imageUrl) {
                  setImages([...images, imageUrl])
                  setImageUrl('')
                }
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt={`Product ${idx}`} className="w-full h-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Spec key (e.g., CPU)"
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
            />
            <Input
              placeholder="Spec value (e.g., Intel i7)"
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (specKey && specValue) {
                  setSpecs({ ...specs, [specKey]: specValue })
                  setSpecKey('')
                  setSpecValue('')
                }
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-slate-100 p-2 rounded">
                <span className="text-sm">
                  <strong>{key}:</strong> {value}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const { [key]: _, ...rest } = specs
                    setSpecs(rest)
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features & Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Features</Label>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (newFeature) {
                    setFeatures([...features, newFeature])
                    setNewFeature('')
                  }
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {features.map((f, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-100 p-2 rounded">
                  <span className="text-sm">{f}</span>
                  <button
                    type="button"
                    onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                    className="text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Colors</Label>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (newColor) {
                    setColors([...colors, newColor])
                    setNewColor('')
                  }
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {colors.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-100 p-2 rounded">
                  <span className="text-sm">{c}</span>
                  <button
                    type="button"
                    onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                    className="text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status & Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Stock Status</Label>
              <Select
                defaultValue={watch('stock')}
                onValueChange={(value) => setValue('stock', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="pre_order">Pre-order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="deliveryDays">Delivery Days</Label>
              <Input id="deliveryDays" type="number" {...register('deliveryDays')} />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('featured')} />
              <span className="text-sm">Featured Product</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('hidden')} />
              <span className="text-sm">Hidden from Catalog</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isNew ? 'Create Product' : 'Update Product'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
