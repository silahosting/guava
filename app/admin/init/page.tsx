'use client'

import { useState } from 'react'
import { Copy, Check, AlertCircle } from 'lucide-react'
import { NeoButton } from '@/components/ui/neo-button'
import { NeoCard } from '@/components/ui/neo-card'
import { NeoBadge } from '@/components/ui/neo-badge'

export default function AdminInitPage() {
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleCreateAdmin() {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/admin/init', {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal membuat admin user')
      } else {
        setCredentials(data.credentials)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  function copyCredentials() {
    if (credentials) {
      const text = `Email: ${credentials.email}\nPassword: ${credentials.password}`
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen dev-bg flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <NeoCard className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Buat Admin User</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Setup akun admin pertama untuk sistem
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/50 border border-red-200/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">{error}</p>
              </div>
            </div>
          )}

          {credentials ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50/50 border border-green-200/50 rounded-lg">
                <p className="text-sm font-medium text-green-900 mb-3">
                  Admin user berhasil dibuat! Salin kredensial di bawah:
                </p>
                
                <div className="space-y-3 bg-white rounded p-3 font-mono text-xs">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Email:</p>
                    <p className="text-green-700 font-semibold">{credentials.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Password:</p>
                    <p className="text-green-700 font-semibold">{credentials.password}</p>
                  </div>
                </div>

                <p className="text-xs text-green-700 mt-3 italic">
                  💡 Harap ubah password di settings setelah login
                </p>
              </div>

              <NeoButton
                onClick={copyCredentials}
                className="w-full"
                variant="outline"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Tersalin!' : 'Salin Kredensial'}
              </NeoButton>

              <NeoButton
                onClick={() => window.location.href = '/login'}
                className="w-full"
              >
                <Check className="w-4 h-4" />
                Lanjut ke Login
              </NeoButton>
            </div>
          ) : (
            <NeoButton
              onClick={handleCreateAdmin}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Membuat...' : 'Buat Admin User'}
            </NeoButton>
          )}

          <div className="mt-6 p-3 bg-blue-50/50 border border-blue-200/50 rounded-lg">
            <p className="text-xs text-blue-900 leading-relaxed">
              <strong>⚠️ Catatan:</strong> Halaman ini hanya untuk setup awal. Akses ke halaman ini akan dibatasi setelah admin user dibuat.
            </p>
          </div>
        </NeoCard>
      </div>
    </div>
  )
}
