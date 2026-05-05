import { NextResponse } from 'next/server'
import { createUser, getUsers } from '@/lib/github-db'
import { hashPassword } from '@/lib/auth'

export async function POST() {
  try {
    // Check if admin already exists
    const users = await getUsers()
    const adminExists = users.some((u: any) => u.role === 'admin')
    
    if (adminExists) {
      return NextResponse.json(
        { error: 'Admin user sudah ada' },
        { status: 400 }
      )
    }

    // Create admin user
    const adminEmail = 'admin@sewa.app'
    const adminPassword = 'Admin@123456'
    const hashedPassword = await hashPassword(adminPassword)

    const admin = await createUser({
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin SewaBot',
      role: 'admin',
      balance: 0,
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user berhasil dibuat',
      credentials: {
        email: adminEmail,
        password: adminPassword,
        note: 'Harap ubah password di settings setelah login'
      },
      user: admin
    })
  } catch (error) {
    console.error('[Init Admin] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal membuat admin user' },
      { status: 500 }
    )
  }
}
