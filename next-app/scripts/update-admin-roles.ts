#!/usr/bin/env tsx

import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

interface RoleDefinition {
  role: string
  permissions: {
    canManageUsers: boolean
    canManageSchools: boolean
    canManageSystem: boolean
    canDeleteData: boolean
    canViewLogs: boolean
    canManageRoles: boolean
    canManageAdmins: boolean
    canAccessAnalytics: boolean
    canManageBackups: boolean
  }
  description: string
}

const roleDefinitions: Record<string, RoleDefinition> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    permissions: {
      canManageUsers: true,
      canManageSchools: true,
      canManageSystem: true,
      canDeleteData: true,
      canViewLogs: true,
      canManageRoles: true,
      canManageAdmins: true,
      canAccessAnalytics: true,
      canManageBackups: true,
    },
    description: 'Full system access - can do everything'
  },
  ADMIN: {
    role: 'ADMIN',
    permissions: {
      canManageUsers: true,
      canManageSchools: true,
      canManageSystem: false,
      canDeleteData: false,
      canViewLogs: true,
      canManageRoles: false,
      canManageAdmins: false,
      canAccessAnalytics: true,
      canManageBackups: false,
    },
    description: 'School-level administrator - can manage school operations'
  },
  MODERATOR: {
    role: 'MODERATOR',
    permissions: {
      canManageUsers: false,
      canManageSchools: false,
      canManageSystem: false,
      canDeleteData: false,
      canViewLogs: false,
      canManageRoles: false,
      canManageAdmins: false,
      canAccessAnalytics: true,
      canManageBackups: false,
    },
    description: 'Limited admin - can view and moderate content'
  }
}

async function updateAdminRoles() {
  try {
    console.log('🔄 Updating admin user roles with proper hierarchy...')
    console.log('=' .repeat(60))

    // Update existing admin users with proper roles
    const roleUpdates = [
      {
        email: 'superadmin@smauiiyk.sch.id',
        newRole: 'SUPER_ADMIN',
        name: 'Super Administrator'
      },
      {
        email: 'admin@smauiiyk.sch.id',
        newRole: 'ADMIN',
        name: 'School Administrator'
      },
      {
        email: 'it@smauiiyk.sch.id',
        newRole: 'ADMIN',
        name: 'IT Administrator'
      },
      {
        email: 'principal@smauiiyk.sch.id',
        newRole: 'ADMIN',
        name: 'School Principal'
      }
    ]

    let updatedCount = 0
    let errorCount = 0

    for (const update of roleUpdates) {
      console.log(`\n📋 Processing: ${update.name}`)
      console.log(`   Email: ${update.email}`)
      console.log(`   New Role: ${update.newRole}`)

      try {
        const user = await prisma.user.findUnique({
          where: { email: update.email }
        })

        if (!user) {
          console.log(`   ❌ User not found: ${update.email}`)
          errorCount++
          continue
        }

        const roleDef = roleDefinitions[update.newRole]
        if (!roleDef) {
          console.log(`   ❌ Invalid role: ${update.newRole}`)
          errorCount++
          continue
        }

        // Update user with new role and permissions
        const updatedUser = await prisma.user.update({
          where: { email: update.email },
          data: {
            role: update.newRole as any,
            permissions: roleDef.permissions,
            name: update.name
          }
        })

        console.log(`   ✅ Updated successfully`)
        console.log(`      ID: ${updatedUser.id}`)
        console.log(`      Role: ${updatedUser.role}`)
        console.log(`      Permissions: ${JSON.stringify(roleDef.permissions, null, 2)}`)
        
        updatedCount++

      } catch (error) {
        console.error(`   ❌ Error updating ${update.email}:`, error)
        errorCount++
      }
    }

    // Summary
    console.log('\n' + '=' .repeat(60))
    console.log('📊 UPDATE SUMMARY')
    console.log('=' .repeat(60))
    console.log(`✅ Successfully updated: ${updatedCount}`)
    console.log(`❌ Errors encountered: ${errorCount}`)
    console.log(`📝 Total processed: ${roleUpdates.length}`)

    if (updatedCount > 0) {
      console.log('\n🎉 Role hierarchy updated successfully!')
      
      console.log('\n🔐 NEW ROLE HIERARCHY:')
      console.log('=' .repeat(30))
      Object.entries(roleDefinitions).forEach(([role, def]) => {
        console.log(`\n👑 ${role}:`)
        console.log(`   Description: ${def.description}`)
        console.log(`   Key Permissions:`)
        Object.entries(def.permissions).forEach(([perm, value]) => {
          if (value) {
            console.log(`     ✅ ${perm}`)
          }
        })
      })

      console.log('\n💡 Key Differences:')
      console.log('   • SUPER_ADMIN: Full system access, can manage other admins')
      console.log('   • ADMIN: School operations, cannot manage other admins')
      console.log('   • MODERATOR: Limited access, view-only for sensitive data')
    }

    console.log('\n🚀 Next steps:')
    console.log('   1. Test role-based access control')
    console.log('   2. Implement permission middleware')
    console.log('   3. Update UI based on user permissions')
    console.log('   4. Test admin vs super admin features')

  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Database connection closed.')
  }
}

// Run the script
updateAdminRoles()
