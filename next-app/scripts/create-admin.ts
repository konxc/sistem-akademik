#!/usr/bin/env tsx

import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

interface AdminUserData {
  name: string
  email: string
  role: string
  description?: string
}

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin users for SMA UII...')
    console.log('=' .repeat(50))

    // Define admin users to create
    const adminUsers: AdminUserData[] = [
      {
        name: 'Administrator SMA UII',
        email: 'admin@smauiiyk.sch.id',
        role: 'ADMIN',
        description: 'Main administrator for the school system'
      },
      {
        name: 'Super Admin',
        email: 'superadmin@smauiiyk.sch.id',
        role: 'ADMIN',
        description: 'Super administrator with full access'
      },
      {
        name: 'IT Administrator',
        email: 'it@smauiiyk.sch.id',
        role: 'ADMIN',
        description: 'IT system administrator'
      },
      {
        name: 'School Principal',
        email: 'principal@smauiiyk.sch.id',
        role: 'ADMIN',
        description: 'School principal with administrative access'
      }
    ]

    let createdCount = 0
    let existingCount = 0

    for (const adminData of adminUsers) {
      console.log(`\n📋 Processing: ${adminData.name}`)
      console.log(`   Email: ${adminData.email}`)
      console.log(`   Role: ${adminData.role}`)

      // Check if admin already exists
      const existingAdmin = await prisma.user.findUnique({
        where: { email: adminData.email }
      })

      if (existingAdmin) {
        console.log(`   ⚠️  Already exists (ID: ${existingAdmin.id})`)
        existingCount++
        continue
      }

      // Create admin user
      try {
        const newAdmin = await prisma.user.create({
          data: {
            name: adminData.name,
            email: adminData.email,
            role: adminData.role as any,
            emailVerified: new Date(),
          }
        })

        console.log(`   ✅ Created successfully (ID: ${newAdmin.id})`)
        createdCount++

      } catch (error) {
        console.error(`   ❌ Error creating ${adminData.email}:`, error)
      }
    }

    // Summary
    console.log('\n' + '=' .repeat(50))
    console.log('📊 SUMMARY')
    console.log('=' .repeat(50))
    console.log(`✅ New admin users created: ${createdCount}`)
    console.log(`⚠️  Existing admin users: ${existingCount}`)
    console.log(`📝 Total processed: ${adminUsers.length}`)

    if (createdCount > 0) {
      console.log('\n🎉 Admin user setup completed successfully!')
      console.log('\n📝 Login credentials for new admins:')
      adminUsers.forEach(admin => {
        console.log(`   • ${admin.name}: ${admin.email}`)
      })
      
      console.log('\n💡 Authentication methods:')
      console.log('   1. Google OAuth (recommended)')
      console.log('   2. Email/Password (if implemented)')
      console.log('   3. Magic Link (if implemented)')
      
      console.log('\n🔐 Access levels:')
      console.log('   • ADMIN: Full access to all features')
      console.log('   • USER: Limited access (students, teachers, staff)')
      console.log('   • GUEST: Read-only access (if implemented)')
    } else {
      console.log('\nℹ️  All admin users already exist. No new users were created.')
    }

    console.log('\n🚀 Next steps:')
    console.log('   1. Test login with admin accounts')
    console.log('   2. Configure Google OAuth credentials')
    console.log('   3. Set up role-based access control')
    console.log('   4. Test admin features and permissions')

  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Database connection closed.')
  }
}

// Run the script
createAdminUser()
