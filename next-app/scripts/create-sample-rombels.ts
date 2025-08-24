import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function createSampleRombels() {
  try {
    console.log('🔧 Membuat data rombel contoh...\n');

    // Get existing classes
    const classes = await prisma.class.findMany({
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
      },
      orderBy: [
        { grade: 'asc' },
        { name: 'asc' }
      ]
    });

    if (classes.length === 0) {
      console.log('❌ Tidak ada kelas yang tersedia. Buat kelas terlebih dahulu.');
      return;
    }

    console.log(`📚 Ditemukan ${classes.length} kelas yang tersedia:\n`);

    // Create rombels for each class
    const createdRombels: any[] = [];

    for (const cls of classes) {
      const majorInfo = cls.major ? `${cls.major.name} (${cls.major.code})` : 'Umum';
      console.log(`🏫 Membuat rombel untuk ${cls.name} - Grade ${cls.grade} - ${majorInfo}:`);

      // Create 2 rombels per class (A and B)
      const rombelNames = ['A', 'B'];
      
      for (const rombelName of rombelNames) {
        try {
          const rombel = await prisma.rombel.create({
            data: {
              name: rombelName,
              maxStudents: 20, // Same as class capacity
              currentStudents: 0,
              isActive: true,
              classId: cls.id,
              schoolId: 'cmeeixcl10000kzf3nyw2lqqs', // SMA UII Yogyakarta
            }
          });

          createdRombels.push(rombel);
          console.log(`  ✅ Rombel ${rombelName} berhasil dibuat`);
          console.log(`     🆔 ID: ${rombel.id}`);
          console.log(`     💺 Kapasitas: ${rombel.maxStudents}`);
          console.log(`     📍 Status: ${rombel.isActive ? 'Aktif' : 'Tidak Aktif'}`);
          console.log('');

        } catch (error: any) {
          if (error.code === 'P2002') {
            console.log(`  ⚠️  Rombel ${rombelName} sudah ada`);
          } else {
            console.log(`  ❌ Error membuat rombel ${rombelName}:`, error.message);
          }
        }
      }
    }

    // Summary
    console.log('📊 Ringkasan Pembuatan Rombel:');
    console.log(`   Total Rombel Dibuat: ${createdRombels.length}`);
    console.log(`   Total Kelas: ${classes.length}`);
    console.log(`   Rata-rata Rombel per Kelas: ${(createdRombels.length / classes.length).toFixed(1)}`);

    if (createdRombels.length > 0) {
      console.log('\n🎉 Data rombel berhasil dibuat!');
      console.log('   Jalankan script check-rombels.ts untuk melihat hasilnya.');
    }

  } catch (error) {
    console.error('❌ Error saat membuat data rombel:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleRombels();
