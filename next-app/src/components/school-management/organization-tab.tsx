'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  Building,
  Plus,
  Edit,
  Trash2
} from "lucide-react"

export function OrganizationTab() {
  // Mock data untuk organizational structure
  const organizationalStructure = [
    {
      position: "Kepala Sekolah",
      name: "Drs. Ahmad Rizki, M.Pd",
      email: "kepsek@smauiiyk.sch.id",
      phone: "0274-895123",
      department: "Manajemen"
    },
    {
      position: "Wakil Kepala Sekolah",
      name: "Dra. Siti Aminah, M.Pd",
      email: "wakasek@smauiiyk.sch.id",
      phone: "0274-895124",
      department: "Akademik"
    },
    {
      position: "Kepala TU",
      name: "Budi Santoso, S.Pd",
      email: "katu@smauiiyk.sch.id",
      phone: "0274-895125",
      department: "Administrasi"
    },
    {
      position: "Kepala Perpustakaan",
      name: "Rina Sari, S.Pd",
      email: "kapus@smauiiyk.sch.id",
      phone: "0274-895126",
      department: "Perpustakaan"
    }
  ]

  // Mock data untuk departments
  const departments = [
    {
      id: 1,
      name: "Akademik",
      head: "Dra. Siti Aminah, M.Pd",
      totalTeachers: 45,
      totalStudents: 650,
      totalClasses: 18
    },
    {
      id: 2,
      name: "Administrasi",
      head: "Budi Santoso, S.Pd",
      totalTeachers: 12,
      totalStudents: 0,
      totalClasses: 0
    },
    {
      id: 3,
      name: "Kesiswaan",
      head: "Rina Sari, S.Pd",
      totalTeachers: 8,
      totalStudents: 1247,
      totalClasses: 36
    },
    {
      id: 4,
      name: "Sarana Prasarana",
      head: "Dr. Ahmad Rizki, M.Pd",
      totalTeachers: 5,
      totalStudents: 0,
      totalClasses: 0
    }
  ]

  return (
    <div className="space-y-6">
      {/* Organizational Structure */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Struktur Organisasi
              </CardTitle>
              <CardDescription>
                Struktur kepemimpinan dan manajemen sekolah
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Jabatan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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

      {/* Departments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Departemen
              </CardTitle>
              <CardDescription>
                Struktur departemen dan divisi sekolah
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Departemen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="p-4">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                  <CardDescription className="text-sm">
                    Kepala: {dept.head}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Guru:</span>
                      <p className="font-medium">{dept.totalTeachers}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Siswa:</span>
                      <p className="font-medium">{dept.totalStudents}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Kelas:</span>
                    <p className="font-medium">{dept.totalClasses}</p>
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
