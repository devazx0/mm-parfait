import { useNavigate } from 'react-router-dom'

export default function TopAppBar() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-margin-mobile h-16 bg-surface border-b border-surface-variant transition-all duration-300 md:hidden">
      <button
        className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors"
        onClick={() => navigate('/')}
      >
        menu
      </button>
      <h1
        className="text-headline-md font-headline-md font-bold text-on-surface tracking-tight cursor-pointer"
        onClick={() => navigate('/')}
      >
        MM Yoghurt Parfait
      </h1>
      <button
        className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors relative"
        onClick={() => navigate('/shop')}
      >
        shopping_bag
      </button>
    </header>
  )
}
