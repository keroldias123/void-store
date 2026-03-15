"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart } from "lucide-react"

type ProductCardProps = {
  product: {
    id: string | number
    slug?: string
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
  const rating = product.rating || 4.5

  return (
    <Link 
      href={`/productos/${product.slug || product.id}`}
      className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-500 block h-full" // ✅ Removido max-h-85, adicionado h-full
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50"> {/* ✅ Aspect ratio fixo */}
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {hasDiscount && (
          <Badge className="absolute left-3 top-3 z-20 bg-red-500 text-white font-bold px-3 py-1 shadow-lg">
            -{discount}%
          </Badge>
        )}

        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
          className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 backdrop-blur shadow-xl transition-all hover:bg-white hover:scale-110 border border-gray-200"
        >
          <Heart 
            className={`h-6 w-6 transition-all ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} 
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-10">
          <div className="bg-gradient-to-t from-black/95 to-transparent p-4 pt-10">
            <Button className="w-full h-11 bg-white text-black hover:bg-white/90 shadow-lg font-semibold text-sm">
              🛒 Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ Conteúdo sempre visível */}
      <div className="p-5"> 
        <div className="mb-3">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            {product.company || product.category || "Loja"}
          </p>
        </div>
        
        <h3 className="font-bold text-lg leading-tight text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors pr-1">
          {product.title}
        </h3>

        {/* ✅ Rating sempre visível */}
        <div className="flex items-center gap-2 mb-4 pb-1 border-b border-gray-100">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating) || (i === Math.floor(rating) && rating % 1 >= 0.5)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews ?? 0})</span>
        </div>

        {/* ✅ Preço sempre visível e destacado */}
        <div className="flex items-baseline gap-3 pt-2">
          <div>
            <span className="text-2xl font-black text-gray-900 block">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-gray-500 font-medium">Kz</span>
          </div>
          
          {hasDiscount && (
            <div className="text-sm text-gray-400 font-normal line-through">
              {formatPrice(product.originalPrice!)} Kz
            </div>
          )}
        </div>

        {/* ✅ Descrição se existir */}
        {product.description && (
          <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>
    </Link>
  )
}

