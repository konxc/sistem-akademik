#!/usr/bin/env tsx

import { PrismaClient } from '../generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setAdminPasswords() {
  try {
    console.log('🔐 Setting passwords for admin users...')
    console.log('=' .repeat(50))

    // Default password untuk semua admin
    const defaultPassword = 'admin123'
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds)

    // Admin users yang perlu di-set password
    const adminUsers = [
      {
        email: 'superadmin@smauiiyk.sch.id',
        name: 'Super Administrator',
        role: 'SUPER_ADMIN'
      },
      {
        email: 'admin@smauiiyk.sch.id',
        name: 'School Administrator',
        role: 'ADMIN'
      },
      {
        email: 'it@smauiiyk.sch.id',
        name: 'IT Administrator',
        role: 'ADMIN'
      },
      {
        email: 'principal@smauiiyk.sch.id',
        name: 'School Principal',
        role: 'ADMIN'
      }
    ]

    let updatedCount = 0
    let errorCount = 0

    for (const adminData of adminUsers) {
      console.log(`\n📋 Processing: ${adminData.name}`)
      console.log(`   Email: ${adminData.email}`)
      console.log(`   Role: ${adminData.role}`)

      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: adminData.email }
        })

        if (!existingUser) {
          console.log(`   ❌ User not found: ${adminData.email}`)
          errorCount++
          continue
        }

        // Update user dengan password dan role yang benar
        const updatedUser = await prisma.user.update({
          where: { email: adminData.email },
          data: {
            password: hashedPassword,
            role: adminData.role as any,
            name: adminData.name
          }
        })

        console.log(`   ✅ Password set successfully`)
        console.log(`      ID: ${updatedUser.id}`)
        console.log(`      Role: ${updatedUser.role}`)
        console.log(`      Password: ${defaultPassword}`)
        
        updatedCount++

      } catch (error) {
        console.error(`   ❌ Error updating ${adminData.email}:`, error)
        errorCount++
      }
    }

    // Summary
    console.log('\n' + '=' .repeat(50))
    console.log('📊 PASSWORD SETUP SUMMARY')
    console.log('=' .repeat(50))
    console.log(`✅ Successfully updated: ${updatedCount}`)
    console.log(`❌ Errors encountered: ${errorCount}`)
    console.log(`📝 Total processed: ${adminUsers.length}`)

    if (updatedCount > 0) {
      console.log('\n🎉 Admin passwords setup completed!')
      
      console.log('\n🔐 LOGIN CREDENTIALS:')
      console.log('=' .repeat(30))
      adminUsers.forEach(admin => {
        console.log(`\n👤 ${admin.name}:`)
        console.log(`   Email: ${admin.email}`)
        console.log(`   Password: ${defaultPassword}`)
        console.log(`   Role: ${admin.role}`)
      })
      
      console.log('\n⚠️  IMPORTANT SECURITY NOTES:')
      console.log('   1. Change default passwords immediately after first login')
      console.log('   2. Use strong, unique passwords for production')
      console.log('   3. Enable 2FA when available')
      console.log('   4. Monitor login attempts and suspicious activity')
      
      console.log('\n🚀 Next steps:')
      console.log('   1. Test login with credentials above')
      console.log('   2. Change default passwords')
      console.log('   3. Setup Google OAuth when ready')
      console.log('   4. Implement password change functionality')
    } else {
      console.log('\n❌ No admin users were updated. Check database connection.')
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
setAdminPasswords()
