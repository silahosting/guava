'use client'

import { useState, useEffect } from 'react'
import { Shield, User, Mail, Calendar, ToggleLeft, Loader } from 'lucide-react'
import { NeoCard } from '@/components/ui/neo-card'
import { NeoButton } from '@/components/ui/neo-button'
import { NeoBadge } from '@/components/ui/neo-badge'
import type { User as UserType } from '@/types'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleUserRole(userId: string, currentRole: 'admin' | 'user') {
    setUpdatingId(userId)
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin'
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kelola User</h1>
        <p className="text-muted-foreground mt-2">
          Manage user roles dan permissions
        </p>
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {users.length === 0 ? (
          <NeoCard className="p-8 text-center">
            <User className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Belum ada user terdaftar</p>
          </NeoCard>
        ) : (
          users.map((user) => (
            <NeoCard key={user.id} className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                      {user.role === 'admin' ? (
                        <Shield className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <NeoBadge
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                    >
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </NeoBadge>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>

                  <NeoButton
                    size="sm"
                    variant={user.role === 'admin' ? 'destructive' : 'default'}
                    onClick={() => toggleUserRole(user.id, user.role)}
                    disabled={updatingId === user.id}
                  >
                    {updatingId === user.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4" />
                        {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </>
                    )}
                  </NeoButton>
                </div>
              </div>
            </NeoCard>
          ))
        )}
      </div>

      {/* Summary */}
      {users.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <NeoCard className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {users.filter((u) => u.role === 'admin').length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Admin Users</p>
          </NeoCard>
          <NeoCard className="p-4 text-center">
            <p className="text-2xl font-bold text-accent">
              {users.filter((u) => u.role === 'user').length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Regular Users</p>
          </NeoCard>
        </div>
      )}
    </div>
  )
}
