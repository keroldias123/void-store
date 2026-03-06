// Mock data for products and categories
export interface Product {
    id: string
    title: string
    organizationName: string // 👈 empresa/loja que vende o produto
    price: number
    originalPrice?: number
    discount?: number
    image: string
    category: string
    description: string
    rating: number
    reviews: number
  }
  
  export interface Category {
    id: string
    name: string
    slug: string
    image: string
  }
  
  export const categories: Category[] = [
    { id: "1", name: "Ficção", slug: "ficcao", image: "/fiction-books-shelf.jpg" },
    { id: "2", name: "Romance", slug: "romance", image: "/romance-books-hearts.jpg" },
    { id: "3", name: "Tecnologia", slug: "tecnologia", image: "/tech-programming-books.jpg" },
    { id: "4", name: "Autoajuda", slug: "autoajuda", image: "/self-help-motivation-books.jpg" },
    { id: "5", name: "Negócios", slug: "negocios", image: "/business-books-success.jpg" },
    { id: "6", name: "História", slug: "historia", image: "/history-ancient-books.jpg" },
  ]
  
  export const products: Product[] = [
    {
      id: "1",
      title: "O Poder do Hábito",
      organizationName: "Horizon Tech",
      price: 29.9,
      originalPrice: 49.9,
      discount: 40,
      image: "/the-power-of-habit-book-cover.jpg",
      category: "autoajuda",
      description: "Por que fazemos o que fazemos na vida e nos negócios. Descubra como criar hábitos positivos e eliminar os negativos.",
      rating: 4.8,
      reviews: 2340,
    },
    {
      id: "2",
      title: "Clean Code",
      organizationName: "Code Masters",
      price: 89.9,
      originalPrice: 119.9,
      discount: 25,
      image: "/clean-code-book-cover.png",
      category: "tecnologia",
      description: "Um manual de boas práticas para desenvolvimento ágil de software. Essencial para programadores.",
      rating: 4.9,
      reviews: 5678,
    },
    {
      id: "3",
      title: "Sapiens",
      organizationName: "History Hub",
      price: 44.9,
      originalPrice: 69.9,
      discount: 36,
      image: "/sapiens-book-cover-harari.jpg",
      category: "historia",
      description: "Uma breve história da humanidade. Da Idade da Pedra ao Vale do Silício.",
      rating: 4.9,
      reviews: 12450,
    },
    {
      id: "4",
      title: "O Investidor Inteligente",
      organizationName: "Finance Plus",
      price: 54.9,
      image: "/intelligent-investor-book-cover.jpg",
      category: "negocios",
      description: "O livro definitivo sobre investimento em valor. A bíblia do mercado de ações.",
      rating: 4.7,
      reviews: 3456,
    },
    {
      id: "5",
      title: "1984",
      organizationName: "Classic Reads",
      price: 34.9,
      originalPrice: 49.9,
      discount: 30,
      image: "/1984-orwell-book-cover.jpg",
      category: "ficcao",
      description: "Uma distopia sobre totalitarismo e vigilância. Um clássico atemporal.",
      rating: 4.8,
      reviews: 15678,
    },
    {
      id: "6",
      title: "Orgulho e Preconceito",
      organizationName: "Romance Store",
      price: 27.9,
      image: "/pride-prejudice-book-cover.jpg",
      category: "romance",
      description: "Romance clássico sobre amor, sociedade e segundas impressões na Inglaterra do século XIX.",
      rating: 4.7,
      reviews: 9876,
    },
  ]
  
  export const featuredProducts = products.slice(0, 4)
  
  // Filtra produtos por categoria
  export function getProductsByCategory(categorySlug: string): Product[] {
    return products.filter((product) => product.category === categorySlug)
  }
  
  // Busca produto pelo ID
  export function getProductById(id: string): Product | undefined {
    return products.find((product) => product.id === id)
  }