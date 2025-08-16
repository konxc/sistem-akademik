"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Building, 
  Users, 
  GraduationCap, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  Eye
} from "lucide-react"

export default function ClassPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAdding, setIsAdding] = useState(false)

  // Mock data untuk kelas
  const classes = [
    {
      id: "X-MIPA-1",
      name: "X MIPA 1",
      stream: "IPA",
      grade: "X",
      totalStudents: 32,
      maxStudents: 36,
      teacher: "Dr. Siti Aminah, M.Pd",
      room: "Lab 101",
      schedule: "Senin-Jumat 07:00-14:30",
      status: "active"
    },
    {
      id: "X-MIPA-2",
      name: "X MIPA 2",
      stream: "IPA",
      grade: "X",
      totalStudents: 30,
      maxStudents: 36,
      teacher: "Drs. Bambang Sutrisno",
      room: "Lab 102",
      schedule: "Senin-Jumat 07:00-14:30",
      status: "active"
    },
    {
      id: "X-IPS-1",
      name: "X IPS 1",
      stream: "IPS",
      grade: "X",
      totalStudents: 28,
      maxStudents: 36,
      teacher: "Dra. Indira Sari",
      room: "Kelas 201",
      schedule: "Senin-Jumat 07:00-14:30",
      status: "active"
    },
    {
      id: "XI-MIPA-1",
      name: "XI MIPA 1",
      stream: "IPA",
      grade: "XI",
      totalStudents: 31,
      maxStudents: 36,
      teacher: "Dra. Rina Dewi",
      room: "Lab 103",
      schedule: "Senin-Jumat 07:00-14:30",
      status: "active"
    },
    {
      id: "XI-IPS-1",
      name: "XI IPS 1",
      stream: "IPS",
      grade: "XI",
      totalStudents: 29,
      maxStudents: 36,
      teacher: "Drs. Ahmad Rizki",
      room: "Kelas 202",
      schedule: "Senin-Jumat 07:00-14:30",
      status: "active"
    },
    {
      id: "XII-MIPA-1",
      name: "XII MIPA 1",
      stream: "IPA",
      grade: "XII",
      totalStudents: 33,
      maxStudents: 36,
      teacher: "Dra. Siti Nurhaliza",
      room: "Lab 104",
      schedule: "Senin-Jumat 07:00-14:30",
      status: "active"
    }
  ]

  // Mock data untuk guru yang tersedia
  const availableTeachers = [
    "Dr. Siti Aminah, M.Pd",
    "Drs. Bambang Sutrisno",
    "Dra. Indira Sari",
    "Dra. Rina Dewi",
    "Drs. Ahmad Rizki",
    "Dra. Siti Nurhaliza"
  ]

  // Mock data untuk ruangan yang tersedia
  const availableRooms = [
    "Lab 101",
    "Lab 102", 
    "Lab 103",
    "Lab 104",
    "Kelas 201",
    "Kelas 202",
    "Kelas 203",
    "Kelas 204"
  ]

  // Mock data untuk jurusan
  const streams = [
    { id: "ipa", name: "Ilmu Pengetahuan Alam (IPA)" },
    { id: "ips", name: "Ilmu Pengetahuan Sosial (IPS)" },
    { id: "bahasa", name: "Bahasa dan Budaya" }
  ]

  // Mock data untuk grade
  const grades = [
    { id: "x", name: "Kelas X" },
    { id: "xi", name: "Kelas XI" },
    { id: "xii", name: "Kelas XII" }
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Kelas</h1>
          <p className="text-muted-foreground">Kelola kelas, siswa, dan pengaturan kelas</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Batal
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kelas
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              Kelas aktif
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((sum, cls) => sum + cls.totalStudents, 0)}</div>
            <p className="text-xs text-muted-foreground">
              Siswa aktif
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Siswa/Kelas</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(classes.reduce((sum, cls) => sum + cls.totalStudents, 0) / classes.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per kelas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kapasitas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((classes.reduce((sum, cls) => sum + cls.totalStudents, 0) / classes.reduce((sum, cls) => sum + cls.maxStudents, 0)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Terisi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Class Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Tambah Kelas Baru
            </CardTitle>
            <CardDescription>Isi informasi kelas baru</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="className">Nama Kelas</Label>
                <Input id="className" placeholder="Contoh: X MIPA 1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classGrade">Grade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.id} value={grade.id}>
                        {grade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="classStream">Jurusan</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jurusan" />
                  </SelectTrigger>
                  <SelectContent>
                    {streams.map((stream) => (
                      <SelectItem key={stream.id} value={stream.id}>
                        {stream.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Maksimal Siswa</Label>
                <Input id="maxStudents" type="number" placeholder="36" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="classTeacher">Wali Kelas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih wali kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeachers.map((teacher) => (
                      <SelectItem key={teacher} value={teacher}>
                        {teacher}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="classRoom">Ruangan</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih ruangan" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classSchedule">Jadwal</Label>
              <Input id="classSchedule" placeholder="Contoh: Senin-Jumat 07:00-14:30" />
            </div>
            <div className="flex space-x-2">
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Class Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detail Kelas</TabsTrigger>
          <TabsTrigger value="students">Siswa</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Daftar Kelas
              </CardTitle>
              <CardDescription>Ringkasan semua kelas aktif</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Kelas</TableHead>
                    <TableHead>Jurusan</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Siswa</TableHead>
                    <TableHead>Wali Kelas</TableHead>
                    <TableHead>Ruangan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>
                        <Badge variant={cls.stream === "IPA" ? "default" : cls.stream === "IPS" ? "secondary" : "outline"}>
                          {cls.stream}
                        </Badge>
                      </TableCell>
                      <TableCell>{cls.grade}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{cls.totalStudents}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-muted-foreground">{cls.maxStudents}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{cls.teacher}</TableCell>
                      <TableCell>{cls.room}</TableCell>
                      <TableCell>
                        <Badge variant={cls.status === "active" ? "default" : "secondary"}>
                          {cls.status === "active" ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Card key={cls.id} className="p-4">
                <CardHeader className="p-0 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cls.name}</CardTitle>
                    <Badge variant={cls.stream === "IPA" ? "default" : cls.stream === "IPS" ? "secondary" : "outline"}>
                      {cls.stream}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    Grade {cls.grade} • {cls.room}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Siswa:</span>
                      <p className="font-medium">{cls.totalStudents}/{cls.maxStudents}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Kapasitas:</span>
                      <p className="font-medium">{Math.round((cls.totalStudents / cls.maxStudents) * 100)}%</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Wali Kelas:</span>
                    <p className="text-sm font-medium truncate">{cls.teacher}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Jadwal:</span>
                    <p className="text-sm font-medium">{cls.schedule}</p>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Detail
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Manajemen Siswa per Kelas
              </CardTitle>
              <CardDescription>Kelola siswa dalam setiap kelas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{cls.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cls.totalStudents} siswa • {cls.teacher}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Siswa
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Siswa
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Siswa:</span>
                        <p className="font-medium">{cls.totalStudents}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Kapasitas:</span>
                        <p className="font-medium">{cls.maxStudents}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tersisa:</span>
                        <p className="font-medium">{cls.maxStudents - cls.totalStudents}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={cls.totalStudents >= cls.maxStudents ? "destructive" : "default"} className="ml-2">
                          {cls.totalStudents >= cls.maxStudents ? "Penuh" : "Tersedia"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
