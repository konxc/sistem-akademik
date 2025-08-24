import { z } from 'zod'

// Base User Schema
export const baseUserSchema = z.object({
  id: z.string().optional(), // Optional for create, required for update
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  email: z.string().email('Email tidak valid'),
  role: z.enum(['STUDENT', 'TEACHER', 'PARENT', 'ADMIN', 'SUPER_ADMIN']),
  isActive: z.boolean().default(true),
  avatar: z.string().url('Avatar harus berupa URL valid').optional().nullable(),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').max(15, 'Nomor telepon maksimal 15 digit').optional(),
  address: z.string().max(500, 'Alamat maksimal 500 karakter').optional(),
  dateOfBirth: z.union([z.string(), z.date()]).transform((val) => val ? new Date(val) : undefined).optional(),
  birthPlace: z.string().max(100, 'Tempat lahir maksimal 100 karakter').optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  schoolId: z.string().min(1, 'School ID harus diisi'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

// Student Schema
export const studentSchema = baseUserSchema.extend({
  role: z.literal('STUDENT'),
  studentId: z.string().min(1, 'Student ID harus diisi'),
  classId: z.string().min(1, 'Class ID harus diisi'),
  majorId: z.string().min(1, 'Major ID harus diisi'),
  enrollmentDate: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  graduationYear: z.number().min(2000).max(2100).optional(),
  parentIds: z.array(z.string()).min(1, 'Minimal 1 orang tua').max(2, 'Maksimal 2 orang tua'),
  emergencyContact: z.object({
    name: z.string().min(2, 'Nama kontak darurat minimal 2 karakter'),
    phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
    relationship: z.string().min(2, 'Hubungan minimal 2 karakter')
  }).optional()
})

// Teacher Schema
export const teacherSchema = baseUserSchema.extend({
  role: z.literal('TEACHER'),
  teacherId: z.string().min(1, 'Teacher ID harus diisi'),
  employeeId: z.string().min(1, 'Employee ID harus diisi'),
  position: z.string().min(1, 'Position harus diisi'),
  hireDate: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  subjects: z.array(z.string()).min(1, 'Minimal 1 mata pelajaran'),
  departmentId: z.string().optional(),
  qualifications: z.array(z.object({
    degree: z.string().min(2, 'Gelar minimal 2 karakter'),
    institution: z.string().min(2, 'Institusi minimal 2 karakter'),
    year: z.number().min(1900).max(new Date().getFullYear())
  })).optional(),
  specializations: z.array(z.string()).optional(),
  isHomeroomTeacher: z.boolean().default(false),
  homeroomClassId: z.string().optional()
})

// Staff Schema
export const staffSchema = baseUserSchema.extend({
  role: z.literal('STAFF'),
  employeeId: z.string().min(1, 'Employee ID harus diisi'),
  position: z.string().min(1, 'Position harus diisi'),
  departmentId: z.string().min(1, 'Department ID harus diisi'),
  hireDate: z.union([z.string(), z.date()]).transform((val) => new Date(val))
})

// Parent Schema
export const parentSchema = baseUserSchema.extend({
  role: z.literal('PARENT'),
  parentId: z.string().min(1, 'Parent ID harus diisi'),
  children: z.array(z.string()).min(1, 'Minimal 1 anak'), // Array of student IDs
  occupation: z.string().max(100, 'Pekerjaan maksimal 100 karakter').optional(),
  company: z.string().max(100, 'Perusahaan maksimal 100 karakter').optional(),
  income: z.number().min(0, 'Pendapatan tidak boleh negatif').optional(),
  isPrimaryContact: z.boolean().default(false)
})

// Admin Schema
export const adminSchema = baseUserSchema.extend({
  role: z.enum(['ADMIN', 'SUPER_ADMIN']),
  adminId: z.string().min(1, 'Admin ID harus diisi'),
  employeeId: z.string().min(1, 'Employee ID harus diisi'),
  hireDate: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  permissions: z.array(z.string()).min(1, 'Minimal 1 permission'),
  department: z.string().max(100, 'Departemen maksimal 100 karakter').optional(),
  isSuperAdmin: z.boolean().default(false)
})

// Create User Schema (Union type)
export const createUserSchema = z.discriminatedUnion('role', [
  studentSchema.omit({ id: true, createdAt: true, updatedAt: true }),
  teacherSchema.omit({ id: true, createdAt: true, updatedAt: true }),
  staffSchema.omit({ id: true, createdAt: true, updatedAt: true }),
  parentSchema.omit({ id: true, createdAt: true, updatedAt: true }),
  adminSchema.omit({ id: true, createdAt: true, updatedAt: true })
])

// Update User Schema
export const updateUserSchema = z.object({
  id: z.string().min(1, 'User ID harus diisi'),
  data: z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    isActive: z.boolean().optional(),
    avatar: z.string().url().optional().nullable(),
    phone: z.string().min(10).max(15).optional(),
    address: z.string().max(500).optional(),
    dateOfBirth: z.date().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    departmentId: z.string().optional()
  })
})

// Get User Schema
export const getUserSchema = z.object({
  id: z.string().min(1, 'User ID harus diisi')
})

// Get Users Schema (with filters)
export const getUsersSchema = z.object({
  schoolId: z.string().min(1, 'School ID harus diisi'),
  role: z.enum(['STUDENT', 'TEACHER', 'STAFF', 'PARENT', 'ADMIN', 'SUPER_ADMIN']).optional(),
  classId: z.string().optional(),
  majorId: z.string().optional(),
  isActive: z.union([z.boolean(), z.enum(['true', 'false', 'all'])]).optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
})

// Delete User Schema
export const deleteUserSchema = z.object({
  id: z.string().min(1, 'User ID harus diisi')
})

// Change Password Schema
export const changePasswordSchema = z.object({
  id: z.string().min(1, 'User ID harus diisi'),
  currentPassword: z.string().min(6, 'Password minimal 6 karakter'),
  newPassword: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().min(6, 'Password minimal 6 karakter')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password baru dan konfirmasi password tidak cocok",
  path: ["confirmPassword"]
})

// Reset Password Schema
export const resetPasswordSchema = z.object({
  id: z.string().min(1, 'User ID harus diisi'),
  newPassword: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().min(6, 'Password minimal 6 karakter')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password baru dan konfirmasi password tidak cocok",
  path: ["confirmPassword"]
})

// Bulk Operations Schema
export const bulkUpdateUsersSchema = z.object({
  userIds: z.array(z.string()).min(1, 'Minimal 1 user ID'),
  updates: z.object({
    isActive: z.boolean().optional(),
    classId: z.string().optional(),
    majorId: z.string().optional()
  })
})

// Export types
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type GetUserInput = z.infer<typeof getUserSchema>
export type GetUsersInput = z.infer<typeof getUsersSchema>
export type DeleteUserInput = z.infer<typeof deleteUserSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type BulkUpdateUsersInput = z.infer<typeof bulkUpdateUsersSchema>
