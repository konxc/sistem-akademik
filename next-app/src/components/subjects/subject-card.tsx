"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, BookOpen, GraduationCap, Users } from "lucide-react"

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

interface SubjectCardProps {
  subject: SubjectData
  variant?: 'default' | 'secondary' | 'outline'
  onEdit: (subject: SubjectData) => void
  onDelete: (subject: SubjectData) => void
}

const variantConfig = {
  default: {
    icon: GraduationCap,
    badgeVariant: 'default' as const,
  },
  secondary: {
    icon: Users,
    badgeVariant: 'secondary' as const,
  },
  outline: {
    icon: BookOpen,
    badgeVariant: 'outline' as const,
  },
}

export function SubjectCard({ 
  subject, 
  variant = 'default',
  onEdit, 
  onDelete 
}: SubjectCardProps) {
  const config = variantConfig[variant]
  const IconComponent = config.icon

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{subject.name}</CardTitle>
          <Badge variant={config.badgeVariant}>{subject.code}</Badge>
        </div>
        <CardDescription className="text-sm">
          {subject.description || "Tidak ada deskripsi"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Jurusan:</span>
            <p className="font-medium">
              {subject.major?.name || "Umum"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">SKS:</span>
            <p className="font-medium">{subject.credits}</p>
          </div>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">Guru:</span>
          <p className="text-sm font-medium truncate">
            {subject.teachers && subject.teachers.length > 0 
              ? subject.teachers.map(t => t.name).join(", ")
              : "Belum ada guru"
            }
          </p>
        </div>
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(subject)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(subject)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
