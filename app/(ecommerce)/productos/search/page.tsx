import Link from "next/link"
import { db } from "@/db"
import { product, category, subcategory } from "@/db/schema/schema"
import { or, like, desc, inArray, sql } from "drizzle-orm"
import ProductCard from "@/app/(ecommerce)/components/product-card"

interface SearchPageProps {
  searchParams: { q?: string; cat?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q || "").trim()
  const activeCat = searchParams.cat || ""

  // 1. ✅ Buscar PRODUTOS primeiro (para pegar categorias relevantes)
  const products = query
    ? await db.query.product.findMany({
        where: (fields, { and, or, like, eq }) =>
          and(
            or(
              like(fields.title, `%${query}%`),
              like(fields.description, `%${query}%`),
              like(fields.category, `%${query}%`)
            ),
            activeCat ? eq(fields.category, activeCat) : undefined // ✅ Corrigido
          ),
        orderBy: (fields) => desc(fields.createdAt),
        columns: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          category: true,
          price: true,
          originalPrice: true,
          slug: true,
          reviews: true,
        }
      })
    : []

  // 2. ✅ Pegar CATEGORIAS ÚNICAS dos produtos encontrados
  const productCategories = [...new Set(products.map(p => p.category).filter(Boolean))]
  
  // 3. ✅ Buscar apenas CATEGORIAS e SUBCATEGORIAS relevantes
  const relevantCategories = productCategories.length > 0 
    ? await db.query.category.findMany({
        where: (fields, { inArray }) => inArray(fields.name, productCategories),
        with: {
          subcategories: {
            where: (subFields, { inArray }) => inArray(subFields.name, productCategories)
          }
        },
      })
    : await db.query.category.findMany({
        with: { subcategories: true },
        limit: 5 // ✅ Limite se não há resultados
      })

  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ASIDE - MENU LATERAL RELEVANTE */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Filtros Relevantes</h2>
              <p className="text-sm text-gray-600">
                {products.length} {products.length === 1 ? 'resultado' : 'resultados'} para &quot;<strong>{query}</strong>&quot;
              </p>
            </div>

            {relevantCategories.length > 0 ? (
              <nav>
                <ul className="space-y-2">
                  {relevantCategories.map((cat) => (
                    <li key={cat.id} className="border-b border-gray-100 pb-2 last:border-b-0">
                      <details className="group" defaultOpen={productCategories.length <= 3}>
                        <summary className="flex cursor-pointer items-center justify-between py-3 text-sm font-semibold text-gray-800 hover:text-bronze-600">
                          <span>{cat.name} ({cat.subcategories?.length || 0})</span>
                          <span className="transition group-open:rotate-180">
                            <svg fill="none" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M6 9l6 6 6-6"></path>
                            </svg>
                          </span>
                        </summary>
                        
                        <div className="mt-3 ml-4 space-y-1">
                          {/* Categoria principal */}
                          <Link 
                            href={`/search?q=${query}&cat=${cat.slug}`}
                            className={`block text-sm py-1 px-2 rounded-lg transition-all ${
                              activeCat === cat.slug 
                                ? 'bg-bronze-500 text-white font-bold shadow-md' 
                                : 'text-gray-700 hover:bg-gray-100 hover:text-bronze-600'
                            }`}
                          >
                            📦 Ver tudo ({cat._count?.subcategories || 0})
                          </Link>
                          
                          {/* Subcategorias relevantes */}
                          {cat.subcategories?.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/search?q=${query}&cat=${sub.slug}`}
                              className={`block text-sm py-1 px-3 rounded-lg transition-all pl-2 border-l-2 ${
                                activeCat === sub.slug 
                                  ? 'bg-bronze-50 border-bronze-400 text-bronze-800 font-semibold shadow-sm' 
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-bronze-600 border-gray-200'
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma categoria encontrada</p>
                <Link href={`/search?q=${query}`} className="text-sm underline mt-2 block hover:text-bronze-600">
                  Ver todos os resultados
                </Link>
              </div>
            )}
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="flex-1 min-w-0">
            {query ? (
              products.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {products.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={{
                        id: prod.id,
                        slug: prod.slug,
                        title: prod.title,
                        image: prod.imageUrl || "/placeholder.png",
                        category: prod.category,
                        company: prod.seller?.name || "Loja", // ✅ Revendedor
                        price: prod.price,
                        originalPrice: prod.originalPrice,
                        rating: prod.rating || 4.5,
                        reviews: prod.reviews || 0,
                        description: prod.description,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Não encontramos &quot;<strong>{query}</strong>&quot;. Tente outros termos.
                  </p>
                  <Link 
                    href={`/search?q=${query}`} 
                    className="inline-flex items-center gap-2 bg-bronze-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-bronze-600 shadow-lg transition-all"
                  >
                    Ver todos os produtos
                  </Link>
                </div>
              )
            ) : (
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">O que você está procurando?</h2>
                <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
                  Digite o nome do produto, categoria ou marca para encontrar rapidamente.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}