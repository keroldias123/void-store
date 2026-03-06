"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  ChevronLeft, 
  ChevronRight,
  Laptop, 
  Smartphone, 
  Monitor, 
  Headphones,
  Shirt,
  ShoppingBag,
  Watch,
  Footprints,
  Home,
  Sofa,
  Lamp,
  Bath,
  Utensils,
  ChefHat,
  Coffee,
  Microwave,
  Dumbbell,
  Bike,
  Tent,
  Trophy,
  Sparkles,
  Scissors,
  Heart,
  Baby,
  Gamepad2,
  BookOpen,
  Music,
  Camera,
  Car,
  Wrench,
  Dog,
  Cat,
  Fish
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SubCategory {
  name: string
  icon: React.ReactNode
  href: string
  image: string
}

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  image: string
  subcategories: SubCategory[]
}

const categories: Category[] = [
  {
    id: "eletronicos",
    name: "Eletrónicos",
    icon: <Laptop className="size-5" />,
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=500&fit=crop",
    subcategories: [
      { name: "Computadores", icon: <Monitor className="size-5" />, href: "/categoria/computadores", image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=300&h=300&fit=crop" },
      { name: "Telemóveis", icon: <Smartphone className="size-5" />, href: "/categoria/telemoveis", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop" },
      { name: "Portáteis", icon: <Laptop className="size-5" />, href: "/categoria/portateis", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop" },
      { name: "Auscultadores", icon: <Headphones className="size-5" />, href: "/categoria/auscultadores", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop" },
      { name: "Tablets", icon: <Monitor className="size-5" />, href: "/categoria/tablets", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop" },
      { name: "Câmaras", icon: <Camera className="size-5" />, href: "/categoria/camaras", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop" },
      { name: "Smartwatches", icon: <Watch className="size-5" />, href: "/categoria/smartwatches", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop" },
      { name: "Consolas", icon: <Gamepad2 className="size-5" />, href: "/categoria/consolas", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop" },
    ]
  },
  {
    id: "roupas",
    name: "Roupas",
    icon: <Shirt className="size-5" />,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop",
    subcategories: [
      { name: "Calças", icon: <ShoppingBag className="size-5" />, href: "/categoria/calcas", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop" },
      { name: "Vestidos", icon: <Shirt className="size-5" />, href: "/categoria/vestidos", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop" },
      { name: "Camisas", icon: <Shirt className="size-5" />, href: "/categoria/camisas", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop" },
      { name: "Casacos", icon: <Shirt className="size-5" />, href: "/categoria/casacos", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop" },
      { name: "Saias", icon: <ShoppingBag className="size-5" />, href: "/categoria/saias", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj5?w=300&h=300&fit=crop" },
      { name: "T-Shirts", icon: <Shirt className="size-5" />, href: "/categoria/tshirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop" },
      { name: "Jeans", icon: <ShoppingBag className="size-5" />, href: "/categoria/jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop" },
      { name: "Blazers", icon: <Shirt className="size-5" />, href: "/categoria/blazers", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=300&fit=crop" },
    ]
  },
  {
    id: "acessorios",
    name: "Acessórios",
    icon: <Watch className="size-5" />,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=500&fit=crop",
    subcategories: [
      { name: "Relógios", icon: <Watch className="size-5" />, href: "/categoria/relogios", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop" },
      { name: "Óculos", icon: <Sparkles className="size-5" />, href: "/categoria/oculos", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop" },
      { name: "Malas", icon: <ShoppingBag className="size-5" />, href: "/categoria/malas", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop" },
      { name: "Bijuteria", icon: <Heart className="size-5" />, href: "/categoria/bijuteria", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop" },
      { name: "Cintos", icon: <Scissors className="size-5" />, href: "/categoria/cintos", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop" },
      { name: "Carteiras", icon: <ShoppingBag className="size-5" />, href: "/categoria/carteiras", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop" },
    ]
  },
  {
    id: "calcado",
    name: "Calçado",
    icon: <Footprints className="size-5" />,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
    subcategories: [
      { name: "Ténis", icon: <Footprints className="size-5" />, href: "/categoria/tenis", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300&h=300&fit=crop" },
      { name: "Sapatos", icon: <Footprints className="size-5" />, href: "/categoria/sapatos", image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=300&h=300&fit=crop" },
      { name: "Sandálias", icon: <Footprints className="size-5" />, href: "/categoria/sandalias", image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&h=300&fit=crop" },
      { name: "Botas", icon: <Footprints className="size-5" />, href: "/categoria/botas", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=300&h=300&fit=crop" },
      { name: "Chinelos", icon: <Footprints className="size-5" />, href: "/categoria/chinelos", image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&h=300&fit=crop" },
      { name: "Sapatilhas", icon: <Footprints className="size-5" />, href: "/categoria/sapatilhas", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop" },
    ]
  },
  {
    id: "casa",
    name: "Casa & Decoração",
    icon: <Home className="size-5" />,
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&h=500&fit=crop",
    subcategories: [
      { name: "Móveis", icon: <Sofa className="size-5" />, href: "/categoria/moveis", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop" },
      { name: "Iluminação", icon: <Lamp className="size-5" />, href: "/categoria/iluminacao", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop" },
      { name: "Casa de Banho", icon: <Bath className="size-5" />, href: "/categoria/casa-banho", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&h=300&fit=crop" },
      { name: "Têxteis", icon: <Shirt className="size-5" />, href: "/categoria/texteis", image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=300&h=300&fit=crop" },
      { name: "Decoração", icon: <Sparkles className="size-5" />, href: "/categoria/decoracao", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop" },
      { name: "Jardim", icon: <Home className="size-5" />, href: "/categoria/jardim", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop" },
    ]
  },
  {
    id: "cozinha",
    name: "Cozinha",
    icon: <Utensils className="size-5" />,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=500&fit=crop",
    subcategories: [
      { name: "Eletrodomésticos", icon: <Microwave className="size-5" />, href: "/categoria/eletrodomesticos", image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=300&h=300&fit=crop" },
      { name: "Utensílios", icon: <ChefHat className="size-5" />, href: "/categoria/utensilios", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop" },
      { name: "Máquinas de Café", icon: <Coffee className="size-5" />, href: "/categoria/maquinas-cafe", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop" },
      { name: "Panelas", icon: <Utensils className="size-5" />, href: "/categoria/panelas", image: "https://images.unsplash.com/photo-1584990347449-a2d4c2c044c4?w=300&h=300&fit=crop" },
      { name: "Loiça", icon: <Coffee className="size-5" />, href: "/categoria/loica", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop" },
      { name: "Facas", icon: <Utensils className="size-5" />, href: "/categoria/facas", image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=300&h=300&fit=crop" },
    ]
  },
  {
    id: "desporto",
    name: "Desporto & Fitness",
    icon: <Dumbbell className="size-5" />,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=500&fit=crop",
    subcategories: [
      { name: "Equipamento Fitness", icon: <Dumbbell className="size-5" />, href: "/categoria/fitness", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop" },
      { name: "Bicicletas", icon: <Bike className="size-5" />, href: "/categoria/bicicletas", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&h=300&fit=crop" },
      { name: "Campismo", icon: <Tent className="size-5" />, href: "/categoria/campismo", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=300&fit=crop" },
      { name: "Roupa Desportiva", icon: <Trophy className="size-5" />, href: "/categoria/roupa-desportiva", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop" },
      { name: "Yoga", icon: <Sparkles className="size-5" />, href: "/categoria/yoga", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop" },
      { name: "Natação", icon: <Dumbbell className="size-5" />, href: "/categoria/natacao", image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&h=300&fit=crop" },
    ]
  },
  {
    id: "beleza",
    name: "Beleza & Saúde",
    icon: <Sparkles className="size-5" />,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop",
    subcategories: [
      { name: "Maquilhagem", icon: <Sparkles className="size-5" />, href: "/categoria/maquilhagem", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop" },
      { name: "Cuidados Pele", icon: <Heart className="size-5" />, href: "/categoria/cuidados-pele", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop" },
      { name: "Cabelo", icon: <Scissors className="size-5" />, href: "/categoria/cabelo", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop" },
      { name: "Perfumes", icon: <Sparkles className="size-5" />, href: "/categoria/perfumes", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop" },
      { name: "Unhas", icon: <Sparkles className="size-5" />, href: "/categoria/unhas", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=300&fit=crop" },
      { name: "Corpo", icon: <Heart className="size-5" />, href: "/categoria/corpo", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop" },
    ]
  },
  {
    id: "bebe",
    name: "Bebé & Criança",
    icon: <Baby className="size-5" />,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop",
    subcategories: [
      { name: "Roupa Bebé", icon: <Shirt className="size-5" />, href: "/categoria/roupa-bebe", image: "https://images.unsplash.com/photo-1522771930-78b353025590?w=300&h=300&fit=crop" },
      { name: "Brinquedos", icon: <Gamepad2 className="size-5" />, href: "/categoria/brinquedos", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=300&fit=crop" },
      { name: "Carrinho", icon: <Baby className="size-5" />, href: "/categoria/carrinhos", image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=300&h=300&fit=crop" },
      { name: "Alimentação", icon: <Utensils className="size-5" />, href: "/categoria/alimentacao-bebe", image: "https://images.unsplash.com/photo-1584839404042-8bc21d240de9?w=300&h=300&fit=crop" },
      { name: "Higiene", icon: <Bath className="size-5" />, href: "/categoria/higiene-bebe", image: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=300&h=300&fit=crop" },
      { name: "Mobiliário", icon: <Sofa className="size-5" />, href: "/categoria/mobiliario-bebe", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=300&h=300&fit=crop" },
    ]
  },
  {
    id: "entretenimento",
    name: "Entretenimento",
    icon: <Gamepad2 className="size-5" />,
    image: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400&h=500&fit=crop",
    subcategories: [
      { name: "Videojogos", icon: <Gamepad2 className="size-5" />, href: "/categoria/videojogos", image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=300&h=300&fit=crop" },
      { name: "Livros", icon: <BookOpen className="size-5" />, href: "/categoria/livros", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop" },
      { name: "Música", icon: <Music className="size-5" />, href: "/categoria/musica", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop" },
      { name: "Filmes", icon: <Camera className="size-5" />, href: "/categoria/filmes", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=300&fit=crop" },
      { name: "Puzzles", icon: <Gamepad2 className="size-5" />, href: "/categoria/puzzles", image: "https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=300&h=300&fit=crop" },
      { name: "Jogos Tabuleiro", icon: <Gamepad2 className="size-5" />, href: "/categoria/jogos-tabuleiro", image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=300&h=300&fit=crop" },
    ]
  },
  {
    id: "automovel",
    name: "Automóvel",
    icon: <Car className="size-5" />,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=500&fit=crop",
    subcategories: [
      { name: "Acessórios Auto", icon: <Car className="size-5" />, href: "/categoria/acessorios-auto", image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=300&h=300&fit=crop" },
      { name: "Ferramentas", icon: <Wrench className="size-5" />, href: "/categoria/ferramentas", image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=300&h=300&fit=crop" },
      { name: "Peças", icon: <Wrench className="size-5" />, href: "/categoria/pecas", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop" },
      { name: "Pneus", icon: <Car className="size-5" />, href: "/categoria/pneus", image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300&h=300&fit=crop" },
      { name: "Óleos", icon: <Car className="size-5" />, href: "/categoria/oleos", image: "https://images.unsplash.com/photo-1635784467270-3bc6bfb6ea64?w=300&h=300&fit=crop" },
      { name: "Limpeza Auto", icon: <Sparkles className="size-5" />, href: "/categoria/limpeza-auto", image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=300&h=300&fit=crop" },
    ]
  },
  {
    id: "animais",
    name: "Animais",
    icon: <Dog className="size-5" />,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=500&fit=crop",
    subcategories: [
      { name: "Cães", icon: <Dog className="size-5" />, href: "/categoria/caes", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop" },
      { name: "Gatos", icon: <Cat className="size-5" />, href: "/categoria/gatos", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop" },
      { name: "Peixes", icon: <Fish className="size-5" />, href: "/categoria/peixes", image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=300&h=300&fit=crop" },
      { name: "Acessórios Pet", icon: <Heart className="size-5" />, href: "/categoria/acessorios-pet", image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=300&h=300&fit=crop" },
      { name: "Alimentação Pet", icon: <Utensils className="size-5" />, href: "/categoria/alimentacao-pet", image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=300&h=300&fit=crop" },
      { name: "Higiene Pet", icon: <Bath className="size-5" />, href: "/categoria/higiene-pet", image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=300&fit=crop" },
    ]
  },
]

// Function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function CategoriesSection() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const activeCategoryData = categories.find(c => c.id === activeCategory)
  const shuffledSubcategories = activeCategoryData 
    ? shuffleArray(activeCategoryData.subcategories)
    : []

  return (
    <section className="py-16 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Explore por Categoria</h2>
            <p className="mt-2 text-muted-foreground">Selecione uma categoria para ver os produtos</p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Carousel (Tab Selector) */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "group flex-shrink-0 w-48 snap-start focus:outline-none",
              )}
            >
              <div className={cn(
                "relative aspect-[3/4] rounded-xl overflow-hidden  transition-all duration-300",
                activeCategory === category.id 
                  ? "ring-4 ring-primary shadow-2xl scale-105" 
                  : "hover:shadow-xl hover:scale-[1.02]"
              )}>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300",
                  activeCategory === category.id ? "from-primary/90 via-primary/50" : "group-hover:from-black/90"
                )} />

                <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                  <div className={cn(
                    "mb-2 p-2 rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300",
                    activeCategory === category.id && "bg-white/30"
                  )}>
                    {category.icon}
                  </div>
                  <h3 className="text-white font-bold text-sm text-center transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                    {category.name}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Subcategories Grid */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">
              {activeCategoryData?.name}
            </h3>
            <Link 
              href={`/categoria/${activeCategory}`}
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              Ver todos
              <ChevronRight className="size-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {shuffledSubcategories.map((sub, idx) => (
              <Link
                key={`${activeCategory}-${idx}`}
                href={sub.href}
                className="group"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={sub.image}
                    alt={sub.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    {sub.icon}
                  </span>
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {sub.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
