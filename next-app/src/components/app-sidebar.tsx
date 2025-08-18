"use client"

import type * as React from "react"
import {
  Calendar,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Network,
  DollarSign,
  UserCheck,
  Building,
  FileText,
  Wallet,
  BarChart3,
  Smartphone,
  User,
  UserCog,
} from "lucide-react"
import { NavUser } from "@/components/nav-user"
import {
  IconHelp,
  IconHome,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"
import { NavMenu } from "@/components/nav-menu"

// Data navigasi
const data = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: IconHome,
    },
  ],
  navMenu: [
    {
      name: "Pengguna",
      items: [
        {
          title: "Siswa",
          url: "/dashboard/users?tab=student",
          icon: GraduationCap,
        },
        {
          title: "Guru",
          url: "/dashboard/users?tab=teacher",
          icon: BookOpen,
        },
      ]
    },
    {
      name: "Akademik",
      items: [
        {
          title: "Manajemen Sekolah",
          url: "/dashboard/school-management",
          icon: Building,
        },
        {
          title: "Mata Pelajaran",
          url: "/dashboard/subject",
          icon: BookOpen,
        },
        {
          title: "Jadwal",
          url: "/dashboard/scheduler",
          icon: Calendar,
        },
        {
          title: "Presensi",
          url: "/dashboard/attendance",
          icon: UserCheck,
        },
        {
          title: "Laporan",
          url: "/dashboard/reports",
          icon: FileText,
        },
      ],
    },
    {
      name: "Manajemen Kelas",
      items: [
        {
          title: "Kas Kelas",
          url: "/dashboard/class-funds",
          icon: DollarSign,
        },
        {
          title: "Aset Kelas",
          url: "/dashboard/class-assets",
          icon: Building,
        },
        {
          title: "Piket Siswa",
          url: "/dashboard/duty-schedule",
          icon: ClipboardCheck,
        },
      ],
    },
    {
      name: "E-Wallet & Digital",
      items: [
        {
          title: "E-Wallet Siswa",
          url: "/dashboard/student-wallet",
          icon: Wallet,
        },
        {
          title: "Google Calendar",
          url: "/dashboard/google-calendar",
          icon: Calendar,
        },
      ],
    },
    {
      name: "Dashboard Preview",
      items: [
        {
          title: "Dashboard Siswa",
          url: "/dashboard/student-dashboard",
          icon: GraduationCap,
        },
        {
          title: "Dashboard Guru",
          url: "/dashboard/teacher-dashboard",
          icon: User,
        },
        {
          title: "Dashboard Wali Murid",
          url: "/dashboard/parent-dashboard",
          icon: UserCog,
        },
      ],
    },
    {
      name: "Mobile App",
      items: [
        {
          title: "Mobile Dashboard",
          url: "/mobile/dashboard",
          icon: Smartphone,
        },
        {
          title: "Mobile Presensi",
          url: "/mobile/attendance",
          icon: UserCheck,
        },
        {
          title: "Mobile Nilai",
          url: "/mobile/grades",
          icon: BarChart3,
        },
        {
          title: "Mobile Keuangan",
          url: "/mobile/financial",
          icon: DollarSign,
        },
      ],
    },
    {
      name: "Sistem",
      items: [
        {
          title: "LDAP Config",
          url: "/dashboard/ldap-config",
          icon: Network,
        },
        {
          title: "Network Monitor",
          url: "/dashboard/network-monitoring",
          icon: Network,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Pengaturan",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Help Desk",
      url: "/dashboard/helpdesk",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/dashboard/search?",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold">Sistem Akademik</p>
            <span className="text-xs">Sekolah Digital SMA UII</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMenu menus={data.navMenu} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
