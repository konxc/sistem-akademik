import { trpc } from '../lib/trpc/client';
import { useCallback } from 'react';
import { toast } from 'sonner';

// School Hooks
export const useSchools = (query: any) => {
  return trpc.school.getSchools.useQuery(query, {
    placeholderData: (previousData) => previousData,
  });
};

export const useSchoolById = (id: string) => {
  return trpc.school.getSchoolById.useQuery(id, {
    enabled: !!id,
  });
};

export const useCreateSchool = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.createSchool.useMutation({
    onSuccess: () => {
      toast.success('Sekolah berhasil dibuat');
      utils.school.getSchools.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal membuat sekolah');
    },
  });
};

export const useUpdateSchool = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.updateSchool.useMutation({
    onSuccess: () => {
      toast.success('Sekolah berhasil diupdate');
      utils.school.getSchools.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal mengupdate sekolah');
    },
  });
};

export const useDeleteSchool = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.deleteSchool.useMutation({
    onSuccess: () => {
      toast.success('Sekolah berhasil dihapus');
      utils.school.getSchools.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menghapus sekolah');
    },
  });
};

// Academic Year Hooks
export const useAcademicYears = (schoolId: string) => {
  return trpc.school.getAcademicYears.useQuery({ schoolId }, {
    enabled: !!schoolId,
  });
};

export const useCreateAcademicYear = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.createAcademicYear.useMutation({
    onSuccess: () => {
      toast.success('Tahun ajaran berhasil dibuat');
      utils.school.getAcademicYears.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal membuat tahun ajaran');
    },
  });
};

export const useUpdateAcademicYear = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.updateAcademicYear.useMutation({
    onSuccess: () => {
      toast.success('Tahun ajaran berhasil diupdate');
      utils.school.getAcademicYears.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal mengupdate tahun ajaran');
    },
  });
};

// Department Hooks
export const useDepartments = (schoolId: string) => {
  return trpc.school.getDepartments.useQuery({ schoolId }, {
    enabled: !!schoolId,
  });
};

export const useCreateDepartment = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.createDepartment.useMutation({
    onSuccess: () => {
      toast.success('Departemen berhasil dibuat');
      utils.school.getDepartments.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal membuat departemen');
    },
  });
};

export const useUpdateDepartment = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.updateDepartment.useMutation({
    onSuccess: () => {
      toast.success('Departemen berhasil diupdate');
      utils.school.getDepartments.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal mengupdate departemen');
    },
  });
};

// Major Hooks
export const useMajors = (schoolId: string) => {
  return trpc.school.getMajors.useQuery({ schoolId }, {
    enabled: !!schoolId,
  });
};

export const useCreateMajor = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.createMajor.useMutation({
    onSuccess: () => {
      toast.success('Jurusan berhasil dibuat');
      utils.school.getMajors.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal membuat jurusan');
    },
  });
};

export const useUpdateMajor = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.updateMajor.useMutation({
    onSuccess: () => {
      toast.success('Jurusan berhasil diupdate');
      utils.school.getMajors.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal mengupdate jurusan');
    },
  });
};

// Class Hooks
export const useClasses = (query: any) => {
  return trpc.school.getClasses.useQuery(query, {
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateClass = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.createClass.useMutation({
    onSuccess: () => {
      toast.success('Kelas berhasil dibuat');
      utils.school.getClasses.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal membuat kelas');
    },
  });
};

export const useUpdateClass = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.updateClass.useMutation({
    onSuccess: () => {
      toast.success('Kelas berhasil diupdate');
      utils.school.getClasses.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal mengupdate kelas');
    },
  });
};

// Teacher Hooks
export const useTeachers = (query: any) => {
  return trpc.school.getTeachers.useQuery(query, {
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateTeacher = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.createTeacher.useMutation({
    onSuccess: () => {
      toast.success('Guru berhasil ditambahkan');
      utils.school.getTeachers.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menambahkan guru');
    },
  });
};

export const useUpdateTeacher = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.updateTeacher.useMutation({
    onSuccess: () => {
      toast.success('Data guru berhasil diupdate');
      utils.school.getTeachers.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal mengupdate data guru');
    },
  });
};

// Student Hooks
export const useStudents = (query: any) => {
  return trpc.school.getStudents.useQuery(query, {
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateStudent = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.createStudent.useMutation({
    onSuccess: () => {
      toast.success('Siswa berhasil ditambahkan');
      utils.school.getStudents.invalidate();
      utils.school.getClasses.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menambahkan siswa');
    },
  });
};

export const useUpdateStudent = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.updateStudent.useMutation({
    onSuccess: () => {
      toast.success('Data siswa berhasil diupdate');
      utils.school.getStudents.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal mengupdate data siswa');
    },
  });
};

// Staff Hooks
export const useStaff = (query: any) => {
  return trpc.school.getStaff.useQuery(query, {
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateStaff = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.createStaff.useMutation({
    onSuccess: () => {
      toast.success('Staff berhasil ditambahkan');
      utils.school.getStaff.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menambahkan staff');
    },
  });
};

export const useUpdateStaff = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.updateStaff.useMutation({
    onSuccess: () => {
      toast.success('Data staff berhasil diupdate');
      utils.school.getStaff.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal mengupdate data staff');
    },
  });
};

// Subject Hooks
export const useSubjects = (query: any) => {
  return trpc.school.getSubjects.useQuery(query, {
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateSubject = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.createSubject.useMutation({
    onSuccess: () => {
      toast.success('Mata pelajaran berhasil ditambahkan');
      utils.school.getSubjects.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menambahkan mata pelajaran');
    },
  });
};

export const useUpdateSubject = () => {
  const utils = trpc.useUtils();
  
  return trpc.school.updateSubject.useMutation({
    onSuccess: () => {
      toast.success('Mata pelajaran berhasil diupdate');
      utils.school.getSubjects.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal mengupdate mata pelajaran');
    },
  });
};

// Dashboard Stats Hook
export const useDashboardStats = (schoolId: string) => {
  return trpc.school.getDashboardStats.useQuery(schoolId, {
    enabled: !!schoolId,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Utility hook untuk bulk operations
export const useBulkOperations = () => {
  const utils = trpc.useUtils();
  
  const invalidateAll = useCallback(() => {
    utils.school.getSchools.invalidate();
    utils.school.getClasses.invalidate();
    utils.school.getTeachers.invalidate();
    utils.school.getStudents.invalidate();
    utils.school.getStaff.invalidate();
    utils.school.getSubjects.invalidate();
  }, [utils]);

  return { invalidateAll };
};
