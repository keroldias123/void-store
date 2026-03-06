"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  Menu,
  X,
  Heart,
  ShoppingBag,
  User,
  Search,
  Home,
  Flame,
  Tag,
  Eye,
  Sparkles,
  Grid3X3,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import { CategoryNav } from "@/components/category-nav"

const mobileMenuCategories = [
  { name: "Início", icon: Home, href: "#" },
  { name: "Categorias", icon: Grid3X3, href: "#categorias" },
  { name: "Populares", icon: Flame, href: "#populares" },
  { name: "Descontos", icon: Tag, badge: "Promo", href: "#descontos" },
  { name: "Vistos Recentemente", icon: Eye, href: "#vistos" },
  { name: "Novidades", icon: Sparkles, href: "#novidades" },
]

const productCategories = [
  "Eletrónicos",
  "Roupas",
  "Acessórios",
  "Calçado",
  "Casa & Decoração",
  "Cozinha",
  "Desporto & Fitness",
  "Beleza & Saúde",
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="bg-background">
      {/* Mobile Menu - Sheet */}
      <Sheet >
        <SheetContent
          side="left"
          className="flex w-full max-w-xs flex-col p-0 sm:max-w-sm"
        >
          <SheetHeader className="flex flex-row items-center justify-between space-y-0 border-b px-4 py-4">
            <SheetTitle className="text-left flex items-center gap-2">
              <div className="flex size-[24px] items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                VOID
              </div>
              <span>Store</span>
            </SheetTitle>
            
          </SheetHeader>

          {/* Mobile Search */}
          <div className="px-4 py-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Pesquisar produtos..."
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto">
            <div className="px-2 py-3">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Menu Principal
              </p>
              {mobileMenuCategories.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-5 text-muted-foreground" />
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  </a>
                )
              })}
            </div>

            <div className="border-t px-2 py-3">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Categorias de Produtos
              </p>
              {productCategories.map((category) => (
                <a
                  key={category}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                >
                  <span>{category}</span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="border-t p-4 space-y-3">
            <Button className="w-full" size="sm">
              <User className="size-4 mr-2" />
              Entrar / Criar Conta
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="size-3" />
              <span>+244 923 456 789</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="size-3" />
              <span>suporte@store.ao</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              <span>Luanda, Angola</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-background lg:hidden">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Pesquisar produtos..."
                className="pl-10"
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(false)}
            >
              Cancelar
            </Button>
          </div>
          <div className="p-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Pesquisas populares
            </p>
            <div className="flex flex-wrap gap-2">
              {["iPhone", "Samsung", "Nike", "Vestidos", "Computadores"].map(
                (term) => (
                  <button
                    key={term}
                    className="px-3 py-1.5 rounded-full bg-muted text-sm hover:bg-muted/80 transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-background">
        {/* Promo Banner */}
        <div className="flex h-9 items-center justify-center bg-primary px-4 text-xs sm:text-sm font-medium text-primary-foreground">
          <span className="hidden sm:inline">
            Portes grátis em encomendas acima de 50.000 Kz
          </span>
          <span className="sm:hidden">Portes grátis acima de 50.000 Kz</span>
        </div>

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-border">
            <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4">
              {/* Mobile menu trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden shrink-0"
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menu"
              >
                <Menu className="size-5 sm:size-6" />
              </Button>

              {/* Logo */}
              <div className="flex shrink-0">
                <a href="#" className="flex items-center gap-2">
                  <div className="flex size-[24px] sm:size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                    VOID
                  </div>
                  <span className="hidden sm:inline-block font-bold text-lg">
                    Store
                  </span>
                </a>
              </div>

              {/* Desktop Search */}
              <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:px-8">
                <div className="relative w-full max-w-lg">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Pesquisar produtos..."
                    className="pl-10 pr-4 bg-muted/50 border-muted focus:bg-background"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="ml-auto flex items-center gap-1 sm:gap-2">
                {/* Mobile Search Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden shrink-0"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="size-5" />
                  <span className="sr-only">Pesquisar</span>
                </Button>

                {/* Wishlist */}
                <Button variant="ghost" size="icon" className="shrink-0" asChild>
                  <a href="#">
                    <Heart className="size-5" />
                    <span className="sr-only">Lista de desejos</span>
                  </a>
                </Button>

                {/* Cart */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative shrink-0"
                  asChild
                >
                  <a href="#">
                    <ShoppingBag className="size-5" />
                    <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      0
                    </span>
                    <span className="sr-only">Carrinho</span>
                  </a>
                </Button>

                {/* User - Desktop */}
                <div className="hidden lg:flex items-center gap-2 ml-2 pl-2 border-l border-border">
                  <Button variant="ghost" size="sm" className="gap-2" asChild>
                    <a href="#">
                      <User className="size-4" />
                      <span>Entrar</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Category Navigation */}
            <CategoryNav />
          </div>
        </nav>
      </header>
    </div>
  )
}