'use server'

import { redirect } from 'next/navigation'
import { createUser, getUserByEmail } from '@/lib/github-db'
import { hashPassword, verifyPassword, createSession, destroySession } from '@/lib/auth'

function isRedirectError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('digest' in error)) {
    return false
  }
  const digest = (error as any).digest
  return typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT')
}

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!name || !email || !password) {
    return { error: 'Semua field harus diisi' }
  }

  if (password !== confirmPassword) {
    return { error: 'Password tidak cocok' }
  }

  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter' }
  }

  try {
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return { error: 'Email sudah terdaftar' }
    }

    const hashedPassword = await hashPassword(password)
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default new users to 'user' role
    })

    if (!user) {
      return { error: 'Gagal membuat akun. Silakan coba lagi.' }
    }

    await createSession(user.id)
    redirect('/dashboard')
  } catch (error) {
    // Re-throw redirect errors - they should not be caught
    if (isRedirectError(error)) {
      throw error
    }
    console.error('Register error:', error)
    return { error: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.' }
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan password harus diisi' }
  }

  try {
    const user = await getUserByEmail(email)
    
    if (!user) {
      return { error: 'Email atau password salah' }
    }

    const isValid = await verifyPassword(password, user.password)
    
    if (!isValid) {
      return { error: 'Email atau password salah' }
    }

    await createSession(user.id)
    
    // Route based on user role
    redirect(user.role === 'admin' ? '/admin' : '/dashboard')
  } catch (error) {
    // Re-throw redirect errors - they should not be caught
    if (isRedirectError(error)) {
      throw error
    }
    console.error('Login error:', error)
    return { error: 'Terjadi kesalahan saat login. Silakan coba lagi.' }
  }
}

export async function logoutAction() {
  await destroySession()
  redirect('/login')
}
