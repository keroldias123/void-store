"use client"

import { useState } from "react"

import { PromoCarousel } from "@/components/carroussel-promo"

import { CategoriesSection } from "./components/category-section"
import { ProductsSection } from "./components/product-section"
import { Clock, Shield, Truck } from "lucide-react"
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
     <div className="container mx-auto ">
      <PromoCarousel/>
         {/* Trust Badges */}
         <div className=" bg-muted/30  mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 mt-8 sm:mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-10 sm:size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Truck className="size-5 sm:size-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-foreground">Entrega Rápida</p>
                <p className="text-xs text-muted-foreground hidden sm:block">Em todo Angola</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-10 sm:size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Shield className="size-5 sm:size-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-foreground">Pagamento Seguro</p>
                <p className="text-xs text-muted-foreground hidden sm:block">100% protegido</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-10 sm:size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock className="size-5 sm:size-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-foreground">Suporte 24/7</p>
                <p className="text-xs text-muted-foreground hidden sm:block">Sempre disponível</p>
              </div>

             
            </div>
            
           
            </div>
      <CategoriesSection/>
      <ProductsSection/>
     </div>

    </>
  )
}
