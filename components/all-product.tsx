"use client"

import { ProductCard } from "@/components/product-card"
import  { Products } from "@/lib/mock-data"

export function AllProducts() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-10 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Todos os Produtos</h2>
          <p className="text-muted-foreground text-lg">Explore nosso catálogo completo</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Products.map((product, index) => (
            <div
              key={product.id}
              style={{ animationDelay: `${(index % 12) * 50}ms` }}
              className="animate-fade-in-up"
            >
              <ProductCard product={product} variant="clean" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}