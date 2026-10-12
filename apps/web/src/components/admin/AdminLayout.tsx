import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'
import SidebarContent from './SidebarContent'

const mobileNavItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/admin' },
  { icon: 'edit_note', label: 'Homepage', path: '/admin/homepage' },
  { icon: 'receipt_long', label: 'Orders', path: '/admin/orders' },
  { icon: 'icecream', label: 'Products', path: '/admin/products' },
  { icon: 'settings', label: 'Settings', path: '/admin/settings' },
] as const

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col md:flex-row antialiased selection:bg-primary-container selection:text-on-primary-container">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-on-surface/40 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-72 z-40 bg-surface border-r border-surface-container shadow-xl p-md rounded-r-xl">
        <SidebarContent />
      </aside>

      <aside
        className={`md:hidden fixed left-0 top-0 h-full w-72 z-40 bg-surface border-r border-surface-container shadow-xl p-md rounded-r-xl transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onNavClick={closeMobileMenu} />
      </aside>

      <div className="flex-1 flex flex-col md:ml-72 min-h-screen w-full transition-all duration-300">
        <header className="flex justify-between items-center w-full px-md h-16 z-20 sticky top-0 bg-surface border-b border-surface-container shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 rounded-full text-primary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">Parfait Admin</h1>
          </div>
          <div className="flex items-center gap-sm">
            <button className="p-2 rounded-full text-secondary hover:bg-surface-container-low transition-colors cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-surface-container flex items-center justify-center bg-surface-variant">
              {user?.avatar ? (
                <img alt="Admin Profile" className="w-full h-full object-cover" src={user.avatar} />
              ) : (
                <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col p-container-margin-mobile md:p-container-margin-desktop max-w-[1200px] mx-auto w-full pb-28 md:pb-8">
          {children}
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-surface py-2 pb-safe border-t border-surface-container shadow-[0px_-4px_20px_rgba(26,26,26,0.06)]">
          {mobileNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              activeOptions={{ exact: item.path === '/admin' }}
              activeProps={{ className: 'flex flex-col items-center justify-center w-full py-xs transition-all active:scale-90 duration-200 text-primary font-bold' }}
              inactiveProps={{ className: 'flex flex-col items-center justify-center w-full py-xs transition-all active:scale-90 duration-200 text-secondary hover:text-primary-container' }}
            >
              <span className="material-symbols-outlined mb-xs">{item.icon}</span>
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
