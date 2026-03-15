"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart } from "lucide-react" // ✅ Ícones do Lucide React

type ProductCardProps = {
  product: {
    id: string | number
    slug?: string // ✅ Adicionado para link
    title: string
    image: string
    category?: string
    company?: string
    price: number
    originalPrice?: number
    discount?: number
    rating?: number
    reviews?: number
    description?: string
  }
}

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  })

export default function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const hasDiscount = Boolean(product.originalPrice && product.price < product.originalPrice)

  const discount = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  const rating = product.rating || 4.5 // ✅ Rating padrão

  return (
    <Link 
      href={`/productos/${product.slug || product.id}`} // ✅ Link clicável
      className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary max-h-85 block"
    >
      <div className="relative aspect-3/4 overflow-hidden bg-gray-50">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {hasDiscount && (
          <Badge className="absolute left-3 top-3 bg-red-500 hover:bg-red-500 text-white font-bold px-2 py-1 z-10 shadow-lg">
            -{discount}%
          </Badge>
        )}

        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-lg transition-all hover:bg-white hover:scale-110 border border-gray-200"
          aria-label="Favoritar produto"
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} 
            strokeWidth={2}
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-10">
          <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 pt-12">
            <Button className="w-full gap-2 bg-white text-black hover:bg-white/90 shadow-lg font-semibold text-sm h-10">
              🛒 Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">
          {product.company || product.category || "Loja"}
        </p>
        
        <h3 className="font-bold text-base leading-tight text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-all duration-200 hover:pr-1">
          {product.title}
        </h3>

        {/* ✅ Estrelas do Lucide React */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 transition-colors ${
                  i < Math.floor(rating) || (i === Math.floor(rating) && rating % 1 >= 0.5)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
                strokeWidth={2}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium ml-1">({product.reviews ?? 0})</span>
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-xl font-black text-gray-900">
            {formatPrice(product.price)} <span className="text-xs font-normal">Kz</span>
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 font-normal line-through">
              {formatPrice(product.originalPrice!)} Kz
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
