"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Package, 
  Building, 
  Users, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  Eye,
  Download,
  Upload
} from "lucide-react"

export default function ClassAssetsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAdding, setIsAdding] = useState(false)

  // Mock data untuk aset kelas
  const classAssets = [
    {
      id: "AST-001",
      className: "X MIPA 1",
      assetName: "Proyektor Epson",
      category: "Elektronik",
      quantity: 1,
      condition: "excellent",
      purchaseDate: "2023-08-15",
      purchasePrice: 2500000,
      currentValue: 2000000,
      location: "Lab 101",
      responsible: "Dr. Siti Aminah, M.Pd",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15",
      status: "active"
    },
    {
      id: "AST-002",
      className: "X MIPA 1",
      assetName: "Laptop Dell",
      category: "Elektronik",
      quantity: 2,
      condition: "good",
      purchaseDate: "2023-09-01",
      purchasePrice: 8000000,
      currentValue: 6000000,
      location: "Lab 101",
      responsible: "Dr. Siti Aminah, M.Pd",
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-04-20",
      status: "active"
    },
    {
      id: "AST-003",
      className: "X MIPA 1",
      assetName: "Meja Laboratorium",
      category: "Furnitur",
      quantity: 8,
      condition: "excellent",
      purchaseDate: "2023-07-01",
      purchasePrice: 2400000,
      currentValue: 2200000,
      location: "Lab 101",
      responsible: "Dr. Siti Aminah, M.Pd",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-04-10",
      status: "active"
    },
    {
      id: "AST-004",
      className: "X MIPA 2",
      assetName: "Proyektor BenQ",
      category: "Elektronik",
      quantity: 1,
      condition: "good",
      purchaseDate: "2023-08-20",
      purchasePrice: 2300000,
      currentValue: 1800000,
      location: "Lab 102",
      responsible: "Drs. Bambang Sutrisno",
      lastMaintenance: "2024-01-25",
      nextMaintenance: "2024-04-25",
      status: "active"
    },
    {
      id: "AST-005",
      className: "X IPS 1",
      assetName: "Papan Tulis Putih",
      category: "Furnitur",
      quantity: 2,
      condition: "excellent",
      purchaseDate: "2023-07-15",
      purchasePrice: 800000,
      currentValue: 750000,
      location: "Kelas 201",
      responsible: "Dra. Indira Sari",
      lastMaintenance: "2024-01-30",
      nextMaintenance: "2024-04-30",
      status: "active"
    },
    {
      id: "AST-006",
      className: "XI MIPA 1",
      assetName: "Mikroskop Digital",
      category: "Laboratorium",
      quantity: 4,
      condition: "excellent",
      purchaseDate: "2023-10-01",
      purchasePrice: 12000000,
      currentValue: 10000000,
      location: "Lab 103",
      responsible: "Dra. Rina Dewi",
      lastMaintenance: "2024-02-01",
      nextMaintenance: "2024-05-01",
      status: "active"
    }
  ]

  // Mock data untuk kategori aset
  const assetCategories = [
    { id: "electronics", name: "Elektronik" },
    { id: "furniture", name: "Furnitur" },
    { id: "laboratory", name: "Laboratorium" },
    { id: "books", name: "Buku & Referensi" },
    { id: "sports", name: "Olahraga" }
  ]

  // Mock data untuk kondisi aset
  const assetConditions = [
    { id: "excellent", name: "Sangat Baik", color: "default" },
    { id: "good", name: "Baik", color: "secondary" },
    { id: "fair", name: "Cukup", color: "outline" },
    { id: "poor", name: "Buruk", color: "destructive" }
  ]

  // Mock data untuk kelas
  const classes = [
    "X MIPA 1",
    "X MIPA 2",
    "X IPS 1",
    "XI MIPA 1",
    "XI IPS 1",
    "XII MIPA 1"
  ]

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Get condition badge
  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "excellent":
        return <Badge variant="default">Sangat Baik</Badge>
      case "good":
        return <Badge variant="secondary">Baik</Badge>
      case "fair":
        return <Badge variant="outline">Cukup</Badge>
      case "poor":
        return <Badge variant="destructive">Buruk</Badge>
      default:
        return <Badge variant="outline">Tidak Diketahui</Badge>
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Aktif</Badge>
      case "maintenance":
        return <Badge variant="secondary">Maintenance</Badge>
      case "broken":
        return <Badge variant="destructive">Rusak</Badge>
      default:
        return <Badge variant="outline">Tidak Diketahui</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Aset Kelas</h1>
          <p className="text-muted-foreground">Kelola aset, inventaris, dan peralatan kelas</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Batal
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Aset
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aset</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classAssets.length}</div>
            <p className="text-xs text-muted-foreground">
              Aset aktif
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(classAssets.reduce((sum, asset) => sum + asset.currentValue, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Nilai saat ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kelas Aktif</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(classAssets.map(asset => asset.className)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Kelas dengan aset
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {classAssets.filter(asset => new Date(asset.nextMaintenance) <= new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Perlu maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Asset Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Tambah Aset Baru
            </CardTitle>
            <CardDescription>Isi informasi aset baru</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetClass">Kelas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetName">Nama Aset</Label>
                <Input id="assetName" placeholder="Contoh: Proyektor Epson" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetCategory">Kategori</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetQuantity">Jumlah</Label>
                <Input id="assetQuantity" type="number" placeholder="1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetCondition">Kondisi</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kondisi" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetConditions.map((condition) => (
                      <SelectItem key={condition.id} value={condition.id}>
                        {condition.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetPurchasePrice">Harga Beli</Label>
                <Input id="assetPurchasePrice" type="number" placeholder="2500000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetPurchaseDate">Tanggal Beli</Label>
                <Input id="assetPurchaseDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetLocation">Lokasi</Label>
                <Input id="assetLocation" placeholder="Contoh: Lab 101" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetResponsible">Penanggung Jawab</Label>
              <Input id="assetResponsible" placeholder="Nama penanggung jawab" />
            </div>
            <div className="flex space-x-2">
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assets Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detail Aset</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Daftar Aset Kelas
              </CardTitle>
              <CardDescription>Ringkasan semua aset kelas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Nama Aset</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Nilai Saat Ini</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.className}</TableCell>
                      <TableCell className="font-medium">{asset.assetName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{asset.category}</Badge>
                      </TableCell>
                      <TableCell>{asset.quantity}</TableCell>
                      <TableCell>{getConditionBadge(asset.condition)}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(asset.currentValue)}</TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classAssets.map((asset) => (
              <Card key={asset.id} className="p-4">
                <CardHeader className="p-0 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{asset.assetName}</CardTitle>
                    <Badge variant="outline">{asset.category}</Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {asset.className} • {asset.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Jumlah:</span>
                      <p className="font-medium">{asset.quantity}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Kondisi:</span>
                      <div className="mt-1">{getConditionBadge(asset.condition)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Harga Beli:</span>
                      <p className="font-medium">{formatCurrency(asset.purchasePrice)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nilai Saat Ini:</span>
                      <p className="font-medium">{formatCurrency(asset.currentValue)}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Penanggung Jawab:</span>
                    <p className="text-sm font-medium truncate">{asset.responsible}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Maintenance:</span>
                    <p className="text-sm font-medium">{asset.nextMaintenance}</p>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Detail
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Jadwal Maintenance
              </CardTitle>
              <CardDescription>Aset yang memerlukan maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Nama Aset</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead>Maintenance Terakhir</TableHead>
                    <TableHead>Maintenance Berikutnya</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classAssets
                    .filter(asset => new Date(asset.nextMaintenance) <= new Date())
                    .map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.className}</TableCell>
                      <TableCell className="font-medium">{asset.assetName}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>{getConditionBadge(asset.condition)}</TableCell>
                      <TableCell>{asset.lastMaintenance}</TableCell>
                      <TableCell className="text-red-600 font-medium">{asset.nextMaintenance}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Perlu Maintenance</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
