import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import { category, subcategory, product } from '@/db/schema/schema'
import { desc, eq } from 'drizzle-orm'
import ProductCard from '@/app/(ecommerce)/components/product-card'

const STATIC_NAV = [
  { name: 'Todos os Produtos', slug: 'all' },
  { name: 'Produtos Populares', slug: 'populares' },
  { name: 'Descontos', slug: 'descontos' },
  { name: 'Vistos Recentemente', slug: 'vistos' },
  { name: 'Novidades', slug: 'novidades' },
]

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0,
  })

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug: rawSlug } = await params
  const slug = rawSlug.toLowerCase()

  const categoriesWithSubcategories = await db.query.category.findMany({
    with: { subcategories: true },
    orderBy: (fields, { asc }) => asc(fields.name),
  })

  const selectedCategory = categoriesWithSubcategories.find((cat) => cat.slug === slug)
  const selectedSubcategory = selectedCategory
    ? null
    : await db.query.subcategory.findFirst({
        where: (fields, { eq }) => eq(fields.slug, slug),
      })

  const isStaticFilter = STATIC_NAV.some((item) => item.slug === slug && item.slug !== 'all')

  if (slug !== 'all' && !selectedCategory && !selectedSubcategory && !isStaticFilter) {
    notFound()
  }

  const products = await db.query.product.findMany({
    where:
      slug === 'all'
        ? undefined
        : selectedCategory
        ? (fields, { eq }) => eq(fields.categoryId, selectedCategory.id)
        : selectedSubcategory
        ? (fields, { eq }) => eq(fields.subcategoryId, selectedSubcategory.id)
        : (fields, { eq }) => eq(fields.slug, slug),
    orderBy: (fields, { desc }) => desc(fields.createdAt),
  })

  const currentTitle =
    slug === 'all'
      ? 'Todos os Produtos'
      : selectedCategory
      ? selectedCategory.name
      : selectedSubcategory
      ? `${selectedSubcategory.name} (Subcategoria)`
      : STATIC_NAV.find((x) => x.slug === slug)?.name || slug.replace(/-/g, ' ')

  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 capitalize">{currentTitle}</h1>
          <div className="text-sm text-gray-500">Sort ▼</div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 pt-6">
         <aside>
  {/* Navegação estática */}
  <div className="mb-8">
    <h2 className="text-lg font-bold text-gray-900 mb-4">Navegação Rápida</h2>
    <nav>
      <ul className="space-y-2">
        {STATIC_NAV.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/productos/${item.slug}`}
              className={`block py-2 px-3 rounded-lg transition-colors text-sm ${
                slug === item.slug 
                  ? 'bg-primary text-white font-bold' 
                  : 'text-gray-600 hover:text-primary hover:bg-gray-100'
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </div>

  {/* Filtro por Categoria com subcategories */}
  <div>
    <h2 className="text-lg font-bold text-gray-900 mb-4">Filtrar por Categoria</h2>
    <nav>
      <ul className="space-y-2">
        {categoriesWithSubcategories.map((cat) => (
          <li key={cat.id} className="border-b border-gray-100 pb-2">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between py-2 text-sm font-medium text-gray-700 hover:text-primary">
                <span>{cat.name}</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              
              <div className="mt-2 ml-4 flex flex-col gap-2">
                {/* Link para a categoria principal */}
                <Link 
                  href={`/productos/${cat.slug}`}
                  className={`text-xs py-1 px-2 rounded transition-colors ${
                    slug === cat.slug 
                      ? 'bg-primary text-white font-bold' 
                      : 'text-gray-500 hover:text-primary hover:bg-gray-100'
                  }`}
                >
                  Ver Tudo em {cat.name}
                </Link>
                
                {/* Listagem de Subcategorias */}
                {cat.subcategories?.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/productos/${sub.slug}`}
                    className={`text-xs py-1 px-2 rounded transition-colors hover:text-primary hover:bg-gray-100 ${
                      slug === sub.slug ? 'bg-primary text-white font-bold' : 'text-gray-500'
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
  </div>
</aside>

          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-500">
                  Tente{' '}
                  <Link href="/productos/all" className="text-indigo-600 hover:underline">
                    ver todos os produtos
                  </Link>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={{
                      id: prod.id,
                      title: prod.title,
                      image: prod.imageUrl || '/placeholder.png',
                      category: prod.category || 'Loja',
                      price: prod.price,
                      originalPrice: prod.originalPrice ?? undefined,
                      discount: prod.originalPrice && prod.price < prod.originalPrice ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100) : undefined,
                      rating: 4.5,
                      reviews: 34,
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
