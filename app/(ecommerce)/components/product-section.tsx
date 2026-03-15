"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/app/(ecommerce)/components/product-card"

interface Product {
  id: number
  title: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  rating: number
  reviews: number
  company: string
  category: string
}

const products: Product[] = [
  // Eletronicos
  {
    id: 1,
    title: "iPhone 15 Pro Max 256GB",
    price: 450000,
    originalPrice: 520000,
    discount: 13,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=500&fit=crop",
    rating: 4.9,
    reviews: 234,
    company: "TechStore Angola",
    category: "Telemoveis"
  },
  {
    id: 2,
    title: "MacBook Pro 14\" M3 Pro",
    price: 890000,
    originalPrice: 980000,
    discount: 9,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=500&fit=crop",
    rating: 4.8,
    reviews: 156,
    company: "Apple Angola",
    category: "Computadores"
  },
  {
    id: 3,
    title: "Samsung Galaxy S24 Ultra",
    price: 380000,
    originalPrice: 450000,
    discount: 16,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=500&fit=crop",
    rating: 4.7,
    reviews: 189,
    company: "Samsung Angola",
    category: "Telemoveis"
  },
  {
    id: 4,
    title: "Sony WH-1000XM5 Headphones",
    price: 125000,
    originalPrice: 150000,
    discount: 17,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=500&fit=crop",
    rating: 4.9,
    reviews: 312,
    company: "SoundMax Lda",
    category: "Auscultadores"
  },
  // Roupas
  {
    id: 5,
    title: "Vestido Elegante Floral",
    price: 28000,
    originalPrice: 35000,
    discount: 20,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    rating: 4.6,
    reviews: 98,
    company: "Moda Luanda",
    category: "Vestidos"
  },
  {
    id: 6,
    title: "Calça Jeans Premium Masculina",
    price: 18500,
    originalPrice: 22000,
    discount: 16,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    rating: 4.5,
    reviews: 67,
    company: "Urban Style AO",
    category: "Calcas"
  },
  {
    id: 7,
    title: "Blazer Executivo Slim Fit",
    price: 45000,
    originalPrice: 55000,
    discount: 18,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    rating: 4.8,
    reviews: 45,
    company: "Elegance Store",
    category: "Casacos"
  },
  {
    id: 8,
    title: "T-Shirt Oversize Street",
    price: 8500,
    originalPrice: 12000,
    discount: 29,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    rating: 4.4,
    reviews: 156,
    company: "Street Wear Angola",
    category: "Camisetas"
  },
  // Casa & Decoracao
  {
    id: 9,
    title: "Sofa Modular 3 Lugares",
    price: 320000,
    originalPrice: 380000,
    discount: 16,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=500&fit=crop",
    rating: 4.7,
    reviews: 34,
    company: "Casa & Conforto",
    category: "Moveis"
  },
  {
    id: 10,
    title: "Candeeiro de Mesa LED",
    price: 15000,
    originalPrice: 18000,
    discount: 17,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=500&fit=crop",
    rating: 4.5,
    reviews: 89,
    company: "LuzDecor Lda",
    category: "Iluminacao"
  },
  {
    id: 11,
    title: "Tapete Persa 200x300cm",
    price: 85000,
    originalPrice: 100000,
    discount: 15,
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=500&fit=crop",
    rating: 4.6,
    reviews: 23,
    company: "Decorar Angola",
    category: "Tapetes"
  },
  {
    id: 12,
    title: "Quadro Decorativo Abstrato",
    price: 25000,
    originalPrice: 30000,
    discount: 17,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=500&fit=crop",
    rating: 4.3,
    reviews: 56,
    company: "Arte & Design AO",
    category: "Decoracao"
  },
  // Desporto
  {
    id: 13,
    title: "Nike Air Max 270 React",
    price: 65000,
    originalPrice: 78000,
    discount: 17,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
    rating: 4.8,
    reviews: 234,
    company: "Sport Zone Angola",
    category: "Calcado"
  },
  {
    id: 14,
    title: "Bicicleta Mountain Bike Pro",
    price: 280000,
    originalPrice: 320000,
    discount: 13,
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=500&fit=crop",
    rating: 4.7,
    reviews: 45,
    company: "Bike World Lda",
    category: "Bicicletas"
  },
  {
    id: 15,
    title: "Kit Halteres 20kg Ajustavel",
    price: 45000,
    originalPrice: 55000,
    discount: 18,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop",
    rating: 4.6,
    reviews: 78,
    company: "FitPro Angola",
    category: "Fitness"
  },
  {
    id: 16,
    title: "Relogio Smartwatch Pro",
    price: 95000,
    originalPrice: 120000,
    discount: 21,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=500&fit=crop",
    rating: 4.5,
    reviews: 167,
    company: "TechFit Store",
    category: "Acessorios"
  },
]

function formatPrice(price: number): string {
  return price.toLocaleString("pt-AO")
}

export function ProductsSection() {
  const [currentPage, setCurrentPage] = useState(0)
  const productsPerPage = 8
  const totalPages = Math.ceil(products.length / productsPerPage)

  const shuffledProducts = [...products].sort(() => Math.random() - 0.5)
  const currentProducts = shuffledProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  )

  return (
    <section className="py-12 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Produtos em Destaque
            </h2>
            <p className="mt-1 text-muted-foreground">
              Descubra as melhores ofertas em Angola
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="size-10 rounded-full"
            >
              ‹
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="size-10 rounded-full"
            >
              ›
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" className="px-8">
            Ver Todos os Produtos
          </Button>
        </div>
      </div>
    </section>
  )
}
