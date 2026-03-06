import { useState } from "react";
import {
  Home,
  Flame,
  Tag,
  Heart,
  Eye,
  Sparkles,
  ListTodo,
} from "lucide-react";

const categories = [
  { name: "Inicio", icon: Home },
  {name: "Categoria", icon: ListTodo},
  { name: "Productos populares", icon: Flame },
  { name: "Descontos", icon: Tag, badge: "Promo" },
  { name: "Vistos", icon: Eye },
  { name: "Novidades", icon: Sparkles },
];

export function CategoryNav() {
  const [active, setActive] = useState("Home");

  return (
    <div className="border-t border-border">
      <div className="flex items-center gap-8 h-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.name;

          return (
            <button
              key={cat.name}
              onClick={() => setActive(cat.name)}
              className="relative flex h-full items-center gap-2 text-sm font-medium"
            >
              <Icon className="size-4" />

              <span
                className={
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                {cat.name}
              </span>

              {cat.badge && (
                <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {cat.badge}
                </span>
              )}

              {/* underline alinhado perfeito */}
              <span
                className={`
                  absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300
                  ${isActive ? "w-full" : "w-0"}
                `}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}