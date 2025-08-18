"use client"
import { ElementType, Suspense } from "react"

import {
  type Icon,
} from "@tabler/icons-react"

import {
  useSidebar,
} from "@/components/ui/sidebar"

import {
  ChevronRight,
} from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"

interface MenuGroup {
  menus: {
    name: string
    items: {
      title: string
      url: string
      icon: ElementType
    }[]
  }[]
}

function NavMenuContent({ menus }: MenuGroup) {
  const { isMobile } = useSidebar()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const isActive = (url: string) => {
    const urlObj = new URL(url, "http://localhost") // dummy base to parse url
    const basePath = urlObj.pathname
    const tabParam = urlObj.searchParams.get("tab")
  
    const currentTab = searchParams.get("tab")
  
    // Exact match for root
    if (basePath === "/" && pathname === "/") return true
  
    // If tab param exists, match both pathname and tab
    if (tabParam) {
      return pathname.startsWith(basePath) && currentTab === tabParam
    }
  
    // Fallback: match just the pathname
    return pathname.startsWith(basePath)
  }
  

  return menus.map((menu) => (
    <SidebarGroup key={menu.name}>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {menu.name}
            </div>
            <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  ))
}

export function NavMenu({ menus }: MenuGroup) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavMenuContent menus={menus} />
    </Suspense>
  )
}
