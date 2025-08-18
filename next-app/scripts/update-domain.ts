#!/usr/bin/env tsx

import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function updateDomain() {
  try {
    console.log('🔄 Updating domain references...')
    console.log('=' .repeat(50))
    console.log('📧 Old domains: sma-uii.sch.id, sma-uii.ac.id')
    console.log('📧 New domain: smauiiyk.sch.id')
    console.log('=' .repeat(50))

    let totalUpdates = 0
    let errors = 0

    // Update School data
    console.log('\n🏫 Updating School data...')
    try {
      const schoolUpdate = await prisma.school.updateMany({
        where: {
          OR: [
            { email: { contains: 'sma-uii.sch.id' } },
            { email: { contains: 'sma-uii.ac.id' } }
          ]
        },
        data: {
          email: 'info@smauiiyk.sch.id',
          website: 'www.smauiiyk.sch.id'
        }
      })
      
      if (schoolUpdate.count > 0) {
        console.log(`✅ Updated ${schoolUpdate.count} school records`)
        totalUpdates += schoolUpdate.count
      } else {
        console.log('ℹ️  No school records to update')
      }
    } catch (error) {
      console.error('❌ Error updating school:', error)
      errors++
    }

    // Update User accounts
    console.log('\n👥 Updating User accounts...')
    try {
      const usersToUpdate = await prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: 'sma-uii.sch.id' } },
            { email: { contains: 'sma-uii.ac.id' } }
          ]
        }
      })
      
      for (const user of usersToUpdate) {
        if (user.email) {
          const newEmail = user.email
            .replace('sma-uii.sch.id', 'smauiiyk.sch.id')
            .replace('sma-uii.ac.id', 'smauiiyk.sch.id')
          
          await prisma.user.update({
            where: { id: user.id },
            data: { email: newEmail }
          })
          
          console.log(`✅ Updated user: ${user.email} → ${newEmail}`)
          totalUpdates++
        }
      }
      
      if (usersToUpdate.length === 0) {
        console.log('ℹ️  No user accounts to update')
      }
    } catch (error) {
      console.error('❌ Error updating users:', error)
      errors++
    }

    // Update specific admin users
    console.log('\n👑 Updating specific admin users...')
    const adminUpdates = [
      {
        oldEmail: 'superadmin@sma-uii.sch.id',
        newEmail: 'superadmin@smauiiyk.sch.id',
        name: 'Super Administrator'
      },
      {
        oldEmail: 'admin@sma-uii.sch.id',
        newEmail: 'admin@smauiiyk.sch.id',
        name: 'School Administrator'
      },
      {
        oldEmail: 'it@sma-uii.sch.id',
        newEmail: 'it@smauiiyk.sch.id',
        name: 'IT Administrator'
      },
      {
        oldEmail: 'principal@sma-uii.sch.id',
        newEmail: 'principal@smauiiyk.sch.id',
        name: 'School Principal'
      }
    ]

    for (const update of adminUpdates) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: update.oldEmail }
        })

        if (user) {
          await prisma.user.update({
            where: { email: update.oldEmail },
            data: { 
              email: update.newEmail,
              name: update.name
            }
          })
          console.log(`✅ Updated ${update.oldEmail} → ${update.newEmail}`)
          totalUpdates++
        } else {
          console.log(`ℹ️  User ${update.oldEmail} not found`)
        }
      } catch (error) {
        console.error(`❌ Error updating ${update.oldEmail}:`, error)
        errors++
      }
    }

    // Update Teacher data
    console.log('\n👨‍🏫 Updating Teacher data...')
    try {
      const teachersToUpdate = await prisma.teacher.findMany({
        where: {
          OR: [
            { email: { contains: 'sma-uii.sch.id' } },
            { email: { contains: 'sma-uii.ac.id' } }
          ]
        }
      })
      
      for (const teacher of teachersToUpdate) {
        if (teacher.email) {
          const newEmail = teacher.email
            .replace('sma-uii.sch.id', 'smauiiyk.sch.id')
            .replace('sma-uii.ac.id', 'smauiiyk.sch.id')
          
          await prisma.teacher.update({
            where: { id: teacher.id },
            data: { email: newEmail }
          })
          
          console.log(`✅ Updated teacher: ${teacher.email} → ${newEmail}`)
          totalUpdates++
        }
      }
      
      if (teachersToUpdate.length === 0) {
        console.log('ℹ️  No teacher records to update')
      }
    } catch (error) {
      console.error('❌ Error updating teachers:', error)
      errors++
    }

    // Update Student data
    console.log('\n👨‍🎓 Updating Student data...')
    try {
      const studentsToUpdate = await prisma.student.findMany({
        where: {
          OR: [
            { email: { contains: 'sma-uii.sch.id' } },
            { email: { contains: 'sma-uii.ac.id' } }
          ]
        }
      })
      
      for (const student of studentsToUpdate) {
        if (student.email) {
          const newEmail = student.email
            .replace('sma-uii.sch.id', 'smauiiyk.sch.id')
            .replace('sma-uii.ac.id', 'smauiiyk.sch.id')
          
          await prisma.student.update({
            where: { id: student.id },
            data: { email: newEmail }
          })
          
          console.log(`✅ Updated student: ${student.email} → ${newEmail}`)
          totalUpdates++
        }
      }
      
      if (studentsToUpdate.length === 0) {
        console.log('ℹ️  No student records to update')
      }
    } catch (error) {
      console.error('❌ Error updating students:', error)
      errors++
    }

    // Update Staff data
    console.log('\n👷 Updating Staff data...')
    try {
      const staffToUpdate = await prisma.staff.findMany({
        where: {
          OR: [
            { email: { contains: 'sma-uii.sch.id' } },
            { email: { contains: 'sma-uii.ac.id' } }
          ]
        }
      })
      
      for (const staff of staffToUpdate) {
        if (staff.email) {
          const newEmail = staff.email
            .replace('sma-uii.sch.id', 'smauiiyk.sch.id')
            .replace('sma-uii.ac.id', 'smauiiyk.sch.id')
          
          await prisma.staff.update({
            where: { id: staff.id },
            data: { email: newEmail }
          })
          
          console.log(`✅ Updated staff: ${staff.email} → ${newEmail}`)
          totalUpdates++
        }
      }
      
      if (staffToUpdate.length === 0) {
        console.log('ℹ️  No staff records to update')
      }
    } catch (error) {
      console.error('❌ Error updating staff:', error)
      errors++
    }

    // Summary
    console.log('\n' + '=' .repeat(50))
    console.log('📊 DOMAIN UPDATE SUMMARY')
    console.log('=' .repeat(50))
    console.log(`✅ Total updates: ${totalUpdates}`)
    console.log(`❌ Errors encountered: ${errors}`)
    console.log(`📝 Success rate: ${totalUpdates > 0 ? Math.round(((totalUpdates - errors) / totalUpdates) * 100) : 0}%`)

    if (totalUpdates > 0) {
      console.log('\n🎉 Domain update completed!')
      console.log('\n🔐 NEW LOGIN CREDENTIALS:')
      console.log('=' .repeat(30))
      adminUpdates.forEach(admin => {
        console.log(`\n👤 ${admin.name}:`)
        console.log(`   Email: ${admin.newEmail}`)
        console.log(`   Password: admin123`)
      })
      
      console.log('\n⚠️  IMPORTANT:')
      console.log('   1. Update your .env file with new domain')
      console.log('   2. Update NextAuth configuration')
      console.log('   3. Test login with new credentials')
      console.log('   4. Update any hardcoded domain references')
    } else {
      console.log('\nℹ️  No domain updates were needed')
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Database connection closed.')
  }
}

// Run the script
updateDomain()
