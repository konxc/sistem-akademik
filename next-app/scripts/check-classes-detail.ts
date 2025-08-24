import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function checkClassesDetail() {
  try {
    console.log('🔍 Memeriksa detail data kelas di database...\n');

    // Get school details
    console.log('🏫 Detail Sekolah:');
    const school = await prisma.school.findUnique({
      where: { id: 'cmeeixcl10000kzf3nyw2lqqs' },
      select: {
        id: true,
        name: true,
        address: true,
        email: true,
        phone: true,
        website: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (school) {
      console.log(`  Nama: ${school.name}`);
      console.log(`  Alamat: ${school.address || 'Tidak ada'}`);
      console.log(`  Email: ${school.email || 'Tidak ada'}`);
      console.log(`  Telepon: ${school.phone || 'Tidak ada'}`);
      console.log(`  Website: ${school.website || 'Tidak ada'}`);
      console.log(`  Status: ${school.isActive ? 'Aktif' : 'Tidak Aktif'}`);
      console.log(`  Dibuat: ${school.createdAt.toLocaleDateString('id-ID')}`);
      console.log(`  Diupdate: ${school.updatedAt.toLocaleDateString('id-ID')}`);
    }
    console.log('');

    // Get academic year details
    console.log('📅 Detail Tahun Akademik:');
    const academicYear = await prisma.academicYear.findUnique({
      where: { id: 'cmeinm1s10005kzkcamze4bh9' },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (academicYear) {
      console.log(`  Nama: ${academicYear.name}`);
      console.log(`  Tanggal Mulai: ${academicYear.startDate.toLocaleDateString('id-ID')}`);
      console.log(`  Tanggal Selesai: ${academicYear.endDate.toLocaleDateString('id-ID')}`);
      console.log(`  Status: ${academicYear.isActive ? 'Aktif' : 'Tidak Aktif'}`);
      console.log(`  Dibuat: ${academicYear.createdAt.toLocaleDateString('id-ID')}`);
      console.log(`  Diupdate: ${academicYear.updatedAt.toLocaleDateString('id-ID')}`);
    }
    console.log('');

    // Get major details
    console.log('🎯 Detail Jurusan:');
    const majors = await prisma.major.findMany({
      where: { schoolId: 'cmeeixcl10000kzf3nyw2lqqs' },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            classes: true
          }
        }
      }
    });

    if (majors.length > 0) {
      console.log(`Ditemukan ${majors.length} jurusan:`);
      majors.forEach(major => {
        console.log(`  - ${major.name} (${major.code}): ${major._count.classes} kelas`);
        console.log(`    Deskripsi: ${major.description || 'Tidak ada'}`);
        console.log(`    Status: ${major.isActive ? 'Aktif' : 'Tidak Aktif'}`);
        console.log(`    Dibuat: ${major.createdAt.toLocaleDateString('id-ID')}`);
        console.log('');
      });
    }

    // Get classes with more details
    console.log('📚 Detail Kelas:');
    const classes = await prisma.class.findMany({
      where: { schoolId: 'cmeeixcl10000kzf3nyw2lqqs' },
      select: {
        id: true,
        name: true,
        grade: true,
        capacity: true,
        currentStudents: true,
        isActive: true,
        major: {
          select: {
            name: true,
            code: true,
          }
        },
        academicYear: {
          select: {
            name: true,
          }
        },
        _count: {
          select: {
            students: true,
          }
        }
      },
      orderBy: [
        { grade: 'asc' },
        { name: 'asc' }
      ]
    });

    if (classes.length > 0) {
      classes.forEach((cls, index) => {
        console.log(`${index + 1}. ${cls.name}`);
        console.log(`   Grade: ${cls.grade}`);
        console.log(`   Jurusan: ${cls.major ? `${cls.major.name} (${cls.major.code})` : 'Tidak ada'}`);
        console.log(`   Tahun Akademik: ${cls.academicYear.name}`);
        console.log(`   Kapasitas: ${cls.capacity}`);
        console.log(`   Siswa Saat Ini: ${cls._count.students}`);
        console.log(`   Status: ${cls.isActive ? 'Aktif' : 'Tidak Aktif'}`);
        console.log('');
      });
    }

    // Check if there are any students
    console.log('👥 Memeriksa data siswa...');
    const students = await prisma.student.findMany({
      where: { schoolId: 'cmeeixcl10000kzf3nyw2lqqs' },
      select: {
        id: true,
        name: true,
        studentId: true,
        classId: true,
        isActive: true,
      }
    });

    if (students.length > 0) {
      console.log(`Ditemukan ${students.length} siswa:`);
      students.forEach(student => {
        console.log(`  - ${student.name} (${student.studentId})`);
        console.log(`    Class ID: ${student.classId || 'Tidak ada'}`);
        console.log(`    Status: ${student.isActive ? 'Aktif' : 'Tidak Aktif'}`);
      });
    } else {
      console.log('Tidak ada siswa terdaftar');
    }

  } catch (error) {
    console.error('❌ Error saat memeriksa detail data kelas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkClassesDetail();
