import { Home, Flame, Tag, Eye, Sparkles, ListTodo } from 'lucide-react'

const footerNav = [
  { name: 'Inicio', icon: Home, href: '/' },
  { name: 'Categoria', icon: ListTodo, href: '/categorias' },
  { name: 'Productos populares', icon: Flame, href: '/productos/populares' },
  { name: 'Descontos', icon: Tag, href: '/productos/descontos' },
  { name: 'Vistos', icon: Eye, href: '/productos/vistos' },
  { name: 'Novidades', icon: Sparkles, href: '/productos/novidades' },
]

export const Footer = () => {
    return (
        <footer className="mt-16 border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-[40px] items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  VOID
                </div>
                <span className="font-bold">Store</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                A sua loja online de confiança para todas as suas necessidades.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Navegação</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {footerNav.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <li key={cat.name} className="flex items-center gap-2">
                      <Icon className="size-4" />
                      <a href={cat.href} className="hover:text-foreground">
                        {cat.name}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Ajuda</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground">Envios</a></li>
                <li><a href="#" className="hover:text-foreground">Devoluções</a></li>
                <li><a href="#" className="hover:text-foreground">Contactos</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Termos & Condições</a></li>
                <li><a href="#" className="hover:text-foreground">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2026 Store. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    )
}