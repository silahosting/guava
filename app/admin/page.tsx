import { Users, BarChart3, Settings, CreditCard } from 'lucide-react'
import { getUsers } from '@/lib/github-db'
import { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardContent } from '@/components/ui/neo-card'
import { NeoButton } from '@/components/ui/neo-button'
import Link from 'next/link'

export default async function AdminDashboard() {
  const users = await getUsers()
  const totalUsers = users.length
  const adminUsers = users.filter(u => u.role === 'admin').length
  const regularUsers = users.filter(u => u.role === 'user').length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Kelola sistem dan pengguna SewaBot</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NeoCard>
          <NeoCardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pengguna</p>
                <p className="text-3xl font-bold mt-2">{totalUsers}</p>
              </div>
              <Users className="w-10 h-10 text-primary/30" />
            </div>
          </NeoCardContent>
        </NeoCard>

        <NeoCard>
          <NeoCardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admin</p>
                <p className="text-3xl font-bold mt-2">{adminUsers}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-secondary/30" />
            </div>
          </NeoCardContent>
        </NeoCard>

        <NeoCard>
          <NeoCardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pengguna Regular</p>
                <p className="text-3xl font-bold mt-2">{regularUsers}</p>
              </div>
              <CreditCard className="w-10 h-10 text-accent/30" />
            </div>
          </NeoCardContent>
        </NeoCard>

        <NeoCard>
          <NeoCardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sistem</p>
                <p className="text-lg font-bold mt-2">Aktif</p>
              </div>
              <Settings className="w-10 h-10 text-success/30" />
            </div>
          </NeoCardContent>
        </NeoCard>
      </div>

      {/* User Management */}
      <NeoCard>
        <NeoCardHeader>
          <NeoCardTitle className="flex items-center justify-between">
            <span>Daftar Pengguna</span>
            <Link href="/admin/users">
              <NeoButton variant="secondary" size="sm">
                Kelola Pengguna
              </NeoButton>
            </Link>
          </NeoCardTitle>
        </NeoCardHeader>
        <NeoCardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 font-semibold">Nama</th>
                  <th className="text-left py-2 px-3 font-semibold">Email</th>
                  <th className="text-left py-2 px-3 font-semibold">Role</th>
                  <th className="text-left py-2 px-3 font-semibold">Terdaftar</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id} className="border-b border-border/30 hover:bg-muted/50">
                    <td className="py-3 px-3 font-medium">{user.name}</td>
                    <td className="py-3 px-3 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        user.role === 'admin' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-secondary/10 text-secondary'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground text-xs">
                      {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Tidak ada pengguna</p>
          )}
        </NeoCardContent>
      </NeoCard>
    </div>
  )
}
