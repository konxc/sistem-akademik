'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserStats } from '@/hooks/useUser'
import { Users, UserCheck, GraduationCap, Briefcase, UserX, Shield } from 'lucide-react'

interface UserStatsProps {
  schoolId: string
}

export function UserStats({ schoolId }: UserStatsProps) {
  const { data: stats, isLoading, error } = useUserStats(schoolId)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm">Error loading stats</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const {
    totalUsers = 0,
    activeUsers = 0,
    totalStudents = 0,
    totalTeachers = 0,
    totalStaff = 0,
    totalAdmins = 0
  } = stats || {}

  const inactiveUsers = totalUsers - activeUsers

  const statCards = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      description: 'Semua user dalam sistem',
      color: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: UserCheck,
      description: 'User yang aktif',
      color: 'text-green-600'
    },
    {
      title: 'Total Students',
      value: totalStudents,
      icon: GraduationCap,
      description: 'Siswa terdaftar',
      color: 'text-purple-600'
    },
    {
      title: 'Total Teachers',
      value: totalTeachers,
      icon: GraduationCap,
      description: 'Guru terdaftar',
      color: 'text-orange-600'
    },
    {
      title: 'Total Staff',
      value: totalStaff,
      icon: Briefcase,
      description: 'Staff terdaftar',
      color: 'text-gray-600'
    },
    {
      title: 'Total Admins',
      value: totalAdmins,
      icon: Shield,
      description: 'Admin terdaftar',
      color: 'text-red-600'
    },
    {
      title: 'Inactive Users',
      value: inactiveUsers,
      icon: UserX,
      description: 'User yang tidak aktif',
      color: 'text-red-500'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-sm transition-shadow border-0 bg-gray-50/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-600 truncate">{stat.title}</div>
              </div>
              <stat.icon className={`h-4 w-4 ${stat.color} opacity-60`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
