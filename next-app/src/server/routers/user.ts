import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { adminProcedure, protectedProcedure, publicProcedure, createTRPCRouter } from '../trpc'
import { prisma } from '../../lib/db'
import { 
  createUserSchema, 
  updateUserSchema, 
  getUserSchema, 
  getUsersSchema, 
  deleteUserSchema,
  changePasswordSchema,
  resetPasswordSchema,
  bulkUpdateUsersSchema
} from '@/lib/validations/user'
import { hash, compare } from 'bcryptjs'

// Type guards untuk discriminated union
function isStudentData(data: any): data is { 
  studentId: string; 
  classId: string; 
  majorId: string;
  birthDate?: string | Date;
  birthPlace?: string;
  gender: string;
  grade: number;
  rombelId: string;
} {
  return 'studentId' in data && 'classId' in data && 'majorId' in data
}

function isTeacherData(data: any): data is { 
  employeeId: string; 
  hireDate: Date; 
  subjects: string[]; 
  position: string 
} {
  return 'employeeId' in data && 'hireDate' in data && 'position' in data
}

function isStaffData(data: any): data is { 
  employeeId: string; 
  position: string; 
  hireDate: Date; 
  departmentId: string 
} {
  return 'employeeId' in data && 'position' in data && 'departmentId' in data
}

export const userRouter = createTRPCRouter({
  // Get all users with filters and pagination
  getAll: protectedProcedure
    .input(getUsersSchema)
    .query(async ({ input }) => {
      try {
        const { schoolId, role, classId, majorId, isActive, search, page, limit } = input
        
        const skip = (page - 1) * limit

        // Build where clause based on role
        let whereClause: any = { schoolId }
        
        if (isActive !== undefined) {
          // Handle isActive that could be boolean or string
          if (typeof isActive === 'string') {
            if (isActive === 'true') {
              whereClause.isActive = true
            } else if (isActive === 'false') {
              whereClause.isActive = false
            }
            // If isActive === 'all', don't add any filter
          } else {
            whereClause.isActive = isActive
          }
        }

        if (search) {
          whereClause.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        }

        // Handle different user types using switch statement to avoid TypeScript type narrowing issues
        let users: any[] = []
        let totalCount = 0
        
        switch (role) {
          case 'STUDENT': {
            const studentWhere = { ...whereClause }
            if (classId) studentWhere.classId = classId
            if (majorId) {
              studentWhere.class = { majorId }
            }

            const [students, count] = await Promise.all([
              prisma.student.findMany({
                where: studentWhere,
                include: {
                  class: {
                    include: {
                      major: true
                    }
                  },
                  rombel: true
                },
                skip,
                take: limit,
                orderBy: { name: 'asc' }
              }),
              prisma.student.count({ where: studentWhere })
            ])

            users = students.map(student => ({
              ...student,
              role: 'STUDENT' as const,
              type: 'student'
            }))
            totalCount = count
            break
          }

          case 'TEACHER': {
            const teacherWhere = { ...whereClause }
            if (classId) {
              teacherWhere.classes = { some: { id: classId } }
            }

            const [teachers, count] = await Promise.all([
              prisma.teacher.findMany({
                where: teacherWhere,
                include: {
                  classes: true,
                  subjects: true,
                  department: true
                },
                skip,
                take: limit,
                orderBy: { name: 'asc' }
              }),
              prisma.teacher.count({ where: teacherWhere })
            ])

            users = teachers.map(teacher => ({
              ...teacher,
              // Fallback: tampilkan employeeId jika teacherId tidak ada di schema
              teacherId: (teacher as any).teacherId ?? teacher.employeeId ?? undefined,
              role: 'TEACHER' as const,
              type: 'teacher'
            }))
            totalCount = count
            break
          }

          case 'STAFF': {
            const staffWhere = { ...whereClause }
            if (majorId) {
              staffWhere.department = { id: majorId } // Using majorId as departmentId for now
            }

            const [staffMembers, count] = await Promise.all([
              prisma.staff.findMany({
                where: staffWhere,
                include: {
                  department: true
                },
                skip,
                take: limit,
                orderBy: { name: 'asc' }
              }),
              prisma.staff.count({ where: staffWhere })
            ])

            users = staffMembers.map(staff => ({
              ...staff,
              role: 'STAFF' as const,
              type: 'staff'
            }))
            totalCount = count
            break
          }

          case 'PARENT': {
            // Handle PARENT role if needed
            users = []
            totalCount = 0
            break
          }

          case 'ADMIN':
          case 'SUPER_ADMIN': {
            // Handle ADMIN/SUPER_ADMIN role if needed
            users = []
            totalCount = 0
            break
          }

          default: {
            // Get all user types when no specific role is selected
            const [students, teachers, staffMembers] = await Promise.all([
              prisma.student.findMany({
                where: { ...whereClause, classId: classId || undefined },
                include: {
                  class: { include: { major: true } },
                  rombel: true
                },
                skip: Math.floor(skip / 3),
                take: Math.ceil(limit / 3),
                orderBy: { name: 'asc' }
              }),
              prisma.teacher.findMany({
                where: whereClause,
                include: {
                  classes: true,
                  subjects: true,
                  department: true
                },
                skip: Math.floor(skip / 3),
                take: Math.ceil(limit / 3),
                orderBy: { name: 'asc' }
              }),
              prisma.staff.findMany({
                where: whereClause,
                include: {
                  department: true
                },
                skip: Math.floor(skip / 3),
                take: Math.ceil(limit / 3),
                orderBy: { name: 'asc' }
              })
            ])

            users = [
              ...students.map(s => ({ ...s, role: 'STUDENT' as const, type: 'student' })),
              ...teachers.map(t => ({ ...t, role: 'TEACHER' as const, type: 'teacher' })),
              ...staffMembers.map(st => ({ ...st, role: 'STAFF' as const, type: 'staff' }))
            ]

            totalCount = await Promise.all([
              prisma.student.count({ where: { ...whereClause, classId: classId || undefined } }),
              prisma.teacher.count({ where: whereClause }),
              prisma.staff.count({ where: whereClause })
            ]).then(counts => counts.reduce((a, b) => a + b, 0))
            break
          }
        }

        return {
          users,
          pagination: {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit)
          }
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengambil data users',
          cause: error,
        })
      }
    }),

  // Get user by ID
  getById: protectedProcedure
    .input(getUserSchema)
    .query(async ({ input }) => {
      try {
        const { id } = input

        // Try to find user in different tables
        const student = await prisma.student.findUnique({
          where: { id },
          include: {
            class: { include: { major: true } },
            rombel: true
          }
        })

        if (student) {
          return { ...student, role: 'STUDENT' as const, type: 'student' }
        }

        const teacher = await prisma.teacher.findUnique({
          where: { id },
          include: {
            classes: true,
            subjects: true,
            department: true
          }
        })

        if (teacher) {
          return { 
            ...teacher, 
            teacherId: (teacher as any).teacherId ?? teacher.employeeId ?? undefined,
            role: 'TEACHER' as const, 
            type: 'teacher' 
          }
        }

        const staff = await prisma.staff.findUnique({
          where: { id },
          include: {
            department: true
          }
        })

        if (staff) {
          return { ...staff, role: 'STAFF' as const, type: 'staff' }
        }

        // Check in NextAuth users table
        const authUser = await prisma.user.findUnique({
          where: { id },
          include: {
            accounts: true,
            sessions: true
          }
        })

        if (authUser) {
          return { ...authUser, type: 'auth' }
        }

        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User tidak ditemukan',
        })
      } catch (error) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengambil data user',
          cause: error,
        })
      }
    }),

  // Create new user
  create: adminProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      try {
        const { role, ...userData } = input

        if (role === 'STUDENT' && isStudentData(userData)) {
          const student = await prisma.student.create({
            data: {
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              address: userData.address,
              birthDate: userData.birthDate ? new Date(userData.birthDate) : undefined,
              gender: userData.gender || 'OTHER',
              studentId: userData.studentId,
              classId: userData.classId,
              rombelId: userData.rombelId,
              schoolId: userData.schoolId,
              isActive: userData.isActive ?? true
            },
            include: {
              class: { include: { major: true } },
              rombel: true
            }
          })

          return { ...student, role: 'STUDENT' as const, type: 'student' }

        } else if (role === 'TEACHER' && isTeacherData(userData)) {
          const teacher = await prisma.teacher.create({
            data: {
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              address: userData.address,
              employeeId: userData.employeeId,
              position: userData.position,
              hireDate: userData.hireDate,
              schoolId: userData.schoolId,
              isActive: userData.isActive ?? true,
              // Optional department for teacher
              departmentId: (userData as any).departmentId || undefined,
              subjects: { connect: userData.subjects?.map(id => ({ id })) || [] }
            },
            include: {
              classes: true,
              subjects: true,
              department: true
            }
          })

          return { ...teacher, role: 'TEACHER' as const, type: 'teacher' }

        } else if (role === 'STAFF' && isStaffData(userData)) {
          const staff = await prisma.staff.create({
            data: {
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              address: userData.address,
              employeeId: userData.employeeId,
              position: userData.position,
              hireDate: userData.hireDate,
              departmentId: userData.departmentId,
              schoolId: userData.schoolId,
              isActive: userData.isActive ?? true
            },
            include: {
              department: true
            }
          })

          return { ...staff, role: 'STAFF' as const, type: 'staff' }

        } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
          // Create in NextAuth users table
          const hashedPassword = (userData as any).password ? await hash((userData as any).password, 12) : undefined
          
          const admin = await prisma.user.create({
            data: {
              name: userData.name,
              email: userData.email,
              password: hashedPassword,
              role: role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN',
              permissions: (userData as any).permissions || []
            }
          })

          return { ...admin, type: 'auth' }
        }

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Role tidak valid',
        })
      } catch (error: any) {
        if (error instanceof TRPCError) throw error
        
        if (error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Email atau ID sudah terdaftar',
          })
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal membuat user',
          cause: error,
        })
      }
    }),

  // Update user
  update: adminProcedure
    .input(updateUserSchema)
    .mutation(async ({ input }) => {
      const { id, data } = input

      // Try student
      try {
        const updatedStudent = await prisma.student.update({
          where: { id },
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            isActive: data.isActive
          },
          include: {
            class: { include: { major: true } },
            rombel: true
          }
        })
        return { ...updatedStudent, role: 'STUDENT' as const, type: 'student' }
      } catch (err: any) {
        if (err?.code && err.code !== 'P2025') {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Gagal mengupdate student', cause: err })
        }
      }

      // Try teacher
      try {
        const updatedTeacher = await prisma.teacher.update({
          where: { id },
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            isActive: data.isActive,
            ...(data as any).departmentId ? { departmentId: (data as any).departmentId } : {}
          },
          include: {
            classes: true,
            subjects: true,
            department: true
          }
        })
        return { ...updatedTeacher, role: 'TEACHER' as const, type: 'teacher' }
      } catch (err: any) {
        if (err?.code && err.code !== 'P2025') {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Gagal mengupdate teacher', cause: err })
        }
      }

      // Try staff
      try {
        const updatedStaff = await prisma.staff.update({
          where: { id },
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            isActive: data.isActive,
            // departmentId tidak ada di schema update umum; tambahkan jika tersedia
            ...(data as any).departmentId ? { departmentId: (data as any).departmentId } : {}
          },
          include: {
            department: true
          }
        })
        return { ...updatedStaff, role: 'STAFF' as const, type: 'staff' }
      } catch (err: any) {
        if (err?.code && err.code !== 'P2025') {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Gagal mengupdate staff', cause: err })
        }
      }

      // Try NextAuth user
      try {
        const authUser = await prisma.user.update({
          where: { id },
          data: {
            name: data.name,
            email: data.email,
            image: data.avatar as any
          }
        })
        return { ...authUser, type: 'auth' }
      } catch (err: any) {
        if (err?.code && err.code !== 'P2025') {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Gagal mengupdate user', cause: err })
        }
      }

      // If none updated
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User tidak ditemukan' })
    }),

  // Delete user
  delete: adminProcedure
    .input(deleteUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id } = input

        // Try to delete from different tables
        try {
          const deletedStudent = await prisma.student.delete({
            where: { id }
          })
          return { success: true, message: 'Student berhasil dihapus', type: 'student' }
        } catch {
          // Student not found, try teacher
        }

        try {
          const deletedTeacher = await prisma.teacher.delete({
            where: { id }
          })
          return { success: true, message: 'Teacher berhasil dihapus', type: 'teacher' }
        } catch {
          // Teacher not found, try staff
        }

        try {
          const deletedStaff = await prisma.staff.delete({
            where: { id }
          })
          return { success: true, message: 'Staff berhasil dihapus', type: 'staff' }
        } catch {
          // Staff not found, try auth user
        }

        // Delete from NextAuth users table
        const deletedUser = await prisma.user.delete({
          where: { id }
        })

        return { success: true, message: 'User berhasil dihapus', type: 'auth' }

      } catch (error) {
        if (error instanceof TRPCError) throw error
        
        if (error.code === 'P2025') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User tidak ditemukan',
          })
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal menghapus user',
          cause: error,
        })
      }
    }),

  // Change password
  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id, currentPassword, newPassword } = input

        // Find user in NextAuth table
        const         user = await prisma.user.findUnique({
          where: { id }
        })

        if (!user || !user.password) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User tidak ditemukan atau tidak memiliki password',
          })
        }

        // Verify current password
        const isValidPassword = await compare(currentPassword, user.password)
        if (!isValidPassword) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Password saat ini tidak valid',
          })
        }

        // Hash new password
        const hashedPassword = await hash(newPassword, 12)

        // Update password
        await prisma.user.update({
          where: { id },
          data: { password: hashedPassword }
        })

        return { success: true, message: 'Password berhasil diubah' }

      } catch (error) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengubah password',
          cause: error,
        })
      }
    }),

  // Reset password (admin only)
  resetPassword: adminProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id, newPassword } = input

        // Hash new password
        const hashedPassword = await hash(newPassword, 12)

        // Update password
        await prisma.user.update({
          where: { id },
          data: { password: hashedPassword }
        })

        return { success: true, message: 'Password berhasil direset' }

      } catch (error) {
        if (error instanceof TRPCError) throw error
        
        if (error.code === 'P2025') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User tidak ditemukan',
          })
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mereset password',
          cause: error,
        })
      }
    }),

  // Bulk update users
  bulkUpdate: adminProcedure
    .input(bulkUpdateUsersSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { userIds, updates } = input

        // Update students
        await prisma.student.updateMany({
          where: { id: { in: userIds } },
          data: {
            isActive: updates.isActive,
            classId: updates.classId
          }
        })

        // Update teachers
        await prisma.teacher.updateMany({
          where: { id: { in: userIds } },
          data: {
            isActive: updates.isActive
          }
        })

        // Update staff
        await prisma.staff.updateMany({
          where: { id: { in: userIds } },
          data: {
            isActive: updates.isActive
          }
        })

        return { success: true, message: `${userIds.length} users berhasil diupdate` }

      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal melakukan bulk update',
          cause: error,
        })
      }
    }),

  // Get user statistics
  getStats: protectedProcedure
    .input(z.object({ schoolId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const { schoolId } = input

        const [totalStudents, activeStudents, totalTeachers, activeTeachers, totalStaff, activeStaff, totalAdmins, activeAdmins] = await Promise.all([
          prisma.student.count({ where: { schoolId } }),
          prisma.student.count({ where: { schoolId, isActive: true } }),
          prisma.teacher.count({ where: { schoolId } }),
          prisma.teacher.count({ where: { schoolId, isActive: true } }),
          prisma.staff.count({ where: { schoolId } }),
          prisma.staff.count({ where: { schoolId, isActive: true } }),
          prisma.user.count({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } } }),
          prisma.user.count({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } } })
        ])

        return {
          totalStudents,
          activeStudents,
          totalTeachers,
          activeTeachers,
          totalStaff,
          activeStaff,
          totalAdmins,
          activeAdmins,
          totalUsers: totalStudents + totalTeachers + totalStaff + totalAdmins,
          activeUsers: activeStudents + activeTeachers + activeStaff + activeAdmins
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengambil statistik users',
          cause: error,
        })
      }
    })
})
