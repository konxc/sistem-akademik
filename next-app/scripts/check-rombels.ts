import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function checkRombels() {
  try {
    console.log('🔍 Memeriksa data rombel di database...\n');

    // Check if rombels table exists by trying to count
    try {
      const rombelCount = await prisma.rombel.count();
      console.log(`✅ Tabel rombels ditemukan dengan ${rombelCount} data rombel\n`);
    } catch (error: any) {
      if (error.code === 'P2021') {
        console.log('❌ Tabel rombels tidak ditemukan di database');
        console.log('   Error:', error.message);
        return;
      } else {
        throw error;
      }
    }

    // Get all rombels
    const rombels = await prisma.rombel.findMany({
      select: {
        id: true,
        name: true,
        maxStudents: true,
        currentStudents: true,
        isActive: true,
        classId: true,
        schoolId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { classId: 'asc' },
        { name: 'asc' }
      ]
    });

    if (rombels.length === 0) {
      console.log('📝 Tidak ada data rombel di database');
      return;
    }

    console.log(`📋 Ditemukan ${rombels.length} rombel:\n`);

    // Group rombels by class
    const rombelsByClass = rombels.reduce((acc, rombel) => {
      if (!acc[rombel.classId]) {
        acc[rombel.classId] = [];
      }
      acc[rombel.classId].push(rombel);
      return acc;
    }, {} as Record<string, typeof rombels>);

    // Get class information for display
    const classIds = Array.from(new Set(rombels.map(r => r.classId)));
    const classes = await prisma.class.findMany({
      where: { id: { in: classIds } },
      select: {
        id: true,
        name: true,
        grade: true,
        major: {
          select: {
            name: true,
            code: true,
          }
        }
      }
    });

    const classMap = new Map(classes.map(c => [c.id, c]));

    Object.entries(rombelsByClass).forEach(([classId, classRombels]) => {
      const classInfo = classMap.get(classId);
      if (classInfo) {
        const majorInfo = classInfo.major ? ` (${classInfo.major.name} - ${classInfo.major.code})` : '';
        console.log(`🏫 ${classInfo.name} - Grade ${classInfo.grade}${majorInfo}:`);
        
        classRombels.forEach((rombel, index) => {
          console.log(`  ${index + 1}. 📚 ${rombel.name}`);
          console.log(`     💺 Kapasitas: ${rombel.maxStudents}, Siswa: ${rombel.currentStudents}`);
          console.log(`     📍 Status: ${rombel.isActive ? 'Aktif' : 'Tidak Aktif'}`);
          console.log(`     🆔 ID: ${rombel.id}`);
          console.log(`     🏢 School ID: ${rombel.schoolId}`);
          console.log(`     📅 Dibuat: ${rombel.createdAt.toLocaleDateString('id-ID')}`);
          console.log('');
        });
      }
    });

    // Summary statistics
    console.log('📊 Ringkasan Statistik Rombel:');
    const totalStudents = rombels.reduce((sum, r) => sum + r.currentStudents, 0);
    const totalCapacity = rombels.reduce((sum, r) => sum + r.maxStudents, 0);
    const activeRombels = rombels.filter(r => r.isActive).length;
    
    console.log(`   Total Rombel: ${rombels.length}`);
    console.log(`   Rombel Aktif: ${activeRombels}`);
    console.log(`   Total Siswa: ${totalStudents}`);
    console.log(`   Total Kapasitas: ${totalCapacity}`);
    console.log(`   Rata-rata Siswa per Rombel: ${(totalStudents / rombels.length).toFixed(1)}`);
    console.log(`   Rata-rata Kapasitas per Rombel: ${(totalCapacity / rombels.length).toFixed(1)}`);

    // Check rombel distribution by class
    console.log('\n📈 Distribusi Rombel per Kelas:');
    Object.entries(rombelsByClass).forEach(([classId, classRombels]) => {
      const classInfo = classMap.get(classId);
      if (classInfo) {
        const totalClassStudents = classRombels.reduce((sum, r) => sum + r.currentStudents, 0);
        const totalClassCapacity = classRombels.reduce((sum, r) => sum + r.maxStudents, 0);
        console.log(`   ${classInfo.name}: ${classRombels.length} rombel, ${totalClassStudents}/${totalClassCapacity} siswa`);
      }
    });

  } catch (error) {
    console.error('❌ Error saat memeriksa data rombel:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRombels();
