import { trpc } from '@/lib/trpc';
import type { GetClassesInput } from '@/lib/validations/class';

// Hook untuk mendapatkan semua kelas
export const useClasses = (params: GetClassesInput) => {
  return trpc.class.getAll.useQuery(params);
};

// Hook untuk mendapatkan kelas by ID
export const useClassById = (id: string) => {
  return trpc.class.getById.useQuery({ id }, { enabled: !!id });
};

// Hook untuk mendapatkan kelas by school
export const useClassesBySchool = (schoolId: string) => {
  return trpc.class.getBySchool.useQuery({ schoolId }, { enabled: !!schoolId });
};

// Hook untuk mendapatkan statistik kelas
export const useClassStats = (schoolId?: string) => {
  return trpc.class.getStats.useQuery({ schoolId });
};

// Hook untuk membuat kelas baru
export const useCreateClass = () => {
  const utils = trpc.useUtils();
  
  return trpc.class.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch classes
      utils.class.getAll.invalidate();
      utils.class.getStats.invalidate();
    },
  });
};

// Hook untuk update kelas
export const useUpdateClass = () => {
  const utils = trpc.useUtils();
  
  return trpc.class.update.useMutation({
    onSuccess: (_, variables) => {
      // Invalidate and refetch classes
      utils.class.getAll.invalidate();
      utils.class.getById.invalidate({ id: variables.id });
      utils.class.getStats.invalidate();
    },
  });
};

// Hook untuk delete kelas
export const useDeleteClass = () => {
  const utils = trpc.useUtils();
  
  return trpc.class.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch classes
      utils.class.getAll.invalidate();
      utils.class.getStats.invalidate();
    },
  });
};
