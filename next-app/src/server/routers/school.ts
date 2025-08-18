import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { prisma } from '../../lib/db';
import {
  createSchoolSchema,
  updateSchoolSchema,
  schoolQuerySchema,
  createAcademicYearSchema,
  updateAcademicYearSchema,
  createDepartmentSchema,
  updateDepartmentSchema,
  createMajorSchema,
  updateMajorSchema,
  createClassSchema,
  updateClassSchema,
  classQuerySchema,
  createTeacherSchema,
  updateTeacherSchema,
  teacherQuerySchema,
  createStudentSchema,
  updateStudentSchema,
  studentQuerySchema,
  createStaffSchema,
  updateStaffSchema,
  staffQuerySchema,
  createSubjectSchema,
  updateSubjectSchema,
  subjectQuerySchema,
} from '../../lib/schemas/school';
import {
  getPaginationData,
  createSearchFilter,
  createSortFilter,
  createActiveFilter,
  createIncludeFilter,
} from '../../lib/db';

export const schoolRouter = createTRPCRouter({
  // School CRUD
  getSchools: protectedProcedure
    .input(schoolQuerySchema)
    .query(async ({ input }) => {
      const { page, limit, search, sortBy, sortOrder, isActive } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...createActiveFilter(isActive),
        ...(search && createSearchFilter(search, ['name', 'address', 'email'])),
      };

      const [schools, total] = await Promise.all([
        prisma.school.findMany({
          where,
          skip,
          take: limit,
          orderBy: createSortFilter(sortBy, sortOrder),
          include: createIncludeFilter(['academicYears', 'departments', 'classes', 'teachers', 'students', 'staff']),
        }),
        prisma.school.count({ where }),
      ]);

      return {
        data: schools,
        pagination: getPaginationData(page, limit, total),
      };
    }),

  getSchoolById: protectedProcedure
    .input(z.string().cuid())
    .query(async ({ input }) => {
      const school = await prisma.school.findUnique({
        where: { id: input },
        include: createIncludeFilter(['academicYears', 'departments', 'classes', 'teachers', 'students', 'staff']),
      });

      if (!school) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Sekolah tidak ditemukan',
        });
      }

      return school;
    }),

  createSchool: protectedProcedure
    .input(createSchoolSchema)
    .mutation(async ({ input }) => {
      try {
        const school = await prisma.school.create({
          data: input,
        });

        return school;
      } catch (error: any) {
        if (error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Sekolah dengan data yang sama sudah ada',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal membuat sekolah',
        });
      }
    }),

  updateSchool: protectedProcedure
    .input(z.object({
      id: z.string().cuid(),
      data: updateSchoolSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        const school = await prisma.school.update({
          where: { id: input.id },
          data: input.data,
        });

        return school;
      } catch (error: any) {
        if (error.code === 'P2025') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Sekolah tidak ditemukan',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengupdate sekolah',
        });
      }
    }),

  deleteSchool: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ input }) => {
      try {
        await prisma.school.update({
          where: { id: input },
          data: { isActive: false },
        });

        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal menghapus sekolah',
        });
      }
    }),

  // Academic Year CRUD
  getAcademicYears: protectedProcedure
    .input(z.object({
      schoolId: z.string().cuid(),
      isActive: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      const where = {
        schoolId: input.schoolId,
        ...createActiveFilter(input.isActive),
      };

      const academicYears = await prisma.academicYear.findMany({
        where,
        orderBy: { startDate: 'desc' },
      });

      return academicYears;
    }),

  createAcademicYear: protectedProcedure
    .input(createAcademicYearSchema)
    .mutation(async ({ input }) => {
      try {
        // If this is the first academic year or marked as active, deactivate others
        if (input.isActive) {
          await prisma.academicYear.updateMany({
            where: { schoolId: input.schoolId },
            data: { isActive: false },
          });
        }

        const academicYear = await prisma.academicYear.create({
          data: input,
        });

        return academicYear;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal membuat tahun ajaran',
        });
      }
    }),

  updateAcademicYear: protectedProcedure
    .input(z.object({
      id: z.string().cuid(),
      data: updateAcademicYearSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        // If marking as active, deactivate others
        if (input.data.isActive) {
          const academicYear = await prisma.academicYear.findUnique({
            where: { id: input.id },
          });

          if (academicYear) {
            await prisma.academicYear.updateMany({
              where: { schoolId: academicYear.schoolId },
              data: { isActive: false },
            });
          }
        }

        const updated = await prisma.academicYear.update({
          where: { id: input.id },
          data: input.data,
        });

        return updated;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengupdate tahun ajaran',
        });
      }
    }),

  // Department CRUD
  getDepartments: protectedProcedure
    .input(z.object({
      schoolId: z.string().cuid(),
      isActive: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      const where = {
        schoolId: input.schoolId,
        ...createActiveFilter(input.isActive),
      };

      const departments = await prisma.department.findMany({
        where,
        orderBy: { name: 'asc' },
      });

      return departments;
    }),

  createDepartment: protectedProcedure
    .input(createDepartmentSchema)
    .mutation(async ({ input }) => {
      try {
        const department = await prisma.department.create({
          data: input,
        });

        return department;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal membuat departemen',
        });
      }
    }),

  updateDepartment: protectedProcedure
    .input(z.object({
      id: z.string().cuid(),
      data: updateDepartmentSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        const department = await prisma.department.update({
          where: { id: input.id },
          data: input.data,
        });

        return department;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengupdate departemen',
        });
      }
    }),

  // Major CRUD
  getMajors: protectedProcedure
    .input(z.object({
      schoolId: z.string().cuid(),
      isActive: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      const where = {
        schoolId: input.schoolId,
        ...createActiveFilter(input.isActive),
      };

      const majors = await prisma.major.findMany({
        where,
        orderBy: { name: 'asc' },
      });

      return majors;
    }),

  createMajor: protectedProcedure
    .input(createMajorSchema)
    .mutation(async ({ input }) => {
      try {
        const major = await prisma.major.create({
          data: input,
        });

        return major;
      } catch (error: any) {
        if (error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Jurusan dengan kode yang sama sudah ada',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal membuat jurusan',
        });
      }
    }),

  updateMajor: protectedProcedure
    .input(z.object({
      id: z.string().cuid(),
      data: updateMajorSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        const major = await prisma.major.update({
          where: { id: input.id },
          data: input.data,
        });

        return major;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengupdate jurusan',
        });
      }
    }),

  // Class CRUD
  getClasses: protectedProcedure
    .input(classQuerySchema)
    .query(async ({ input }) => {
      const { page, limit, search, sortBy, sortOrder, academicYearId, majorId, grade, isActive } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...createActiveFilter(isActive),
        ...(academicYearId && { academicYearId }),
        ...(majorId && { majorId }),
        ...(grade && { grade }),
        ...(search && createSearchFilter(search, ['name'])),
      };

      const [classes, total] = await Promise.all([
        prisma.class.findMany({
          where,
          skip,
          take: limit,
          orderBy: createSortFilter(sortBy, sortOrder),
          include: createIncludeFilter(['academicYear', 'major', 'school']),
        }),
        prisma.class.count({ where }),
      ]);

      return {
        data: classes,
        pagination: getPaginationData(page, limit, total),
      };
    }),

  createClass: protectedProcedure
    .input(createClassSchema)
    .mutation(async ({ input }) => {
      try {
        const classRecord = await prisma.class.create({
          data: input,
        });

        return classRecord;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal membuat kelas',
        });
      }
    }),

  updateClass: protectedProcedure
    .input(z.object({
      id: z.string().cuid(),
      data: updateClassSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        const classRecord = await prisma.class.update({
          where: { id: input.id },
          data: input.data,
        });

        return classRecord;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengupdate kelas',
        });
      }
    }),

  // Teacher CRUD
  getTeachers: protectedProcedure
    .input(teacherQuerySchema)
    .query(async ({ input }) => {
      const { page, limit, search, sortBy, sortOrder, position, subject, isActive } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...createActiveFilter(isActive),
        ...(position && { position }),
        ...(subject && { subject }),
        ...(search && createSearchFilter(search, ['name', 'employeeId', 'email'])),
      };

      const [teachers, total] = await Promise.all([
        prisma.teacher.findMany({
          where,
          skip,
          take: limit,
          orderBy: createSortFilter(sortBy, sortOrder),
          include: createIncludeFilter(['school', 'classes', 'subjects']),
        }),
        prisma.teacher.count({ where }),
      ]);

      return {
        data: teachers,
        pagination: getPaginationData(page, limit, total),
      };
    }),

  createTeacher: protectedProcedure
    .input(createTeacherSchema)
    .mutation(async ({ input }) => {
      try {
        const teacher = await prisma.teacher.create({
          data: input,
        });

        return teacher;
      } catch (error: any) {
        if (error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Guru dengan ID pegawai atau email yang sama sudah ada',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal membuat guru',
        });
      }
    }),

  updateTeacher: protectedProcedure
    .input(z.object({
      id: z.string().cuid(),
      data: updateTeacherSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        const teacher = await prisma.teacher.update({
          where: { id: input.id },
          data: input.data,
        });

        return teacher;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengupdate guru',
        });
      }
    }),

  // Student CRUD
  getStudents: protectedProcedure
    .input(studentQuerySchema)
    .query(async ({ input }) => {
      const { page, limit, search, sortBy, sortOrder, classId, gender, isActive } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...createActiveFilter(isActive),
        ...(classId && { classId }),
        ...(gender && { gender }),
        ...(search && createSearchFilter(search, ['name', 'studentId', 'email'])),
      };

      const [students, total] = await Promise.all([
        prisma.student.findMany({
          where,
          skip,
          take: limit,
          orderBy: createSortFilter(sortBy, sortOrder),
          include: createIncludeFilter(['class', 'school']),
        }),
        prisma.student.count({ where }),
      ]);

      return {
        data: students,
        pagination: getPaginationData(page, limit, total),
      };
    }),

  createStudent: protectedProcedure
    .input(createStudentSchema)
    .mutation(async ({ input }) => {
      try {
        const student = await prisma.student.create({
          data: input,
        });

        // Update class current students count
        await prisma.class.update({
          where: { id: input.classId },
          data: {
            currentStudents: {
              increment: 1,
            },
          },
        });

        return student;
      } catch (error: any) {
        if (error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Siswa dengan ID siswa atau email yang sama sudah ada',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal membuat siswa',
        });
      }
    }),

  updateStudent: protectedProcedure
    .input(z.object({
      id: z.string().cuid(),
      data: updateStudentSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        const student = await prisma.student.update({
          where: { id: input.id },
          data: input.data,
        });

        return student;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengupdate siswa',
        });
      }
    }),

  // Staff CRUD
  getStaff: protectedProcedure
    .input(staffQuerySchema)
    .query(async ({ input }) => {
      const { page, limit, search, sortBy, sortOrder, departmentId, position, isActive } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...createActiveFilter(isActive),
        ...(departmentId && { departmentId }),
        ...(position && { position }),
        ...(search && createSearchFilter(search, ['name', 'employeeId', 'email'])),
      };

      const [staff, total] = await Promise.all([
        prisma.staff.findMany({
          where,
          skip,
          take: limit,
          orderBy: createSortFilter(sortBy, sortOrder),
          include: createIncludeFilter(['department', 'school']),
        }),
        prisma.staff.count({ where }),
      ]);

      return {
        data: staff,
        pagination: getPaginationData(page, limit, total),
      };
    }),

  createStaff: protectedProcedure
    .input(createStaffSchema)
    .mutation(async ({ input }) => {
      try {
        const staff = await prisma.staff.create({
          data: input,
        });

        return staff;
      } catch (error: any) {
        if (error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Staff dengan ID pegawai atau email yang sama sudah ada',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal membuat staff',
        });
      }
    }),

  updateStaff: protectedProcedure
    .input(z.object({
      id: z.string().cuid(),
      data: updateStaffSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        const staff = await prisma.staff.update({
          where: { id: input.id },
          data: input.data,
        });

        return staff;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengupdate staff',
        });
      }
    }),

  // Subject CRUD
  getSubjects: protectedProcedure
    .input(subjectQuerySchema)
    .query(async ({ input }) => {
      const { page, limit, search, sortBy, sortOrder, credits, isActive } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...createActiveFilter(isActive),
        ...(credits && { credits }),
        ...(search && createSearchFilter(search, ['name', 'code'])),
      };

      const [subjects, total] = await Promise.all([
        prisma.subject.findMany({
          where,
          skip,
          take: limit,
          orderBy: createSortFilter(sortBy, sortOrder),
          include: createIncludeFilter(['school', 'teachers']),
        }),
        prisma.subject.count({ where }),
      ]);

      return {
        data: subjects,
        pagination: getPaginationData(page, limit, total),
      };
    }),

  createSubject: protectedProcedure
    .input(createSubjectSchema)
    .mutation(async ({ input }) => {
      try {
        const subject = await prisma.subject.create({
          data: input,
        });

        return subject;
      } catch (error: any) {
        if (error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Mata pelajaran dengan kode yang sama sudah ada',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal membuat mata pelajaran',
        });
      }
    }),

  updateSubject: protectedProcedure
    .input(z.object({
      id: z.string().cuid(),
      data: updateSubjectSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        const subject = await prisma.subject.update({
          where: { id: input.id },
          data: input.data,
        });

        return subject;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengupdate mata pelajaran',
        });
      }
    }),

  // Dashboard Statistics
  getDashboardStats: protectedProcedure
    .input(z.string().cuid())
    .query(async ({ input: schoolId }) => {
      const [
        totalStudents,
        totalTeachers,
        totalClasses,
        totalStaff,
        activeClasses,
        recentStudents,
        recentTeachers,
      ] = await Promise.all([
        prisma.student.count({ where: { schoolId, isActive: true } }),
        prisma.teacher.count({ where: { schoolId, isActive: true } }),
        prisma.class.count({ where: { schoolId, isActive: true } }),
        prisma.staff.count({ where: { schoolId, isActive: true } }),
        prisma.class.findMany({
          where: { schoolId, isActive: true },
          include: { major: true, academicYear: true },
          orderBy: { name: 'asc' },
        }),
        prisma.student.findMany({
          where: { schoolId, isActive: true },
          include: { class: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        prisma.teacher.findMany({
          where: { schoolId, isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

      return {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalStaff,
        activeClasses,
        recentStudents,
        recentTeachers,
      };
    }),
});
