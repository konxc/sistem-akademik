import { trpc } from '@/lib/trpc';

// Hook untuk mendapatkan semua rombel
export const useRombels = (params: {
  classId?: string;
  schoolId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}) => {
  return trpc.rombel.getAll.useQuery(params);
};

// Hook untuk mendapatkan rombel by ID
export const useRombelById = (id: string) => {
  return trpc.rombel.getById.useQuery({ id }, { enabled: !!id });
};

// Hook untuk mendapatkan rombel by class
export const useRombelsByClass = (classId: string) => {
  return trpc.rombel.getByClass.useQuery({ classId }, { enabled: !!classId });
};

// Hook untuk membuat rombel baru
export const useCreateRombel = () => {
  const utils = trpc.useUtils();
  
  return trpc.rombel.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch rombels
      utils.rombel.getAll.invalidate();
      utils.rombel.getByClass.invalidate();
    },
  });
};

// Hook untuk update rombel
export const useUpdateRombel = () => {
  const utils = trpc.useUtils();
  
  return trpc.rombel.update.useMutation({
    onSuccess: (_, variables) => {
      // Invalidate and refetch rombels
      utils.rombel.getAll.invalidate();
      utils.rombel.getById.invalidate({ id: variables.id });
      utils.rombel.getByClass.invalidate();
    },
  });
};

// Hook untuk delete rombel
export const useDeleteRombel = () => {
  const utils = trpc.useUtils();
  
  return trpc.rombel.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch rombels
      utils.rombel.getAll.invalidate();
      utils.rombel.getByClass.invalidate();
    },
  });
};
