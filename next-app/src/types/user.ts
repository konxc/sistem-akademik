// Base User Interface
export interface BaseUser {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  avatar?: string | null
  phone?: string
  address?: string
  dateOfBirth?: Date
  gender?: Gender
  schoolId: string
  createdAt: Date
  updatedAt: Date
}

// Student Interface
export interface Student extends BaseUser {
  role: 'STUDENT'
  studentId: string
  classId: string
  majorId: string
  enrollmentDate: Date
  graduationYear?: number
  parentIds: string[]
  emergencyContact?: EmergencyContact
  // Relations
  class?: ClassWithMajor
  rombel?: Rombel
}

// Teacher Interface
export interface Teacher extends BaseUser {
  role: 'TEACHER'
  teacherId: string
  employeeId: string
  hireDate: Date
  subjects: string[]
  qualifications?: Qualification[]
  specializations?: string[]
  isHomeroomTeacher: boolean
  homeroomClassId?: string
  // Relations
  classes?: Class[]
  subjectsList?: Subject[]
}

// Parent Interface
export interface Parent extends BaseUser {
  role: 'PARENT'
  parentId: string
  children: string[] // Array of student IDs
  occupation?: string
  company?: string
  income?: number
  isPrimaryContact: boolean
  // Relations
  childrenList?: Student[]
}

// Admin Interface
export interface Admin extends BaseUser {
  role: 'ADMIN' | 'SUPER_ADMIN'
  adminId: string
  employeeId: string
  hireDate: Date
  permissions: string[]
  department?: string
  isSuperAdmin: boolean
}

// Staff Interface
export interface Staff extends BaseUser {
  role: 'STAFF'
  employeeId: string
  position: string
  departmentId: string
  hireDate: Date
  // Relations
  department?: Department
}

// Union type for all user types
export type User = Student | Teacher | Parent | Admin | Staff

// Supporting Interfaces
export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface Qualification {
  degree: string
  institution: string
  year: number
}

export interface ClassWithMajor {
  id: string
  name: string
  grade: number
  major: {
    id: string
    name: string
    code: string
  }
}

export interface Class {
  id: string
  name: string
  grade: number
  capacity: number
  currentStudents: number
}

export interface Rombel {
  id: string
  name: string
  maxStudents: number
  currentStudents: number
}

export interface Subject {
  id: string
  name: string
  code: string
  description?: string
  credits: number
}

export interface Department {
  id: string
  name: string
  description?: string
}

// Enums
export type UserRole = 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN' | 'SUPER_ADMIN' | 'STAFF'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

// API Response Types
export interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UserStats {
  totalStudents: number
  activeStudents: number
  totalTeachers: number
  activeTeachers: number
  totalStaff: number
  activeStaff: number
  totalUsers: number
  activeUsers: number
}

// Form Types
export interface CreateUserFormData {
  role: UserRole
  name: string
  email: string
  password?: string
  phone?: string
  address?: string
  dateOfBirth?: Date
  gender?: Gender
  schoolId: string
  // Student specific
  studentId?: string
  classId?: string
  majorId?: string
  enrollmentDate?: Date
  graduationYear?: number
  parentIds?: string[]
  emergencyContact?: EmergencyContact
  // Teacher specific
  teacherId?: string
  employeeId?: string
  hireDate?: Date
  subjects?: string[]
  qualifications?: Qualification[]
  specializations?: string[]
  isHomeroomTeacher?: boolean
  homeroomClassId?: string
  // Parent specific
  parentId?: string
  children?: string[]
  occupation?: string
  company?: string
  income?: number
  isPrimaryContact?: boolean
  // Admin specific
  adminId?: string
  permissions?: string[]
  department?: string
  isSuperAdmin?: boolean
  // Staff specific
  position?: string
}

export interface UpdateUserFormData {
  name?: string
  email?: string
  isActive?: boolean
  avatar?: string | null
  phone?: string
  address?: string
  dateOfBirth?: Date
  gender?: Gender
}

// Filter Types
export interface UserFilters {
  schoolId: string
  role?: UserRole
  classId?: string
  majorId?: string
  isActive?: boolean
  search?: string
  page?: number
  limit?: number
}

// Mock Data Types (based on role-mock.ts)
export interface StudentMock {
  id: string
  name: string
  className: string
  scheduleToday: ScheduleItem[]
  announcements: Announcement[]
  finance: FinanceInfo
}

export interface TeacherMock {
  id: string
  name: string
  subjects: string[]
  dutyToday?: DutyInfo
  scheduleToday: ScheduleItem[]
  announcements: Announcement[]
}

export interface ParentMock {
  id: string
  name: string
  children: ChildInfo[]
  announcements: Announcement[]
}

export interface AdminMock {
  id: string
  name: string
  quickStats: QuickStat[]
  announcements: Announcement[]
}

export interface ScheduleItem {
  time: string
  title: string
  room: string
}

export interface Announcement {
  id: string
  title: string
}

export interface FinanceInfo {
  bill: number
  balance: number
}

export interface DutyInfo {
  type: 'attendance' | 'exam'
  classes: string[]
}

export interface ChildInfo {
  id: string
  name: string
  className: string
  finance: FinanceInfo
}

export interface QuickStat {
  title: string
  value: string
}
