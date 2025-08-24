'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GraduationCap, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateMajor, useUpdateMajor } from '@/hooks/use-school'

interface MajorModalProps {
  isOpen: boolean
  onClose: () => void
  schoolId: string
  major?: {
    id: string
    name: string
    code: string
    description?: string
  }
  mode: 'create' | 'edit'
}

export function MajorModal({ isOpen, onClose, schoolId, major, mode }: MajorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  })

  const createMajor = useCreateMajor()
  const updateMajor = useUpdateMajor()

  // Initialize form data when modal opens
  useEffect(() => {
    if (mode === 'edit' && major) {
      setFormData({
        name: major.name,
        code: major.code,
        description: major.description || ''
      })
    } else {
      setFormData({
        name: '',
        code: '',
        description: ''
      })
    }
  }, [mode, major, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.code) {
      toast.error('Nama dan kode jurusan harus diisi')
      return
    }

    try {
      if (mode === 'create') {
        await createMajor.mutateAsync({
          name: formData.name,
          code: formData.code.toUpperCase(),
          description: formData.description || undefined,
          schoolId
        })
      } else if (mode === 'edit' && major) {
        await updateMajor.mutateAsync({
          id: major.id,
          data: {
            name: formData.name,
            code: formData.code.toUpperCase(),
            description: formData.description || undefined
          }
        })
      }
      
      onClose()
    } catch (error: any) {
      console.error('Error saving major:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isLoading = createMajor.isPending || updateMajor.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {mode === 'create' ? 'Tambah Jurusan' : 'Edit Jurusan'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Buat jurusan baru untuk sekolah' 
              : 'Edit data jurusan yang ada'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Jurusan</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Contoh: Ilmu Pengetahuan Alam (IPA)"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Kode Jurusan</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              placeholder="Contoh: IPA"
              disabled={isLoading}
              maxLength={10}
            />
            <p className="text-xs text-muted-foreground">
              Kode akan otomatis dikonversi ke huruf besar
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Deskripsi singkat tentang jurusan ini..."
              disabled={isLoading}
              rows={3}
            />
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
