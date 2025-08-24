import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

async function updateSubjectMajors() {
  try {
    console.log('🔧 Updating subject majors...\n')

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

    // Get all subjects
    const subjects = await prisma.subject.findMany({
      where: { schoolId },
      include: { major: true }
    })

    console.log(`📖 Found ${subjects.length} subjects\n`)

    // Define mapping for subjects that should have specific majors
    const subjectMajorMapping: { [key: string]: string } = {
      'BIO': 'Ilmu Pengetahuan Alam',
      'PHY': 'Ilmu Pengetahuan Alam', 
      'CHEM': 'Ilmu Pengetahuan Alam',
      'ECO': 'Ilmu Pengetahuan Sosial',
      'GEO': 'Ilmu Pengetahuan Sosial',
      'HIST': 'Ilmu Pengetahuan Sosial'
    }

    let updatedCount = 0
    let skippedCount = 0

    for (const subject of subjects) {
      try {
        const expectedMajorName = subjectMajorMapping[subject.code]
        
        if (!expectedMajorName) {
          console.log(`⏭️  Skipping ${subject.code}: ${subject.name} (no major mapping defined)`)
          skippedCount++
          continue
        }

        // Check if subject already has correct major
        if (subject.major?.name === expectedMajorName) {
          console.log(`✅ ${subject.code}: ${subject.name} already has correct major (${expectedMajorName})`)
          skippedCount++
          continue
        }

        // Find the correct major
        const correctMajor = majors.find(m => m.name === expectedMajorName)
        if (!correctMajor) {
          console.log(`⚠️  Major '${expectedMajorName}' not found for ${subject.code}`)
          skippedCount++
          continue
        }

        // Update subject major
        await prisma.subject.update({
          where: { id: subject.id },
          data: { majorId: correctMajor.id }
        })

        console.log(`🔄 Updated ${subject.code}: ${subject.name} → ${expectedMajorName}`)
        updatedCount++

      } catch (error: any) {
        console.error(`❌ Error updating ${subject.code}: ${error.message}`)
      }
    }

    console.log(`\n🎉 Update completed!`)
    console.log(`🔄 Updated: ${updatedCount} subjects`)
    console.log(`⏭️  Skipped: ${skippedCount} subjects`)

    // Show final status
    console.log('\n📊 Final subject distribution:')
    const finalSubjects = await prisma.subject.findMany({
      where: { schoolId },
      include: { major: true }
    })

    const subjectsByMajor = new Map<string, any[]>()
    const subjectsWithoutMajor: any[] = []

    finalSubjects.forEach(subject => {
      if (subject.major) {
        const majorName = subject.major.name
        if (!subjectsByMajor.has(majorName)) {
          subjectsByMajor.set(majorName, [])
        }
        subjectsByMajor.get(majorName)!.push(subject)
      } else {
        subjectsWithoutMajor.push(subject)
      }
    })

    subjectsByMajor.forEach((subjects, majorName) => {
      console.log(`  ${majorName}: ${subjects.length} subjects`)
    })

    if (subjectsWithoutMajor.length > 0) {
      console.log(`  Tanpa Jurusan: ${subjectsWithoutMajor.length} subjects`)
    }

  } catch (error) {
    console.error('❌ Error updating subject majors:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateSubjectMajors()
