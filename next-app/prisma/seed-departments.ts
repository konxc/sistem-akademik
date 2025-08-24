import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function seedDepartments() {
  try {
    console.log('🌱 Seeding departments...')

    // Get the first school (assuming it exists)
    const school = await prisma.school.findFirst()
    if (!school) {
      console.log('❌ No school found. Please seed schools first.')
      return
    }

    const departments = [
      {
        name: 'Akademik',
        description: 'Bertanggung jawab atas kurikulum, pembelajaran, dan evaluasi akademik siswa',
        isActive: true,
        schoolId: school.id
      },
      {
        name: 'Kesiswaan',
        description: 'Mengelola kegiatan ekstrakurikuler, pembinaan karakter, dan prestasi siswa',
        isActive: true,
        schoolId: school.id
      },
      {
        name: 'Sarana Prasarana',
        description: 'Mengatur dan memelihara fasilitas sekolah, gedung, dan peralatan',
        isActive: true,
        schoolId: school.id
      },
      {
        name: 'Administrasi',
        description: 'Mengelola administrasi sekolah, keuangan, dan ketatausahaan',
        isActive: true,
        schoolId: school.id
      },
      {
        name: 'Perpustakaan',
        description: 'Mengelola perpustakaan sekolah dan layanan informasi akademik',
        isActive: true,
        schoolId: school.id
      },
      {
        name: 'IT & Multimedia',
        description: 'Mengelola sistem teknologi informasi dan multimedia pembelajaran',
        isActive: true,
        schoolId: school.id
      },
      {
        name: 'Bimbingan Konseling',
        description: 'Memberikan layanan bimbingan dan konseling kepada siswa',
        isActive: true,
        schoolId: school.id
      },
      {
        name: 'Kesehatan',
        description: 'Mengelola layanan kesehatan sekolah dan UKS',
        isActive: true,
        schoolId: school.id
      }
    ]

    for (const dept of departments) {
      // Check if department already exists
      const existingDept = await prisma.department.findFirst({
        where: { 
          name: dept.name,
          schoolId: dept.schoolId
        }
      })
      
      if (existingDept) {
        await prisma.department.update({
          where: { id: existingDept.id },
          data: dept
        })
      } else {
        await prisma.department.create({
          data: dept
        })
      }
    }

    console.log('✅ Departments seeded successfully!')
    
    // Display seeded departments
    const seededDepartments = await prisma.department.findMany({
      where: { schoolId: school.id },
      orderBy: { name: 'asc' }
    })
    
    console.log('\n📋 Seeded Departments:')
    seededDepartments.forEach(dept => {
      console.log(`  - ${dept.name}: ${dept.description}`)
    })

  } catch (error) {
    console.error('❌ Error seeding departments:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
seedDepartments()
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
