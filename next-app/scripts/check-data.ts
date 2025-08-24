import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

async function checkData() {
  try {
    console.log('🔍 Checking database data...\n')

    // Check schools
    console.log('📚 Schools:')
    const schools = await prisma.school.findMany()
    console.log(`Found ${schools.length} schools`)
    schools.forEach(school => {
      console.log(`  - ${school.name} (ID: ${school.id})`)
    })

    // Check majors
    console.log('\n🎓 Majors:')
    const majors = await prisma.major.findMany({
      include: {
        subjects: true
      }
    })
    console.log(`Found ${majors.length} majors`)
    majors.forEach(major => {
      console.log(`  - ${major.name} (ID: ${major.id}) - ${major.subjects.length} subjects`)
    })

    // Check subjects
    console.log('\n📖 Subjects:')
    const subjects = await prisma.subject.findMany({
      include: {
        major: true,
        teachers: true
      }
    })
    console.log(`Found ${subjects.length} subjects`)
    subjects.forEach(subject => {
      const majorName = subject.major?.name || 'Tanpa Jurusan'
      const teacherCount = subject.teachers?.length || 0
      console.log(`  - ${subject.code}: ${subject.name} (${majorName}) - ${teacherCount} teachers`)
    })

    // Check teachers
    console.log('\n👨‍🏫 Teachers:')
    const teachers = await prisma.teacher.findMany()
    console.log(`Found ${teachers.length} teachers`)

    // Check students
    console.log('\n👨‍🎓 Students:')
    const students = await prisma.student.findMany()
    console.log(`Found ${students.length} students`)

    // Check classes
    console.log('\n🏫 Classes:')
    const classes = await prisma.class.findMany()
    console.log(`Found ${classes.length} classes`)

  } catch (error) {
    console.error('❌ Error checking data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()
