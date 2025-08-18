"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Filter, MoreHorizontal, UserCheck, Users, GraduationCap, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter, useSearchParams } from "next/navigation"

function UsersPageContent() {
  const [searchTerm, setSearchTerm] = useState("")

  // Get tab from URL params
  const searchParams = useSearchParams()
  const router = useRouter()

  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(
    tabParam === "teacher" ? "teachers" : tabParam === "staff" ? "staff" : "students"
  )

  useEffect(() => {
    if (tabParam === "teacher") {
      setActiveTab("teachers")
    } else if (tabParam === "staff") {
      setActiveTab("staff")
    } else {
      setActiveTab("students")
    }
  }, [tabParam])

  const students = [
    {
      id: "1",
      name: "Ahmad Rizki Pratama",
      nisn: "0012345678",
      phone: "081234567890",
      grade: "12",
      group: "XII IPA 1",
      balance: "Rp 150.000",
      status: "active",
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      nisn: "0012345679",
      phone: "081234567891",
      grade: "11",
      group: "XI IPS 2",
      balance: "Rp 200.000",
      status: "active",
    },
    {
      id: "3",
      name: "Budi Santoso",
      nisn: "0012345680",
      phone: "081234567892",
      grade: "10",
      group: "X MIPA 3",
      balance: "Rp 75.000",
      status: "inactive",
    },
  ]

  const teachers = [
    {
      id: "1",
      name: "Dr. Fatimah Azzahra, M.Pd",
      nip: "196801011990032001",
      phone: "081234567893",
      subject: "Matematika",
      status: "active",
    },
    {
      id: "2",
      name: "Drs. Muhammad Yusuf",
      nip: "196505151991031002",
      phone: "081234567894",
      subject: "Fisika",
      status: "active",
    },
    {
      id: "3",
      name: "Dra. Siti Aisyah",
      nip: "197002201992032003",
      phone: "081234567895",
      subject: "Kimia",
      status: "active",
    },
  ]

  const staff = [
    {
      id: "1",
      name: "Sri Wahyuni, S.E",
      nip: "198003151995032004",
      phone: "081234567896",
      position: "Staff Administrasi",
      status: "active",
    },
    {
      id: "2",
      name: "Joko Widodo, S.Kom",
      nip: "198504201996031005",
      phone: "081234567897",
      position: "Staff IT",
      status: "active",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Aktif</Badge>
      case "inactive":
        return <Badge variant="destructive">Tidak Aktif</Badge>
      default:
        return <Badge variant="outline">Belum Diketahui</Badge>
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Update URL params
    if (value === "teachers") {
      router.push("?tab=teacher")
    } else if (value === "staff") {
      router.push("?tab=staff")
    } else {
      router.push("?tab=students")
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">Kelola data siswa, guru, dan staff sekolah</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pengguna
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pengguna</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter Lanjutan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Siswa
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Guru
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff
          </TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Daftar Siswa
              </CardTitle>
              <CardDescription>Kelola data siswa sekolah</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>NISN</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{student.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{student.nisn}</TableCell>
                      <TableCell>{student.group}</TableCell>
                      <TableCell className="font-medium">{student.balance}</TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                            <DropdownMenuItem>Hapus</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Daftar Guru
              </CardTitle>
              <CardDescription>Kelola data guru sekolah</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIP</TableHead>
                    <TableHead>Mata Pelajaran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{teacher.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{teacher.name}</div>
                          <div className="text-sm text-muted-foreground">{teacher.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{teacher.nip}</TableCell>
                      <TableCell>{teacher.subject}</TableCell>
                      <TableCell>{getStatusBadge(teacher.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                            <DropdownMenuItem>Hapus</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Daftar Staff
              </CardTitle>
              <CardDescription>Kelola data staff sekolah</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIP</TableHead>
                    <TableHead>Posisi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((staffMember) => (
                    <TableRow key={staffMember.id}>
                      <TableCell className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{staffMember.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{staffMember.name}</div>
                          <div className="text-sm text-muted-foreground">{staffMember.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{staffMember.nip}</TableCell>
                      <TableCell>{staffMember.position}</TableCell>
                      <TableCell>{getStatusBadge(staffMember.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                            <DropdownMenuItem>Hapus</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersPageContent />
    </Suspense>
  )
}
