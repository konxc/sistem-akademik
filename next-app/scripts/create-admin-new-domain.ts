#!/usr/bin/env tsx

import { PrismaClient } from '../generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminNewDomain() {
  try {
    console.log('👑 Creating admin users with new domain...')
    console.log('=' .repeat(50))
    console.log('📧 New domain: smauiiyk.sch.id')
    console.log('=' .repeat(50))

    // Default password untuk semua admin
    const defaultPassword = 'admin123'
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds)

    // Admin users dengan domain baru
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

    let createdCount = 0
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

        if (existingUser) {
          console.log(`   ℹ️  User already exists: ${adminData.email}`)
          continue
        }

        // Create new admin user
        const newAdmin = await prisma.user.create({
          data: {
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword,
            role: adminData.role as any,
            emailVerified: new Date(),
          }
        })

        console.log(`   ✅ Admin user created successfully`)
        console.log(`      ID: ${newAdmin.id}`)
        console.log(`      Role: ${newAdmin.role}`)
        console.log(`      Password: ${defaultPassword}`)
        
        createdCount++

      } catch (error) {
        console.error(`   ❌ Error creating ${adminData.email}:`, error)
        errorCount++
      }
    }

    // Summary
    console.log('\n' + '=' .repeat(50))
    console.log('📊 ADMIN CREATION SUMMARY')
    console.log('=' .repeat(50))
    console.log(`✅ Successfully created: ${createdCount}`)
    console.log(`❌ Errors encountered: ${errorCount}`)
    console.log(`📝 Total processed: ${adminUsers.length}`)

    if (createdCount > 0) {
      console.log('\n🎉 Admin users creation completed!')
      
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
      console.log('\nℹ️  No new admin users were created')
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
createAdminNewDomain()
