import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const deliveryMethods = [
  { id: 'standard', label: 'Standard Delivery', desc: '3-5 business days', fee: 1500, icon: 'local_shipping' },
  { id: 'express', label: 'Express Delivery', desc: '1-2 business days', fee: 3500, icon: 'rocket_launch' },
  { id: 'pickup', label: 'Pick Up', desc: 'Ready in 2 hours', fee: 0, icon: 'store' },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()

  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', note: '' })
  const [deliveryMethod, setDeliveryMethod] = useState('standard')
  const [submitting, setSubmitting] = useState(false)

  const method = deliveryMethods.find((m) => m.id === deliveryMethod)!
  const deliveryFee = method.fee
  const grandTotal = totalPrice + deliveryFee

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    const order = { name: form.name, total: grandTotal, method: method.label, items: items.length }
    sessionStorage.setItem('orderSuccess', JSON.stringify(order))
    clearCart()
    navigate('/order-success')
  }

  return (
    <main className="px-container-margin-mobile pt-16 pb-[100px]">
      <section className="pt-md pb-lg">
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-xs">Checkout</h2>
        <p className="text-body-md font-body-md text-on-surface-variant">Complete your order</p>
      </section>

      <form onSubmit={handleSubmit}>
        {/* Delivery Details */}
        <section className="mb-lg">
          <h3 className="text-body-md font-body-md font-bold text-on-surface mb-md flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
            Delivery Details
          </h3>
          <div className="bg-surface border border-outline-variant rounded-lg p-md flex flex-col gap-md shadow-[0px_4px_20px_rgba(26,26,26,0.06)]">
            {[
              { key: 'name', label: 'Full Name', type: 'text', icon: 'badge' },
              { key: 'phone', label: 'Phone Number', type: 'tel', icon: 'call' },
              { key: 'email', label: 'Email Address', type: 'email', icon: 'mail' },
              { key: 'address', label: 'Delivery Address', type: 'text', icon: 'home' },
            ].map((field) => (
              <div key={field.key} className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">{field.icon}</span>
                <input
                  type={field.type}
                  required
                  value={(form as any)[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.label}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 pl-10 pr-4 text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[20px]">notes</span>
              <textarea
                value={form.note}
                onChange={(e) => update('note', e.target.value)}
                placeholder="Order Notes (optional)"
                rows={3}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 pl-10 pr-4 text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>
        </section>

        {/* Delivery Method */}
        <section className="mb-lg">
          <h3 className="text-body-md font-body-md font-bold text-on-surface mb-md flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
            Delivery Method
          </h3>
          <div className="flex flex-col gap-sm">
            {deliveryMethods.map((dm) => (
              <label
                key={dm.id}
                className={`flex items-center gap-md bg-surface border rounded-lg p-md cursor-pointer transition-all duration-200 shadow-[0px_4px_20px_rgba(26,26,26,0.06)] ${
                  deliveryMethod === dm.id
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-outline-variant hover:border-outline'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value={dm.id}
                  checked={deliveryMethod === dm.id}
                  onChange={() => setDeliveryMethod(dm.id)}
                  className="accent-primary w-4 h-4"
                />
                <span className="material-symbols-outlined text-primary text-[24px]">{dm.icon}</span>
                <div className="flex-grow">
                  <p className="text-body-md font-body-md font-bold text-on-surface">{dm.label}</p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">{dm.desc}</p>
                </div>
                <span className="text-label-md font-label-md font-bold text-on-surface">{dm.fee === 0 ? 'Free' : `₦${dm.fee.toLocaleString()}`}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Order Items */}
        <section className="mb-lg">
          <h3 className="text-body-md font-body-md font-bold text-on-surface mb-md flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
            Order Items
          </h3>
          <div className="bg-surface border border-outline-variant rounded-lg p-md shadow-[0px_4px_20px_rgba(26,26,26,0.06)]">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-outline-variant last:border-b-0">
                <div className="flex items-center gap-sm min-w-0">
                  <div className="w-10 h-10 rounded bg-surface-container-high overflow-hidden shrink-0">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-md font-body-md text-on-surface truncate">{item.name}</p>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-label-md font-label-md font-bold text-on-surface shrink-0 ml-2">₦{(item.priceNum * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Summary */}
        <section className="mb-lg">
          <h3 className="text-body-md font-body-md font-bold text-on-surface mb-md flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">credit_card</span>
            Payment Summary
          </h3>
          <div className="bg-surface border border-outline-variant rounded-lg p-md shadow-[0px_4px_20px_rgba(26,26,26,0.06)]">
            <div className="flex justify-between text-body-md font-body-md text-on-surface mb-xs">
              <span>Subtotal</span>
              <span>₦{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-body-md font-body-md text-on-surface-variant mb-xs">
              <span>Delivery ({method.label})</span>
              <span>{deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}</span>
            </div>
            <div className="border-t border-outline-variant my-sm" />
            <div className="flex justify-between text-body-lg font-body-lg font-bold text-on-surface">
              <span>Total</span>
              <span>₦{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-on-primary font-bold py-3 rounded text-label-md font-label-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-sm"
        >
          {submitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              Processing...
            </>
          ) : (
            `Place Order — ₦${grandTotal.toLocaleString()}`
          )}
        </button>

        <p className="text-label-sm font-label-sm text-on-surface-variant text-center mt-md">
          By placing this order, you agree to our Terms & Conditions.
        </p>
      </form>
    </main>
  )
}
