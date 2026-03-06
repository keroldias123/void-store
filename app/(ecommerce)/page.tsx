"use client"

import { useState } from "react"
import {
  Menu,
  Search,
  ShoppingBag,
  X,
  ChevronDown,
  Globe,
  User,
  UserPlus,
  Heart,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Autocomplete } from "@/components/auto-complete";
import { CategoryNav} from "@/components/category-nav.tsx";
import { PromoCarousel } from "@/components/carroussel-promo"
import { AllProducts } from "@/components/all-product"
import CategoriasGrid from "@/components/category"
import { authClient, signIn } from "@/lib/auth-client"

const countries = [
  { label: "Portugal", value: "pt" },
  { label: "Angola", value: "ao" },
  { label: "Brasil", value: "br" },
  { label: "Moçambique", value: "mz" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
    <div className="bg-background min-h-screen">
      {/* Mobile menu - Sheet (shadcn) */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="left"
          className="flex w-full max-w-xs flex-col p-0 sm:max-w-xs"
          showCloseButton={false}
        >
          <SheetHeader className="flex flex-row items-center justify-between space-y-0 border-b px-4 py-4">
            <SheetTitle className="text-left">Menu</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" aria-label="Fechar menu">
                <X className="size-5" />
              </Button>
            </SheetClose>
          </SheetHeader>

        </SheetContent>
      </Sheet>

      <header className="relative bg-background">
        <p className="flex h-10 items-center justify-center bg-primary px-4 text-sm font-medium text-primary-foreground sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>

        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-border">
            <div className="flex h-16 items-center gap-4">
              {/* Mobile menu trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menu"
              >
                <Menu className="size-6" />
              </Button>

              {/* Logo */}
              <div className="flex flex-1 lg:flex-initial">
                <a href="#" className="flex items-center">
                  <span className="sr-only">Your Company</span>
                  <img
                    src="./logo.svg"
                    alt=""
                    className="h-8 w-auto"
                  />
                </a>
              </div>

              {/* Desktop: categorias + páginas */}
              <div className="flex items-center">
  <div className="w-80">
    <Autocomplete
      options={countries}
      onChange={(v) => console.log(v)}
      placeholder="Busca  de productos"
    />
  </div>
</div>

              {/* Ações: conta, moeda, busca, carrinho */}
              <div className="ml-auto flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative" asChild>
                  <a href="#">
                    <Heart className="size-5" />
                   
                    <span className="sr-only">items in cart, view bag</span>
                  </a>
                </Button>
                <Button variant="ghost" size="icon" className="relative" asChild>
                  <a href="#">
                    <ShoppingBag className="size-5" />
                    <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      0
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </a>
                </Button>

                <div className="hidden items-center gap-4 lg:flex">
                <Button variant="ghost"  className="relative" onClick = {() => signIn.social({provider: "google", callbackURL: "./api/auth/[..all]"})} asChild>
                  <a
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <User className="size-4" />
                    Faça o Login
                  </a>
                  </Button>
                </div>


              </div>
            </div>
            <CategoryNav />
          </div>
          
        </nav>
      </header>
      <PromoCarousel/>
    </div>
   
    <CategoriasGrid />

    </>
  )
}
