#!/usr/bin/env tsx

import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function listAdminUsers() {
  try {
    console.log('👥 Listing all admin users in SMA UII system...')
    console.log('=' .repeat(60))

    // Get all admin users
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    if (adminUsers.length === 0) {
      console.log('❌ No admin users found in the system.')
      console.log('💡 Run "pnpm create-admin" to create admin users.')
      return
    }

    console.log(`📊 Found ${adminUsers.length} admin user(s):`)
    console.log('')

    adminUsers.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name}`)
      console.log(`   📧 Email: ${admin.email}`)
      console.log(`   🆔 ID: ${admin.id}`)
      console.log(`   🔑 Role: ${admin.role}`)
      console.log(`   ✅ Email Verified: ${admin.emailVerified ? 'Yes' : 'No'}`)
      console.log(`   🖼️  Image: ${admin.image || 'Not set'}`)
      console.log(`   📅 Created: ${admin.createdAt?.toLocaleDateString('id-ID') || 'Unknown'}`)
      console.log(`   🔄 Updated: ${admin.updatedAt?.toLocaleDateString('id-ID') || 'Unknown'}`)
      console.log('')
    })

    // Summary statistics
    const totalUsers = await prisma.user.count()
    const verifiedAdmins = adminUsers.filter(admin => admin.emailVerified).length
    const unverifiedAdmins = adminUsers.filter(admin => !admin.emailVerified).length

    console.log('📈 STATISTICS')
    console.log('=' .repeat(30))
    console.log(`👥 Total users in system: ${totalUsers}`)
    console.log(`👑 Total admin users: ${adminUsers.length}`)
    console.log(`✅ Verified admin users: ${verifiedAdmins}`)
    console.log(`⏳ Unverified admin users: ${unverifiedAdmins}`)
    console.log(`📊 Admin percentage: ${((adminUsers.length / totalUsers) * 100).toFixed(1)}%`)

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS')
    console.log('=' .repeat(30))
    
    if (unverifiedAdmins > 0) {
      console.log(`⚠️  ${unverifiedAdmins} admin user(s) need email verification`)
      console.log('   Consider implementing email verification system')
    }
    
    if (adminUsers.length < 2) {
      console.log('⚠️  Consider creating backup admin accounts')
      console.log('   Run "pnpm create-admin" to create additional admins')
    }
    
    if (adminUsers.length > 5) {
      console.log('⚠️  High number of admin users detected')
      console.log('   Review admin access and consider role reduction')
    }

    console.log('\n🚀 Available commands:')
    console.log('   • pnpm create-admin    - Create new admin users')
    console.log('   • pnpm db:studio       - Open Prisma Studio')
    console.log('   • pnpm db:seed         - Seed database with sample data')

  } catch (error) {
    console.error('\n❌ Error listing admin users:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Database connection closed.')
  }
}

// Run the script
listAdminUsers()
