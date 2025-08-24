'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Building, Save, X, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateClass, useUpdateClass } from '@/hooks/use-school'

interface ClassModalProps {
  isOpen: boolean
  onClose: () => void
  schoolId: string
  academicYearId: string
  majors: Array<{ id: string; name: string; code: string }>
  classData?: {
    id: string
    name: string
    grade: number
    capacity: number
    currentStudents: number
    majorId?: string
  }
  mode: 'create' | 'edit'
}

export function ClassModal({ isOpen, onClose, schoolId, academicYearId, majors, classData, mode }: ClassModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    capacity: '',
    majorId: undefined as string | undefined
  })

  const createClass = useCreateClass()
  const updateClass = useUpdateClass()

  // Initialize form data when modal opens
  useEffect(() => {
    if (mode === 'edit' && classData) {
      setFormData({
        name: classData.name,
        grade: classData.grade.toString(),
        capacity: classData.capacity.toString(),
        majorId: classData.majorId || undefined
      })
    } else {
      setFormData({
        name: '',
        grade: '',
        capacity: '',
        majorId: undefined
      })
    }
  }, [mode, classData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.grade || !formData.capacity) {
      toast.error('Nama kelas, grade, dan kapasitas harus diisi')
      return
    }

    const grade = parseInt(formData.grade)
    if (grade < 1 || grade > 12) {
      toast.error('Grade harus antara 1-12')
      return
    }

    const capacity = parseInt(formData.capacity)
    if (capacity < 1) {
      toast.error('Kapasitas harus minimal 1')
      return
    }

    try {
      if (mode === 'create') {
        await createClass.mutateAsync({
          name: formData.name,
          grade,
          capacity,
          academicYearId,
          majorId: formData.majorId || undefined,
          schoolId
        })
      } else if (mode === 'edit' && classData) {
        await updateClass.mutateAsync({
          id: classData.id,
          data: {
            name: formData.name,
            grade,
            capacity,
            majorId: formData.majorId || undefined
          }
        })
      }
      
      onClose()
    } catch (error: any) {
      console.error('Error saving class:', error)
      // Error akan ditangani oleh tRPC mutation hooks
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'majorId' && value === '' ? undefined : value
    }))
  }

  const isLoading = createClass.isPending || updateClass.isPending

  // Generate grade options based on school type (assuming hybrid for now)
  const gradeOptions = [
    { value: '1', label: 'Kelas 1' },
    { value: '2', label: 'Kelas 2' },
    { value: '3', label: 'Kelas 3' },
    { value: '4', label: 'Kelas 4' },
    { value: '5', label: 'Kelas 5' },
    { value: '6', label: 'Kelas 6' },
    { value: '7', label: 'Kelas 7' },
    { value: '8', label: 'Kelas 8' },
    { value: '9', label: 'Kelas 9' },
    { value: '10', label: 'Kelas 10' },
    { value: '11', label: 'Kelas 11' },
    { value: '12', label: 'Kelas 12' }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {mode === 'create' ? 'Tambah Kelas' : 'Edit Kelas'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Buat kelas baru untuk tahun ajaran ini' 
              : 'Edit data kelas yang ada'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kelas</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Contoh: X IPA A, XI IPS B"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select
                value={formData.grade || undefined}
                onValueChange={(value) => handleInputChange('grade', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Kapasitas</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="40"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="majorId">Jurusan (Opsional)</Label>
            <Select
              value={formData.majorId || undefined}
              onValueChange={(value) => handleInputChange('majorId', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Jurusan (Opsional)" />
              </SelectTrigger>
              <SelectContent>
                {majors.map((major) => (
                  <SelectItem key={major.id} value={major.id}>
                    {major.code} - {major.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Buat' : 'Update'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
