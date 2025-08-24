"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"

interface SubjectData {
  id: string
  name: string
  code: string
  description?: string | null
  credits: number
  majorId?: string | null
  major?: {
    name: string
  } | null
  teachers?: Array<{
    name: string
  }> | null
  isActive: boolean
}

interface SubjectsTableProps {
  subjects: SubjectData[]
  onEdit: (subject: SubjectData) => void
  onDelete: (subject: SubjectData) => void
  // Add majors data to help determine correct major names
  majors?: Array<{
    id: string
    name: string
  }>
}

export function SubjectsTable({ subjects, onEdit, onDelete, majors }: SubjectsTableProps) {
  // Helper function to get major name
  const getMajorName = (subject: SubjectData) => {
    if (subject.major?.name) {
      return subject.major.name
    }
    if (subject.majorId && majors) {
      const major = majors.find(m => m.id === subject.majorId)
      return major?.name || "Tanpa Jurusan"
    }
    return "Tanpa Jurusan"
  }

  if (subjects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Tidak ada mata pelajaran yang ditemukan
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kode</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Jurusan</TableHead>
          <TableHead>SKS</TableHead>
          <TableHead>Guru</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects.map((subject) => (
          <TableRow key={subject.id}>
            <TableCell className="font-medium">{subject.code}</TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{subject.name}</p>
                <p className="text-sm text-muted-foreground">
                  {subject.description || "Tidak ada deskripsi"}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={subject.majorId ? "default" : "outline"}>
                {getMajorName(subject)}
              </Badge>
            </TableCell>
            <TableCell>{subject.credits}</TableCell>
            <TableCell className="max-w-[200px] truncate">
              {subject.teachers && subject.teachers.length > 0 
                ? subject.teachers.map(t => t.name).join(", ")
                : "Belum ada guru"
              }
            </TableCell>
            <TableCell>
              <Badge variant={subject.isActive ? "default" : "secondary"}>
                {subject.isActive ? "Aktif" : "Nonaktif"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(subject)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(subject)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
