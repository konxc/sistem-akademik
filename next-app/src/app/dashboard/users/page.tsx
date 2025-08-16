"use client"

import { useState, useEffect } from "react"
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

export default function UsersPage() {
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
      name: "Sari Indrawati, S.Pd",
      nip: "197203121998032001",
      phone: "081234567895",
      subject: null,
      status: "active",
    },
  ]

  const staff = [
    {
      id: "1",
      name: "Andi Wijaya",
      nip: "198001011999031001",
      phone: "081234567896",
      position: "Tata Usaha",
      status: "active",
    },
    {
      id: "2",
      name: "Rina Sari",
      nip: "198505102005032002",
      phone: "081234567897",
      position: "Perpustakaan",
      status: "active",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Manajemen Pengguna</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Badge variant="outline" className="ml-auto">
          <Settings className="h-3 w-3 mr-1" />
          LDAP Sync
        </Badge>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Search and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Tambah Pengguna
          </Button>
        </div>

        {/* User Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12 siswa baru bulan ini</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+3 guru baru semester ini</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Staff administrasi aktif</p>
            </CardContent>
          </Card>
        </div>

        {/* User Tables */}
        <Tabs value={activeTab} onValueChange={(val) => {
          setActiveTab(val)
          const newTab = val === "teachers" ? "teacher" : val === "staff" ? "staff" : "student"
          router.push(`users?tab=${newTab}`)
        }} className="space-y-4">
          <TabsList>
            <TabsTrigger value="students">Siswa</TabsTrigger>
            <TabsTrigger value="teachers">Guru</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Siswa</CardTitle>
                <CardDescription>Daftar siswa yang terdaftar di sistem LDAP</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NISN</TableHead>
                      <TableHead>No. Telepon</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Rombel</TableHead>
                      <TableHead>Saldo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                            <AvatarFallback>
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{student.name}</span>
                        </TableCell>
                        <TableCell>{student.nisn}</TableCell>
                        <TableCell>{student.phone}</TableCell>
                        <TableCell>{student.grade}</TableCell>
                        <TableCell>{student.group}</TableCell>
                        <TableCell>{student.balance}</TableCell>
                        <TableCell>
                          <Badge variant={student.status === "active" ? "default" : "secondary"}>
                            {student.status === "active" ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Detail</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Hapus</DropdownMenuItem>
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

          <TabsContent value="teachers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Guru</CardTitle>
                <CardDescription>Daftar guru yang terdaftar di sistem LDAP</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIP</TableHead>
                      <TableHead>No. Telepon</TableHead>
                      <TableHead>Mata Pelajaran</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                            <AvatarFallback>
                              {teacher.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{teacher.name}</span>
                        </TableCell>
                        <TableCell>{teacher.nip}</TableCell>
                        <TableCell>{teacher.phone}</TableCell>
                        <TableCell>
                          {teacher.subject ? (
                            <Badge variant="outline">{teacher.subject}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={teacher.status === "active" ? "default" : "secondary"}>
                            {teacher.status === "active" ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Assign Subject</DropdownMenuItem>
                              <DropdownMenuItem>Detail</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Hapus</DropdownMenuItem>
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

          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Staff</CardTitle>
                <CardDescription>Daftar staff administrasi yang terdaftar di sistem LDAP</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIP</TableHead>
                      <TableHead>No. Telepon</TableHead>
                      <TableHead>Posisi</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </TableCell>
                        <TableCell>{member.nip}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.position}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.status === "active" ? "default" : "secondary"}>
                            {member.status === "active" ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Detail</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Hapus</DropdownMenuItem>
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
    </div>
  )
}
