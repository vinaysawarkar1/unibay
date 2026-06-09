import { ProductForm } from '@/components/admin/product-form'

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
        <p className="text-muted-foreground mt-2">Add a new product to your catalog</p>
      </div>

      <ProductForm isNew />
    </div>
  )
}
