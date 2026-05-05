'use dynamic'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Navbar } from '@/components/dashboard/Navbar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  // Only admins can access admin routes
  if (session.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isAdmin={true} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar isAdmin={true} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
