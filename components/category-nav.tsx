import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Flame, Tag, Eye, Sparkles, ListTodo } from "lucide-react";

const categories = [
  { name: "Inicio", icon: Home, href: "/" },
  // { name: "Categoria", icon: ListTodo, href: "/categorias" },
  { name: "Productos populares", icon: Flame, href: "/productos/populares" },
  { name: "Descontos", icon: Tag, href: "/productos/descontos", badge: "Promo" },
  { name: "Vistos", icon: Eye, href: "/productos/vistos" },
  { name: "Novidades", icon: Sparkles, href: "/productos/novidades" },
];

export function CategoryNav() {
  const pathname = usePathname();

  return (
    <div className="border-t border-border">
      <div className="flex items-center gap-8 h-12">
        {categories.map((cat) => {
          const isActive =
            pathname === cat.href || (cat.href !== "/" && pathname.startsWith(cat.href));

          return (
          <Link
            key={cat.name}
            href={cat.href}
            className={`relative flex h-full items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium transition-colors ${
              isActive ? "text-foreground bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <cat.icon className="size-4" />
            <span>{cat.name}</span>

            {cat.badge && (
              <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {cat.badge}
              </span>
            )}

            <span
              className={`
                absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300
                ${isActive ? "w-full" : "w-0"}
              `}
            />
          </Link>
          );
        })}
      </div>
    </div>
  );
}