import { z } from "zod";

// Base schemas
export const baseSchema = z.object({
  id: z.string().cuid().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// School Schema
export const schoolSchema = baseSchema.extend({
  name: z.string().min(1, "Nama sekolah harus diisi"),
  foundedYear: z.number().int().min(1900, "Tahun berdiri tidak valid"),
  address: z.string().min(1, "Alamat harus diisi"),
  phone: z.string().min(1, "Nomor telepon harus diisi"),
  email: z.string().email("Format email tidak valid"),
  website: z.string().optional().or(z.literal("")),
  accreditation: z.string().optional(),
  totalStudents: z.number().int().min(0).default(0),
  totalTeachers: z.number().int().min(0).default(0),
  totalClasses: z.number().int().min(0).default(0),
  totalStaff: z.number().int().min(0).default(0),
});

export const createSchoolSchema = schoolSchema.omit({ 
  id: true, 
  totalStudents: true, 
  totalTeachers: true, 
  totalClasses: true, 
  totalStaff: true,
  createdAt: true, 
  updatedAt: true 
});

export const updateSchoolSchema = z.object({
  name: z.string().min(1, "Nama sekolah harus diisi").optional(),
  foundedYear: z.number().int().min(1900, "Tahun berdiri tidak valid").optional(),
  address: z.string().min(1, "Alamat harus diisi").optional(),
  phone: z.string().min(1, "Nomor telepon harus diisi").optional(),
  email: z.string().email("Format email tidak valid").optional(),
  website: z.string().optional(),
  accreditation: z.string().optional(),
  totalStudents: z.number().int().min(0).optional(),
  totalTeachers: z.number().int().min(0).optional(),
  totalClasses: z.number().int().min(0).optional(),
  totalStaff: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

// Academic Year Schema
export const academicYearSchema = baseSchema.extend({
  name: z.string().min(1, "Nama tahun ajaran harus diisi"),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean().default(false),
  schoolId: z.string().cuid(),
});

export const createAcademicYearSchema = academicYearSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const updateAcademicYearSchema = academicYearSchema.partial().omit({ 
  id: true, 
  schoolId: true,
  createdAt: true, 
  updatedAt: true 
});

// Department Schema
export const departmentSchema = baseSchema.extend({
  name: z.string().min(1, "Nama departemen harus diisi"),
  description: z.string().optional(),
  schoolId: z.string().cuid(),
});

export const createDepartmentSchema = departmentSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const updateDepartmentSchema = departmentSchema.partial().omit({ 
  id: true, 
  schoolId: true,
  createdAt: true, 
  updatedAt: true 
});

// Major Schema
export const majorSchema = baseSchema.extend({
  name: z.string().min(1, "Nama jurusan harus diisi"),
  code: z.string().min(1, "Kode jurusan harus diisi"),
  description: z.string().optional(),
  schoolId: z.string().cuid(),
});

export const createMajorSchema = majorSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const updateMajorSchema = majorSchema.partial().omit({ 
  id: true, 
  schoolId: true,
  createdAt: true, 
  updatedAt: true 
});

// Class Schema
export const classSchema = baseSchema.extend({
  name: z.string().min(1, "Nama kelas harus diisi"),
  grade: z.number().int().min(10).max(12, "Grade harus antara 10-12"),
  capacity: z.number().int().min(1, "Kapasitas harus minimal 1"),
  currentStudents: z.number().int().min(0).default(0),
  academicYearId: z.string().cuid(),
  majorId: z.string().cuid().optional(),
  schoolId: z.string().cuid(),
});

export const createClassSchema = classSchema.omit({ 
  id: true, 
  currentStudents: true,
  createdAt: true, 
  updatedAt: true 
});

export const updateClassSchema = classSchema.partial().omit({ 
  id: true, 
  schoolId: true,
  createdAt: true, 
  updatedAt: true 
});

// Teacher Schema
export const teacherSchema = baseSchema.extend({
  employeeId: z.string().min(1, "ID pegawai harus diisi"),
  name: z.string().min(1, "Nama guru harus diisi"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().optional(),
  address: z.string().optional(),
  position: z.string().min(1, "Posisi harus diisi"),
  subject: z.string().optional(),
  hireDate: z.date(),
  schoolId: z.string().cuid(),
});

export const createTeacherSchema = teacherSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const updateTeacherSchema = teacherSchema.partial().omit({ 
  id: true, 
  schoolId: true,
  createdAt: true, 
  updatedAt: true 
});

// Student Schema
export const studentSchema = baseSchema.extend({
  studentId: z.string().min(1, "ID siswa harus diisi"),
  name: z.string().min(1, "Nama siswa harus diisi"),
  email: z.string().email("Format email tidak valid").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  birthDate: z.date().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  classId: z.string().cuid(),
  schoolId: z.string().cuid(),
});

export const createStudentSchema = studentSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const updateStudentSchema = studentSchema.partial().omit({ 
  id: true, 
  schoolId: true,
  createdAt: true, 
  updatedAt: true 
});

// Staff Schema
export const staffSchema = baseSchema.extend({
  employeeId: z.string().min(1, "ID pegawai harus diisi"),
  name: z.string().min(1, "Nama staff harus diisi"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().optional(),
  address: z.string().optional(),
  position: z.string().min(1, "Posisi harus diisi"),
  departmentId: z.string().cuid(),
  hireDate: z.date(),
  schoolId: z.string().cuid(),
});

export const createStaffSchema = staffSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const updateStaffSchema = staffSchema.partial().omit({ 
  id: true, 
  schoolId: true,
  createdAt: true, 
  updatedAt: true 
});

// Subject Schema
export const subjectSchema = baseSchema.extend({
  name: z.string().min(1, "Nama mata pelajaran harus diisi"),
  code: z.string().min(1, "Kode mata pelajaran harus diisi"),
  description: z.string().optional(),
  credits: z.number().int().min(1, "SKS harus minimal 1"),
  schoolId: z.string().cuid(),
});

export const createSubjectSchema = subjectSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const updateSubjectSchema = subjectSchema.partial().omit({ 
  id: true, 
  schoolId: true,
  createdAt: true, 
  updatedAt: true 
});

// Query Schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const schoolQuerySchema = paginationSchema.extend({
  isActive: z.boolean().optional(),
});

export const classQuerySchema = paginationSchema.extend({
  academicYearId: z.string().cuid().optional(),
  majorId: z.string().cuid().optional(),
  grade: z.number().int().min(10).max(12).optional(),
  isActive: z.boolean().optional(),
});

export const teacherQuerySchema = paginationSchema.extend({
  position: z.string().optional(),
  subject: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const studentQuerySchema = paginationSchema.extend({
  classId: z.string().cuid().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  isActive: z.boolean().optional(),
});

export const staffQuerySchema = paginationSchema.extend({
  departmentId: z.string().cuid().optional(),
  position: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const subjectQuerySchema = paginationSchema.extend({
  credits: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// Response Schemas
export const schoolResponseSchema = schoolSchema.extend({
  academicYears: z.array(academicYearSchema).optional(),
  departments: z.array(departmentSchema).optional(),
  classes: z.array(classSchema).optional(),
  teachers: z.array(teacherSchema).optional(),
  students: z.array(studentSchema).optional(),
  staff: z.array(staffSchema).optional(),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    data: z.array(schema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  });

// Export types
export type School = z.infer<typeof schoolSchema>;
export type AcademicYear = z.infer<typeof academicYearSchema>;
export type Department = z.infer<typeof departmentSchema>;
export type Major = z.infer<typeof majorSchema>;
export type Class = z.infer<typeof classSchema>;
export type Teacher = z.infer<typeof teacherSchema>;
export type Student = z.infer<typeof studentSchema>;
export type Staff = z.infer<typeof staffSchema>;
export type Subject = z.infer<typeof subjectSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
