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
  CheckCircle, 
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  Download,
  Upload
} from "lucide-react"

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("today")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState("")

  // Mock data untuk kelas
  const classes = [
    { id: "X-MIPA-1", name: "X MIPA 1", totalStudents: 32, teacher: "Dr. Siti Aminah, M.Pd" },
    { id: "X-MIPA-2", name: "X MIPA 2", totalStudents: 30, teacher: "Drs. Bambang Sutrisno" },
    { id: "X-IPS-1", name: "X IPS 1", totalStudents: 28, teacher: "Dra. Indira Sari" },
    { id: "XI-MIPA-1", name: "XI MIPA 1", totalStudents: 31, teacher: "Dra. Rina Dewi" },
    { id: "XI-IPS-1", name: "XI IPS 1", totalStudents: 29, teacher: "Drs. Ahmad Rizki" },
    { id: "XII-MIPA-1", name: "XII MIPA 1", totalStudents: 33, teacher: "Dra. Siti Nurhaliza" }
  ]

  // Mock data untuk presensi hari ini
  const todayAttendance = [
    {
      id: "X-MIPA-1",
      className: "X MIPA 1",
      date: "2024-02-15",
      totalStudents: 32,
      present: 30,
      absent: 1,
      late: 1,
      teacher: "Dr. Siti Aminah, M.Pd",
      status: "completed"
    },
    {
      id: "X-MIPA-2",
      className: "X MIPA 2",
      date: "2024-02-15",
      totalStudents: 30,
      present: 28,
      absent: 2,
      late: 0,
      teacher: "Drs. Bambang Sutrisno",
      status: "completed"
    },
    {
      id: "X-IPS-1",
      className: "X IPS 1",
      date: "2024-02-15",
      totalStudents: 28,
      present: 26,
      absent: 1,
      late: 1,
      teacher: "Dra. Indira Sari",
      status: "completed"
    },
    {
      id: "XI-MIPA-1",
      className: "XI MIPA 1",
      date: "2024-02-15",
      totalStudents: 31,
      present: 29,
      absent: 2,
      late: 0,
      teacher: "Dra. Rina Dewi",
      status: "completed"
    },
    {
      id: "XI-IPS-1",
      className: "XI IPS 1",
      date: "2024-02-15",
      totalStudents: 29,
      present: 27,
      absent: 1,
      late: 1,
      teacher: "Drs. Ahmad Rizki",
      status: "completed"
    },
    {
      id: "XII-MIPA-1",
      className: "XII MIPA 1",
      date: "2024-02-15",
      totalStudents: 33,
      present: 31,
      absent: 1,
      late: 1,
      teacher: "Dra. Siti Nurhaliza",
      status: "completed"
    }
  ]

  // Mock data untuk detail presensi siswa
  const studentAttendance = [
    {
      id: "STU-001",
      name: "Ahmad Fadillah",
      nisn: "0012345678",
      status: "present",
      time: "07:25",
      note: ""
    },
    {
      id: "STU-002",
      name: "Siti Nurhaliza",
      nisn: "0012345679",
      status: "present",
      time: "07:30",
      note: ""
    },
    {
      id: "STU-003",
      name: "Budi Santoso",
      nisn: "0012345680",
      status: "late",
      time: "07:45",
      note: "Macet di jalan"
    },
    {
      id: "STU-004",
      name: "Rina Sari",
      nisn: "0012345681",
      status: "absent",
      time: "-",
      note: "Sakit"
    }
  ]

  // Mock data untuk laporan presensi
  const attendanceReports = [
    {
      id: "REP-001",
      period: "Januari 2024",
      totalDays: 22,
      totalStudents: 1247,
      averageAttendance: 95.2,
      totalAbsent: 62,
      totalLate: 45,
      status: "completed"
    },
    {
      id: "REP-002",
      period: "Februari 2024",
      totalDays: 20,
      totalStudents: 1247,
      averageAttendance: 94.8,
      totalAbsent: 65,
      totalLate: 52,
      status: "in-progress"
    }
  ]

  // Status presensi
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Hadir</Badge>
      case "absent":
        return <Badge variant="destructive">Tidak Hadir</Badge>
      case "late":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">Terlambat</Badge>
      case "sick":
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Sakit</Badge>
      default:
        return <Badge variant="outline">Belum Diisi</Badge>
    }
  }

  // Status laporan
  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Selesai</Badge>
      case "in-progress":
        return <Badge variant="secondary">Sedang Berlangsung</Badge>
      default:
        return <Badge variant="outline">Belum Dimulai</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Presensi</h1>
          <p className="text-muted-foreground">Kelola presensi siswa dan laporan kehadiran</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Presensi
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              Aktif hari ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hadir</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,182</div>
            <p className="text-xs text-muted-foreground">
              94.8% dari total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tidak Hadir</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">65</div>
            <p className="text-xs text-muted-foreground">
              5.2% dari total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">52</div>
            <p className="text-xs text-muted-foreground">
              4.2% dari total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classFilter">Kelas</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFilter">Tanggal</Label>
              <Input
                id="dateFilter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchFilter">Cari Siswa</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchFilter"
                  placeholder="Cari nama atau NISN..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Presensi Hari Ini</TabsTrigger>
          <TabsTrigger value="detail">Detail Presensi</TabsTrigger>
          <TabsTrigger value="reports">Laporan</TabsTrigger>
        </TabsList>

        {/* Today's Attendance Tab */}
        <TabsContent value="today" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Presensi Hari Ini - {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardTitle>
              <CardDescription>Ringkasan presensi semua kelas hari ini</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Guru</TableHead>
                    <TableHead>Total Siswa</TableHead>
                    <TableHead>Hadir</TableHead>
                    <TableHead>Tidak Hadir</TableHead>
                    <TableHead>Terlambat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAttendance.map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell className="font-medium">{attendance.className}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{attendance.teacher}</TableCell>
                      <TableCell>{attendance.totalStudents}</TableCell>
                      <TableCell className="text-green-600 font-medium">{attendance.present}</TableCell>
                      <TableCell className="text-red-600 font-medium">{attendance.absent}</TableCell>
                      <TableCell className="text-yellow-600 font-medium">{attendance.late}</TableCell>
                      <TableCell>
                        <Badge variant={attendance.status === "completed" ? "default" : "secondary"}>
                          {attendance.status === "completed" ? "Selesai" : "Belum Selesai"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
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

        {/* Detail Attendance Tab */}
        <TabsContent value="detail" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Detail Presensi Siswa
              </CardTitle>
              <CardDescription>Detail presensi per siswa per kelas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NISN</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentAttendance.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.nisn}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell>{student.time}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{student.note}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
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

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Laporan Presensi
              </CardTitle>
              <CardDescription>Laporan presensi per periode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Laporan Periode</h4>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Laporan Baru
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {attendanceReports.map((report) => (
                    <Card key={report.id} className="p-4">
                      <CardHeader className="p-0 pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{report.period}</CardTitle>
                          {getReportStatusBadge(report.status)}
                        </div>
                        <CardDescription className="text-sm">
                          Laporan presensi {report.period}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total Hari:</span>
                            <p className="font-medium">{report.totalDays}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total Siswa:</span>
                            <p className="font-medium">{report.totalStudents}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Rata-rata:</span>
                            <p className="font-medium text-green-600">{report.averageAttendance}%</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tidak Hadir:</span>
                            <p className="font-medium text-red-600">{report.totalAbsent}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-sm">Terlambat:</span>
                          <p className="text-sm font-medium text-yellow-600">{report.totalLate}</p>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
