import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

async function cleanupSubjects() {
  try {
    console.log('🧹 Cleaning up subjects data...\n')

    // Get school ID
    const school = await prisma.school.findFirst()
    if (!school) {
      console.log('❌ No school found. Please create a school first.')
      return
    }

    const schoolId = school.id
    console.log(`🏫 Using school: ${school.name} (ID: ${schoolId})\n`)

    // Get all subjects
    const subjects = await prisma.subject.findMany({
      where: { schoolId },
      include: { major: true }
    })

    console.log(`📖 Found ${subjects.length} subjects\n`)

    // Step 1: Remove subjects from "Umum" major (set majorId to null)
    console.log('🔧 Step 1: Removing subjects from "Umum" major...')
    const umumMajor = await prisma.major.findFirst({
      where: { name: 'Umum', schoolId }
    })

    if (umumMajor) {
      const subjectsInUmum = subjects.filter(s => s.major?.id === umumMajor.id)
      console.log(`Found ${subjectsInUmum.length} subjects in "Umum" major`)

      for (const subject of subjectsInUmum) {
        await prisma.subject.update({
          where: { id: subject.id },
          data: { majorId: null }
        })
        console.log(`🔄 Removed ${subject.code}: ${subject.name} from "Umum" major`)
      }
    }

    // Step 2: Delete duplicate subjects with "-UMUM" suffix
    console.log('\n🗑️  Step 2: Deleting duplicate subjects with "-UMUM" suffix...')
    const duplicateSubjects = subjects.filter(s => s.code.includes('-UMUM'))
    console.log(`Found ${duplicateSubjects.length} duplicate subjects to delete`)

    for (const subject of duplicateSubjects) {
      await prisma.subject.delete({
        where: { id: subject.id }
      })
      console.log(`🗑️  Deleted duplicate: ${subject.code}: ${subject.name}`)
    }

    // Step 3: Update subjects that should have specific majors
    console.log('\n🔧 Step 3: Updating subjects with correct majors...')
    
    const majorUpdates = [
      { code: 'MATH', majorName: 'Ilmu Pengetahuan Alam' },
      { code: 'TEST', majorName: 'Ilmu Pengetahuan Alam' }
    ]

    for (const update of majorUpdates) {
      const subject = await prisma.subject.findFirst({
        where: { code: update.code, schoolId }
      })

      if (subject) {
        const major = await prisma.major.findFirst({
          where: { name: update.majorName, schoolId }
        })

        if (major && subject.majorId !== major.id) {
          await prisma.subject.update({
            where: { id: subject.id },
            data: { majorId: major.id }
          })
          console.log(`🔄 Updated ${subject.code}: ${subject.name} → ${update.majorName}`)
        }
      }
    }

    // Step 4: Delete "Umum" major if it has no subjects
    console.log('\n🗑️  Step 4: Deleting "Umum" major if empty...')
    if (umumMajor) {
      const remainingSubjects = await prisma.subject.findMany({
        where: { majorId: umumMajor.id }
      })

      if (remainingSubjects.length === 0) {
        await prisma.major.delete({
          where: { id: umumMajor.id }
        })
        console.log('🗑️  Deleted "Umum" major (no subjects remaining)')
      } else {
        console.log(`⚠️  "Umum" major still has ${remainingSubjects.length} subjects`)
      }
    }

    // Show final status
    console.log('\n📊 Final status:')
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

    console.log(`\n🎉 Cleanup completed! Total subjects: ${finalSubjects.length}`)

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupSubjects()
