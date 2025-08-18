'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  Users,
  Plus,
  Edit,
  Trash2
} from "lucide-react"

export function ProgramTab() {
  // Mock data untuk academic streams/majors
  const streams = [
    {
      id: 1,
      name: "IPA (Ilmu Pengetahuan Alam)",
      description: "Program studi dengan fokus pada mata pelajaran sains dan matematika",
      totalStudents: 450,
      totalClasses: 15,
      subjects: ["Matematika", "Fisika", "Kimia", "Biologi"]
    },
    {
      id: 2,
      name: "IPS (Ilmu Pengetahuan Sosial)",
      description: "Program studi dengan fokus pada mata pelajaran sosial dan ekonomi",
      totalStudents: 380,
      totalClasses: 13,
      subjects: ["Ekonomi", "Sejarah", "Geografi", "Sosiologi"]
    },
    {
      id: 3,
      name: "Bahasa",
      description: "Program studi dengan fokus pada mata pelajaran bahasa dan sastra",
      totalStudents: 200,
      totalClasses: 7,
      subjects: ["Bahasa Indonesia", "Bahasa Inggris", "Bahasa Arab", "Sastra"]
    },
    {
      id: 4,
      name: "Agama",
      description: "Program studi dengan fokus pada mata pelajaran agama dan keislaman",
      totalStudents: 217,
      totalClasses: 7,
      subjects: ["Aqidah", "Fiqh", "Al-Quran", "Hadits"]
    }
  ]

  // Mock data untuk special programs
  const specialPrograms = [
    {
      id: 1,
      name: "Program Unggulan",
      description: "Program khusus untuk siswa berprestasi tinggi",
      totalStudents: 50,
      requirements: "Nilai rata-rata minimal 8.5",
      benefits: ["Beasiswa penuh", "Kelas khusus", "Mentor khusus"]
    },
    {
      id: 2,
      name: "Program Tahfidz",
      description: "Program menghafal Al-Quran",
      totalStudents: 30,
      requirements: "Minimal hafal 5 juz",
      benefits: ["Guru tahfidz", "Jadwal khusus", "Evaluasi berkala"]
    },
    {
      id: 3,
      name: "Program Internasional",
      description: "Program dengan kurikulum internasional",
      totalStudents: 25,
      requirements: "Kemampuan bahasa Inggris aktif",
      benefits: ["Kurikulum Cambridge", "Native speaker", "International certificate"]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Academic Streams */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Jurusan/Program Studi
              </CardTitle>
              <CardDescription>
                Manajemen jurusan dan program studi
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Jurusan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Special Programs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Program Khusus
              </CardTitle>
              <CardDescription>
                Program unggulan dan program khusus sekolah
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Program
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {specialPrograms.map((program) => (
              <Card key={program.id} className="p-4">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total Siswa:</span>
                    <p className="font-medium">{program.totalStudents}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Persyaratan:</span>
                    <p className="font-medium">{program.requirements}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Fasilitas:</span>
                    <div className="space-y-1 mt-1">
                      {program.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{benefit}</span>
                        </div>
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
        </CardContent>
      </Card>
    </div>
  )
}
