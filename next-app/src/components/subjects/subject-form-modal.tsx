"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useCreateSubject, useUpdateSubject } from "@/hooks/use-school"

interface SubjectData {
  id: string
  name: string
  code: string
  description?: string | null
  credits: number
  majorId?: string | null
}

interface MajorData {
  id: string
  name: string
  code: string
  description?: string | null
}

interface SubjectFormModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  subject?: SubjectData
  schoolId: string
  majors: MajorData[]
}

export function SubjectFormModal({
  isOpen,
  onClose,
  mode,
  subject,
  schoolId,
  majors
}: SubjectFormModalProps) {
  const [formData, setFormData] = useState<SubjectData>({
    id: "",
    name: "",
    code: "",
    description: "",
    credits: 1,
    majorId: "no-major", // Default to "no-major" (no major)
  })
  const [originalData, setOriginalData] = useState<SubjectData | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  const createSubjectMutation = useCreateSubject()
  const updateSubjectMutation = useUpdateSubject()

  // Reset form when modal opens/closes or subject changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && subject) {
        const subjectData = {
          id: subject.id,
          name: subject.name,
          code: subject.code,
          description: subject.description || "",
          credits: subject.credits,
          majorId: subject.majorId || null,
        }
        setFormData(subjectData)
        setOriginalData(subjectData)
        setHasChanges(false)
      } else {
        setFormData({
          id: "",
          name: "",
          code: "",
          description: "",
          credits: 1,
          majorId: "no-major",
        })
        setOriginalData(null)
        setHasChanges(false)
      }
    }
  }, [isOpen, mode, subject])

  // Check for changes when formData changes
  useEffect(() => {
    if (originalData && mode === 'edit') {
      const changed = 
        formData.name !== originalData.name ||
        formData.code !== originalData.code ||
        formData.description !== originalData.description ||
        formData.credits !== originalData.credits ||
        formData.majorId !== originalData.majorId
      
      setHasChanges(changed)
    } else if (mode === 'create') {
      const hasData = formData.name.trim() !== "" || formData.code.trim() !== ""
      setHasChanges(hasData)
    }
  }, [formData, originalData, mode])

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setHasChanges(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.code) {
      toast.error("Nama dan kode mata pelajaran harus diisi")
      return
    }

    try {
      if (mode === 'create') {
        await createSubjectMutation.mutateAsync({
          ...formData,
          schoolId,
          majorId: formData.majorId === "no-major" ? undefined : (formData.majorId || undefined),
          description: formData.description || undefined,
        })
        toast.success("Mata pelajaran berhasil ditambahkan")
      } else {
        await updateSubjectMutation.mutateAsync({
          id: subject!.id,
          data: {
            ...formData,
            majorId: formData.majorId === "no-major" ? undefined : (formData.majorId || undefined),
            description: formData.description || undefined,
          },
        })
        toast.success("Mata pelajaran berhasil diupdate")
      }
      
      // Reset form dan close modal
      setFormData({
        id: "",
        name: "",
        code: "",
        description: "",
        credits: 1,
        majorId: "no-major",
      })
      setOriginalData(null)
      setHasChanges(false)
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan")
    }
  }

  const isLoading = createSubjectMutation.isPending || updateSubjectMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Tambah Mata Pelajaran Baru' : 'Edit Mata Pelajaran'}
            {mode === 'edit' && hasChanges && (
              <span className="ml-2 text-sm text-orange-600 font-normal">
                (Ada perubahan)
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Isi informasi mata pelajaran baru' 
              : hasChanges 
                ? 'Update informasi mata pelajaran'
                : 'Tidak ada perubahan yang dibuat'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subjectCode">Kode Mata Pelajaran</Label>
              <Input
                id="subjectCode"
                placeholder="Contoh: MATH"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjectName">Nama Mata Pelajaran</Label>
              <Input
                id="subjectName"
                placeholder="Contoh: Matematika"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjectDescription">Deskripsi</Label>
            <Textarea
              id="subjectDescription"
              placeholder="Deskripsi singkat mata pelajaran"
              rows={3}
              value={formData.description || ""}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subjectCredits">SKS</Label>
              <Input
                id="subjectCredits"
                type="number"
                placeholder="4"
                value={formData.credits || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  handleInputChange('credits', isNaN(value) ? 1 : value)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjectCategory">Jurusan</Label>
              <Select
                value={formData.majorId || "no-major"}
                onValueChange={(value) => handleInputChange('majorId', value === "no-major" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jurusan (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-major">Tanpa Jurusan</SelectItem>
                  {majors.map((major) => (
                    <SelectItem key={major.id} value={major.id}>
                      {major.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || (mode === 'edit' && !hasChanges)}
            >
              {isLoading 
                ? "Menyimpan..." 
                : mode === 'create' 
                  ? "Tambah" 
                  : hasChanges 
                    ? "Update" 
                    : "Tidak Ada Perubahan"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
