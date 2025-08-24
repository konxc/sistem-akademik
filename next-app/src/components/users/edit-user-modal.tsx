'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDepartments } from '@/hooks/use-department'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateUser } from '@/hooks/useUser'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface EditUserModalProps {
  user: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditUserModal({ user, open, onOpenChange, onSuccess }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
    departmentId: '' as string
  })

  const updateUserMutation = useUpdateUser()
  const { data: departmentsData, isLoading: isLoadingDepartments } = useDepartments(user?.schoolId || '', true)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        isActive: user.isActive ?? true,
        departmentId: (user.departmentId as string) || ''
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      toast.error('Nama dan email harus diisi')
      return
    }

    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        data: formData
      })

      toast.success('User berhasil diupdate')
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Gagal mengupdate user')
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Perbarui informasi dasar pengguna.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Masukkan email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Masukkan nomor telepon"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Masukkan alamat lengkap"
              rows={3}
            />
          </div>

          {/* Department selector: optional for teacher, required for staff */}
          {user?.role === 'TEACHER' && (
            <div className="space-y-2">
              <Label htmlFor="departmentId">Department (Opsional)</Label>
              <Select
                value={formData.departmentId || 'none'}
                onValueChange={(value) => handleInputChange('departmentId', value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingDepartments ? 'Loading departments...' : 'Pilih department (opsional)'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tanpa department</SelectItem>
                  {departmentsData?.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {user?.role === 'STAFF' && (
            <div className="space-y-2">
              <Label htmlFor="departmentId">Department *</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => handleInputChange('departmentId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingDepartments ? 'Loading departments...' : 'Pilih department'} />
                </SelectTrigger>
                <SelectContent>
                  {departmentsData?.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="isActive">Status</Label>
            <Select
              value={formData.isActive.toString()}
              onValueChange={(value) => handleInputChange('isActive', value === 'true')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
