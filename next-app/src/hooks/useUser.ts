import { trpc } from '@/lib/trpc';

// Type alias untuk menghindari infinite type instantiation
type UserRole = 'STUDENT' | 'TEACHER' | 'STAFF' | 'PARENT' | 'ADMIN' | 'SUPER_ADMIN';

// Hook untuk mendapatkan semua users dengan filters
export const useUsers = (params: {
  schoolId: string;
  role?: UserRole;
  classId?: string;
  majorId?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return trpc.user.getAll.useQuery(params);
};

// Hook untuk mendapatkan user by ID
export const useUserById = (id: string) => {
  return trpc.user.getById.useQuery({ id }, { enabled: !!id });
};

// Hook untuk membuat user baru
export const useCreateUser = () => {
  const utils = trpc.useUtils();
  
  return (trpc.user.create.useMutation as any)({
    onSuccess: () => {
      // Invalidate and refetch users
      utils.user.getAll.invalidate();
      utils.user.getStats.invalidate();
    },
  });
};

// Hook untuk update user
export const useUpdateUser = () => {
  const utils = trpc.useUtils();
  
  return (trpc.user.update.useMutation as any)({
    onSuccess: (_, variables) => {
      // Invalidate and refetch users
      utils.user.getAll.invalidate();
      utils.user.getById.invalidate({ id: variables.id });
      utils.user.getStats.invalidate();
    },
  });
};

// Hook untuk delete user
export const useDeleteUser = () => {
  const utils = trpc.useUtils();
  
  return trpc.user.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch users
      utils.user.getAll.invalidate();
      utils.user.getStats.invalidate();
    },
  });
};

// Hook untuk change password
export const useChangePassword = () => {
  const utils = trpc.useUtils();
  
  return trpc.user.changePassword.useMutation({
    onSuccess: () => {
      // Invalidate user data
      utils.user.getById.invalidate();
    },
  });
};

// Hook untuk reset password (admin only)
export const useResetPassword = () => {
  const utils = trpc.useUtils();
  
  return trpc.user.resetPassword.useMutation({
    onSuccess: () => {
      // Invalidate user data
      utils.user.getById.invalidate();
    },
  });
};

// Hook untuk bulk update users
export const useBulkUpdateUsers = () => {
  const utils = trpc.useUtils();
  
  return trpc.user.bulkUpdate.useMutation({
    onSuccess: () => {
      // Invalidate and refetch users
      utils.user.getAll.invalidate();
      utils.user.getStats.invalidate();
    },
  });
};

// Hook untuk mendapatkan user statistics
export const useUserStats = (schoolId: string) => {
  return trpc.user.getStats.useQuery({ schoolId }, { enabled: !!schoolId });
};

// Hook untuk mendapatkan students by class
export const useStudentsByClass = (classId: string) => {
  return trpc.user.getAll.useQuery({
    schoolId: '', // Will be set by component
    role: 'STUDENT',
    classId,
    limit: 100
  }, { enabled: !!classId });
};

// Hook untuk mendapatkan teachers by school
export const useTeachersBySchool = (schoolId: string) => {
  return trpc.user.getAll.useQuery({
    schoolId,
    role: 'TEACHER',
    limit: 100
  }, { enabled: !!schoolId });
};

// Hook untuk mendapatkan staff by school
export const useStaffBySchool = (schoolId: string) => {
  return trpc.user.getAll.useQuery({
    schoolId,
    role: 'STAFF',
    limit: 100
  }, { enabled: !!schoolId });
};

// Hook untuk search users
export const useSearchUsers = (params: {
  schoolId: string;
  search: string;
  role?: 'STUDENT' | 'TEACHER' | 'STAFF' | 'PARENT' | 'ADMIN' | 'SUPER_ADMIN';
  limit?: number;
}) => {
  return trpc.user.getAll.useQuery({
    ...params,
    page: 1,
    limit: params.limit || 20
  }, { 
    enabled: !!params.schoolId && !!params.search
  });
};
