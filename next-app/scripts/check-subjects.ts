import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

async function checkSubjects() {
  try {
    console.log('🔍 Checking subjects and grouping by major...\n')

    // Get all subjects with major info
    const subjects = await prisma.subject.findMany({
      include: {
        major: true,
        teachers: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    console.log(`📖 Total subjects found: ${subjects.length}\n`)

    // Group subjects by major
    const subjectsByMajor = new Map<string, any[]>()
    const subjectsWithoutMajor: any[] = []

    subjects.forEach(subject => {
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

    // Display subjects by major
    console.log('🎓 Subjects by Major:')
    subjectsByMajor.forEach((subjects, majorName) => {
      console.log(`\n  ${majorName} (${subjects.length} subjects):`)
      subjects.forEach(subject => {
        const teacherCount = subject.teachers?.length || 0
        console.log(`    - ${subject.code}: ${subject.name} - ${subject.credits} SKS - ${teacherCount} teachers`)
      })
    })

    // Display subjects without major
    if (subjectsWithoutMajor.length > 0) {
      console.log(`\n📚 Subjects without Major (${subjectsWithoutMajor.length} subjects):`)
      subjectsWithoutMajor.forEach(subject => {
        const teacherCount = subject.teachers?.length || 0
        console.log(`    - ${subject.code}: ${subject.name} - ${subject.credits} SKS - ${teacherCount} teachers`)
      })
    }

    // Check for duplicate codes
    console.log('\n🔍 Checking for duplicate subject codes...')
    const codes = subjects.map(s => s.code)
    const duplicateCodes = codes.filter((code, index) => codes.indexOf(code) !== index)
    
    if (duplicateCodes.length > 0) {
      console.log('❌ Duplicate codes found:')
      const uniqueDuplicates = Array.from(new Set(duplicateCodes))
      uniqueDuplicates.forEach(code => {
        const subjectsWithCode = subjects.filter(s => s.code === code)
        console.log(`    ${code}: ${subjectsWithCode.length} subjects`)
        subjectsWithCode.forEach(subject => {
          console.log(`      - ${subject.name} (ID: ${subject.id})`)
        })
      })
    } else {
      console.log('✅ No duplicate codes found')
    }

  } catch (error) {
    console.error('❌ Error checking subjects:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkSubjects()
