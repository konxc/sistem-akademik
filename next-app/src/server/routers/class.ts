import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "../trpc";
import { prisma } from "../../lib/db";
import { 
  createClassSchema, 
  updateClassSchema, 
  getClassesSchema, 
  deleteClassSchema,
  getClassByIdSchema,
  type CreateClassInput,
  type UpdateClassInput
} from "../../lib/validations/class";

export const classRouter = createTRPCRouter({
  // Get all classes with pagination and filters
  getAll: protectedProcedure
    .input(getClassesSchema)
    .query(async ({ input }) => {
      const { schoolId, grade, isActive, search, page, limit, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      try {
        // Build where clause
        const where: any = {};
        if (schoolId) where.schoolId = schoolId;
        if (grade) where.grade = grade;
        if (isActive !== undefined) where.isActive = isActive;
        
        // Add search filter
        if (search) {
          const gradeNumber = parseInt(search);
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            ...(isNaN(gradeNumber) ? [] : [{ grade: { equals: gradeNumber } }]),
          ];
        }

        // Get total count
        const total = await prisma.class.count({ where });

        // Get classes with pagination
        const classes = await prisma.class.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            school: {
              select: {
                id: true,
                name: true,
              }
            },
            rombels: {
              where: { isActive: true },
              select: {
                id: true,
                name: true,
                currentStudents: true,
                maxStudents: true,
              }
            },
            _count: {
              select: {
                rombels: {
                  where: { isActive: true }
                }
              }
            }
          }
        });

        // Calculate statistics for each class
        const classesWithStats = classes.map(cls => {
          const totalRombels = cls._count.rombels;
          const totalStudents = cls.rombels.reduce((sum, rombel) => sum + (rombel.currentStudents || 0), 0);
          const totalCapacity = cls.rombels.reduce((sum, rombel) => sum + (rombel.maxStudents || 0), 0);
          
          return {
            ...cls,
            _count: undefined, // Remove _count from response
            totalRombels,
            totalStudents,
            totalCapacity,
            utilizationRate: totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0,
          };
        });

        const totalPages = Math.ceil(total / limit);

        return {
          data: classesWithStats,
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mengambil data kelas",
          cause: error,
        });
      }
    }),

  // Get class by ID
  getById: protectedProcedure
    .input(getClassByIdSchema)
    .query(async ({ input }) => {
      try {
        const classData = await prisma.class.findUnique({
          where: { id: input.id },
          include: {
            school: {
              select: {
                id: true,
                name: true,
              }
            },
            rombels: {
              where: { isActive: true },
              select: {
                id: true,
                name: true,
                currentStudents: true,
                maxStudents: true,
                isActive: true,
              },
              orderBy: { name: 'asc' }
            },
            _count: {
              select: {
                rombels: {
                  where: { isActive: true }
                }
              }
            }
          }
        });

        if (!classData) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Kelas tidak ditemukan",
          });
        }

        // Calculate statistics
        const totalRombels = classData._count.rombels;
        const totalStudents = classData.rombels.reduce((sum, rombel) => sum + (rombel.currentStudents || 0), 0);
        const totalCapacity = classData.rombels.reduce((sum, rombel) => sum + (rombel.maxStudents || 0), 0);

        return {
          ...classData,
          _count: undefined,
          totalRombels,
          totalStudents,
          totalCapacity,
          utilizationRate: totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mengambil data kelas",
          cause: error,
        });
      }
    }),

  // Get classes by school ID
  getBySchool: protectedProcedure
    .input(z.object({ schoolId: z.string() }))
    .query(async ({ input }) => {
      try {
        const classes = await prisma.class.findMany({
          where: {
            schoolId: input.schoolId,
            isActive: true,
          },
          orderBy: [
            { grade: 'asc' },
            { name: 'asc' }
          ],
          select: {
            id: true,
            name: true,
            grade: true,
            capacity: true,
            currentStudents: true,
            rombels: {
              where: { isActive: true },
              select: {
                id: true,
                name: true,
                currentStudents: true,
                maxStudents: true,
              }
            },
            _count: {
              select: {
                rombels: {
                  where: { isActive: true }
                }
              }
            }
          }
        });

        return classes.map(cls => {
          const totalStudents = cls.rombels.reduce((sum, rombel) => sum + (rombel.currentStudents || 0), 0);
          const totalCapacity = cls.rombels.reduce((sum, rombel) => sum + (rombel.maxStudents || 0), 0);
          
          return {
            ...cls,
            _count: undefined,
            totalStudents,
            totalCapacity,
            utilizationRate: totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0,
          };
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mengambil data kelas untuk sekolah ini",
          cause: error,
        });
      }
    }),

  // Create new class
  create: adminProcedure
    .input(createClassSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if class name already exists in the same school
        const existingClass = await prisma.class.findFirst({
          where: {
            name: input.name,
            schoolId: input.schoolId,
            isActive: true,
          }
        });

        if (existingClass) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Nama kelas sudah ada di sekolah ini",
          });
        }

        const newClass = await prisma.class.create({
          data: input,
          include: {
            school: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        });

        return {
          ...newClass,
          message: "Kelas berhasil dibuat",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal membuat kelas",
          cause: error,
        });
      }
    }),

  // Update class
  update: adminProcedure
    .input(updateClassSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;

        // Check if class exists
        const existingClass = await prisma.class.findUnique({
          where: { id }
        });

        if (!existingClass) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Kelas tidak ditemukan",
          });
        }

        // Check if new name conflicts with existing class in same school
        if (updateData.name && updateData.name !== existingClass.name) {
          const nameConflict = await prisma.class.findFirst({
            where: {
              name: updateData.name,
              schoolId: existingClass.schoolId,
              id: { not: id },
              isActive: true,
            }
          });

          if (nameConflict) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Nama kelas sudah ada di sekolah ini",
            });
          }
        }

        const updatedClass = await prisma.class.update({
          where: { id },
          data: updateData,
          include: {
            school: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        });

        return {
          ...updatedClass,
          message: "Kelas berhasil diupdate",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mengupdate kelas",
          cause: error,
        });
      }
    }),

  // Delete class (soft delete)
  delete: adminProcedure
    .input(deleteClassSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if class exists
        const existingClass = await prisma.class.findUnique({
          where: { id: input.id },
          include: {
            rombels: {
              where: { isActive: true },
              select: { id: true, name: true }
            }
          }
        });

        if (!existingClass) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Kelas tidak ditemukan",
          });
        }

        // Check if class has active rombels
        if (existingClass.rombels.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Tidak dapat menghapus kelas yang masih memiliki rombel aktif",
          });
        }

        // Soft delete
        await prisma.class.update({
          where: { id: input.id },
          data: { isActive: false }
        });

        return { 
          success: true, 
          message: "Kelas berhasil dihapus" 
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal menghapus kelas",
          cause: error,
        });
      }
    }),

  // Get class statistics
  getStats: protectedProcedure
    .input(z.object({ schoolId: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        const where: any = { isActive: true };
        if (input.schoolId) where.schoolId = input.schoolId;

        const [totalClasses, totalRombels, totalStudents, totalCapacity] = await Promise.all([
          prisma.class.count({ where }),
          prisma.rombel.count({ 
            where: { 
              class: where,
              isActive: true 
            } 
          }),
          prisma.rombel.aggregate({
            where: { 
              class: where,
              isActive: true 
            },
            _sum: { currentStudents: true }
          }),
          prisma.rombel.aggregate({
            where: { 
              class: where,
              isActive: true 
            },
            _sum: { maxStudents: true }
          })
        ]);

        const totalStudentsCount = totalStudents._sum.currentStudents || 0;
        const totalCapacityCount = totalCapacity._sum.maxStudents || 0;

        return {
          totalClasses,
          totalRombels,
          totalStudents: totalStudentsCount,
          totalCapacity: totalCapacityCount,
          utilizationRate: totalCapacityCount > 0 ? Math.round((totalStudentsCount / totalCapacityCount) * 100) : 0,
          averageStudentsPerClass: totalClasses > 0 ? Math.round(totalStudentsCount / totalClasses) : 0,
          averageStudentsPerRombel: totalRombels > 0 ? Math.round(totalStudentsCount / totalRombels) : 0,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mengambil statistik kelas",
          cause: error,
        });
      }
    }),
});
