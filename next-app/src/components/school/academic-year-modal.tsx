'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateAcademicYear, useUpdateAcademicYear } from '@/hooks/use-school'

interface AcademicYearModalProps {
  isOpen: boolean
  onClose: () => void
  schoolId: string
  academicYear?: {
    id: string
    name: string
    startDate: string
    endDate: string
    isActive: boolean
  }
  mode: 'create' | 'edit'
}

export function AcademicYearModal({ isOpen, onClose, schoolId, academicYear, mode }: AcademicYearModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: false
  })

  const createAcademicYear = useCreateAcademicYear()
  const updateAcademicYear = useUpdateAcademicYear()

  // Initialize form data when modal opens
  useEffect(() => {
    if (mode === 'edit' && academicYear) {
      // Convert date to YYYY-MM-DD format for HTML date input
      const formatDateForInput = (dateString: string | Date) => {
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }
      
      setFormData({
        name: academicYear.name,
        startDate: formatDateForInput(academicYear.startDate),
        endDate: formatDateForInput(academicYear.endDate),
        isActive: academicYear.isActive
      })
    } else {
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        isActive: false
      })
    }
  }, [mode, academicYear, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error('Semua field harus diisi')
      return
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('Tanggal mulai harus lebih awal dari tanggal selesai')
      return
    }

    try {
      if (mode === 'create') {
        await createAcademicYear.mutateAsync({
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isActive: formData.isActive,
          schoolId
        })
      } else if (mode === 'edit' && academicYear) {
        await updateAcademicYear.mutateAsync({
          id: academicYear.id,
          data: {
            name: formData.name,
            startDate: formData.startDate,
            endDate: formData.endDate,
            isActive: formData.isActive
          }
        })
      }
      
      onClose()
    } catch (error: any) {
      console.error('Error saving academic year:', error)
      // Error akan ditangani oleh tRPC mutation hooks
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isLoading = createAcademicYear.isPending || updateAcademicYear.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {mode === 'create' ? 'Tambah Tahun Ajaran' : 'Edit Tahun Ajaran'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Buat tahun ajaran baru untuk sekolah' 
              : 'Edit data tahun ajaran yang ada'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Tahun Ajaran</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Contoh: 2024/2025"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal Mulai</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Tanggal Selesai</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              disabled={isLoading}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isActive">Tahun Ajaran Aktif</Label>
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
