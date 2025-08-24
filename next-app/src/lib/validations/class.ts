import { z } from "zod";

// Schema untuk membuat kelas baru
export const createClassSchema = z.object({
  name: z.string().min(1, "Nama kelas harus diisi"),
  grade: z.number().min(1, "Tingkat kelas harus minimal 1"),
  schoolId: z.string().min(1, "ID sekolah harus diisi"),
  academicYearId: z.string().min(1, "ID tahun akademik harus diisi"),
  majorId: z.string().optional(),
  capacity: z.number().min(1, "Kapasitas kelas harus minimal 1").default(40),
  isActive: z.boolean().default(true),
});

// Schema untuk update kelas
export const updateClassSchema = z.object({
  id: z.string().min(1, "ID kelas harus diisi"),
  name: z.string().min(1, "Nama kelas harus diisi").optional(),
  grade: z.number().min(1, "Tingkat kelas harus minimal 1").optional(),
  capacity: z.number().min(1, "Kapasitas kelas harus minimal 1").optional(),
  majorId: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Schema untuk query kelas dengan filter
export const getClassesSchema = z.object({
  schoolId: z.string().optional(),
  grade: z.number().optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["name", "grade", "createdAt", "capacity"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Schema untuk delete kelas
export const deleteClassSchema = z.object({
  id: z.string().min(1, "ID kelas harus diisi"),
});

// Schema untuk get kelas by ID
export const getClassByIdSchema = z.object({
  id: z.string().min(1, "ID kelas harus diisi"),
});

// Type exports
export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type GetClassesInput = z.infer<typeof getClassesSchema>;
export type DeleteClassInput = z.infer<typeof deleteClassSchema>;
export type GetClassByIdInput = z.infer<typeof getClassByIdSchema>;
