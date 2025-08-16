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
  Calendar, 
  Users, 
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  Eye,
  Download,
  Upload
} from "lucide-react"

export default function DutySchedulePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAdding, setIsAdding] = useState(false)

  // Mock data untuk jadwal piket
  const dutySchedules = [
    {
      id: "DS-001",
      className: "X MIPA 1",
      date: "2024-02-15",
      day: "Kamis",
      students: [
        { name: "Ahmad Fadillah", duty: "Kebersihan Kelas", time: "07:00-07:30" },
        { name: "Siti Nurhaliza", duty: "Papan Tulis", time: "07:00-07:15" },
        { name: "Budi Santoso", duty: "Tempat Sampah", time: "07:00-07:20" }
      ],
      teacher: "Dr. Siti Aminah, M.Pd",
      status: "completed"
    },
    {
      id: "DS-002",
      className: "X MIPA 2",
      date: "2024-02-15",
      day: "Kamis",
      students: [
        { name: "Rina Sari", duty: "Kebersihan Kelas", time: "07:00-07:30" },
        { name: "Dewi Putri", duty: "Papan Tulis", time: "07:00-07:15" },
        { name: "Muhammad Rizki", duty: "Tempat Sampah", time: "07:00-07:20" }
      ],
      teacher: "Drs. Bambang Sutrisno",
      status: "completed"
    },
    {
      id: "DS-003",
      className: "X IPS 1",
      date: "2024-02-15",
      day: "Kamis",
      students: [
        { name: "Indra Kusuma", duty: "Kebersihan Kelas", time: "07:00-07:30" },
        { name: "Nina Safitri", duty: "Papan Tulis", time: "07:00-07:15" },
        { name: "Ahmad Hidayat", duty: "Tempat Sampah", time: "07:00-07:20" }
      ],
      teacher: "Dra. Indira Sari",
      status: "completed"
    },
    {
      id: "DS-004",
      className: "XI MIPA 1",
      date: "2024-02-16",
      day: "Jumat",
      students: [
        { name: "Putri Wulandari", duty: "Kebersihan Kelas", time: "07:00-07:30" },
        { name: "Rizki Pratama", duty: "Papan Tulis", time: "07:00-07:15" },
        { name: "Sari Indah", duty: "Tempat Sampah", time: "07:00-07:20" }
      ],
      teacher: "Dra. Rina Dewi",
      status: "pending"
    },
    {
      id: "DS-005",
      className: "XI IPS 1",
      date: "2024-02-16",
      day: "Jumat",
      students: [
        { name: "Budi Setiawan", duty: "Kebersihan Kelas", time: "07:00-07:30" },
        { name: "Dewi Sartika", duty: "Papan Tulis", time: "07:00-07:15" },
        { name: "Ahmad Fauzi", duty: "Tempat Sampah", time: "07:00-07:20" }
      ],
      teacher: "Drs. Ahmad Rizki",
      status: "pending"
    },
    {
      id: "DS-006",
      className: "XII MIPA 1",
      date: "2024-02-17",
      day: "Sabtu",
      students: [
        { name: "Nurul Hidayah", duty: "Kebersihan Kelas", time: "07:00-07:30" },
        { name: "Rizki Ramadhan", duty: "Papan Tulis", time: "07:00-07:15" },
        { name: "Siti Aisyah", duty: "Tempat Sampah", time: "07:00-07:20" }
      ],
      teacher: "Dra. Siti Nurhaliza",
      status: "pending"
    }
  ]

  // Mock data untuk jenis tugas
  const dutyTypes = [
    { id: "class-cleanup", name: "Kebersihan Kelas", description: "Membersihkan lantai, meja, dan kursi" },
    { id: "whiteboard", name: "Papan Tulis", description: "Membersihkan dan menyiapkan papan tulis" },
    { id: "trash", name: "Tempat Sampah", description: "Mengosongkan dan membersihkan tempat sampah" },
    { id: "windows", name: "Jendela", description: "Membersihkan jendela dan kaca" },
    { id: "plants", name: "Tanaman", description: "Menyiram dan merawat tanaman di kelas" }
  ]

  // Mock data untuk kelas
  const classes = [
    "X MIPA 1",
    "X MIPA 2",
    "X IPS 1",
    "XI MIPA 1",
    "XI IPS 1",
    "XII MIPA 1"
  ]

  // Mock data untuk siswa
  const students = [
    "Ahmad Fadillah",
    "Siti Nurhaliza",
    "Budi Santoso",
    "Rina Sari",
    "Dewi Putri",
    "Muhammad Rizki",
    "Indra Kusuma",
    "Nina Safitri",
    "Ahmad Hidayat",
    "Putri Wulandari",
    "Rizki Pratama",
    "Sari Indah",
    "Budi Setiawan",
    "Dewi Sartika",
    "Ahmad Fauzi",
    "Nurul Hidayah",
    "Rizki Ramadhan",
    "Siti Aisyah"
  ]

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Selesai</Badge>
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>
      case "in-progress":
        return <Badge variant="outline">Sedang Berlangsung</Badge>
      default:
        return <Badge variant="outline">Tidak Diketahui</Badge>
    }
  }

  // Get day badge
  const getDayBadge = (day: string) => {
    const dayColors: { [key: string]: string } = {
      "Senin": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      "Selasa": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      "Rabu": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      "Kamis": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      "Jumat": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      "Sabtu": "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
    
    return (
      <Badge className={dayColors[day] || "bg-gray-100 text-gray-700"}>
        {day}
      </Badge>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jadwal Piket Kelas</h1>
          <p className="text-muted-foreground">Kelola jadwal piket dan tugas kebersihan kelas</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
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
                Tambah Jadwal
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jadwal</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dutySchedules.length}</div>
            <p className="text-xs text-muted-foreground">
              Jadwal aktif
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selesai Hari Ini</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dutySchedules.filter(ds => ds.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Dari total jadwal
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {dutySchedules.filter(ds => ds.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Belum dikerjakan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dutySchedules.reduce((sum, ds) => sum + ds.students.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Bertugas hari ini
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Schedule Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Tambah Jadwal Piket Baru
            </CardTitle>
            <CardDescription>Isi informasi jadwal piket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduleClass">Kelas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduleDate">Tanggal</Label>
                <Input id="scheduleDate" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduleTeacher">Guru Pengawas</Label>
                <Input id="scheduleTeacher" placeholder="Nama guru pengawas" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduleStatus">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="in-progress">Sedang Berlangsung</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduleStudents">Siswa yang Bertugas</Label>
              <div className="space-y-2">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="grid grid-cols-3 gap-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih siswa" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student} value={student}>
                            {student}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tugas" />
                      </SelectTrigger>
                      <SelectContent>
                        {dutyTypes.map((duty) => (
                          <SelectItem key={duty.id} value={duty.id}>
                            {duty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Waktu (07:00-07:30)" />
                  </div>
                ))}
              </div>
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

      {/* Duty Schedule Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detail Jadwal</TabsTrigger>
          <TabsTrigger value="reports">Laporan</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Jadwal Piket Hari Ini
              </CardTitle>
              <CardDescription>Ringkasan jadwal piket semua kelas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Hari</TableHead>
                    <TableHead>Jumlah Siswa</TableHead>
                    <TableHead>Guru Pengawas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dutySchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.className}</TableCell>
                      <TableCell>{schedule.date}</TableCell>
                      <TableCell>{getDayBadge(schedule.day)}</TableCell>
                      <TableCell>{schedule.students.length}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{schedule.teacher}</TableCell>
                      <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
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
            {dutySchedules.map((schedule) => (
              <Card key={schedule.id} className="p-4">
                <CardHeader className="p-0 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{schedule.className}</CardTitle>
                    {getDayBadge(schedule.day)}
                  </div>
                  <CardDescription className="text-sm">
                    {schedule.date} • {schedule.teacher}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <div>
                    <span className="text-muted-foreground text-sm">Siswa yang Bertugas:</span>
                    <div className="space-y-2 mt-2">
                      {schedule.students.map((student, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{student.name}</span>
                          <span className="text-muted-foreground">{student.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Tugas:</span>
                    <div className="space-y-1 mt-1">
                      {schedule.students.map((student, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          • {student.duty}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>{getStatusBadge(schedule.status)}</div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Laporan Piket Kelas
              </CardTitle>
              <CardDescription>Statistik dan laporan piket kelas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Weekly Summary */}
                <div>
                  <h4 className="font-medium mb-4">Ringkasan Mingguan</h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">Senin</div>
                        <p className="text-sm text-muted-foreground">6 Kelas</p>
                        <p className="text-xs text-green-600">100% Selesai</p>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">Selasa</div>
                        <p className="text-sm text-muted-foreground">6 Kelas</p>
                        <p className="text-xs text-green-600">100% Selesai</p>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">Rabu</div>
                        <p className="text-sm text-muted-foreground">6 Kelas</p>
                        <p className="text-xs text-green-600">100% Selesai</p>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">Kamis</div>
                        <p className="text-sm text-muted-foreground">3 Kelas</p>
                        <p className="text-xs text-green-600">100% Selesai</p>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Duty Type Distribution */}
                <div>
                  <h4 className="font-medium mb-4">Distribusi Jenis Tugas</h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {dutyTypes.map((duty) => (
                      <Card key={duty.id} className="p-4">
                        <CardHeader className="p-0 pb-2">
                          <CardTitle className="text-lg">{duty.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {duty.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="text-2xl font-bold text-blue-600">
                            {dutySchedules.reduce((sum, schedule) => 
                              sum + schedule.students.filter(s => s.duty === duty.name).length, 0
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">Siswa bertugas</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Export Options */}
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Opsi Export</h4>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Excel
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Jadwal Mingguan
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
