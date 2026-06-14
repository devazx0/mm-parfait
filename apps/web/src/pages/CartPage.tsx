import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart()

  const deliveryFee = totalPrice >= 5000 ? 0 : 1500
  const grandTotal = totalPrice + deliveryFee

  return (
    <main className="px-container-margin-mobile pt-16 pb-[100px]">
      <section className="pt-md pb-lg">
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-xs">Cart</h2>
        <p className="text-body-md font-body-md text-on-surface-variant">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
      </section>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-xxl gap-md text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant">shopping_cart</span>
          <p className="text-body-md font-body-md text-on-surface-variant">Your cart is empty.</p>
          <p className="text-label-sm font-label-sm text-on-surface-variant">Browse our shop to add items.</p>
          <button onClick={() => navigate('/shop')} className="bg-primary text-on-primary font-bold py-3 px-lg rounded text-label-md font-label-md hover:opacity-90 transition-opacity">
            Browse Shop
          </button>
        </div>
      ) : (
        <>
          <section className="flex flex-col gap-md mb-lg">
            {items.map((item) => (
              <div key={item.id} className="flex gap-md bg-surface border border-outline-variant rounded-lg p-md shadow-[0px_4px_20px_rgba(26,26,26,0.06)]">
                <div className="w-20 h-20 rounded-lg bg-surface-container-high overflow-hidden shrink-0">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-grow min-w-0">
                  <h3 className="text-body-md font-body-md font-bold text-on-surface truncate">{item.name}</h3>
                  <span className="text-label-sm font-label-sm text-primary font-bold mt-1">{item.price}</span>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-outline-variant rounded">
                      <button
                        className="material-symbols-outlined text-on-surface-variant text-[18px] px-1"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >remove</button>
                      <span className="text-label-sm font-label-sm text-on-surface min-w-[24px] text-center">{item.quantity}</span>
                      <button
                        className="material-symbols-outlined text-on-surface-variant text-[18px] px-1"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >add</button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="material-symbols-outlined text-error text-[20px]"
                    >delete</button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Order Summary */}
          <section className="bg-surface border border-outline-variant rounded-lg p-md mb-lg shadow-[0px_4px_20px_rgba(26,26,26,0.06)]">
            <h3 className="text-body-md font-body-md font-bold text-on-surface mb-md">Order Summary</h3>
            <div className="flex justify-between text-body-md font-body-md text-on-surface mb-xs">
              <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
              <span>₦{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-body-md font-body-md text-on-surface-variant mb-xs">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}</span>
            </div>
            {totalPrice < 5000 && totalPrice > 0 && (
              <p className="text-label-sm font-label-sm text-primary mb-xs">
                Add ₦{(5000 - totalPrice).toLocaleString()} more for free delivery
              </p>
            )}
            <div className="border-t border-outline-variant my-sm" />
            <div className="flex justify-between text-body-lg font-body-lg font-bold text-on-surface">
              <span>Total</span>
              <span>₦{grandTotal.toLocaleString()}</span>
            </div>
          </section>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-primary text-on-primary font-bold py-3 rounded text-label-md font-label-md hover:opacity-90 transition-opacity"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </main>
  )
}
