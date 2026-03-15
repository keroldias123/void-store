import Link from "next/link"
import { db } from "@/db"
import { product, category, subcategory } from "@/db/schema/schema"
import { or, like, desc } from "drizzle-orm"
import ProductCard from "@/app/(ecommerce)/components/product-card"

interface SearchPageProps {
  searchParams: { q?: string; cat?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q || "").trim()
  const activeCat = searchParams.cat || ""

  // 1. Buscar Categorias e Subcategorias para o Menu Lateral
  const categoriesWithSub = await db.query.category.findMany({
    with: {
      subcategories: true,
    },
  })

  // 2. Buscar Produtos (Filtrando por texto E categoria se selecionada)
  const products = query
    ? await db.query.product.findMany({
        where: (fields, { and, or, like, eq }) =>
          and(
            or(
              like(fields.title, `%${query}%`),
              like(fields.description, `%${query}%`),
              like(fields.category, `%${query}%`)
            ),
            activeCat ? eq(fields.category, activeCat) : undefined
          ),
        orderBy: (fields) => desc(fields.createdAt),
      })
    : []

  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* ASIDE - MENU LATERAL COM DROPDOWNS */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Filtrar por Categoria</h2>
            <nav>
              <ul className="space-y-2">
                {categoriesWithSub.map((cat) => (
                  <li key={cat.id} className="border-b border-gray-100 pb-2">
                    <details className="group">
                      <summary className="flex cursor-pointer items-center justify-between py-2 text-sm font-medium text-gray-700 hover:text-primary">
                        <span>{cat.name}</span>
                        <span className="transition group-open:rotate-180">
                          <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                      </summary>
                      
                      <div className="mt-2 ml-4 flex flex-col gap-2">
                        {/* Link para a categoria principal */}
                        <Link 
                          href={`/search?q=${query}&cat=${cat.slug}`}
                          className={`text-xs ${activeCat === cat.slug ? 'text-primary font-bold' : 'text-gray-500'}`}
                        >
                          Ver Tudo em {cat.name}
                        </Link>
                        
                        {/* Listagem de Subcategorias */}
                        {cat.subcategories?.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/search?q=${query}&cat=${sub.slug}`}
                            className={`text-xs transition-colors hover:text-primary ${
                              activeCat === sub.slug ? 'text-primary font-bold' : 'text-gray-500'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Resultados da Pesquisa</h1>
              <form method="get" className="mt-4 flex gap-2">
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Buscar produtos..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                />
                {activeCat && <input type="hidden" name="cat" value={activeCat} />}
                <button type="submit" className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90">
                  Buscar
                </button>
              </form>
            </div>

            {!query ? (
              <p className="text-gray-500 text-center py-10">Insira um termo para começar a sua busca.</p>
            ) : products.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-gray-600">Nenhum resultado para &quot;{query}&quot; {activeCat && `em ${activeCat}`}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={{
                      id: prod.id,
                      title: prod.title,
                      image: prod.imageUrl || "/placeholder.png",
                      category: prod.category ?? "",
                      price: prod.price,
                      originalPrice: prod.originalPrice ?? undefined,
                      rating: 4.5,
                      reviews: 10,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
