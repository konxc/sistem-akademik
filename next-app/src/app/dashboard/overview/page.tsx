"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Users, GraduationCap, BookOpen, Calendar, DollarSign, TrendingUp, Bell, Activity } from "lucide-react"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Siswa",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Guru",
      value: "89",
      change: "+3%",
      icon: GraduationCap,
      color: "text-green-600",
    },
    {
      title: "Mata Pelajaran",
      value: "24",
      change: "0%",
      icon: BookOpen,
      color: "text-purple-600",
    },
    {
      title: "Kelas Aktif",
      value: "36",
      change: "+1%",
      icon: Calendar,
      color: "text-orange-600",
    },
  ]

  const recentActivities = [
    {
      title: "Presensi Kelas XII IPA 1",
      description: "28 siswa hadir, 2 siswa izin",
      time: "2 menit yang lalu",
      type: "attendance",
    },
    {
      title: "Pembayaran Kas Kelas XI IPS 2",
      description: "Rp 500,000 terkumpul untuk kegiatan kelas",
      time: "15 menit yang lalu",
      type: "payment",
    },
    {
      title: "Jadwal Piket Kelas X MIPA 3",
      description: "Jadwal piket minggu ini telah diperbarui",
      time: "1 jam yang lalu",
      type: "schedule",
    },
    {
      title: "Sinkronisasi Google Calendar",
      description: "Jadwal pelajaran berhasil disinkronkan",
      time: "2 jam yang lalu",
      type: "sync",
    },
  ]

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Selamat datang di Sistem Manajemen Akademik SMA UII</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifikasi
            </Button>
            <Button size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Laporan
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> dari bulan lalu
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>Fitur yang sering digunakan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="h-4 w-4 mr-2" />
                Presensi Hari Ini
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <DollarSign className="h-4 w-4 mr-2" />
                Kas Kelas
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                Jadwal Pelajaran
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BookOpen className="h-4 w-4 mr-2" />
                E-Wallet Siswa
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>Update terbaru dari sistem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Activity className="h-4 w-4 text-muted-foreground mt-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status Sistem</CardTitle>
            <CardDescription>Monitoring sistem dan integrasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Moodle Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Google Calendar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">LDAP Server</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Network Monitor</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
