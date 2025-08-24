'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useCreateDepartment, useUpdateDepartment } from '@/hooks/use-department'
import { Department } from '@/lib/schemas/school'

interface DepartmentModalProps {
  isOpen: boolean
  onClose: () => void
  department?: Department | null
  mode: 'create' | 'edit'
  schoolId: string
}

export function DepartmentModal({ isOpen, onClose, department, mode, schoolId }: DepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  })

  const createDepartmentMutation = useCreateDepartment()
  const updateDepartmentMutation = useUpdateDepartment()

  // Reset form when modal opens/closes or department changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && department) {
        setFormData({
          name: department.name || '',
          description: department.description || '',
          isActive: department.isActive ?? true
        })
      } else {
        setFormData({
          name: '',
          description: '',
          isActive: true
        })
      }
    }
  }, [isOpen, mode, department])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Nama departemen harus diisi')
      return
    }

    try {
      if (mode === 'create') {
        await createDepartmentMutation.mutateAsync({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          isActive: formData.isActive,
          schoolId
        })
      } else {
        if (!department?.id) {
          toast.error('ID departemen tidak valid')
          return
        }
        
        await updateDepartmentMutation.mutateAsync({
          id: department.id,
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          isActive: formData.isActive
        })
      }
      
      onClose()
    } catch (error: any) {
      // Error toast sudah ditangani di hooks
    }
  }

  const handleClose = () => {
    if (createDepartmentMutation.isPending || updateDepartmentMutation.isPending) {
      return // Prevent closing while submitting
    }
    onClose()
  }

  const isLoading = createDepartmentMutation.isPending || updateDepartmentMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Tambah Departemen Baru' : 'Edit Departemen'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Buat departemen baru untuk mengelompokkan staff sekolah'
              : 'Update informasi departemen yang sudah ada'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Departemen *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Contoh: Akademik, Kesiswaan, Administrasi"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Jelaskan fungsi dan tanggung jawab departemen ini"
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              disabled={isLoading}
            />
            <Label htmlFor="isActive">Departemen Aktif</Label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  {mode === 'create' ? 'Membuat...' : 'Mengupdate...'}
                </>
              ) : (
                mode === 'create' ? 'Buat Departemen' : 'Update Departemen'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
