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
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
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

export default function ClassFundsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAdding, setIsAdding] = useState(false)

  // Mock data untuk kas kelas
  const classFunds = [
    {
      id: "CF-001",
      className: "X MIPA 1",
      totalStudents: 32,
      monthlyFee: 50000,
      totalCollected: 1600000,
      totalExpenses: 1200000,
      currentBalance: 400000,
      treasurer: "Ahmad Fadillah",
      lastUpdate: "2024-02-15",
      status: "active"
    },
    {
      id: "CF-002",
      className: "X MIPA 2",
      totalStudents: 30,
      monthlyFee: 50000,
      totalCollected: 1500000,
      totalExpenses: 1100000,
      currentBalance: 400000,
      treasurer: "Siti Nurhaliza",
      lastUpdate: "2024-02-15",
      status: "active"
    },
    {
      id: "CF-003",
      className: "X IPS 1",
      totalStudents: 28,
      monthlyFee: 50000,
      totalCollected: 1400000,
      totalExpenses: 1000000,
      currentBalance: 400000,
      treasurer: "Budi Santoso",
      lastUpdate: "2024-02-15",
      status: "active"
    },
    {
      id: "CF-004",
      className: "XI MIPA 1",
      totalStudents: 31,
      monthlyFee: 50000,
      totalCollected: 1550000,
      totalExpenses: 1150000,
      currentBalance: 400000,
      treasurer: "Rina Sari",
      lastUpdate: "2024-02-15",
      status: "active"
    },
    {
      id: "CF-005",
      className: "XI IPS 1",
      totalStudents: 29,
      monthlyFee: 50000,
      totalCollected: 1450000,
      totalExpenses: 1050000,
      currentBalance: 400000,
      treasurer: "Dewi Putri",
      lastUpdate: "2024-02-15",
      status: "active"
    },
    {
      id: "CF-006",
      className: "XII MIPA 1",
      totalStudents: 33,
      monthlyFee: 50000,
      totalCollected: 1650000,
      totalExpenses: 1250000,
      currentBalance: 400000,
      treasurer: "Muhammad Rizki",
      lastUpdate: "2024-02-15",
      status: "active"
    }
  ]

  // Mock data untuk transaksi kas
  const transactions = [
    {
      id: "TXN-001",
      className: "X MIPA 1",
      type: "income",
      category: "Iuran Bulanan",
      description: "Iuran bulan Februari 2024",
      amount: 1600000,
      date: "2024-02-01",
      treasurer: "Ahmad Fadillah",
      status: "completed"
    },
    {
      id: "TXN-002",
      className: "X MIPA 1",
      type: "expense",
      category: "Konsumsi",
      description: "Snack rapat kelas",
      amount: 150000,
      date: "2024-02-10",
      treasurer: "Ahmad Fadillah",
      status: "completed"
    },
    {
      id: "TXN-003",
      className: "X MIPA 1",
      type: "expense",
      category: "Kegiatan",
      description: "Biaya outing class",
      amount: 500000,
      date: "2024-02-12",
      treasurer: "Ahmad Fadillah",
      status: "completed"
    },
    {
      id: "TXN-004",
      className: "X MIPA 2",
      type: "income",
      category: "Iuran Bulanan",
      description: "Iuran bulan Februari 2024",
      amount: 1500000,
      date: "2024-02-01",
      treasurer: "Siti Nurhaliza",
      status: "completed"
    }
  ]

  // Mock data untuk kategori transaksi
  const transactionCategories = [
    { id: "monthly-fee", name: "Iuran Bulanan", type: "income" },
    { id: "activity", name: "Kegiatan", type: "expense" },
    { id: "consumption", name: "Konsumsi", type: "expense" },
    { id: "equipment", name: "Peralatan", type: "expense" },
    { id: "donation", name: "Donasi", type: "income" }
  ]

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Aktif</Badge>
      case "completed":
        return <Badge variant="default">Selesai</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">Tidak Diketahui</Badge>
    }
  }

  // Get transaction type badge
  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case "income":
        return <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Pemasukan</Badge>
      case "expense":
        return <Badge variant="destructive">Pengeluaran</Badge>
      default:
        return <Badge variant="outline">Tidak Diketahui</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Kas Kelas</h1>
          <p className="text-muted-foreground">Kelola keuangan dan kas setiap kelas</p>
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
                Tambah Transaksi
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(classFunds.reduce((sum, cf) => sum + cf.currentBalance, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Saldo semua kelas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(classFunds.reduce((sum, cf) => sum + cf.totalCollected, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Semua kelas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(classFunds.reduce((sum, cf) => sum + cf.totalExpenses, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Semua kelas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classFunds.reduce((sum, cf) => sum + cf.totalStudents, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Aktif
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Transaction Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Tambah Transaksi Baru
            </CardTitle>
            <CardDescription>Isi informasi transaksi kas kelas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transactionClass">Kelas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classFunds.map((cf) => (
                      <SelectItem key={cf.id} value={cf.className}>
                        {cf.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionType">Jenis Transaksi</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Pemasukan</SelectItem>
                    <SelectItem value="expense">Pengeluaran</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transactionCategory">Kategori</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionAmount">Jumlah</Label>
                <Input id="transactionAmount" type="number" placeholder="50000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionDescription">Deskripsi</Label>
              <Input id="transactionDescription" placeholder="Deskripsi transaksi" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transactionDate">Tanggal</Label>
                <Input id="transactionDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionTreasurer">Bendahara</Label>
                <Input id="transactionTreasurer" placeholder="Nama bendahara" />
              </div>
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

      {/* Class Funds Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transaksi</TabsTrigger>
          <TabsTrigger value="reports">Laporan</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Ringkasan Kas Kelas
              </CardTitle>
              <CardDescription>Status keuangan setiap kelas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Total Siswa</TableHead>
                    <TableHead>Iuran/Bulan</TableHead>
                    <TableHead>Total Terkumpul</TableHead>
                    <TableHead>Total Pengeluaran</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Bendahara</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classFunds.map((cf) => (
                    <TableRow key={cf.id}>
                      <TableCell className="font-medium">{cf.className}</TableCell>
                      <TableCell>{cf.totalStudents}</TableCell>
                      <TableCell>{formatCurrency(cf.monthlyFee)}</TableCell>
                      <TableCell className="text-green-600 font-medium">{formatCurrency(cf.totalCollected)}</TableCell>
                      <TableCell className="text-red-600 font-medium">{formatCurrency(cf.totalExpenses)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(cf.currentBalance)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{cf.treasurer}</TableCell>
                      <TableCell>{getStatusBadge(cf.status)}</TableCell>
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

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Riwayat Transaksi
              </CardTitle>
              <CardDescription>Semua transaksi kas kelas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Bendahara</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell>{txn.date}</TableCell>
                      <TableCell className="font-medium">{txn.className}</TableCell>
                      <TableCell>{getTransactionTypeBadge(txn.type)}</TableCell>
                      <TableCell>{txn.category}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{txn.description}</TableCell>
                      <TableCell className={`font-medium ${txn.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{txn.treasurer}</TableCell>
                      <TableCell>{getStatusBadge(txn.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
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

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classFunds.map((cf) => (
              <Card key={cf.id} className="p-4">
                <CardHeader className="p-0 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cf.className}</CardTitle>
                    <Badge variant="default">Kas Kelas</Badge>
                  </div>
                  <CardDescription className="text-sm">
                    Bendahara: {cf.treasurer}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Siswa:</span>
                      <p className="font-medium">{cf.totalStudents}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Iuran/Bulan:</span>
                      <p className="font-medium">{formatCurrency(cf.monthlyFee)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Terkumpul:</span>
                      <p className="font-medium text-green-600">{formatCurrency(cf.totalCollected)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pengeluaran:</span>
                      <p className="font-medium text-red-600">{formatCurrency(cf.totalExpenses)}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Saldo:</span>
                    <p className="text-lg font-bold">{formatCurrency(cf.currentBalance)}</p>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Detail
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
