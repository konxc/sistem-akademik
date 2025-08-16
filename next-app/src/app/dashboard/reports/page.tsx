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
  FileText, 
  BarChart3, 
  TrendingUp, 
  Users,
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  Printer
} from "lucide-react"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("attendance")
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [selectedClass, setSelectedClass] = useState("")

  // Mock data untuk periode
  const periods = [
    "Januari 2024",
    "Februari 2024",
    "Maret 2024",
    "Semester 1 2023/2024",
    "Semester 2 2023/2024"
  ]

  // Mock data untuk kelas
  const classes = [
    "Semua Kelas",
    "X MIPA 1",
    "X MIPA 2", 
    "X IPS 1",
    "XI MIPA 1",
    "XI IPS 1",
    "XII MIPA 1"
  ]

  // Mock data untuk laporan presensi
  const attendanceReports = [
    {
      id: "ATT-001",
      period: "Januari 2024",
      class: "Semua Kelas",
      totalStudents: 1247,
      totalDays: 22,
      averageAttendance: 95.2,
      totalPresent: 26134,
      totalAbsent: 1310,
      totalLate: 940,
      status: "completed"
    },
    {
      id: "ATT-002",
      period: "Februari 2024",
      class: "Semua Kelas",
      totalStudents: 1247,
      totalDays: 20,
      averageAttendance: 94.8,
      totalPresent: 23656,
      totalAbsent: 1300,
      totalLate: 1044,
      status: "in-progress"
    }
  ]

  // Mock data untuk laporan nilai
  const gradeReports = [
    {
      id: "GRD-001",
      period: "Semester 1 2023/2024",
      class: "X MIPA 1",
      subject: "Matematika",
      totalStudents: 32,
      averageGrade: 85.6,
      highestGrade: 98,
      lowestGrade: 72,
      passRate: 96.9,
      status: "completed"
    },
    {
      id: "GRD-002",
      period: "Semester 1 2023/2024",
      class: "X MIPA 1",
      subject: "Fisika",
      totalStudents: 32,
      averageGrade: 82.3,
      highestGrade: 95,
      lowestGrade: 68,
      passRate: 93.8,
      status: "completed"
    },
    {
      id: "GRD-003",
      period: "Semester 1 2023/2024",
      class: "X MIPA 1",
      subject: "Kimia",
      totalStudents: 32,
      averageGrade: 80.1,
      highestGrade: 92,
      lowestGrade: 65,
      passRate: 90.6,
      status: "completed"
    }
  ]

  // Mock data untuk laporan keuangan
  const financialReports = [
    {
      id: "FIN-001",
      period: "Januari 2024",
      class: "Semua Kelas",
      totalStudents: 1247,
      totalFees: 124700000,
      paidFees: 118465000,
      unpaidFees: 6235000,
      paymentRate: 95.0,
      status: "completed"
    },
    {
      id: "FIN-002",
      period: "Februari 2024",
      class: "Semua Kelas",
      totalStudents: 1247,
      totalFees: 124700000,
      paidFees: 112230000,
      unpaidFees: 12470000,
      paymentRate: 90.0,
      status: "in-progress"
    }
  ]

  // Mock data untuk statistik detail
  const detailedStats = [
    {
      category: "Presensi",
      total: 1247,
      present: 1182,
      absent: 65,
      percentage: 94.8
    },
    {
      category: "Nilai",
      total: 1247,
      excellent: 187,
      good: 623,
      average: 374,
      below: 63,
      percentage: 95.0
    },
    {
      category: "Keuangan",
      total: 1247,
      paid: 1185,
      unpaid: 62,
      percentage: 95.0
    }
  ]

  // Status laporan
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Selesai</Badge>
      case "in-progress":
        return <Badge variant="secondary">Sedang Berlangsung</Badge>
      default:
        return <Badge variant="outline">Belum Dimulai</Badge>
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan & Analisis</h1>
          <p className="text-muted-foreground">Laporan komprehensif dan analisis data sekolah</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Semua
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodFilter">Periode</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classFilter">Kelas</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
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
              <Label htmlFor="searchFilter">Cari Laporan</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchFilter"
                  placeholder="Cari laporan..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              Aktif semester ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Presensi</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">95.0%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">82.5</div>
            <p className="text-xs text-muted-foreground">
              +1.2 dari semester lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pembayaran</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92.5%</div>
            <p className="text-xs text-muted-foreground">
              +5.2% dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">Presensi</TabsTrigger>
          <TabsTrigger value="grades">Nilai</TabsTrigger>
          <TabsTrigger value="financial">Keuangan</TabsTrigger>
          <TabsTrigger value="analytics">Analisis</TabsTrigger>
        </TabsList>

        {/* Attendance Reports Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Laporan Presensi
              </CardTitle>
              <CardDescription>Laporan kehadiran siswa per periode</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Periode</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Total Siswa</TableHead>
                    <TableHead>Total Hari</TableHead>
                    <TableHead>Rata-rata Hadir</TableHead>
                    <TableHead>Total Tidak Hadir</TableHead>
                    <TableHead>Total Terlambat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.period}</TableCell>
                      <TableCell>{report.class}</TableCell>
                      <TableCell>{report.totalStudents.toLocaleString()}</TableCell>
                      <TableCell>{report.totalDays}</TableCell>
                      <TableCell className="text-green-600 font-medium">{report.averageAttendance}%</TableCell>
                      <TableCell className="text-red-600 font-medium">{report.totalAbsent.toLocaleString()}</TableCell>
                      <TableCell className="text-yellow-600 font-medium">{report.totalLate.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Printer className="h-4 w-4" />
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

        {/* Grades Reports Tab */}
        <TabsContent value="grades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Laporan Nilai
              </CardTitle>
              <CardDescription>Laporan nilai siswa per mata pelajaran</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Periode</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Mata Pelajaran</TableHead>
                    <TableHead>Total Siswa</TableHead>
                    <TableHead>Rata-rata</TableHead>
                    <TableHead>Nilai Tertinggi</TableHead>
                    <TableHead>Nilai Terendah</TableHead>
                    <TableHead>Tingkat Kelulusan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradeReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.period}</TableCell>
                      <TableCell>{report.class}</TableCell>
                      <TableCell>{report.subject}</TableCell>
                      <TableCell>{report.totalStudents}</TableCell>
                      <TableCell className="font-medium">{report.averageGrade}</TableCell>
                      <TableCell className="text-green-600 font-medium">{report.highestGrade}</TableCell>
                      <TableCell className="text-red-600 font-medium">{report.lowestGrade}</TableCell>
                      <TableCell className="text-blue-600 font-medium">{report.passRate}%</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Printer className="h-4 w-4" />
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

        {/* Financial Reports Tab */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Laporan Keuangan
              </CardTitle>
              <CardDescription>Laporan pembayaran dan keuangan siswa</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Periode</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Total Siswa</TableHead>
                    <TableHead>Total Tagihan</TableHead>
                    <TableHead>Sudah Bayar</TableHead>
                    <TableHead>Belum Bayar</TableHead>
                    <TableHead>Tingkat Pembayaran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.period}</TableCell>
                      <TableCell>{report.class}</TableCell>
                      <TableCell>{report.totalStudents.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(report.totalFees)}</TableCell>
                      <TableCell className="text-green-600 font-medium">{formatCurrency(report.paidFees)}</TableCell>
                      <TableCell className="text-red-600 font-medium">{formatCurrency(report.unpaidFees)}</TableCell>
                      <TableCell className="text-blue-600 font-medium">{report.paymentRate}%</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Printer className="h-4 w-4" />
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analisis Data
              </CardTitle>
              <CardDescription>Analisis komprehensif performa sekolah</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Detailed Statistics */}
                <div>
                  <h4 className="font-medium mb-4">Statistik Detail</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    {detailedStats.map((stat, index) => (
                      <Card key={index} className="p-4">
                        <CardHeader className="p-0 pb-4">
                          <CardTitle className="text-lg">{stat.category}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Total:</span>
                              <p className="font-medium">{stat.total}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Persentase:</span>
                              <p className="font-medium text-green-600">{stat.percentage}%</p>
                            </div>
                          </div>
                          {stat.category === "Nilai" && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">A:</span>
                                <p className="font-medium text-green-600">{stat.excellent}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">B:</span>
                                <p className="font-medium text-blue-600">{stat.good}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">C:</span>
                                <p className="font-medium text-yellow-600">{stat.average}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">D:</span>
                                <p className="font-medium text-red-600">{stat.below}</p>
                              </div>
                            </div>
                          )}
                          {stat.category === "Presensi" && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Hadir:</span>
                                <p className="font-medium text-green-600">{stat.present}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Tidak Hadir:</span>
                                <p className="font-medium text-red-600">{stat.absent}</p>
                              </div>
                            </div>
                          )}
                          {stat.category === "Keuangan" && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Lunas:</span>
                                <p className="font-medium text-green-600">{stat.paid}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Belum Lunas:</span>
                                <p className="font-medium text-red-600">{stat.unpaid}</p>
                              </div>
                            </div>
                          )}
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
                      <Printer className="h-4 w-4 mr-2" />
                      Print Report
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
