#!/usr/bin/env tsx

import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function checkSchools() {
  try {
    console.log('🔍 Checking schools in database...')
    console.log('=' .repeat(50))

    // Check if schools table exists and has data
    const schools = await prisma.school.findMany()
    
    console.log(`📊 Total schools found: ${schools.length}`)
    
    if (schools.length === 0) {
      console.log('❌ No schools found in database')
      console.log('💡 You need to create a school first')
      
      // Create a default school
      console.log('\n🏗️  Creating default school...')
      const defaultSchool = await prisma.school.create({
        data: {
          name: "SMA UII Yogyakarta",
          foundedYear: 1995,
          address: "Jl. Kaliurang KM 14.5, Sleman, Yogyakarta",
          phone: "0274-895123",
          email: "info@smauiiyk.sch.id",
          website: "www.smauiiyk.sch.id",
          accreditation: "A",
          totalStudents: 1247,
          totalTeachers: 89,
          totalClasses: 36,
          totalStaff: 45
        }
      })
      
      console.log('✅ Default school created:', defaultSchool)
    } else {
      console.log('\n🏫 Schools found:')
      schools.forEach((school, index) => {
        console.log(`\n${index + 1}. ${school.name}`)
        console.log(`   ID: ${school.id}`)
        console.log(`   Founded: ${school.foundedYear}`)
        console.log(`   Address: ${school.address}`)
        console.log(`   Phone: ${school.phone}`)
        console.log(`   Email: ${school.email}`)
        console.log(`   Website: ${school.website}`)
        console.log(`   Accreditation: ${school.accreditation}`)
        console.log(`   Students: ${school.totalStudents}`)
        console.log(`   Teachers: ${school.totalTeachers}`)
        console.log(`   Classes: ${school.totalClasses}`)
        console.log(`   Staff: ${school.totalStaff}`)
        console.log(`   Active: ${school.isActive}`)
        console.log(`   Created: ${school.createdAt}`)
        console.log(`   Updated: ${school.updatedAt}`)
      })
    }

    // Check database schema
    console.log('\n🔍 Checking database schema...')
    try {
      const tableInfo = await prisma.$queryRaw`
        SELECT table_name, column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'schools'
        ORDER BY ordinal_position
      `
      console.log('📋 School table schema:', tableInfo)
    } catch (error) {
      console.log('❌ Could not check schema:', error)
    }

  } catch (error) {
    console.error('\n❌ Error checking schools:', error)
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Database connection closed.')
  }
}

// Run the script
checkSchools()
