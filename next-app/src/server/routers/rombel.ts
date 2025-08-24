import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure, adminProcedure } from "../trpc"
import { prisma } from "../../lib/db"
import { 
  createRombelSchema, 
  updateRombelSchema, 
  getRombelsSchema, 
  deleteRombelSchema,
  type CreateRombelInput,
  type UpdateRombelInput
} from "../../lib/validations/rombel"

export const rombelRouter = createTRPCRouter({
  // Get all rombels with pagination and filters
  getAll: protectedProcedure
    .input(getRombelsSchema)
    .query(async ({ input }) => {
      const { classId, schoolId, isActive, page, limit } = input
      const skip = (page - 1) * limit

      try {
        // Build where clause
        const where: any = {}
        if (classId) where.classId = classId
        if (schoolId) where.schoolId = schoolId
        if (isActive !== undefined) where.isActive = isActive

        // Get total count
        const total = await prisma.rombel.count({ where })

        // Get rombels with pagination
        const rombels = await prisma.rombel.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            class: {
              select: {
                id: true,
                name: true,
                grade: true,
              }
            },
            school: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        })

        const totalPages = Math.ceil(total / limit)

        return {
          data: rombels,
          total,
          page,
          limit,
          totalPages,
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mengambil data rombel",
          cause: error,
        })
      }
    }),

  // Get rombels by class ID
  getByClass: protectedProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ input }) => {
      try {
        const rombels = await prisma.rombel.findMany({
          where: {
            classId: input.classId,
            isActive: true,
          },
          orderBy: { name: "asc" },
          include: {
            class: {
              select: {
                id: true,
                name: true,
                grade: true,
              }
            }
          }
        })

        return rombels
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mengambil data rombel untuk kelas ini",
          cause: error,
        })
      }
    }),

  // Get rombel by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const rombel = await prisma.rombel.findUnique({
          where: { id: input.id },
          include: {
            class: {
              select: {
                id: true,
                name: true,
                grade: true,
              }
            },
            school: {
              select: {
                id: true,
                name: true,
              }
            },
            students: {
              select: {
                id: true,
                name: true,
                studentId: true,
              }
            }
          }
        })

        if (!rombel) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Rombel tidak ditemukan",
          })
        }

        return rombel
      } catch (error) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mengambil data rombel",
          cause: error,
        })
      }
    }),

  // Create new rombel
  create: adminProcedure
    .input(createRombelSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if class exists
        const classExists = await prisma.class.findUnique({
          where: { id: input.classId }
        })

        if (!classExists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Kelas tidak ditemukan",
          })
        }

        // Check if school exists
        const schoolExists = await prisma.school.findUnique({
          where: { id: input.schoolId }
        })

        if (!schoolExists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Sekolah tidak ditemukan",
          })
        }

        // Check if rombel name already exists in the same class
        const existingRombel = await prisma.rombel.findFirst({
          where: {
            name: input.name,
            classId: input.classId,
          }
        })

        if (existingRombel) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Rombel ${input.name} sudah ada di kelas ini`,
          })
        }

        // Create rombel
        const rombel = await prisma.rombel.create({
          data: {
            name: input.name,
            maxStudents: input.maxStudents,
            currentStudents: 0,
            classId: input.classId,
            schoolId: input.schoolId,
            isActive: true,
          },
          include: {
            class: {
              select: {
                id: true,
                name: true,
                grade: true,
              }
            }
          }
        })

        return rombel
      } catch (error) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal membuat rombel",
          cause: error,
        })
      }
    }),

  // Update rombel
  update: adminProcedure
    .input(updateRombelSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input

        // Check if rombel exists
        const existingRombel = await prisma.rombel.findUnique({
          where: { id }
        })

        if (!existingRombel) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Rombel tidak ditemukan",
          })
        }

        // If updating name, check for conflicts
        if (updateData.name && updateData.name !== existingRombel.name) {
          const nameConflict = await prisma.rombel.findFirst({
            where: {
              name: updateData.name,
              classId: existingRombel.classId,
              id: { not: id }
            }
          })

          if (nameConflict) {
            throw new TRPCError({
              code: "CONFLICT",
              message: `Rombel ${updateData.name} sudah ada di kelas ini`,
            })
          }
        }

        // Update rombel
        const updatedRombel = await prisma.rombel.update({
          where: { id },
          data: updateData,
          include: {
            class: {
              select: {
                id: true,
                name: true,
                grade: true,
              }
            }
          }
        })

        return updatedRombel
      } catch (error) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mengupdate rombel",
          cause: error,
        })
      }
    }),

  // Delete rombel
  delete: adminProcedure
    .input(deleteRombelSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if rombel exists
        const existingRombel = await prisma.rombel.findUnique({
          where: { id: input.id },
          include: {
            students: {
              select: { id: true }
            }
          }
        })

        if (!existingRombel) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Rombel tidak ditemukan",
          })
        }

        // Check if rombel has students
        if (existingRombel.students.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Tidak dapat menghapus rombel yang masih memiliki siswa",
          })
        }

        // Delete rombel
        await prisma.rombel.delete({
          where: { id: input.id }
        })

        return { success: true, message: "Rombel berhasil dihapus" }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal menghapus rombel",
          cause: error,
        })
      }
    }),

  // Get rombel statistics
  getStats: protectedProcedure
    .input(z.object({ classId: z.string().optional(), schoolId: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        const where: any = {}
        if (input.classId) where.classId = input.classId
        if (input.schoolId) where.schoolId = input.schoolId

        const [totalRombels, activeRombels, totalCapacity, totalStudents] = await Promise.all([
          prisma.rombel.count({ where }),
          prisma.rombel.count({ where: { ...where, isActive: true } }),
          prisma.rombel.aggregate({
            where: { ...where, isActive: true },
            _sum: { maxStudents: true }
          }),
          prisma.rombel.aggregate({
            where: { ...where, isActive: true },
            _sum: { currentStudents: true }
          })
        ])

        return {
          totalRombels,
          activeRombels,
          totalCapacity: totalCapacity._sum.maxStudents || 0,
          totalStudents: totalStudents._sum.currentStudents || 0,
          utilizationRate: totalCapacity._sum.maxStudents 
            ? Math.round((totalStudents._sum.currentStudents || 0) / totalCapacity._sum.maxStudents * 100)
            : 0
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mengambil statistik rombel",
          cause: error,
        })
      }
    }),
})
