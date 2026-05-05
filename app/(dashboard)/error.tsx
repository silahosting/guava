'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { NeoButton } from '@/components/ui/neo-button'
import { NeoCard, NeoCardContent } from '@/components/ui/neo-card'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Dashboard error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <NeoCard className="max-w-md w-full">
        <NeoCardContent className="flex flex-col items-center text-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Terjadi Kesalahan</h2>
            <p className="text-sm text-muted-foreground text-pretty">
              Halaman dashboard gagal dimuat. Ini biasanya terjadi karena koneksi ke database
              sedang bermasalah atau session Anda perlu diperbarui.
            </p>
            {error?.digest && (
              <p className="text-xs text-muted-foreground/70 font-mono mt-1">
                ID: {error.digest}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <NeoButton onClick={() => reset()} variant="default" className="flex-1">
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </NeoButton>
            <Link href="/login" className="flex-1">
              <NeoButton variant="secondary" className="w-full">
                <Home className="w-4 h-4" />
                Login Ulang
              </NeoButton>
            </Link>
          </div>
        </NeoCardContent>
      </NeoCard>
    </div>
  )
}
