import { z } from 'zod'

// School Schema
export const schoolSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nama sekolah harus diisi'),
  foundedYear: z.number().int().min(1900, 'Tahun berdiri tidak valid'),
  address: z.string().min(1, 'Alamat harus diisi'),
  phone: z.string().min(1, 'Nomor telepon harus diisi'),
  email: z.string().email('Format email tidak valid'),
  website: z.string().optional().or(z.literal('')),
  accreditation: z.string().optional(),
  totalStudents: z.number().int().min(0).default(0),
  totalTeachers: z.number().int().min(0).default(0),
  totalClasses: z.number().int().min(0).default(0),
  totalStaff: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export const createSchoolSchema = schoolSchema.omit({ 
  id: true, 
  totalStudents: true, 
  totalTeachers: true, 
  totalClasses: true, 
  totalStaff: true,
  createdAt: true, 
  updatedAt: true 
})

export const updateSchoolSchema = z.object({
  name: z.string().min(1, 'Nama sekolah harus diisi').optional(),
  foundedYear: z.number().int().min(1900, 'Tahun berdiri tidak valid').optional(),
  address: z.string().min(1, 'Alamat harus diisi').optional(),
  phone: z.string().min(1, 'Nomor telepon harus diisi').optional(),
  email: z.string().email('Format email tidak valid').optional(),
  website: z.string().optional(),
  accreditation: z.string().optional(),
  totalStudents: z.number().int().min(0).optional(),
  totalTeachers: z.number().int().min(0).optional(),
  totalClasses: z.number().int().min(0).optional(),
  totalStaff: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const schoolQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  isActive: z.boolean().optional(),
})

// Teacher Schema
export const teacherSchema = z.object({
  id: z.string().optional(),
  employeeId: z.string().min(1, 'ID pegawai harus diisi'),
  name: z.string().min(1, 'Nama guru harus diisi'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().optional(),
  address: z.string().optional(),
  position: z.string().min(1, 'Posisi harus diisi'),
  subject: z.string().optional(),
  hireDate: z.date(),
  isActive: z.boolean().default(true),
  schoolId: z.string().min(1, 'School ID harus diisi'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export const createTeacherSchema = teacherSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})

export const updateTeacherSchema = teacherSchema.partial().extend({
  id: z.string().min(1, 'Teacher ID harus diisi')
})

export const teacherQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  position: z.string().optional(),
  subject: z.string().optional(),
  isActive: z.boolean().optional(),
  schoolId: z.string().min(1, 'School ID harus diisi'),
})

// Student Schema
export const studentSchema = z.object({
  id: z.string().optional(),
  studentId: z.string().min(1, 'ID siswa harus diisi'),
  name: z.string().min(1, 'Nama siswa harus diisi'),
  email: z.string().email('Format email tidak valid').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  birthDate: z.date().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  classId: z.string().min(1, 'Class ID harus diisi'),
  schoolId: z.string().min(1, 'School ID harus diisi'),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export const createStudentSchema = studentSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})

export const updateStudentSchema = studentSchema.partial().extend({
  id: z.string().min(1, 'Student ID harus diisi')
})

export const studentQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  classId: z.string().min(1, 'Class ID harus diisi').optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  isActive: z.boolean().optional(),
  schoolId: z.string().min(1, 'School ID harus diisi'),
})

// Staff Schema
export const staffSchema = z.object({
  id: z.string().optional(),
  employeeId: z.string().min(1, 'ID pegawai harus diisi'),
  name: z.string().min(1, 'Nama staff harus diisi'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().optional(),
  address: z.string().optional(),
  position: z.string().min(1, 'Posisi harus diisi'),
  departmentId: z.string().min(1, 'Department ID harus diisi'),
  hireDate: z.date(),
  isActive: z.boolean().default(true),
  schoolId: z.string().min(1, 'School ID harus diisi'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export const createStaffSchema = staffSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})

export const updateStaffSchema = staffSchema.partial().extend({
  id: z.string().min(1, 'Staff ID harus diisi')
})

export const staffQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  departmentId: z.string().min(1, 'Department ID harus diisi').optional(),
  position: z.string().optional(),
  isActive: z.boolean().optional(),
  schoolId: z.string().min(1, 'School ID harus diisi'),
})

// Department Schema
export const departmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Nama departemen minimal 2 karakter').max(100, 'Nama departemen maksimal 100 karakter'),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
  isActive: z.boolean().default(true),
  schoolId: z.string().min(1, 'School ID harus diisi'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

// Create Department Schema
export const createDepartmentSchema = departmentSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})

// Update Department Schema
export const updateDepartmentSchema = departmentSchema.partial().extend({
  id: z.string().min(1, 'Department ID harus diisi')
})

// Department Query Schema
export const departmentQuerySchema = z.object({
  schoolId: z.string().min(1, 'School ID harus diisi'),
  isActive: z.boolean().optional()
})

// Academic Year Schema
export const academicYearSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Nama tahun ajaran minimal 2 karakter'),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean().default(false),
  schoolId: z.string().min(1, 'School ID harus diisi'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

// Create Academic Year Schema
export const createAcademicYearSchema = academicYearSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})

// Update Academic Year Schema
export const updateAcademicYearSchema = academicYearSchema.partial().extend({
  id: z.string().min(1, 'Academic Year ID harus diisi')
})

// Academic Year Query Schema
export const academicYearQuerySchema = z.object({
  schoolId: z.string().min(1, 'School ID harus diisi'),
  isActive: z.boolean().optional()
})

// Major Schema
export const majorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Nama jurusan minimal 2 karakter'),
  code: z.string().min(2, 'Kode jurusan minimal 2 karakter'),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
  isActive: z.boolean().default(true),
  schoolId: z.string().min(1, 'School ID harus diisi'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

// Create Major Schema
export const createMajorSchema = majorSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})

// Update Major Schema
export const updateMajorSchema = majorSchema.partial().extend({
  id: z.string().min(1, 'Major ID harus diisi')
})

// Major Query Schema
export const majorQuerySchema = z.object({
  schoolId: z.string().min(1, 'School ID harus diisi'),
  isActive: z.boolean().optional()
})

// Class Schema
export const classSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Nama kelas minimal 2 karakter'),
  academicYearId: z.string().min(1, 'Academic Year ID harus diisi'),
  majorId: z.string().min(1, 'Major ID harus diisi'),
  grade: z.number().min(1, 'Grade minimal 1').max(12, 'Grade maksimal 12'),
  capacity: z.number().min(1, 'Kapasitas minimal 1'),
  currentStudents: z.number().min(0, 'Jumlah siswa tidak boleh negatif').default(0),
  isActive: z.boolean().default(true),
  schoolId: z.string().min(1, 'School ID harus diisi'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

// Create Class Schema
export const createClassSchema = classSchema.omit({ 
  id: true, 
  currentStudents: true, 
  createdAt: true, 
  updatedAt: true 
})

// Update Class Schema
export const updateClassSchema = classSchema.partial().extend({
  id: z.string().min(1, 'Class ID harus diisi')
})

// Class Query Schema
export const classQuerySchema = z.object({
  schoolId: z.string().min(1, 'School ID harus diisi'),
  majorId: z.string().optional(),
  grade: z.number().optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  academicYearId: z.string().optional()
})

// Subject Schema
export const subjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Nama mata pelajaran minimal 2 karakter'),
  code: z.string().min(2, 'Kode mata pelajaran minimal 2 karakter'),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
  isActive: z.boolean().default(true),
  schoolId: z.string().min(1, 'School ID harus diisi'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

// Create Subject Schema
export const createSubjectSchema = subjectSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})

// Update Subject Schema
export const updateSubjectSchema = subjectSchema.partial().extend({
  id: z.string().min(1, 'Subject ID harus diisi')
})

// Subject Query Schema
export const subjectQuerySchema = z.object({
  schoolId: z.string().min(1, 'School ID harus diisi'),
  isActive: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  majorId: z.string().optional(),
  credits: z.number().optional()
})

// Rombel Schema
export const rombelSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Nama rombel minimal 2 karakter'),
  classId: z.string().min(1, 'Class ID harus diisi'),
  capacity: z.number().min(1, 'Kapasitas minimal 1'),
  currentStudents: z.number().min(0, 'Jumlah siswa tidak boleh negatif').default(0),
  isActive: z.boolean().default(true),
  schoolId: z.string().min(1, 'School ID harus diisi'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

// Create Rombel Schema
export const createRombelSchema = rombelSchema.omit({ 
  id: true, 
  currentStudents: true, 
  createdAt: true, 
  updatedAt: true 
})

// Update Rombel Schema
export const updateRombelSchema = rombelSchema.partial().extend({
  id: z.string().min(1, 'Rombel ID harus diisi')
})

// Rombel Query Schema
export const rombelQuerySchema = z.object({
  classId: z.string().min(1, 'Class ID harus diisi'),
  isActive: z.boolean().optional()
})

// Export types
export type School = z.infer<typeof schoolSchema>
export type Teacher = z.infer<typeof teacherSchema>
export type Student = z.infer<typeof studentSchema>
export type Staff = z.infer<typeof staffSchema>
export type Department = z.infer<typeof departmentSchema>
export type AcademicYear = z.infer<typeof academicYearSchema>
export type Major = z.infer<typeof majorSchema>
export type Class = z.infer<typeof classSchema>
export type Subject = z.infer<typeof subjectSchema>
export type Rombel = z.infer<typeof rombelSchema>
