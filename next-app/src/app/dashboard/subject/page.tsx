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
import { Textarea } from "@/components/ui/textarea"
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Filter
} from "lucide-react"

export default function SubjectPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data untuk mata pelajaran
  const subjects = [
    {
      id: "MATH-001",
      code: "MATH",
      name: "Matematika",
      description: "Mata pelajaran matematika dasar dan lanjutan",
      category: "IPA",
      grade: "X, XI, XII",
      credits: 4,
      teacher: "Dr. Siti Aminah, M.Pd",
      totalStudents: 456,
      totalClasses: 12,
      status: "active"
    },
    {
      id: "PHY-002",
      code: "PHY",
      name: "Fisika",
      description: "Mata pelajaran fisika dengan praktikum laboratorium",
      category: "IPA",
      grade: "X, XI, XII",
      credits: 4,
      teacher: "Drs. Bambang Sutrisno",
      totalStudents: 398,
      totalClasses: 11,
      status: "active"
    },
    {
      id: "CHEM-003",
      code: "CHEM",
      name: "Kimia",
      description: "Mata pelajaran kimia dengan eksperimen laboratorium",
      category: "IPA",
      grade: "X, XI, XII",
      credits: 4,
      teacher: "Dra. Indira Sari",
      totalStudents: 398,
      totalClasses: 11,
      status: "active"
    },
    {
      id: "BIO-004",
      code: "BIO",
      name: "Biologi",
      description: "Mata pelajaran biologi dengan praktikum",
      category: "IPA",
      grade: "X, XI, XII",
      credits: 4,
      teacher: "Dra. Rina Dewi",
      totalStudents: 398,
      totalClasses: 11,
      status: "active"
    },
    {
      id: "ECO-005",
      code: "ECO",
      name: "Ekonomi",
      description: "Mata pelajaran ekonomi dasar dan aplikasi",
      category: "IPS",
      grade: "X, XI, XII",
      credits: 3,
      teacher: "Drs. Ahmad Rizki",
      totalStudents: 320,
      totalClasses: 9,
      status: "active"
    },
    {
      id: "HIST-006",
      code: "HIST",
      name: "Sejarah",
      description: "Mata pelajaran sejarah Indonesia dan dunia",
      category: "IPS",
      grade: "X, XI, XII",
      credits: 3,
      teacher: "Dra. Siti Nurhaliza",
      totalStudents: 320,
      totalClasses: 9,
      status: "active"
    },
    {
      id: "GEO-007",
      code: "GEO",
      name: "Geografi",
      description: "Mata pelajaran geografi fisik dan sosial",
      category: "IPS",
      grade: "X, XI, XII",
      credits: 3,
      teacher: "Drs. Budi Santoso",
      totalStudents: 320,
      totalClasses: 9,
      status: "active"
    },
    {
      id: "IND-008",
      code: "IND",
      name: "Bahasa Indonesia",
      description: "Mata pelajaran bahasa Indonesia dan sastra",
      category: "Umum",
      grade: "X, XI, XII",
      credits: 3,
      teacher: "Dra. Sari Dewi",
      totalStudents: 1247,
      totalClasses: 36,
      status: "active"
    },
    {
      id: "ENG-009",
      code: "ENG",
      name: "Bahasa Inggris",
      description: "Mata pelajaran bahasa Inggris komunikatif",
      category: "Umum",
      grade: "X, XI, XII",
      credits: 3,
      teacher: "Mr. John Smith",
      totalStudents: 1247,
      totalClasses: 36,
      status: "active"
    }
  ]

  // Data guru yang tersedia
  const availableTeachers = [
    "Dr. Siti Aminah, M.Pd",
    "Drs. Bambang Sutrisno",
    "Dra. Indira Sari",
    "Dra. Rina Dewi",
    "Drs. Ahmad Rizki",
    "Dra. Siti Nurhaliza",
    "Drs. Budi Santoso",
    "Dra. Sari Dewi",
    "Mr. John Smith"
  ]

  // Filter mata pelajaran berdasarkan tab dan search
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "ipa") return subject.category === "IPA" && matchesSearch
    if (activeTab === "ips") return subject.category === "IPS" && matchesSearch
    if (activeTab === "umum") return subject.category === "Umum" && matchesSearch
    
    return matchesSearch
  })

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Mata Pelajaran</h1>
          <p className="text-muted-foreground">Kelola mata pelajaran dan kurikulum sekolah</p>
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
                Tambah Mata Pelajaran
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari mata pelajaran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Add New Subject Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Tambah Mata Pelajaran Baru
            </CardTitle>
            <CardDescription>Isi informasi mata pelajaran baru</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subjectCode">Kode Mata Pelajaran</Label>
                <Input id="subjectCode" placeholder="Contoh: MATH" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjectName">Nama Mata Pelajaran</Label>
                <Input id="subjectName" placeholder="Contoh: Matematika" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjectDescription">Deskripsi</Label>
              <Textarea 
                id="subjectDescription" 
                placeholder="Deskripsi singkat mata pelajaran"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subjectCategory">Kategori</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ipa">IPA</SelectItem>
                    <SelectItem value="ips">IPS</SelectItem>
                    <SelectItem value="umum">Umum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjectGrade">Kelas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="x">Kelas X</SelectItem>
                    <SelectItem value="xi">Kelas XI</SelectItem>
                    <SelectItem value="xii">Kelas XII</SelectItem>
                    <SelectItem value="all">Semua Kelas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjectCredits">SKS</Label>
                <Input id="subjectCredits" type="number" placeholder="4" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjectTeacher">Guru Pengampu</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih guru" />
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

      {/* Subjects Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Semua ({subjects.length})</TabsTrigger>
          <TabsTrigger value="ipa">IPA ({subjects.filter(s => s.category === "IPA").length})</TabsTrigger>
          <TabsTrigger value="ips">IPS ({subjects.filter(s => s.category === "IPS").length})</TabsTrigger>
          <TabsTrigger value="umum">Umum ({subjects.filter(s => s.category === "Umum").length})</TabsTrigger>
        </TabsList>

        {/* All Subjects Tab */}
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Daftar Semua Mata Pelajaran
              </CardTitle>
              <CardDescription>Total {filteredSubjects.length} mata pelajaran</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>SKS</TableHead>
                    <TableHead>Guru</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.code}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm text-muted-foreground">{subject.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subject.category === "IPA" ? "default" : subject.category === "IPS" ? "secondary" : "outline"}>
                          {subject.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{subject.grade}</TableCell>
                      <TableCell>{subject.credits}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{subject.teacher}</TableCell>
                      <TableCell>
                        <Badge variant={subject.status === "active" ? "default" : "secondary"}>
                          {subject.status === "active" ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* IPA Subjects Tab */}
        <TabsContent value="ipa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Mata Pelajaran IPA
              </CardTitle>
              <CardDescription>Mata pelajaran ilmu pengetahuan alam</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSubjects.map((subject) => (
                  <Card key={subject.id} className="p-4">
                    <CardHeader className="p-0 pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <Badge variant="default">{subject.code}</Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {subject.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Kelas:</span>
                          <p className="font-medium">{subject.grade}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">SKS:</span>
                          <p className="font-medium">{subject.credits}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">Guru:</span>
                        <p className="text-sm font-medium truncate">{subject.teacher}</p>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* IPS Subjects Tab */}
        <TabsContent value="ips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mata Pelajaran IPS
              </CardTitle>
              <CardDescription>Mata pelajaran ilmu pengetahuan sosial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSubjects.map((subject) => (
                  <Card key={subject.id} className="p-4">
                    <CardHeader className="p-0 pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <Badge variant="secondary">{subject.code}</Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {subject.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Kelas:</span>
                          <p className="font-medium">{subject.grade}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">SKS:</span>
                          <p className="font-medium">{subject.credits}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">Guru:</span>
                        <p className="text-sm font-medium truncate">{subject.teacher}</p>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Umum Subjects Tab */}
        <TabsContent value="umum" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Mata Pelajaran Umum
              </CardTitle>
              <CardDescription>Mata pelajaran wajib untuk semua jurusan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSubjects.map((subject) => (
                  <Card key={subject.id} className="p-4">
                    <CardHeader className="p-0 pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <Badge variant="outline">{subject.code}</Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {subject.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Kelas:</span>
                          <p className="font-medium">{subject.grade}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">SKS:</span>
                          <p className="font-medium">{subject.credits}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">Guru:</span>
                        <p className="text-sm font-medium truncate">{subject.teacher}</p>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
