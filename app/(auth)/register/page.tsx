'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bot, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { NeoButton } from '@/components/ui/neo-button'
import { NeoInput } from '@/components/ui/neo-input'
import { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardDescription, NeoCardContent, NeoCardFooter } from '@/components/ui/neo-card'
import { registerAction } from '@/actions/auth.actions'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    try {
      const formData = new FormData(e.currentTarget)
      console.log('[v0] Submitting register form...')
      
      const result = await registerAction(formData)
      
      if (result?.error) {
        setError(result.error)
        console.log('[v0] Register error:', result.error)
      }
    } catch (err) {
      console.error('[v0] Register caught error:', err)
      if (!(err instanceof Error && err.message.includes('NEXT_REDIRECT'))) {
        setError('Terjadi kesalahan. Silakan coba lagi.')
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <NeoCard className="bg-card">
      <NeoCardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-secondary neo-border flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-secondary-foreground" />
        </div>
        <NeoCardTitle>Daftar</NeoCardTitle>
        <NeoCardDescription>
          Buat akun untuk mulai sewa dan kelola bot Anda
        </NeoCardDescription>
      </NeoCardHeader>
      
      <NeoCardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-destructive text-destructive-foreground p-3 neo-border-2 text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-bold uppercase tracking-wide">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <NeoInput
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className="pl-11"
                required
                disabled={isPending}
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-bold uppercase tracking-wide">
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
            <label htmlFor="password" className="text-sm font-bold uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <NeoInput
                id="password"
                name="password"
                type="password"
                placeholder="Min. 6 karakter"
                className="pl-11"
                required
                minLength={6}
                disabled={isPending}
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-bold uppercase tracking-wide">
              Konfirmasi Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <NeoInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                className="pl-11"
                required
                minLength={6}
                disabled={isPending}
              />
            </div>
          </div>
          
          <NeoButton type="submit" variant="secondary" className="w-full mt-2" disabled={isPending}>
            {isPending ? 'Memproses...' : 'Daftar'}
            <ArrowRight className="w-5 h-5" />
          </NeoButton>
        </form>
      </NeoCardContent>
      
      <NeoCardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Masuk
          </Link>
        </p>
      </NeoCardFooter>
    </NeoCard>
  )
}
