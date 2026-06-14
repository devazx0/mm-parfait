import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
    size: 5 + Math.random() * 8,
    color: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'][Math.floor(Math.random() * 6)],
    rotation: Math.random() * 360,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function loadOrder() {
  try {
    const saved = sessionStorage.getItem('orderSuccess')
    if (saved) return JSON.parse(saved)
  } catch {}
  return {}
}

export default function OrderSuccessPage() {
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(true)
  const { name, total, method, items } = loadOrder()

  useEffect(() => {
    sessionStorage.removeItem('orderSuccess')
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!name) {
    return (
      <main className="px-container-margin-mobile pt-16 pb-[100px] flex flex-col items-center justify-center min-h-[70vh] text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-md">info</span>
        <p className="text-body-md font-body-md text-on-surface-variant">No order information found.</p>
        <button onClick={() => navigate('/shop')} className="mt-lg bg-primary text-on-primary font-bold py-3 px-lg rounded text-label-md font-label-md">
          Go to Shop
        </button>
      </main>
    )
  }

  const orderNumber = `MMP-${String(Math.floor(100000 + Math.random() * 900000))}`

  return (
    <main className="px-container-margin-mobile pt-16 pb-[100px]">
      {showConfetti && <Confetti />}

      <section className="flex flex-col items-center text-center pt-xl pb-lg">
        <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-md animate-[scaleIn_0.4s_ease-out]">
          <span className="material-symbols-outlined text-[#2E7D32] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface font-bold mb-xs">Order Confirmed!</h2>
        <p className="text-body-md font-body-md text-on-surface-variant">Thank you, {name}!</p>
      </section>

      <section className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-lg p-md mb-lg flex items-center gap-md">
        <span className="material-symbols-outlined text-[#2E7D32] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
        <div>
          <p className="text-body-md font-body-md font-bold text-[#1B5E20]">Your order is being prepared</p>
          <p className="text-label-sm font-label-sm text-[#388E3C]">We'll notify you when it's ready.</p>
        </div>
      </section>

      <section className="bg-surface border border-outline-variant rounded-lg p-md mb-lg shadow-[0px_4px_20px_rgba(26,26,26,0.06)]">
        <h3 className="text-body-md font-body-md font-bold text-on-surface mb-md">Order Details</h3>
        <div className="flex flex-col gap-sm">
          <div className="flex justify-between text-label-sm font-label-sm">
            <span className="text-on-surface-variant">Order Number</span>
            <span className="text-on-surface font-bold">{orderNumber}</span>
          </div>
          <div className="flex justify-between text-label-sm font-label-sm">
            <span className="text-on-surface-variant">Items</span>
            <span className="text-on-surface">{items} item{items !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between text-label-sm font-label-sm">
            <span className="text-on-surface-variant">Delivery Method</span>
            <span className="text-on-surface">{method}</span>
          </div>
          <div className="border-t border-outline-variant my-sm" />
          <div className="flex justify-between text-body-md font-body-md font-bold">
            <span className="text-on-surface">Total Paid</span>
            <span className="text-primary">₦{total.toLocaleString()}</span>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-sm">
        <button onClick={() => navigate('/shop')} className="w-full bg-primary text-on-primary font-bold py-3 rounded text-label-md font-label-md hover:opacity-90 transition-opacity">
          Continue Shopping
        </button>
        <button onClick={() => navigate('/')} className="w-full bg-surface text-on-surface border-2 border-on-tertiary-fixed font-bold py-3 rounded text-label-md font-label-md hover:bg-surface-container transition-colors">
          Back to Home
        </button>
      </div>
    </main>
  )
}
