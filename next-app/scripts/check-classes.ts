import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function checkClasses() {
  try {
    console.log('🔍 Memeriksa data kelas di database...\n');

    // Get all classes with basic info
    const classes = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        grade: true,
        capacity: true,
        currentStudents: true,
        isActive: true,
        schoolId: true,
        academicYearId: true,
        majorId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { grade: 'asc' },
        { name: 'asc' }
      ]
    });

    if (classes.length === 0) {
      console.log('❌ Tidak ada data kelas di database');
      return;
    }

    console.log(`✅ Ditemukan ${classes.length} kelas:\n`);

    // Display classes
    classes.forEach((cls, index) => {
      console.log(`${index + 1}. 📚 ${cls.name}`);
      console.log(`   Grade: ${cls.grade}`);
      console.log(`   Kapasitas: ${cls.capacity}`);
      console.log(`   Siswa Saat Ini: ${cls.currentStudents}`);
      console.log(`   Status: ${cls.isActive ? 'Aktif' : 'Tidak Aktif'}`);
      console.log(`   School ID: ${cls.schoolId}`);
      console.log(`   Academic Year ID: ${cls.academicYearId}`);
      console.log(`   Major ID: ${cls.majorId || 'Tidak ada'}`);
      console.log(`   Dibuat: ${cls.createdAt.toLocaleDateString('id-ID')}`);
      console.log(`   Diupdate: ${cls.updatedAt.toLocaleDateString('id-ID')}`);
      console.log('');
    });

    // Summary statistics
    console.log('📊 Ringkasan Statistik:');
    const totalStudents = classes.reduce((sum, cls) => sum + cls.currentStudents, 0);
    const totalCapacity = classes.reduce((sum, cls) => sum + cls.capacity, 0);
    const activeClasses = classes.filter(cls => cls.isActive).length;
    
    console.log(`   Total Kelas: ${classes.length}`);
    console.log(`   Kelas Aktif: ${activeClasses}`);
    console.log(`   Total Siswa: ${totalStudents}`);
    console.log(`   Total Kapasitas: ${totalCapacity}`);
    console.log(`   Rata-rata Siswa per Kelas: ${(totalStudents / classes.length).toFixed(1)}`);
    console.log(`   Rata-rata Kapasitas per Kelas: ${(totalCapacity / classes.length).toFixed(1)}`);

    // Check for schools
    console.log('\n🏫 Memeriksa data sekolah...');
    const schools = await prisma.school.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            classes: true
          }
        }
      }
    });

    if (schools.length > 0) {
      console.log(`Ditemukan ${schools.length} sekolah:`);
      schools.forEach(school => {
        console.log(`  - ${school.name}: ${school._count.classes} kelas`);
      });
    }

    // Check for academic years
    console.log('\n📅 Memeriksa data tahun akademik...');
    const academicYears = await prisma.academicYear.findMany({
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        isActive: true,
        _count: {
          select: {
            classes: true
          }
        }
      }
    });

    if (academicYears.length > 0) {
      console.log(`Ditemukan ${academicYears.length} tahun akademik:`);
      academicYears.forEach(ay => {
        const startYear = ay.startDate.getFullYear();
        const endYear = ay.endDate.getFullYear();
        console.log(`  - ${ay.name} (${startYear}-${endYear}): ${ay._count.classes} kelas`);
      });
    }

  } catch (error) {
    console.error('❌ Error saat memeriksa data kelas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkClasses();
