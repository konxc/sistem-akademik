import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion, Home } from "lucide-react"
import Link from "next/link"

export default function OverviewNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <FileQuestion className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Halaman Tidak Ditemukan</CardTitle>
          <CardDescription>
            Halaman overview dashboard yang Anda cari tidak dapat ditemukan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            <p>Silakan periksa URL atau kembali ke dashboard utama.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="outline" className="flex-1">
              Kembali
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
