'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  Calendar,
  Plus,
  Edit,
  Trash2
} from "lucide-react"

export function AcademicTab() {
  // Mock data untuk academic years
  const academicYears = [
    {
      id: 1,
      year: "2024/2025",
      status: "active",
      startDate: "2024-07-15",
      endDate: "2025-06-30",
      totalStudents: 1247,
      totalClasses: 36
    },
    {
      id: 2,
      year: "2023/2024",
      status: "completed",
      startDate: "2023-07-15",
      endDate: "2024-06-30",
      totalStudents: 1189,
      totalClasses: 34
    },
    {
      id: 3,
      year: "2022/2023",
      status: "completed",
      startDate: "2022-07-15",
      endDate: "2023-06-30",
      totalStudents: 1123,
      totalClasses: 32
    }
  ]

  // Mock data untuk subjects
  const subjects = [
    {
      id: 1,
      name: "Matematika",
      code: "MAT",
      grade: "X, XI, XII",
      teacher: "Dr. Ahmad Rizki, M.Pd",
      totalStudents: 1247
    },
    {
      id: 2,
      name: "Bahasa Indonesia",
      code: "BIN",
      grade: "X, XI, XII",
      teacher: "Dra. Siti Aminah, M.Pd",
      totalStudents: 1247
    },
    {
      id: 3,
      name: "Bahasa Inggris",
      code: "BIG",
      grade: "X, XI, XII",
      teacher: "Budi Santoso, S.Pd",
      totalStudents: 1247
    },
    {
      id: 4,
      name: "Fisika",
      code: "FIS",
      grade: "X, XI, XII",
      teacher: "Rina Sari, S.Pd",
      totalStudents: 1247
    }
  ]

  return (
    <div className="space-y-6">
      {/* Academic Years */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tahun Akademik
              </CardTitle>
              <CardDescription>
                Manajemen tahun akademik dan periode belajar
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Tahun Akademik
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {academicYears.map((year) => (
              <div key={year.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{year.year}</h4>
                    <Badge variant={year.status === 'active' ? 'default' : 'secondary'}>
                      {year.status === 'active' ? 'Aktif' : 'Selesai'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {year.startDate} - {year.endDate}
                  </p>
                  <div className="flex space-x-4 text-sm">
                    <span>Siswa: {year.totalStudents}</span>
                    <span>Kelas: {year.totalClasses}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Mata Pelajaran
              </CardTitle>
              <CardDescription>
                Daftar mata pelajaran yang diajarkan
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Mata Pelajaran
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{subject.name}</h4>
                    <Badge variant="outline">{subject.code}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kelas: {subject.grade}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Guru: {subject.teacher}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Siswa: {subject.totalStudents}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
