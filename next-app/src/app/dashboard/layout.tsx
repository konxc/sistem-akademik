import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { RouteGuard } from "@/components/auth/route-guard"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SMA UII Dashboard",
  description: "Sistem Manajemen Akademik SMA UII",
  generator: 'v0.dev'
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard>
      <div className={inter.className}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {/* <SiteHeader /> */}
            <main className="flex-1 overflow-auto p-4">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </RouteGuard>
  )
}
