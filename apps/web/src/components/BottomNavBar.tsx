import { useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { icon: 'home', label: 'Home', path: '/' },
  { icon: 'storefront', label: 'Shop', path: '/shop' },
  { icon: 'photo_library', label: 'Gallery', path: '/gallery' },
  { icon: 'shopping_cart', label: 'Cart', path: '/cart' },
]

export default function BottomNavBar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-surface py-2 pb-safe border-t border-surface-variant shadow-sm">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <button
            key={item.label}
            className={`flex flex-col items-center justify-center gap-1 w-16 group transition-all duration-200 ${
              isActive
                ? 'text-primary font-bold scale-95'
                : 'text-on-secondary-fixed-variant hover:text-primary'
            }`}
            onClick={() => navigate(item.path)}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-label-sm font-label-sm mt-xs">{item.label}</span>
            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />}
          </button>
        )
      })}
    </nav>
  )
}
