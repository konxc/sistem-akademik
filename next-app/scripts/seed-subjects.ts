import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

async function seedSubjects() {
  try {
    console.log('🌱 Seeding subjects...\n')

    // Get school ID
    const school = await prisma.school.findFirst()
    if (!school) {
      console.log('❌ No school found. Please create a school first.')
      return
    }

    const schoolId = school.id
    console.log(`🏫 Using school: ${school.name} (ID: ${schoolId})\n`)

    // Get majors
    const majors = await prisma.major.findMany({
      where: { schoolId }
    })

    console.log(`🎓 Found ${majors.length} majors: ${majors.map(m => m.name).join(', ')}\n`)

    // Define subjects to seed
    const subjectsToSeed = [
      // IPA subjects
      { code: 'BIO', name: 'Biologi', description: 'Mata pelajaran biologi dengan praktikum', credits: 4, majorName: 'Ilmu Pengetahuan Alam' },
      { code: 'PHY', name: 'Fisika', description: 'Mata pelajaran fisika dengan praktikum laboratorium', credits: 4, majorName: 'Ilmu Pengetahuan Alam' },
      { code: 'CHEM', name: 'Kimia', description: 'Mata pelajaran kimia dengan eksperimen laboratorium', credits: 4, majorName: 'Ilmu Pengetahuan Alam' },
      
      // IPS subjects
      { code: 'ECO', name: 'Ekonomi', description: 'Mata pelajaran ekonomi dasar dan aplikasi', credits: 3, majorName: 'Ilmu Pengetahuan Sosial' },
      { code: 'GEO', name: 'Geografi', description: 'Mata pelajaran geografi dan lingkungan', credits: 3, majorName: 'Ilmu Pengetahuan Sosial' },
      { code: 'HIST', name: 'Sejarah', description: 'Mata pelajaran sejarah Indonesia dan dunia', credits: 3, majorName: 'Ilmu Pengetahuan Sosial' },
      
      // General subjects (no major)
      { code: 'MATH', name: 'Matematika', description: 'Mata pelajaran matematika dasar dan lanjutan', credits: 4, majorName: null },
      { code: 'IND', name: 'Bahasa Indonesia', description: 'Mata pelajaran bahasa Indonesia', credits: 4, majorName: null },
      { code: 'ENG', name: 'Bahasa Inggris', description: 'Mata pelajaran bahasa Inggris', credits: 4, majorName: null },
      { code: 'REL', name: 'Pendidikan Agama', description: 'Mata pelajaran pendidikan agama', credits: 2, majorName: null },
      { code: 'CIV', name: 'PPKN', description: 'Mata pelajaran pendidikan kewarganegaraan', credits: 2, majorName: null },
      { code: 'ART', name: 'Seni Budaya', description: 'Mata pelajaran seni budaya dan keterampilan', credits: 2, majorName: null },
      { code: 'SPORT', name: 'Penjaskes', description: 'Mata pelajaran pendidikan jasmani dan kesehatan', credits: 2, majorName: null },
    ]

    let createdCount = 0
    let skippedCount = 0

    for (const subjectData of subjectsToSeed) {
      try {
        // Check if subject already exists
        const existingSubject = await prisma.subject.findFirst({
          where: {
            code: subjectData.code,
            schoolId
          }
        })

        if (existingSubject) {
          console.log(`⏭️  Skipping ${subjectData.code}: ${subjectData.name} (already exists)`)
          skippedCount++
          continue
        }

        // Find major ID if specified
        let majorId: string | undefined = undefined
        if (subjectData.majorName) {
          const major = majors.find(m => m.name === subjectData.majorName)
          if (major) {
            majorId = major.id
          } else {
            console.log(`⚠️  Major '${subjectData.majorName}' not found for ${subjectData.code}`)
          }
        }

        // Create subject
        const subject = await prisma.subject.create({
          data: {
            code: subjectData.code,
            name: subjectData.name,
            description: subjectData.description,
            credits: subjectData.credits,
            schoolId,
            majorId,
            isActive: true
          }
        })

        const majorInfo = majorId ? ` (${subjectData.majorName})` : ' (Tanpa Jurusan)'
        console.log(`✅ Created ${subject.code}: ${subject.name}${majorInfo}`)
        createdCount++

      } catch (error: any) {
        console.error(`❌ Error creating ${subjectData.code}: ${error.message}`)
      }
    }

    console.log(`\n🎉 Seeding completed!`)
    console.log(`✅ Created: ${createdCount} subjects`)
    console.log(`⏭️  Skipped: ${skippedCount} subjects`)

  } catch (error) {
    console.error('❌ Error seeding subjects:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedSubjects()
