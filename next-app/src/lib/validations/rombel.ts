import { z } from "zod"

// Schema untuk membuat rombel baru
export const createRombelSchema = z.object({
  name: z.string().min(1, "Nama rombel harus diisi").max(1, "Nama rombel maksimal 1 karakter"),
  maxStudents: z.number().min(1, "Kapasitas maksimal harus minimal 1").max(100, "Kapasitas maksimal maksimal 100"),
  classId: z.string().min(1, "ID kelas harus diisi"),
  schoolId: z.string().min(1, "ID sekolah harus diisi"),
})

// Schema untuk update rombel
export const updateRombelSchema = z.object({
  id: z.string().min(1, "ID rombel harus diisi"),
  name: z.string().min(1, "Nama rombel harus diisi").max(1, "Nama rombel maksimal 1 karakter").optional(),
  maxStudents: z.number().min(1, "Kapasitas maksimal harus minimal 1").max(100, "Kapasitas maksimal maksimal 100").optional(),
  isActive: z.boolean().optional(),
})

// Schema untuk query rombel
export const getRombelsSchema = z.object({
  classId: z.string().optional(),
  schoolId: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

// Schema untuk delete rombel
export const deleteRombelSchema = z.object({
  id: z.string().min(1, "ID rombel harus diisi"),
})

// Schema untuk response rombel
export const rombelResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  maxStudents: z.number(),
  currentStudents: z.number(),
  isActive: z.boolean(),
  classId: z.string(),
  schoolId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  class: z.object({
    id: z.string(),
    name: z.string(),
    grade: z.number(),
  }).optional(),
  school: z.object({
    id: z.string(),
    name: z.string(),
  }).optional(),
})

// Schema untuk list response rombel
export const rombelListResponseSchema = z.object({
  data: z.array(rombelResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

// Type exports
export type CreateRombelInput = z.infer<typeof createRombelSchema>
export type UpdateRombelInput = z.infer<typeof updateRombelSchema>
export type GetRombelsInput = z.infer<typeof getRombelsSchema>
export type DeleteRombelInput = z.infer<typeof deleteRombelSchema>
export type RombelResponse = z.infer<typeof rombelResponseSchema>
export type RombelListResponse = z.infer<typeof rombelListResponseSchema>
