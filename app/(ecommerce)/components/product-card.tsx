"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"

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
              <ShoppingCart className="h-5 w-5 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </div>

   {/* ✅ Conteúdo PROFISSIONAL - Preto & Bronze */}
<div className="p-6 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
  
  {/* 1️⃣ REVENDEDOR/ORGANIZAÇÃO */}
  <div className="mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
    <div className="w-8 h-8 bg-gradient-to-br from-bronze-500 to-amber-700 rounded-xl flex items-center justify-center shadow-sm">
      <span className="text-white text-sm font-bold">🏪</span>
    </div>
    <div>
      <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
        {product.company || "Loja Oficial"}
      </p>
      <p className="text-xs text-gray-500 font-medium">
        {product.category || "Categoria"}
      </p>
    </div>
  </div>

  {/* 2️⃣ TÍTULO PRINCIPAL */}
  <h3 className="font-black text-xl leading-tight text-gray-900 mb-4 line-clamp-2 hover:text-bronze-600 transition-all duration-200 pr-1 group-hover:pr-2">
    {product.title}
  </h3>

  {/* 3️⃣ RATING & REVIEW */}
  <div className="flex items-center justify-between mb-5 py-2">
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-bronze-50 p-2 rounded-lg border border-bronze-100">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 transition-all ${
              i < Math.floor(rating) || (i === Math.floor(rating) && rating % 1 >= 0.5)
                ? 'text-bronze-500 fill-bronze-500 drop-shadow-sm'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-gray-700 bg-white px-2 py-1 rounded-full shadow-sm">
        {rating.toFixed(1)}
      </span>
    </div>
    
    <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-3 py-1 rounded-full">
      {product.reviews ?? 0} vendas
    </span>
  </div>

  {/* 4️⃣ PREÇO DESTACADO */}
  <div className="flex items-end justify-between gap-4 pb-4 mb-4 border-b border-gray-100">
    <div className="flex flex-col">
      <span className="text-3xl font-black text-gray-900 leading-none mb-1">
        {formatPrice(product.price)}
      </span>
      <span className="text-xs font-bold text-bronze-600 uppercase tracking-wider bg-bronze-50 px-2 py-0.5 rounded-full w-fit">
        Kz
      </span>
    </div>
    
    {hasDiscount && (
      <div className="text-lg font-semibold text-gray-400 line-through bg-gray-50 px-3 py-1 rounded-lg">
        {formatPrice(product.originalPrice!)}
      </div>
    )}
  </div>

  {/* 5️⃣ DESCRIÇÃO BREVE */}
  {product.description && (
    <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
      <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
        {product.description}
      </p>
    </div>
  )}

  {/* 6️⃣ BADGE DE STATUS */}
  <div className="flex items-center gap-2 pt-2">
    <div className="px-3 py-1 bg-gradient-to-r from-bronze-500 to-amber-600 text-white text-xs font-bold rounded-full shadow-md">
      Em estoque
    </div>
    <span className="text-xs text-gray-500 font-medium">• Frete grátis</span>
  </div>
</div>
    </Link>
  )
}

