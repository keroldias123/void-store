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

const navigation = {
  categories: [
    {
      id: "women",
      name: "Women",
      featured: [
        {
          name: "New Arrivals",
          href: "#",
          imageSrc:
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg",
          imageAlt:
            "Models sitting back to back, wearing Basic Tee in black and bone.",
        },
        {
          name: "Basic Tees",
          href: "#",
          imageSrc:
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-02.jpg",
          imageAlt:
            "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "#" },
            { name: "Dresses", href: "#" },
            { name: "Pants", href: "#" },
            { name: "Denim", href: "#" },
            { name: "Sweaters", href: "#" },
            { name: "T-Shirts", href: "#" },
            { name: "Jackets", href: "#" },
            { name: "Activewear", href: "#" },
            { name: "Browse All", href: "#" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "#" },
            { name: "Wallets", href: "#" },
            { name: "Bags", href: "#" },
            { name: "Sunglasses", href: "#" },
            { name: "Hats", href: "#" },
            { name: "Belts", href: "#" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Full Nelson", href: "#" },
            { name: "My Way", href: "#" },
            { name: "Re-Arranged", href: "#" },
            { name: "Counterfeit", href: "#" },
            { name: "Significant Other", href: "#" },
          ],
        },
      ],
    },
    {
      id: "men",
      name: "Men",
      featured: [
        {
          name: "New Arrivals",
          href: "#",
          imageSrc:
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
          imageAlt:
            "Drawstring top with elastic loop closure and textured interior padding.",
        },
        {
          name: "Artwork Tees",
          href: "#",
          imageSrc:
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg",
          imageAlt:
            "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "#" },
            { name: "Pants", href: "#" },
            { name: "Sweaters", href: "#" },
            { name: "T-Shirts", href: "#" },
            { name: "Jackets", href: "#" },
            { name: "Activewear", href: "#" },
            { name: "Browse All", href: "#" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "#" },
            { name: "Wallets", href: "#" },
            { name: "Bags", href: "#" },
            { name: "Sunglasses", href: "#" },
            { name: "Hats", href: "#" },
            { name: "Belts", href: "#" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Re-Arranged", href: "#" },
            { name: "Counterfeit", href: "#" },
            { name: "Full Nelson", href: "#" },
            { name: "My Way", href: "#" },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: "Company", href: "#" },
    { name: "Stores", href: "#" },
  ],
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
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

          <Tabs defaultValue={navigation.categories[0].id} className="flex flex-1 flex-col">
            <div className="border-b px-2">
              <TabsList className="h-auto w-full justify-start gap-0 bg-transparent p-0">
                {navigation.categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex-1 rounded-none border-b-2 border-transparent px-4 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              {navigation.categories.map((category) => (
                <TabsContent
                  key={category.id}
                  value={category.id}
                  className="mt-0 space-y-6 px-4 pb-8 pt-6"
                >
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    {category.featured.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="group relative text-sm"
                        onClick={() => setMenuOpen(false)}
                      >
                        <img
                          alt={item.imageAlt}
                          src={item.imageSrc}
                          className="aspect-square w-full rounded-lg bg-muted object-cover transition-opacity group-hover:opacity-75"
                        />
                        <span className="mt-2 block font-medium text-foreground">
                          {item.name}
                        </span>
                        <span className="text-muted-foreground">Shop now</span>
                      </a>
                    ))}
                  </div>
                  {category.sections.map((section) => (
                    <div key={section.id}>
                      <p className="font-medium text-foreground">{section.name}</p>
                      <ul className="mt-3 flex flex-col gap-2">
                        {section.items.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className="block py-1.5 text-muted-foreground transition-colors hover:text-foreground"
                              onClick={() => setMenuOpen(false)}
                            >
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </TabsContent>
              ))}
            </ScrollArea>

            <Separator />

            <div className="space-y-2 px-4 py-4">
              {navigation.pages.map((page) => (
                <a
                  key={page.name}
                  href={page.href}
                  className="block py-2 font-medium text-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  {page.name}
                </a>
              ))}
            </div>

            <Separator />

            <div className="space-y-2 px-4 py-4">
              <a
                href="#"
                className="flex items-center gap-2 py-2 font-medium text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                <User className="size-4" />
                Sign in
              </a>
              <a
                href="#"
                className="flex items-center gap-2 py-2 font-medium text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                <UserPlus className="size-4" />
                Create account
              </a>
            </div>

            <div className="border-t px-4 py-4">
              <a
                href="#"
                className="flex items-center gap-2 text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                <Globe className="size-5 shrink-0" />
                <span className="font-medium">CAD</span>
                <span className="sr-only">, change currency</span>
              </a>
            </div>
          </Tabs>
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
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    alt=""
                    className="h-8 w-auto"
                  />
                </a>
              </div>

              {/* Desktop: categorias + páginas */}
              <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
                {navigation.categories.map((category) => (
                  <Popover key={category.id}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="gap-1 font-medium text-muted-foreground hover:text-foreground data-[state=open]:text-foreground"
                      >
                        {category.name}
                        <ChevronDown className="size-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="center"
                      sideOffset={0}
                      className="w-[min(36rem,100vw)] rounded-none border-x-0 border-t-0 p-0 shadow-lg"
                    >
                      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">
                          <div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-10 md:col-span-1 md:col-start-2">
                            {category.featured.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className="group relative text-sm"
                              >
                                <img
                                  alt={item.imageAlt}
                                  src={item.imageSrc}
                                  className="aspect-square w-full rounded-lg bg-muted object-cover transition-opacity group-hover:opacity-75"
                                />
                                <span className="mt-2 block font-medium text-foreground">
                                  {item.name}
                                </span>
                                <span className="text-muted-foreground">
                                  Shop now
                                </span>
                              </a>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-10 text-sm md:col-span-1 md:col-start-1 md:row-span-2">
                            {category.sections.map((section) => (
                              <div key={section.id}>
                                <p className="font-medium text-foreground">
                                  {section.name}
                                </p>
                                <ul className="mt-4 space-y-3">
                                  {section.items.map((item) => (
                                    <li key={item.name}>
                                      <a
                                        href={item.href}
                                        className="text-muted-foreground transition-colors hover:text-foreground"
                                      >
                                        {item.name}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
                {navigation.pages.map((page) => (
                  <a
                    key={page.name}
                    href={page.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {page.name}
                  </a>
                ))}
              </div>

              {/* Ações: conta, moeda, busca, carrinho */}
              <div className="ml-auto flex items-center gap-1">
                <div className="hidden items-center gap-4 lg:flex">
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <User className="size-4" />
                    Sign in
                  </a>
                  <Separator orientation="vertical" className="h-5" />
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <UserPlus className="size-4" />
                    Create account
                  </a>
                </div>

                <div className="hidden lg:ml-4 lg:flex">
                  <Button variant="ghost" size="sm" className="gap-2" asChild>
                    <a href="#">
                      <Globe className="size-4" />
                      <span>CAD</span>
                      <span className="sr-only">, change currency</span>
                    </a>
                  </Button>
                </div>

                <Button variant="ghost" size="icon" aria-label="Search" asChild>
                  <a href="#">
                    <Search className="size-5" />
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
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
