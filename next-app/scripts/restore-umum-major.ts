import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

async function restoreUmumMajor() {
  try {
    console.log('🔄 Restoring "Umum" major and fixing subject structure...\n')

    // Get school ID
    const school = await prisma.school.findFirst()
    if (!school) {
      console.log('❌ No school found. Please create a school first.')
      return
    }

    const schoolId = school.id
    console.log(`🏫 Using school: ${school.name} (ID: ${schoolId})\n`)

    // Step 1: Create "Umum" major if it doesn't exist
    console.log('🔧 Step 1: Creating "Umum" major...')
    let umumMajor = await prisma.major.findFirst({
      where: { name: 'Umum', schoolId }
    })

    if (!umumMajor) {
      umumMajor = await prisma.major.create({
        data: {
          name: 'Umum',
          code: 'UMUM',
          description: 'Mata pelajaran wajib untuk semua jurusan',
          schoolId,
          isActive: true
        }
      })
      console.log('✅ Created "Umum" major')
    } else {
      console.log('✅ "Umum" major already exists')
    }

    // Step 2: Get all subjects
    const subjects = await prisma.subject.findMany({
      where: { schoolId },
      include: { major: true }
    })

    console.log(`\n📖 Found ${subjects.length} subjects\n`)

    // Step 3: Move subjects without major to "Umum" major
    console.log('🔧 Step 2: Moving subjects without major to "Umum" major...')
    const subjectsWithoutMajor = subjects.filter(s => !s.majorId)
    
    for (const subject of subjectsWithoutMajor) {
      await prisma.subject.update({
        where: { id: subject.id },
        data: { majorId: umumMajor.id }
      })
      console.log(`🔄 Moved ${subject.code}: ${subject.name} to "Umum" major`)
    }

    // Step 4: Verify final structure
    console.log('\n📊 Final subject distribution:')
    const finalSubjects = await prisma.subject.findMany({
      where: { schoolId },
      include: { major: true }
    })

    const finalSubjectsByMajor = new Map<string, any[]>()
    const finalSubjectsWithoutMajor: any[] = []

    finalSubjects.forEach(subject => {
      if (subject.major) {
        const majorName = subject.major.name
        if (!finalSubjectsByMajor.has(majorName)) {
          finalSubjectsByMajor.set(majorName, [])
        }
        finalSubjectsByMajor.get(majorName)!.push(subject)
      } else {
        finalSubjectsWithoutMajor.push(subject)
      }
    })

    finalSubjectsByMajor.forEach((subjects, majorName) => {
      console.log(`  ${majorName}: ${subjects.length} subjects`)
      subjects.forEach(subject => {
        console.log(`    - ${subject.code}: ${subject.name} (${subject.credits} SKS)`)
      })
    })

    if (finalSubjectsWithoutMajor.length > 0) {
      console.log(`  Tanpa Jurusan: ${finalSubjectsWithoutMajor.length} subjects`)
      finalSubjectsWithoutMajor.forEach(subject => {
        console.log(`    - ${subject.code}: ${subject.name} (${subject.credits} SKS)`)
      })
    }

    console.log(`\n🎉 Restoration completed! Total subjects: ${finalSubjects.length}`)
    console.log('✅ "Umum" major restored and subjects properly categorized')

  } catch (error) {
    console.error('❌ Error during restoration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

restoreUmumMajor()
