"use client"

import { create } from "zustand"
import { trpc } from "@/lib/trpc"

export interface ProductStoreItem {
  id: string
  organizationId: string
  title: string
  slug: string
  description?: string
  price: number
  originalPrice?: number
  currency: string
  imageUrl?: string
  category?: string
  stock: number
  status: "active" | "inactive"
}

interface ProductStore {
  products: ProductStoreItem[]
  setProducts: (items: ProductStoreItem[]) => void
  addProduct: (product: ProductStoreItem) => void
  updateProduct: (id: string, data: Partial<ProductStoreItem>) => void
  removeProduct: (id: string) => void
  clear: () => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (items) => set({ products: items }),
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, data) =>
    set((state) => ({
      products: state.products.map((item) => (item.id === id ? { ...item, ...data } : item)),
    })),
  removeProduct: (id) => set((state) => ({ products: state.products.filter((item) => item.id !== id) })),
  clear: () => set({ products: [] }),
}))

export function useLoadProducts(organizationId?: string) {
  const trpcUtils = trpc.products.list.useQuery(
    { organizationId },
    {
      enabled: Boolean(organizationId),
      onSuccess: (data) => {
        useProductStore.getState().setProducts(
          data.map((p) => ({
            ...p,
            price: p.price / 100,
            originalPrice: p.originalPrice != null ? p.originalPrice / 100 : undefined,
          }))
        )
      },
    }
  )

  return trpcUtils
}
