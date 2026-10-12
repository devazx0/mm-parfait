import { Link } from '@tanstack/react-router'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/admin' },
  { icon: 'edit_note', label: 'Homepage', path: '/admin/homepage' },
  { icon: 'receipt_long', label: 'Orders', path: '/admin/orders' },
  { icon: 'icecream', label: 'Products', path: '/admin/products' },
  { icon: 'photo_library', label: 'Gallery', path: '/admin/gallery' },
  { icon: 'settings', label: 'Settings', path: '/admin/settings' },
] as const

export default function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { user, logout } = useAuth()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 mb-6 p-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-11 h-11 rounded-full bg-surface-container-high overflow-hidden border border-surface-variant flex-shrink-0 flex items-center justify-center">
            {user?.avatar ? (
              <img alt="Admin" className="w-full h-full object-cover" src={user.avatar} />
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
            )}
          </div>
          <div className="truncate">
            <h2 className="font-headline-md text-headline-md text-primary font-bold truncate">{user?.name ?? 'Admin'}</h2>
            <p className="font-label-md text-label-md text-secondary truncate">Premium Parfait HQ</p>
          </div>
        </div>
        {onNavClick && (
          <button
            onClick={onNavClick}
            className="md:hidden p-2 rounded-full text-secondary hover:bg-surface-container transition-colors cursor-pointer shrink-0 border-none bg-transparent"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            activeOptions={{ exact: item.path === '/admin' }}
            onClick={onNavClick}
            activeProps={{
              className:
              `flex items-center gap-3 p-3 rounded-lg font-label-md text-label-md transition-all active:opacity-80 ${
                'bg-primary-container text-on-primary-container font-bold'
              }`,
            }}
            inactiveProps={{
              className: 'flex items-center gap-3 p-3 rounded-lg font-label-md text-label-md transition-all active:opacity-80 text-on-surface-variant hover:bg-surface-container',
            }}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => logout()}
        className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container transition-all rounded-lg font-label-md text-label-md mt-auto cursor-pointer"
      >
        <span className="material-symbols-outlined">logout</span>
        Logout
      </button>
    </div>
  )
}
