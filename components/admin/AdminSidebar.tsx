import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bot, Settings, LayoutDashboard, Users, LogOut, X, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeoButton } from '@/components/ui/neo-button'
import { NeoBadge } from '@/components/ui/neo-badge'
import { logoutAction } from '@/actions/auth.actions'

const adminNavItems = [
  { href: '/dashboard', label: 'Dashboard Toko', icon: LayoutDashboard },
  { href: '/admin/settings', label: 'Payment Config', icon: Settings },
  { href: '/admin/users', label: 'Kelola User', icon: Users },
]

export function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-card to-card/50 border-r border-border/50 flex flex-col z-50 lg:z-auto transition-transform lg:translate-x-0 backdrop-blur-sm',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          className="lg:hidden absolute right-4 top-4 p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pt-8 lg:pt-6 border-b border-border/50">
          <Link href="/admin/settings" className="flex items-center gap-3 hover:opacity-75 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 text-primary flex items-center justify-center border border-primary/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Management</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium group',
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{item.label}</span>
                {isActive && (
                  <NeoBadge variant="default" className="ml-auto text-xs">
                    Active
                  </NeoBadge>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border/50 space-y-2">
          <form action={logoutAction} className="w-full">
            <NeoButton
              type="submit"
              variant="destructive"
              className="w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </NeoButton>
          </form>
        </div>
      </aside>
    </>
  )
}
