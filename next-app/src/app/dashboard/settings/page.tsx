"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Users, 
  Shield, 
  Database, 
  Network, 
  Bell, 
  Globe, 
  Lock,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [ldapStatus, setLdapStatus] = useState("connected")
  const [networkStatus, setNetworkStatus] = useState("healthy")

  // Mock data untuk settings
  const systemInfo = {
    version: "2.1.0",
    lastUpdate: "2024-02-15",
    uptime: "15 days",
    databaseSize: "2.4 GB",
    activeUsers: 156,
    systemLoad: "45%"
  }

  const ldapConfig = {
    server: "ldap.sma-uii.ac.id",
    port: "389",
    baseDN: "dc=sma-uii,dc=ac,dc=id",
    status: "connected",
    lastSync: "2024-02-15 08:30"
  }

  const networkConfig = {
    serverIP: "192.168.1.100",
    gateway: "192.168.1.1",
    dns: "8.8.8.8",
    bandwidth: "100 Mbps",
    latency: "5ms"
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan Sistem</h1>
          <p className="text-muted-foreground">Konfigurasi dan pengaturan sistem akademik</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Simpan Semua
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="users">Pengguna</TabsTrigger>
          <TabsTrigger value="security">Keamanan</TabsTrigger>
          <TabsTrigger value="ldap">LDAP</TabsTrigger>
          <TabsTrigger value="network">Jaringan</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Pengaturan Umum
              </CardTitle>
              <CardDescription>Konfigurasi dasar sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">Nama Sekolah</Label>
                  <Input id="schoolName" defaultValue="SMA UII Yogyakarta" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolAddress">Alamat</Label>
                  <Input id="schoolAddress" defaultValue="Jl. Kaliurang KM 14.5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolPhone">Telepon</Label>
                  <Input id="schoolPhone" defaultValue="0274-895123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolEmail">Email</Label>
                  <Input id="schoolEmail" defaultValue="info@sma-uii.ac.id" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Waktu</Label>
                  <Select defaultValue="asia/jakarta">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia/jakarta">Asia/Jakarta (WIB)</SelectItem>
                      <SelectItem value="asia/makassar">Asia/Makassar (WITA)</SelectItem>
                      <SelectItem value="asia/jayapura">Asia/Jayapura (WIT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Bahasa</Label>
                  <Select defaultValue="id">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Informasi Sistem
              </CardTitle>
              <CardDescription>Status dan informasi sistem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Versi Sistem</p>
                  <p className="font-medium">{systemInfo.version}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Update Terakhir</p>
                  <p className="font-medium">{systemInfo.lastUpdate}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="font-medium">{systemInfo.uptime}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Ukuran Database</p>
                  <p className="font-medium">{systemInfo.databaseSize}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Pengguna Aktif</p>
                  <p className="font-medium">{systemInfo.activeUsers}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Beban Sistem</p>
                  <p className="font-medium">{systemInfo.systemLoad}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Settings */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pengaturan Pengguna
              </CardTitle>
              <CardDescription>Konfigurasi manajemen pengguna</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Maksimal Percobaan Login</Label>
                  <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout Sesi (menit)</Label>
                  <Input id="sessionTimeout" type="number" defaultValue="30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimal Panjang Password</Label>
                  <Input id="passwordMinLength" type="number" defaultValue="8" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Kadaluarsa Password (hari)</Label>
                  <Input id="passwordExpiry" type="number" defaultValue="90" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="requireMFA" />
                <Label htmlFor="requireMFA">Wajib Multi-Factor Authentication</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="autoLockAccount" />
                <Label htmlFor="autoLockAccount">Auto-lock akun setelah percobaan gagal</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Pengaturan Keamanan
              </CardTitle>
              <CardDescription>Konfigurasi keamanan sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sslCertificate">SSL Certificate</Label>
                  <Select defaultValue="letsencrypt">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="letsencrypt">Let's Encrypt (Free)</SelectItem>
                      <SelectItem value="custom">Custom Certificate</SelectItem>
                      <SelectItem value="selfsigned">Self-Signed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firewallLevel">Level Firewall</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="enableAuditLog" defaultChecked />
                <Label htmlFor="enableAuditLog">Aktifkan Audit Log</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="enableBackup" defaultChecked />
                <Label htmlFor="enableBackup">Aktifkan Auto Backup</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="enableEncryption" defaultChecked />
                <Label htmlFor="enableEncryption">Enkripsi data sensitif</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LDAP Settings */}
        <TabsContent value="ldap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Konfigurasi LDAP
              </CardTitle>
              <CardDescription>Pengaturan integrasi LDAP server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ldapServer">LDAP Server</Label>
                  <Input id="ldapServer" defaultValue={ldapConfig.server} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ldapPort">Port</Label>
                  <Input id="ldapPort" defaultValue={ldapConfig.port} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ldapBaseDN">Base DN</Label>
                <Input id="ldapBaseDN" defaultValue={ldapConfig.baseDN} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ldapUsername">Username</Label>
                  <Input id="ldapUsername" type="password" placeholder="Enter LDAP username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ldapPassword">Password</Label>
                  <Input id="ldapPassword" type="password" placeholder="Enter LDAP password" />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status Koneksi</p>
                  <p className="text-sm text-muted-foreground">
                    {ldapConfig.lastSync}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {ldapStatus === "connected" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <Badge variant={ldapStatus === "connected" ? "default" : "destructive"}>
                    {ldapStatus === "connected" ? "Terhubung" : "Terputus"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Test Koneksi
                </Button>
                <Button size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Simpan & Sync
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Network Settings */}
        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Pengaturan Jaringan
              </CardTitle>
              <CardDescription>Konfigurasi jaringan dan monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serverIP">IP Server</Label>
                  <Input id="serverIP" defaultValue={networkConfig.serverIP} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gateway">Gateway</Label>
                  <Input id="gateway" defaultValue={networkConfig.gateway} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dns">DNS Server</Label>
                  <Input id="dns" defaultValue={networkConfig.dns} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bandwidth">Bandwidth</Label>
                  <Input id="bandwidth" defaultValue={networkConfig.bandwidth} />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status Jaringan</p>
                  <p className="text-sm text-muted-foreground">
                    Latency: {networkConfig.latency}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {networkStatus === "healthy" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <Badge variant={networkStatus === "healthy" ? "default" : "destructive"}>
                    {networkStatus === "healthy" ? "Sehat" : "Masalah"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Test Koneksi
                </Button>
                <Button size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Konfigurasi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
