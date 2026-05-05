'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bot, Mail, Lock, ArrowRight } from 'lucide-react'
import { NeoButton } from '@/components/ui/neo-button'
import { NeoInput } from '@/components/ui/neo-input'
import { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardDescription, NeoCardContent, NeoCardFooter } from '@/components/ui/neo-card'
import { loginAction } from '@/actions/auth.actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    try {
      const formData = new FormData(e.currentTarget)
      console.log('[v0] Submitting login form...')
      
      const result = await loginAction(formData)
      
      // If we get here, login failed (redirect would have happened)
      if (result?.error) {
        setError(result.error)
        console.log('[v0] Login error:', result.error)
      } else {
        // No result and no redirect means something went wrong
        setError('Terjadi kesalahan. Silakan coba lagi.')
        console.log('[v0] Unexpected login result')
      }
    } catch (err) {
      console.error('[v0] Login caught error:', err)
      // Don't show error for redirect - it's expected
      if (!(err instanceof Error && err.message.includes('NEXT_REDIRECT'))) {
        setError('Terjadi kesalahan. Silakan coba lagi.')
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <NeoCard className="bg-card/80 backdrop-blur-xl">
      <NeoCardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <Bot className="w-8 h-8 text-primary-foreground" />
        </div>
        <NeoCardTitle className="text-xl font-bold normal-case">Selamat Datang Kembali</NeoCardTitle>
        <NeoCardDescription>
          Masuk ke dashboard untuk mengelola bot Anda
        </NeoCardDescription>
      </NeoCardHeader>
      
      <NeoCardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg border border-destructive/20 text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <NeoInput
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                className="pl-11"
                required
                disabled={isPending}
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <NeoInput
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                className="pl-11"
                required
                disabled={isPending}
              />
            </div>
          </div>
          
          <NeoButton type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? 'Memproses...' : 'Masuk'}
            <ArrowRight className="w-5 h-5" />
          </NeoButton>
        </form>
      </NeoCardContent>
      
      <NeoCardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Belum punya akun?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </NeoCardFooter>
    </NeoCard>
  )
}
