"use client"

import Link from "next/link"
import { Button } from "@base-ui/react"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Produtos", href: "/dashboard/products", icon: Package },
  { name: "Pedidos", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Clientes", href: "/dashboard/customers", icon: Users },
  { name: "Pagamentos", href: "/dashboard/payments", icon: CreditCard },
  { name: "Relatórios", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
]

export function Navigation() {
  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-12">
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <Button
              key={item.name}
              className="flex items-center gap-4 border border-transparent text-black  text-sm data-[current=true]:border-border data-[current=true]:text-foreground"
            >
              <Link href={item.href} className="flex items-center gap-2">
                <Icon className="size-4" />
                {item.name}
              </Link>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}