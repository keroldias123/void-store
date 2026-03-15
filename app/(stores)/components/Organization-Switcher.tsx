"use client";
import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


// dados fictícios
const organizations = [
    {
      id: "1",
      name: "Tech Store Angola",
      slug: "tech-store",
      avatarUrl: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: "2",
      name: "Prime Electronics",
      slug: "prime-electronics",
      avatarUrl: "https://i.pravatar.cc/40?img=2",
    },
    {
      id: "3",
      name: "Dias Marketplace",
      slug: "dias-marketplace",
      avatarUrl: "https://i.pravatar.cc/40?img=3",
    },
  ]
  
  // organização atual fictícia
  const currentOrg = "tech-store"
  
export async function OrganizationSwitcher() {

    const currentOrganization = organizations.find(
        (org) => org.slug === currentOrg,
      )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[180px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">

        {currentOrganization ? (
          <>
            <Avatar className="size-5">
              <AvatarImage src={currentOrganization.avatarUrl} />
              <AvatarFallback>
                {currentOrganization.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <span className="truncate text-left">
              {currentOrganization.name}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">
            Select organization
          </span>
        )}

        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[220px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>

          {organizations.map((organization) => (
            <DropdownMenuItem key={organization.id} asChild>
              <Link href={`/org/${organization.slug}`}>
                <Avatar className="mr-2 size-5">
                  <AvatarImage src={organization.avatarUrl} />
                  <AvatarFallback>
                    {organization.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <span className="line-clamp-1">
                  {organization.name}
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <PlusCircle className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
