import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@smauiiyk.sch.id' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@smauiiyk.sch.id',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create School
  const school = await prisma.school.create({
    data: {
      name: 'SMA UII',
      foundedYear: 2020,
      address: 'Jl. Kaliurang KM 14,5 Sleman, Yogyakarta',
      phone: '+62-274-898444',
      email: 'info@smauiiyk.sch.id',
      website: 'https://smauiiyk.sch.id',
      accreditation: 'A',
      totalStudents: 0,
      totalTeachers: 0,
      totalClasses: 0,
      totalStaff: 0,
    },
  });

  console.log('✅ School created:', school.name);

  // Create Academic Years
  const academicYear2024 = await prisma.academicYear.create({
    data: {
      name: '2024/2025',
      startDate: new Date('2024-07-15'),
      endDate: new Date('2025-06-30'),
      isActive: true,
      schoolId: school.id,
    },
  });

  const academicYear2023 = await prisma.academicYear.create({
    data: {
      name: '2023/2024',
      startDate: new Date('2023-07-15'),
      endDate: new Date('2024-06-30'),
      isActive: false,
      schoolId: school.id,
    },
  });

  console.log('✅ Academic years created');

  // Create Departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Akademik',
        description: 'Departemen yang menangani kurikulum dan pembelajaran',
        schoolId: school.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Kesiswaan',
        description: 'Departemen yang menangani kegiatan siswa',
        schoolId: school.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Sarana Prasarana',
        description: 'Departemen yang menangani fasilitas sekolah',
        schoolId: school.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Administrasi',
        description: 'Departemen yang menangani administrasi sekolah',
        schoolId: school.id,
      },
    }),
  ]);

  console.log('✅ Departments created');

  // Create Majors
  const majors = await Promise.all([
    prisma.major.create({
      data: {
        name: 'IPA',
        code: 'IPA',
        description: 'Ilmu Pengetahuan Alam',
        schoolId: school.id,
      },
    }),
    prisma.major.create({
      data: {
        name: 'IPS',
        code: 'IPS',
        description: 'Ilmu Pengetahuan Sosial',
        schoolId: school.id,
      },
    }),
    prisma.major.create({
      data: {
        name: 'Bahasa',
        code: 'BHS',
        description: 'Bahasa dan Sastra',
        schoolId: school.id,
      },
    }),
  ]);

  console.log('✅ Majors created');

  // Create Classes
  const classes = await Promise.all([
    prisma.class.create({
      data: {
        name: 'X IPA 1',
        grade: 10,
        capacity: 36,
        currentStudents: 0,
        academicYearId: academicYear2024.id,
        majorId: majors[0].id, // IPA
        schoolId: school.id,
      },
    }),
    prisma.class.create({
      data: {
        name: 'X IPA 2',
        grade: 10,
        capacity: 36,
        currentStudents: 0,
        academicYearId: academicYear2024.id,
        majorId: majors[0].id, // IPA
        schoolId: school.id,
      },
    }),
    prisma.class.create({
      data: {
        name: 'X IPS 1',
        grade: 10,
        capacity: 36,
        currentStudents: 0,
        academicYearId: academicYear2024.id,
        majorId: majors[1].id, // IPS
        schoolId: school.id,
      },
    }),
    prisma.class.create({
      data: {
        name: 'XI IPA 1',
        grade: 11,
        capacity: 36,
        currentStudents: 0,
        academicYearId: academicYear2024.id,
        majorId: majors[0].id, // IPA
        schoolId: school.id,
      },
    }),
    prisma.class.create({
      data: {
        name: 'XI IPS 1',
        grade: 11,
        capacity: 36,
        currentStudents: 0,
        academicYearId: academicYear2024.id,
        majorId: majors[1].id, // IPS
        schoolId: school.id,
      },
    }),
    prisma.class.create({
      data: {
        name: 'XII IPA 1',
        grade: 12,
        capacity: 36,
        currentStudents: 0,
        academicYearId: academicYear2024.id,
        majorId: majors[0].id, // IPA
        schoolId: school.id,
      },
    }),
    prisma.class.create({
      data: {
        name: 'XII IPS 1',
        grade: 12,
        capacity: 36,
        currentStudents: 0,
        academicYearId: academicYear2024.id,
        majorId: majors[1].id, // IPS
        schoolId: school.id,
      },
    }),
  ]);

  console.log('✅ Classes created');

  // Create Teachers
  const teachers = await Promise.all([
    prisma.teacher.create({
      data: {
        employeeId: 'T001',
        name: 'Dr. Ahmad Supriyadi, M.Pd',
        email: 'ahmad.supriyadi@smauiiyk.sch.id',
        phone: '+62-812-3456-7890',
        address: 'Jl. Kaliurang No. 123, Sleman',
        position: 'Guru Tetap',
        subject: 'Matematika',
        hireDate: new Date('2020-07-01'),
        schoolId: school.id,
      },
    }),
    prisma.teacher.create({
      data: {
        employeeId: 'T002',
        name: 'Siti Nurhaliza, S.Pd',
        email: 'siti.nurhaliza@smauiiyk.sch.id',
        phone: '+62-812-3456-7891',
        address: 'Jl. Kaliurang No. 124, Sleman',
        position: 'Guru Tetap',
        subject: 'Bahasa Indonesia',
        hireDate: new Date('2020-07-01'),
        schoolId: school.id,
      },
    }),
    prisma.teacher.create({
      data: {
        employeeId: 'T003',
        name: 'Budi Santoso, S.Pd',
        email: 'budi.santoso@smauiiyk.sch.id',
        phone: '+62-812-3456-7892',
        address: 'Jl. Kaliurang No. 125, Sleman',
        position: 'Guru Tetap',
        subject: 'Fisika',
        hireDate: new Date('2020-07-01'),
        schoolId: school.id,
      },
    }),
    prisma.teacher.create({
      data: {
        employeeId: 'T004',
        name: 'Dewi Sartika, S.Pd',
        email: 'dewi.sartika@smauiiyk.sch.id',
        phone: '+62-812-3456-7893',
        address: 'Jl. Kaliurang No. 126, Sleman',
        position: 'Guru Tetap',
        subject: 'Kimia',
        hireDate: new Date('2020-07-01'),
        schoolId: school.id,
      },
    }),
    prisma.teacher.create({
      data: {
        employeeId: 'T005',
        name: 'Rudi Hermawan, S.Pd',
        email: 'rudi.hermawan@smauiiyk.sch.id',
        phone: '+62-812-3456-7894',
        address: 'Jl. Kaliurang No. 127, Sleman',
        position: 'Guru Tetap',
        subject: 'Biologi',
        hireDate: new Date('2020-07-01'),
        schoolId: school.id,
      },
    }),
  ]);

  console.log('✅ Teachers created');

  // Create Staff
  const staff = await Promise.all([
    prisma.staff.create({
      data: {
        employeeId: 'S001',
        name: 'Sri Wahyuni, S.E',
        email: 'sri.wahyuni@smauiiyk.sch.id',
        phone: '+62-812-3456-7895',
        address: 'Jl. Kaliurang No. 128, Sleman',
        position: 'Staff Administrasi',
        departmentId: departments[3].id, // Administrasi
        hireDate: new Date('2020-07-01'),
        schoolId: school.id,
      },
    }),
    prisma.staff.create({
      data: {
        employeeId: 'S002',
        name: 'Joko Widodo, S.Kom',
        email: 'joko.widodo@smauiiyk.sch.id',
        phone: '+62-812-3456-7896',
        address: 'Jl. Kaliurang No. 129, Sleman',
        position: 'Staff IT',
        departmentId: departments[2].id, // Sarana Prasarana
        hireDate: new Date('2020-07-01'),
        schoolId: school.id,
      },
    }),
    prisma.staff.create({
      data: {
        employeeId: 'S003',
        name: 'Mega Putri, S.Pd',
        email: 'mega.putri@smauiiyk.sch.id',
        phone: '+62-812-3456-7897',
        address: 'Jl. Kaliurang No. 130, Sleman',
        position: 'Staff Kesiswaan',
        departmentId: departments[1].id, // Kesiswaan
        hireDate: new Date('2020-07-01'),
        schoolId: school.id,
      },
    }),
  ]);

  console.log('✅ Staff created');

  // Create Subjects
  const subjects = await Promise.all([
    prisma.subject.create({
      data: {
        name: 'Matematika',
        code: 'MTK',
        description: 'Matematika Wajib',
        credits: 4,
        schoolId: school.id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Bahasa Indonesia',
        code: 'BIN',
        description: 'Bahasa Indonesia Wajib',
        credits: 4,
        schoolId: school.id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Bahasa Inggris',
        code: 'BIG',
        description: 'Bahasa Inggris Wajib',
        credits: 4,
        schoolId: school.id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Fisika',
        code: 'FIS',
        description: 'Fisika untuk jurusan IPA',
        credits: 3,
        schoolId: school.id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Kimia',
        code: 'KIM',
        description: 'Kimia untuk jurusan IPA',
        credits: 3,
        schoolId: school.id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Biologi',
        code: 'BIO',
        description: 'Biologi untuk jurusan IPA',
        credits: 3,
        schoolId: school.id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Ekonomi',
        code: 'EKO',
        description: 'Ekonomi untuk jurusan IPS',
        credits: 3,
        schoolId: school.id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Sosiologi',
        code: 'SOS',
        description: 'Sosiologi untuk jurusan IPS',
        credits: 3,
        schoolId: school.id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Geografi',
        code: 'GEO',
        description: 'Geografi untuk jurusan IPS',
        credits: 3,
        schoolId: school.id,
      },
    }),
  ]);

  console.log('✅ Subjects created');

  // Create Sample Students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        studentId: '2024001',
        name: 'Ahmad Fadillah',
        email: 'ahmad.fadillah@student.smauiiyk.sch.id',
        phone: '+62-812-3456-7900',
        address: 'Jl. Kaliurang No. 131, Sleman',
        birthDate: new Date('2008-03-15'),
        gender: 'MALE',
        classId: classes[0].id, // X IPA 1
        schoolId: school.id,
      },
    }),
    prisma.student.create({
      data: {
        studentId: '2024002',
        name: 'Siti Aisyah',
        email: 'siti.aisyah@student.smauiiyk.sch.id',
        phone: '+62-812-3456-7901',
        address: 'Jl. Kaliurang No. 132, Sleman',
        birthDate: new Date('2008-06-20'),
        gender: 'FEMALE',
        classId: classes[0].id, // X IPA 1
        schoolId: school.id,
      },
    }),
    prisma.student.create({
      data: {
        studentId: '2024003',
        name: 'Muhammad Rizki',
        email: 'muhammad.rizki@student.smauiiyk.sch.id',
        phone: '+62-812-3456-7902',
        address: 'Jl. Kaliurang No. 133, Sleman',
        birthDate: new Date('2008-09-10'),
        gender: 'MALE',
        classId: classes[2].id, // X IPS 1
        schoolId: school.id,
      },
    }),
    prisma.student.create({
      data: {
        studentId: '2024004',
        name: 'Nurul Hidayah',
        email: 'nurul.hidayah@student.smauiiyk.sch.id',
        phone: '+62-812-3456-7903',
        address: 'Jl. Kaliurang No. 134, Sleman',
        birthDate: new Date('2008-12-05'),
        gender: 'FEMALE',
        classId: classes[2].id, // X IPS 1
        schoolId: school.id,
      },
    }),
  ]);

  console.log('✅ Students created');

  // Update class current students count
  await Promise.all([
    prisma.class.update({
      where: { id: classes[0].id },
      data: { currentStudents: 2 },
    }),
    prisma.class.update({
      where: { id: classes[2].id },
      data: { currentStudents: 2 },
    }),
  ]);

  // Update school totals
  await prisma.school.update({
    where: { id: school.id },
    data: {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalClasses: classes.length,
      totalStaff: staff.length,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin User: ${adminUser.email} (${adminUser.role})`);
  console.log(`📊 School: ${school.name}`);
  console.log(`👥 Total Students: ${students.length}`);
  console.log(`👨‍🏫 Total Teachers: ${teachers.length}`);
  console.log(`🏫 Total Classes: ${classes.length}`);
  console.log(`👷 Total Staff: ${staff.length}`);
  console.log(`📚 Total Subjects: ${subjects.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
