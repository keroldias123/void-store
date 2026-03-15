"use client"

import Image from "next/image"
import Link from "next/link"
import { Bell, PlusCircle, Slash, Store } from "lucide-react"
import { ProfileButton } from "./Profile-Button"
import { Separator } from "@/components/ui/separator"
import { OrganizationSwitcher } from "./Organization-Switcher"

export function DashboardHeader() {
  return (
    <header className=" bg-background">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
             {/* Logo */}
             <div className="flex shrink-0">
               
                  <div className="flex size-[24px] sm:size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                    VOID
                  </div>
                  <span className="hidden sm:inline-block font-bold text-lg">
                    Store
                  </span>
              
              </div>
          </Link>

          <Slash className="size-3 -rotate-[24deg] text-border" />

          {/* Store Switcher */}
          <button className="flex items-center gap-2 text-sm font-medium hover:text-primary">
            <Store className="size-4" />
            <OrganizationSwitcher />
          </button>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <button className="relative">
            <Bell className="size-5" />
            <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              3
            </span>
          </button>

          <Separator orientation="vertical" className="h-5" />
          <ProfileButton />
        

        </div>
      </div>
    </header>
  )
}