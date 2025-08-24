import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { protectedProcedure, adminProcedure } from '../trpc'
import { prisma } from '../../lib/db'
import { 
  createDepartmentSchema,
  updateDepartmentSchema,
  departmentQuerySchema
} from '@/lib/schemas/school'

export const departmentRouter = {
  createDepartment: adminProcedure
    .input(createDepartmentSchema)
    .mutation(async ({ input }) => {
      try {
        const department = await prisma.department.create({
          data: input
        })
        return department
      } catch (error) {
        if (error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Nama departemen sudah ada',
          })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal membuat departemen',
          cause: error,
        })
      }
    }),

  updateDepartment: adminProcedure
    .input(updateDepartmentSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input
        const department = await prisma.department.update({
          where: { id },
          data
        })
        return department
      } catch (error) {
        if (error.code === 'P2025') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Departemen tidak ditemukan',
          })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengupdate departemen',
          cause: error,
        })
      }
    }),

  deleteDepartment: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        // Check if department has staff
        const staffCount = await prisma.staff.count({
          where: { departmentId: input.id }
        })

        if (staffCount > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Tidak dapat menghapus departemen yang masih memiliki staff',
          })
        }

        await prisma.department.delete({
          where: { id: input.id }
        })
        
        return { success: true, message: 'Departemen berhasil dihapus' }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal menghapus departemen',
          cause: error,
        })
      }
    }),

  getDepartments: protectedProcedure
    .input(departmentQuerySchema)
    .query(async ({ input }) => {
      try {
        const departments = await prisma.department.findMany({
          where: {
            schoolId: input.schoolId,
            ...(input.isActive !== undefined && { isActive: input.isActive })
          },
          include: {
            _count: {
              select: {
                staff: true
              }
            }
          },
          orderBy: { name: 'asc' }
        })

        // Transform data to include staff count
        return departments.map(dept => ({
          ...dept,
          staffCount: dept._count.staff,
          teacherCount: 0 // Teachers don't have department relation in current schema
        }))
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengambil data departemen',
          cause: error,
        })
      }
    }),

  getDepartmentById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const department = await prisma.department.findUnique({
          where: { id: input.id },
          include: {
            staff: {
              select: {
                id: true,
                name: true,
                email: true,
                position: true,
                isActive: true
              }
            }
          }
        })

        if (!department) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Departemen tidak ditemukan',
          })
        }

        return department
      } catch (error) {
        if (error instanceof TRPCError) throw error
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengambil data departemen',
          cause: error,
        })
      }
    })
}
