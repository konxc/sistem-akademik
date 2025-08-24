'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Building, Save, X, Plus, Trash2, Edit, Users, Shield, AlertTriangle, RefreshCw, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRombelsByClass, useCreateRombel, useUpdateRombel, useDeleteRombel } from '@/hooks/useRombel'
import { useSession } from 'next-auth/react'
import { DebugPanel } from '@/components/debug/debug-panel'

interface RombelModalProps {
  isOpen: boolean
  onClose: () => void
  schoolId: string
  classId: string
  className: string
  mode: 'create' | 'edit'
}

interface Rombel {
  id: string
  name: string
  classId: string
  maxStudents: number
  currentStudents: number
  isActive: boolean
}

export function RombelModal({ isOpen, onClose, schoolId, classId, className, mode }: RombelModalProps) {
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    maxStudents: ''
  })

  const [editingRombel, setEditingRombel] = useState<Rombel | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletedRombels, setDeletedRombels] = useState<Set<string>>(new Set())
  const [lastAction, setLastAction] = useState<'create' | 'update' | 'delete' | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [deletingRombels, setDeletingRombels] = useState<Set<string>>(new Set())
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)
  const [rombelToDelete, setRombelToDelete] = useState<string | null>(null)

  // Load rombel data from tRPC
  const { data: rombelData, isLoading: isLoadingRombels, refetch: refetchRombels } = useRombelsByClass(classId)
  const createRombel = useCreateRombel()
  const updateRombel = useUpdateRombel()
  const deleteRombel = useDeleteRombel()
  
  // Debug deleteRombel mutation state
  console.log('🔍 deleteRombel mutation state:', {
    isPending: deleteRombel.isPending,
    isSuccess: deleteRombel.isSuccess,
    isError: deleteRombel.isError,
    error: deleteRombel.error,
    data: deleteRombel.data
  })

  // Get rombel list from tRPC data
  const rombelList = rombelData || []

  // Check if user has admin access
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  // Check if rombel still exists (not deleted)
  const isRombelExists = (rombelId: string) => {
    return !deletedRombels.has(rombelId) && rombelList.some(r => r.id === rombelId)
  }

  // Check if current editing rombel still exists
  const isEditingRombelValid = editingRombel ? isRombelExists(editingRombel.id) : true

  // Debug session info
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      console.log('Session user:', session.user)
      console.log('User role:', session.user.role)
      console.log('Is admin:', isAdmin)
    }
  }, [session, status, isAdmin])

  // Auto-cleanup editing state if rombel was deleted
  useEffect(() => {
    if (editingRombel && !isEditingRombelValid) {
      console.log('Editing rombel was deleted, cleaning up state...')
      setEditingRombel(null)
      resetForm()
      setShowCreateForm(false)
      toast.warning('Rombel yang sedang diedit telah dihapus. Form telah direset.')
    }
  }, [editingRombel, isEditingRombelValid])

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm()
      setDeletedRombels(new Set())
      setDeletingRombels(new Set())
      setShowDeleteConfirmDialog(false)
      setRombelToDelete(null)
      setLastAction(null)
      setShowCreateForm(false)
    }
  }, [isOpen])

  const resetForm = () => {
    setFormData({
      name: '',
      maxStudents: ''
    })
    setEditingRombel(null)
  }

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm)
    if (!showCreateForm) {
      // When showing form, reset any editing state
      setEditingRombel(null)
      resetForm()
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check admin permission before proceeding
    if (!isAdmin) {
      toast.error('Anda tidak memiliki akses untuk membuat atau mengedit rombel')
      return
    }

    // Check if editing rombel still exists
    if (editingRombel && !isEditingRombelValid) {
      toast.error('Rombel yang sedang diedit tidak ditemukan. Silakan refresh halaman.')
      setEditingRombel(null)
      resetForm()
      return
    }
    
    if (!formData.name || !formData.maxStudents) {
      toast.error('Nama rombel dan kapasitas maksimal harus diisi')
      return
    }

    const maxStudents = parseInt(formData.maxStudents)
    if (maxStudents < 1) {
      toast.error('Kapasitas maksimal harus minimal 1')
      return
    }

    // Check if rombel name already exists
    const existingRombel = rombelList.find(
      rombel => rombel.name === formData.name && rombel.id !== editingRombel?.id
    )
    if (existingRombel) {
      toast.error(`Rombel ${formData.name} sudah ada`)
      return
    }

    try {
      setIsSubmitting(true)
      
      // Log the data being sent
      console.log('Submitting rombel data:', {
        name: formData.name,
        maxStudents,
        classId,
        schoolId,
        isEditing: !!editingRombel
      })
      
      if (editingRombel) {
        // Update existing rombel
        const updateData = {
          id: editingRombel.id,
          name: formData.name,
          maxStudents,
          isActive: editingRombel.isActive
        }
        console.log('Updating rombel with data:', updateData)
        
        await updateRombel.mutateAsync(updateData)
        setLastAction('update')
        toast.success('Rombel berhasil diupdate')
      } else {
        // Create new rombel
        const createData = {
          name: formData.name,
          maxStudents,
          classId,
          schoolId
        }
        console.log('Creating rombel with data:', createData)
        
        await createRombel.mutateAsync(createData)
        setLastAction('create')
        toast.success('Rombel berhasil dibuat')
      }
      
      resetForm()
      setShowCreateForm(false)
    } catch (error: unknown) {
      console.error('Error saving rombel:', error)
      
      // Type-safe error handling
      if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as { 
          message?: string; 
          data?: { code?: string; message?: string }; 
          stack?: string 
        }
        
        console.error('Error details:', {
          message: errorObj.message,
          data: errorObj.data,
          code: errorObj.data?.code,
          stack: errorObj.stack
        })
        
        // Handle different types of errors
        if (errorObj.data?.code === 'FORBIDDEN') {
          toast.error('Anda tidak memiliki akses untuk melakukan operasi ini')
        } else if (errorObj.data?.code === 'UNAUTHORIZED') {
          toast.error('Anda harus login terlebih dahulu')
        } else if (errorObj.data?.code === 'NOT_FOUND') {
          // Handle rombel not found (deleted)
          if (editingRombel) {
            toast.error('Rombel yang sedang diedit tidak ditemukan. Kemungkinan telah dihapus.')
            setEditingRombel(null)
            resetForm()
            // Refresh data to sync with server
            refetchRombels()
          } else {
            toast.error('Data yang diperlukan tidak ditemukan')
          }
        } else if (errorObj.data?.code === 'CONFLICT') {
          toast.error(errorObj.data.message || 'Data sudah ada')
        } else if (errorObj.message?.includes('tidak memiliki akses')) {
          toast.error('Anda tidak memiliki akses untuk melakukan operasi ini')
        } else if (errorObj.message?.includes('Unexpected token') || errorObj.message?.includes('is not valid JSON')) {
          // Handle JSON parsing errors
          console.error('JSON parsing error - server returned HTML instead of JSON')
          toast.error('Server error: Response tidak valid. Silakan coba lagi atau hubungi administrator.')
        } else {
          toast.error('Gagal menyimpan rombel: ' + (errorObj.message || 'Unknown error'))
        }
      } else {
        toast.error('Gagal menyimpan rombel: Unknown error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if form is valid for submission
  const isFormValid = formData.name && formData.maxStudents && parseInt(formData.maxStudents) >= 1

  // Real-time validation feedback
  const validationErrors = {
    name: !formData.name ? 'Nama rombel harus dipilih' : '',
    maxStudents: !formData.maxStudents ? 'Kapasitas maksimal harus diisi' : 
                parseInt(formData.maxStudents) < 1 ? 'Kapasitas maksimal harus minimal 1' : ''
  }

  const hasValidationErrors = Object.values(validationErrors).some(error => error)

  const handleEditRombel = (rombel: Rombel) => {
    if (!isAdmin) {
      toast.error('Anda tidak memiliki akses untuk mengedit rombel')
      return
    }

    // Check if rombel still exists
    if (!isRombelExists(rombel.id)) {
      toast.error('Rombel tidak dapat diedit karena tidak ditemukan')
      return
    }
    
    setEditingRombel(rombel)
    setFormData({
      name: rombel.name,
      maxStudents: rombel.maxStudents.toString()
    })
    // Show form when editing
    setShowCreateForm(true)
  }

  const handleDeleteRombel = async (rombelId: string) => {
    console.log('🔄 handleDeleteRombel called with ID:', rombelId)
    
    if (!isAdmin) {
      console.log('❌ User is not admin, cannot delete rombel')
      toast.error('Anda tidak memiliki akses untuk menghapus rombel')
      return
    }
    
    console.log('✅ User is admin, proceeding with delete confirmation')
    
    // Check if rombel is currently being edited
    if (editingRombel && editingRombel.id === rombelId) {
      console.log('⚠️ Rombel sedang diedit, showing enhanced confirmation dialog')
      
      // Show enhanced confirmation dialog for editing rombel
      setRombelToDelete(rombelId)
      setShowDeleteConfirmDialog(true)
      return
    }
    
    // For non-editing rombels, use simple confirmation
    const isConfirmed = window.confirm('Apakah Anda yakin ingin menghapus rombel ini?')
    console.log('🔍 Delete confirmation result:', isConfirmed)
    
    if (isConfirmed) {
      await performDeleteRombel(rombelId)
    } else {
      console.log('❌ Delete cancelled by user')
    }
  }

  const performDeleteRombel = async (rombelId: string) => {
    try {
      console.log('🚀 Starting delete process...')
      
      // Add to deleting state
      setDeletingRombels(prev => new Set(prev).add(rombelId))
      
      console.log('📡 Calling deleteRombel.mutateAsync...')
      const result = await deleteRombel.mutateAsync({ id: rombelId })
      console.log('✅ Delete API call successful:', result)
      
      // Remove from deleting state and add to deleted state
      setDeletingRombels(prev => {
        const newSet = new Set(prev)
        newSet.delete(rombelId)
        return newSet
      })
      
      // Track deleted rombel
      console.log('📝 Updating deletedRombels state...')
      setDeletedRombels(prev => {
        const newSet = new Set(prev)
        newSet.add(rombelId)
        console.log('🗑️ Updated deletedRombels:', Array.from(newSet))
        return newSet
      })
      
      setLastAction('delete')
      console.log('🎯 Set lastAction to delete')
      
      toast.success('Rombel berhasil dihapus')
      console.log('🎉 Delete process completed successfully')
      
            } catch (error: unknown) {
          // Remove from deleting state on error
          setDeletingRombels(prev => {
            const newSet = new Set(prev)
            newSet.delete(rombelId)
            return newSet
          })
          
          console.error('❌ Error deleting rombel:', error)
          
          // Type-safe error handling
          if (error && typeof error === 'object' && 'message' in error) {
            const errorObj = error as { 
              message?: string; 
              data?: { code?: string; message?: string }; 
              stack?: string 
            }
            
            console.error('Error details:', {
              message: errorObj.message,
              data: errorObj.data,
              code: errorObj.data?.code,
              stack: errorObj.stack
            })
            
            // Handle different types of errors
            if (errorObj.data?.code === 'FORBIDDEN') {
              toast.error('Anda tidak memiliki akses untuk menghapus rombel')
            } else if (errorObj.data?.code === 'UNAUTHORIZED') {
              toast.error('Anda harus login terlebih dahulu')
            } else if (errorObj.data?.code === 'NOT_FOUND') {
              toast.error('Rombel tidak ditemukan')
              // Refresh data to sync with server
              refetchRombels()
            } else if (errorObj.data?.code === 'BAD_REQUEST') {
              toast.error(errorObj.data.message || 'Tidak dapat menghapus rombel')
            } else if (errorObj.message?.includes('tidak memiliki akses')) {
              toast.error('Anda tidak memiliki akses untuk menghapus rombel')
            } else {
              toast.error('Gagal menghapus rombel: ' + (errorObj.message || 'Unknown error'))
            }
          } else {
            toast.error('Gagal menghapus rombel: Unknown error')
          }
        }
  }

  const handleConfirmDeleteEditingRombel = async () => {
    if (!rombelToDelete) return
    
    console.log('✅ User confirmed delete for editing rombel, closing edit mode and proceeding with delete')
    
    // Close edit mode first
    setEditingRombel(null)
    setShowCreateForm(false)
    resetForm()
    
    // Close confirmation dialog
    setShowDeleteConfirmDialog(false)
    setRombelToDelete(null)
    
    // Proceed with delete
    await performDeleteRombel(rombelToDelete)
  }

  const handleCancelDeleteEditingRombel = () => {
    console.log('❌ User cancelled delete for editing rombel, returning to edit mode')
    
    // Close confirmation dialog and return to edit mode
    setShowDeleteConfirmDialog(false)
    setRombelToDelete(null)
    
    // Stay in edit mode
    toast.info('Penghapusan dibatalkan. Anda dapat melanjutkan mengedit rombel.')
  }

  const handleCancel = () => {
    resetForm()
    onClose()
  }

  // Generate rombel options (A-Z)
  const rombelOptions = Array.from({ length: 26 }, (_, i) => ({
    value: String.fromCharCode(65 + i), // A-Z
    label: String.fromCharCode(65 + i)
  }))

  // Filter out already used rombel names
  const availableRombelOptions = rombelOptions.filter(option => 
    !rombelList.find(rombel => rombel.name === option.value) || 
    (editingRombel && editingRombel.name === option.value)
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">
            {editingRombel ? 'Edit Rombel' : 'Manajemen Rombel'}
          </DialogTitle>
          <DialogDescription>
            Kelola rombel untuk kelas {className}
          </DialogDescription>
        </DialogHeader>

        {/* Permission Warning */}
        {!isAdmin && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">
                Anda tidak memiliki akses untuk membuat, mengedit, atau menghapus rombel
              </span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Hanya admin yang dapat mengelola rombel. Silakan hubungi administrator untuk bantuan.
            </p>
          </div>
        )}

        {/* Status Bar */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4" data-testid="status-bar">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Status: {isLoadingRombels ? 'Loading...' : 'Ready'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                <span>Total: {rombelList.length} rombel</span>
              </div>
              {deletedRombels.size > 0 && (
                <div className="flex items-center gap-2">
                  <Trash2 className="h-3 w-3" />
                  <span>Deleted: {deletedRombels.size}</span>
                </div>
              )}
              {deletingRombels.size > 0 && (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Deleting: {deletingRombels.size}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {lastAction && (
                <Badge variant="outline" className="text-xs">
                  Last: {lastAction === 'create' ? 'Created' : lastAction === 'update' ? 'Updated' : 'Deleted'}
                </Badge>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  refetchRombels()
                  setDeletedRombels(new Set())
                  toast.info('Data rombel telah di-refresh')
                }}
                disabled={isLoadingRombels}
                className="text-xs"
                data-testid="refresh-button"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isLoadingRombels ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                size="sm" 
                variant={showCreateForm ? 'outline' : 'default'}
                onClick={toggleCreateForm}
                disabled={isLoadingRombels || !isAdmin}
                className="text-xs"
                data-testid="toggle-create-form-button"
              >
                <Plus className="h-3 w-3 mr-1" />
                {showCreateForm ? 'Sembunyikan Form' : 'Tambah Rombel'}
              </Button>
            </div>
          </div>
        </div>

        {/* Debug Session Info - Hanya tampilkan di development */}
        {/* {process.env.NODE_ENV === 'development' && (
          <DebugPanel
            session={session}
            status={status}
            isAdmin={isAdmin}
            debugData={{
              rombelData,
              isLoadingRombels,
              rombelList,
              createRombel: { error: createRombel.error, isPending: createRombel.isPending },
              updateRombel: { error: updateRombel.error, isPending: updateRombel.isPending },
              deleteRombel: { error: deleteRombel.error, isPending: deleteRombel.isPending },
              isSubmitting,
              formData,
              editingRombel,
              availableRombelOptions,
              className,
              mode,
              classId,
              schoolId,
              // Form validation
              isFormValid,
              hasValidationErrors,
              validationErrors,
              // Permission debug
              userRole: session?.user?.role,
              requiredRoles: ['ADMIN', 'SUPER_ADMIN'],
              hasPermission: isAdmin,
              canCreate: isAdmin && isFormValid,
              canEdit: isAdmin && editingRombel,
              canDelete: isAdmin
            }}
          />
        )} */}
        {/* Delete Confirmation Modal for Editing Rombel */}
        <AlertDialog open={showDeleteConfirmDialog && !!rombelToDelete} onOpenChange={setShowDeleteConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {editingRombel ? 'Edit Rombel' : 'Konfirmasi Penghapusan Rombel'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {editingRombel ? `Rombel "${editingRombel.name}" sedang dalam mode edit.` : `Apakah Anda yakin ingin menghapus rombel ini?`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDeleteEditingRombel}>Tidak, Lanjutkan Edit</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDeleteEditingRombel} className="bg-red-600 hover:bg-red-700">
                {editingRombel ? 'Ya, Hapus Rombel' : 'Ya, Hapus'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <div className="space-y-6">
          {/* Form untuk create/edit rombel */}
          {(showCreateForm || editingRombel) && (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                {editingRombel ? 'Edit Rombel' : 'Tambah Rombel Baru'}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Form completion:</span>
                <div className="w-20 bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ 
                      width: `${isFormValid ? 100 : 
                        (formData.name ? 50 : 0) + (formData.maxStudents && parseInt(formData.maxStudents) >= 1 ? 50 : 0)}%` 
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {isFormValid ? '100%' : 
                    `${(formData.name ? 50 : 0) + (formData.maxStudents && parseInt(formData.maxStudents) >= 1 ? 50 : 0)}%`}
                </span>
              </div>
            </div>

            {/* Warning for editing deleted rombel */}
            {editingRombel && !isEditingRombelValid && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Peringatan!</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Rombel yang sedang diedit tidak ditemukan atau telah dihapus. 
                  Silakan batalkan edit atau refresh data.
                </p>
                <div className="mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setEditingRombel(null)
                      resetForm()
                      refetchRombels()
                    }}
                    className="text-xs"
                  >
                    Batalkan Edit & Refresh
                  </Button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rombelName" className="text-sm font-medium">
                  Nama Rombel <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.name} 
                  onValueChange={(value) => handleInputChange('name', value)}
                  disabled={isSubmitting || !isAdmin}
                >
                  <SelectTrigger 
                    id="rombelName"
                    data-testid="rombel-name-select"
                    className={validationErrors.name ? 'border-red-300' : ''}
                  >
                    <SelectValue placeholder="Pilih nama rombel" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRombelOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        data-testid={`rombel-option-${option.value}`}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.name && (
                  <p className="text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxStudents" className="text-sm font-medium">
                  Kapasitas Maksimal <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="maxStudents"
                  data-testid="max-students-input"
                  type="number"
                  min="1"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                  placeholder="40"
                  disabled={isSubmitting || !isAdmin}
                  className={validationErrors.maxStudents ? 'border-red-300' : ''}
                />
                {validationErrors.maxStudents && (
                  <p className="text-sm text-red-500">{validationErrors.maxStudents}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (editingRombel) {
                    setEditingRombel(null)
                    resetForm()
                  } else {
                    setShowCreateForm(false)
                    resetForm()
                  }
                }}
                disabled={isSubmitting}
                data-testid="cancel-button"
              >
                {editingRombel ? 'Batal Edit' : 'Tutup Form'}
              </Button>
              
              <Button 
                type="submit" 
                disabled={isSubmitting || !isAdmin || !isFormValid} 
                className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
                data-testid="submit-button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : editingRombel ? 'Update Rombel' : 'Buat Rombel'}
              </Button>
              {/* Show delete button only when editing */}
              {editingRombel && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => handleDeleteRombel(editingRombel.id)}
                  disabled={isSubmitting || !isAdmin || deleteRombel.isPending}
                  className="text-sm"
                  data-testid="delete-rombel-from-form"
                >
                  {deleteRombel.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus Rombel
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Form Status */}
            {hasValidationErrors && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Form belum lengkap</span>
                </div>
                <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                  {validationErrors.name && <li>• {validationErrors.name}</li>}
                  {validationErrors.maxStudents && <li>• {validationErrors.maxStudents}</li>}
                </ul>
              </div>
            )}

            {isFormValid && !hasValidationErrors && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  <span className="text-sm font-medium">Form siap untuk disubmit</span>
                </div>
                <p className="mt-1 text-sm text-green-700">
                  Semua field telah diisi dengan benar. Klik tombol "{editingRombel ? 'Update' : 'Buat Rombel'}" untuk melanjutkan.
                </p>
              </div>
            )}
          </form>
          )}

          {/* Tabel daftar rombel */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Daftar Rombel Kelas {className}</h4>
            
            {isLoadingRombels ? (
              <div className="text-center py-8">
                <div className="h-4 w-4 mx-auto animate-spin rounded-full border-2 border-current border-t-transparent" />
                <p className="mt-2 text-muted-foreground">Memuat data rombel...</p>
              </div>
            ) : rombelList.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Rombel</TableHead>
                    <TableHead>Kapasitas</TableHead>
                    <TableHead>Siswa Aktif</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rombelList.map((rombel) => (
                    <TableRow 
                      key={rombel.id} 
                      className={
                        deletedRombels.has(rombel.id) ? 'opacity-50' : 
                        deletingRombels.has(rombel.id) ? 'opacity-75 bg-yellow-50' : ''
                      } 
                      data-testid={`rombel-row-${rombel.id}`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {rombel.name}
                          </Badge>
                          {rombel.name}
                          {deletedRombels.has(rombel.id) && (
                            <Badge variant="destructive" className="text-xs">
                              Dihapus
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {rombel.currentStudents}/{rombel.maxStudents}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ 
                                width: `${(rombel.currentStudents / rombel.maxStudents) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((rombel.currentStudents / rombel.maxStudents) * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rombel.isActive ? "default" : "secondary"}>
                          {rombel.isActive ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditRombel(rombel)}
                            disabled={isSubmitting || !isAdmin || deletedRombels.has(rombel.id)}
                            title={deletedRombels.has(rombel.id) ? 'Rombel telah dihapus' : ''}
                            data-testid={`edit-rombel-${rombel.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteRombel(rombel.id)}
                            disabled={isSubmitting || !isAdmin || deletedRombels.has(rombel.id) || deleteRombel.isPending}
                            title={
                              deletedRombels.has(rombel.id) ? 'Rombel telah dihapus' : 
                              deleteRombel.isPending ? 'Sedang menghapus...' : 
                              'Hapus rombel'
                            }
                            data-testid={`delete-rombel-${rombel.id}`}
                          >
                            {deleteRombel.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Belum ada rombel yang dibuat untuk kelas ini
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel} data-testid="close-button">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
