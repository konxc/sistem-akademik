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
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react"

export default function SchoolManagementPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)

  // Mock data untuk sekolah
  const schoolData = {
    name: "SMA UII Yogyakarta",
    address: "Jl. Kaliurang KM 14.5, Sleman, Yogyakarta",
    phone: "0274-895123",
    email: "info@sma-uii.ac.id",
    website: "www.sma-uii.ac.id",
    established: "1995",
    accreditation: "A",
    principal: "Drs. Ahmad Rizki, M.Pd",
    vicePrincipal: "Dra. Siti Aminah, M.Pd",
    totalStudents: 1247,
    totalTeachers: 89,
    totalStaff: 45,
    totalClasses: 36
  }

  // Data tahun ajaran
  const academicYears = [
    {
      id: "2024-2025",
      name: "Tahun Ajaran 2024/2025",
      startDate: "2024-07-15",
      endDate: "2025-06-30",
      status: "active",
      semester: "Semester 1"
    },
    {
      id: "2023-2024",
      name: "Tahun Ajaran 2023/2024",
      startDate: "2023-07-15",
      endDate: "2024-06-30",
      status: "completed",
      semester: "Semester 2"
    }
  ]

  // Data struktur organisasi
  const organizationalStructure = [
    {
      position: "Kepala Sekolah",
      name: "Drs. Ahmad Rizki, M.Pd",
      email: "kepsek@sma-uii.ac.id",
      phone: "0274-895123",
      department: "Manajemen"
    },
    {
      position: "Wakil Kepala Sekolah",
      name: "Dra. Siti Aminah, M.Pd",
      email: "wakasek@sma-uii.ac.id",
      phone: "0274-895124",
      department: "Akademik"
    },
    {
      position: "Kepala TU",
      name: "Budi Santoso, S.Pd",
      email: "katu@sma-uii.ac.id",
      phone: "0274-895125",
      department: "Administrasi"
    },
    {
      position: "Kepala Perpustakaan",
      name: "Rina Sari, S.Pd",
      email: "kapus@sma-uii.ac.id",
      phone: "0274-895126",
      department: "Perpustakaan"
    }
  ]

  // Data jurusan/stream
  const streams = [
    {
      id: "ipa",
      name: "Ilmu Pengetahuan Alam (IPA)",
      description: "Jurusan untuk siswa yang ingin melanjutkan ke perguruan tinggi bidang sains dan teknologi",
      totalStudents: 456,
      totalClasses: 12,
      subjects: ["Matematika", "Fisika", "Kimia", "Biologi"]
    },
    {
      id: "ips",
      name: "Ilmu Pengetahuan Sosial (IPS)",
      description: "Jurusan untuk siswa yang ingin melanjutkan ke perguruan tinggi bidang sosial dan ekonomi",
      totalStudents: 398,
      totalClasses: 11,
      subjects: ["Ekonomi", "Sejarah", "Geografi", "Sosiologi"]
    },
    {
      id: "bahasa",
      name: "Bahasa dan Budaya",
      description: "Jurusan untuk siswa yang ingin melanjutkan ke perguruan tinggi bidang bahasa dan budaya",
      totalStudents: 193,
      totalClasses: 5,
      subjects: ["Bahasa Indonesia", "Bahasa Inggris", "Bahasa Arab", "Sastra"]
    }
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Sekolah</h1>
          <p className="text-muted-foreground">Pengaturan dan konfigurasi sekolah</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Globe className="h-4 w-4 mr-2" />
            Website
          </Button>
          <Button size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Batal
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Akademik</TabsTrigger>
          <TabsTrigger value="organization">Organisasi</TabsTrigger>
          <TabsTrigger value="streams">Jurusan</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* School Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informasi Sekolah
              </CardTitle>
              <CardDescription>Data dasar sekolah</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">Nama Sekolah</Label>
                  <Input 
                    id="schoolName" 
                    defaultValue={schoolData.name}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="established">Tahun Berdiri</Label>
                  <Input 
                    id="established" 
                    defaultValue={schoolData.established}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolAddress">Alamat</Label>
                <Input 
                  id="schoolAddress" 
                  defaultValue={schoolData.address}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolPhone">Telepon</Label>
                  <Input 
                    id="schoolPhone" 
                    defaultValue={schoolData.phone}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolEmail">Email</Label>
                  <Input 
                    id="schoolEmail" 
                    defaultValue={schoolData.email}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolWebsite">Website</Label>
                  <Input 
                    id="schoolWebsite" 
                    defaultValue={schoolData.website}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accreditation">Akreditasi</Label>
                  <Input 
                    id="accreditation" 
                    defaultValue={schoolData.accreditation}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <Button size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schoolData.totalStudents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Aktif tahun ajaran ini
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schoolData.totalTeachers}</div>
                <p className="text-xs text-muted-foreground">
                  Guru tetap dan honorer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schoolData.totalClasses}</div>
                <p className="text-xs text-muted-foreground">
                  Kelas aktif
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schoolData.totalStaff}</div>
                <p className="text-xs text-muted-foreground">
                  Staff administrasi
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Academic Tab */}
        <TabsContent value="academic" className="space-y-6">
          {/* Academic Year Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tahun Ajaran
              </CardTitle>
              <CardDescription>Manajemen tahun ajaran aktif</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Tahun Ajaran Aktif</h4>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Tahun Ajaran
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tahun Ajaran</TableHead>
                      <TableHead>Periode</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {academicYears.map((year) => (
                      <TableRow key={year.id}>
                        <TableCell className="font-medium">{year.name}</TableCell>
                        <TableCell>{year.startDate} - {year.endDate}</TableCell>
                        <TableCell>
                          <Badge variant={year.status === "active" ? "default" : "secondary"}>
                            {year.status === "active" ? "Aktif" : "Selesai"}
                          </Badge>
                        </TableCell>
                        <TableCell>{year.semester}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-6">
          {/* Organizational Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Struktur Organisasi
              </CardTitle>
              <CardDescription>Jabatan dan struktur kepemimpinan sekolah</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Jabatan Kepemimpinan</h4>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Jabatan
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead>Departemen</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizationalStructure.map((position, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{position.position}</TableCell>
                        <TableCell>{position.name}</TableCell>
                        <TableCell>{position.email}</TableCell>
                        <TableCell>{position.phone}</TableCell>
                        <TableCell>{position.department}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Streams Tab */}
        <TabsContent value="streams" className="space-y-6">
          {/* Academic Streams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Jurusan/Program Studi
              </CardTitle>
              <CardDescription>Manajemen jurusan dan program studi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Daftar Jurusan</h4>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Jurusan
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {streams.map((stream) => (
                    <Card key={stream.id} className="p-4">
                      <CardHeader className="p-0 pb-4">
                        <CardTitle className="text-lg">{stream.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {stream.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Siswa:</span>
                            <p className="font-medium">{stream.totalStudents}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Kelas:</span>
                            <p className="font-medium">{stream.totalClasses}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-sm">Mata Pelajaran:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {stream.subjects.map((subject, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
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
