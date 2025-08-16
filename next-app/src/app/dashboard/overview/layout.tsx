import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Overview - SMA UII Dashboard",
  description: "Halaman overview dashboard Sistem Manajemen Akademik SMA UII",
}

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
