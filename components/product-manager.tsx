"use client"

import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { useProductStore } from "@/lib/product-store"

interface ProductForm {
  organizationId: string
  title: string
  slug: string
  description?: string
  price: number
  stock: number
  imageUrl?: string
  category?: string
}

export function ProductManager({ organizationId }: { organizationId: string }) {
  const [form, setForm] = useState<ProductForm>({
    organizationId,
    title: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: "",
    category: "",
  })

  const products = useProductStore((state) => state.products)
  const trpcUtils = trpc.useContext()
  const trpcList = trpc.products.list.useQuery(
    { organizationId },
    {
      onSuccess: (prod) => {
        useProductStore.getState().setProducts(
          prod.map((p) => ({
            ...p,
            price: p.price / 100,
            originalPrice: p.originalPrice != null ? p.originalPrice / 100 : undefined,
          }))
        )
      },
    }
  )

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      trpcUtils.products.list.invalidate()
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync({
        organizationId: form.organizationId,
        title: form.title,
        slug: form.slug,
        description: form.description,
        price: form.price,
        stock: form.stock,
        imageUrl: form.imageUrl || undefined,
        category: form.category || undefined,
      })
      setForm({
        organizationId,
        title: "",
        slug: "",
        description: "",
        price: 0,
        stock: 0,
        imageUrl: "",
        category: "",
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Product Manager - org {organizationId}</h2>
      <form onSubmit={handleSubmit}>
        <input value={form.title} placeholder="Title" onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
        <input value={form.slug} placeholder="Slug" onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} />
        <input
          value={form.price}
          type="number"
          placeholder="Price"
          onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))}
        />
        <input
          value={form.stock}
          type="number"
          placeholder="Stock"
          onChange={(e) => setForm((s) => ({ ...s, stock: Number(e.target.value) }))}
        />
        <button type="submit">Create</button>
      </form>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.title} - R$ {product.price.toFixed(2)} - stock: {product.stock}
          </li>
        ))}
      </ul>

      {createMutation.isError && <p>Error: {(createMutation.error as Error).message}</p>}
      {trpcList.isLoading && <p>Loading...</p>}
    </div>
  )
}
