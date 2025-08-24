import { trpc } from '@/lib/trpc'
import { toast } from 'sonner'

export const useDepartments = (schoolId: string, isActive?: boolean) => {
  return trpc.department.getDepartments.useQuery(
    { schoolId, isActive },
    {
      enabled: !!schoolId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

export const useDepartmentById = (id: string) => {
  return trpc.department.getDepartmentById.useQuery(
    { id },
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

export const useCreateDepartment = () => {
  const utils = trpc.useUtils()
  
  return trpc.department.createDepartment.useMutation({
    onSuccess: () => {
      toast.success('Departemen berhasil dibuat')
      utils.department.getDepartments.invalidate()
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal membuat departemen')
    }
  })
}

export const useUpdateDepartment = () => {
  const utils = trpc.useUtils()
  
  return trpc.department.updateDepartment.useMutation({
    onSuccess: () => {
      toast.success('Departemen berhasil diupdate')
      utils.department.getDepartments.invalidate()
      utils.department.getDepartmentById.invalidate()
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal mengupdate departemen')
    }
  })
}

export const useDeleteDepartment = () => {
  const utils = trpc.useUtils()
  
  return trpc.department.deleteDepartment.useMutation({
    onSuccess: () => {
      toast.success('Departemen berhasil dihapus')
      utils.department.getDepartments.invalidate()
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menghapus departemen')
    }
  })
}
