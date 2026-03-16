'use client'

import { useSearchParams } from 'next/navigation'
import { api } from '@/src/trpc/react' // ✅ Import padrão recomendado
import Link from 'next/link'
import ProductCard from '@/app/(ecommerce)/components/product-card'
import { Loader2, Search, X, PackageOpen, Home } from 'lucide-react'

export default function SearchPage() {
  const searchParams = useSearchParams()
  
  // Decodifica a query para exibição limpa na UI
  const rawQuery = searchParams.get('q') || ''
  const query = decodeURIComponent(rawQuery).trim()
  const activeCat = searchParams.get('cat') || ''

  // ✅ tRPC Query com proteção contra strings vazias
  const { 
    data: searchData, 
    isLoading, 
    isError,
    error 
  } = api.categories.searchRouter.useQuery(
    { 
      query: query || undefined, 
      category: activeCat || undefined 
    }, 
    {
      enabled: query.length > 0, // Evita chamadas inúteis
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false
    }
  )

  const products = searchData?.products ?? []
  const relevantCategories = searchData?.categories ?? []
  const total = searchData?.total ?? 0

  // 1. Estado: Erro
  if (isError) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="bg-red-50 p-4 rounded-full inline-block">
            <X className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Erro na busca</h2>
          <p className="text-gray-500 max-w-xs">{error?.message || "Ocorreu um problema inesperado."}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    )
  }

  // 2. Estado: Busca Vazia (Ainda não digitou)
  if (!query) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <Search className="w-24 h-24 text-gray-200 mb-8" />
        <h1 className="text-4xl font-black text-gray-900 mb-4">O que você procura?</h1>
        <p className="text-gray-500 text-lg max-w-md">
          Digite o nome de um produto ou categoria para começar.
        </p>
      </main>
    )
  }

  // 3. Estado: Carregando
  if (isLoading) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-gray-900" />
          <p className="font-bold text-gray-600">Buscando as melhores opções...</p>
        </div>
      </main>
    )
  }

  return (
    <>
      <title>&quot;{query}&quot; | Sua Loja</title>
      <main className="bg-slate-50/50 min-h-screen pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
          
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Sidebar Otimizada */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                
                {/* Stats Card */}
                <div className="p-6 rounded-[2rem] bg-white shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-3xl font-black text-slate-900">{total}</span>
                    <span className="text-slate-500 font-medium">itens</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 truncate">para &quot;{query}&quot;</p>
                  
                  {activeCat && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                    >
                      <X className="w-3 h-3" /> REMOVER FILTROS
                    </Link>
                  )}
                </div>

                {/* Categories Filter */}
                <div className="space-y-3">
                  <h3 className="px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Filtrar por Categoria</h3>
                  {relevantCategories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <Link
                        href={`/search?q=${encodeURIComponent(query)}&cat=${cat.slug}`}
                        className={`flex items-center justify-between p-4 transition-all ${
                          activeCat === cat.slug ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-900'
                        }`}
                      >
                        <span className="font-bold truncate">{cat.name}</span>
                        <span className={`text-[10px] px-2 py-1 rounded-lg ${
                          activeCat === cat.slug ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {cat.subcategories?.length || 0}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Results Area */}
            <div className="flex-1">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[3rem] p-12 text-center border border-slate-200 shadow-sm">
                  <PackageOpen className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                  <h2 className="text-3xl font-black text-slate-900 mb-4">Nenhum resultado</h2>
                  <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                    Não encontramos correspondências exatas para <strong>{query}</strong>. Tente termos mais genéricos.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/" className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:shadow-xl transition-all">
                      <Home className="w-5 h-5" /> Início
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </>
  )
}