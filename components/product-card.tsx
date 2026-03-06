"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/mock-data"
import { useCartStore } from "@/lib/cart-store"

interface ProductCardProps {
  product: Product
  variant?: "default" | "clean"
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const hasDiscount = product.discount && product.originalPrice

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
  }

  if (variant === "clean") {
    return (
      <div className="group overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-scale-in">
        <Link href={`/produto/${product.id}`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-t-xl">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {hasDiscount && (
              <Badge className="absolute right-3 top-3 bg-destructive/90 text-destructive-foreground font-bold shadow-lg backdrop-blur-sm border-0">
                -{product.discount}%
              </Badge>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </div>
        </Link>
        <div className="bg-card p-4 rounded-b-xl border border-t-0 border-border/30">
          <Link href={`/produto/${product.id}`} className="block">
            <h3 className="font-semibold text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{product.organizationName}</p>
          </Link>

          <div className="flex items-center gap-1 mb-4">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div>
              {hasDiscount && (
                <div className="text-xs text-muted-foreground line-through mb-1">
                  R$ {product.originalPrice?.toFixed(2)}
                </div>
              )}
              <div className="text-xl font-bold text-primary">R$ {product.price.toFixed(2)}</div>
            </div>
            <Button
              size="sm"
              className="gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/20 animate-scale-in">
      <Link href={`/produto/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {hasDiscount && (
            <Badge className="absolute right-3 top-3 bg-accent text-accent-foreground font-bold shadow-lg backdrop-blur-sm">
              -{product.discount}%
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        </div>
      </Link>
      <CardContent className="p-5">
        <Link href={`/produto/${product.id}`} className="block">
          <h3 className="font-semibold text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{product.organizationName}</p>
        </Link>

        <div className="flex items-center gap-1 mb-4">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            {hasDiscount && (
              <div className="text-xs text-muted-foreground line-through mb-1">
                R$ {product.originalPrice?.toFixed(2)}
              </div>
            )}
            <div className="text-xl font-bold text-primary">R$ {product.price.toFixed(2)}</div>
          </div>
          <Button
            size="sm"
            className="gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}