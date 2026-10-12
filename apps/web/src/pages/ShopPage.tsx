import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCart } from '../context/CartContext'
import { useProductsQuery } from '../services/products/hook'

const priceNum = (price: string) => Number(price.replace(/[^0-9]/g, ''))

export default function ShopPage() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { data: products = [], isLoading, error } = useProductsQuery()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products],
  )

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  const getQty = (id: string) => quantities[id] ?? 1
  const setQty = (id: string, v: number) => setQuantities((q) => ({ ...q, [id]: Math.max(1, v) }))

  return (
    <main className="px-container-margin-mobile pt-16 pb-[100px]">
      {/* Header */}
      <section className="pt-md pb-lg">
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-xs">Shop</h2>
        <p className="text-body-md font-body-md text-on-surface-variant">Fresh parfaits, crafted daily.</p>
      </section>

      {/* Search Bar */}
      <section className="mb-md">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search parfaits..."
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 pl-10 pr-4 text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>
      </section>

      {/* Filter Pills + Result Count */}
      <section className="flex flex-col gap-sm mb-lg">
        <div className="flex overflow-x-auto hide-scrollbar gap-sm pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-md py-xs rounded-full text-label-sm font-label-sm transition-all duration-200 ${
                cat === activeCategory
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface border border-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-label-sm font-label-sm text-on-surface-variant">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</span>
      </section>

      {/* Product Grid */}
      <section>
        {isLoading ? (
          <div className="flex items-center justify-center py-xxl">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-xxl gap-md text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">error</span>
            <p className="text-body-md font-body-md text-on-surface-variant">Unable to load products. Please try again later.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-xxl gap-md text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">search_off</span>
            <p className="text-body-md font-body-md text-on-surface-variant">No parfaits match your search.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All') }} className="text-label-md font-label-md text-primary font-bold hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-md">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-surface border border-outline-variant rounded-lg shadow-[0px_4px_20px_rgba(26,26,26,0.06)] overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] bg-surface-container-high w-full relative overflow-hidden">
                  {product.img ? (
                    <img alt={product.name} className="w-full h-full object-cover" src={product.img} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                      <span className="material-symbols-outlined text-tertiary-fixed-dim text-4xl">image</span>
                    </div>
                  )}
                  {product.badge && (
                    <div className="absolute top-2 left-2 bg-primary text-on-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="p-sm flex flex-col flex-grow gap-1">
                  <h3 className="text-body-md font-body-md font-bold text-on-surface leading-tight line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-label-sm font-label-sm text-on-surface-variant line-clamp-2">{product.description}</p>
                  <span className="text-body-md font-body-md font-bold text-primary mt-auto pt-1">{product.price}</span>
                  <div className="flex items-center justify-between border border-outline-variant rounded mt-1">
                    <button
                      className="material-symbols-outlined text-on-surface-variant text-[18px] px-1"
                      onClick={() => setQty(product.id, getQty(product.id) - 1)}
                    >
                      remove
                    </button>
                    <span className="text-label-sm font-label-sm text-on-surface min-w-[20px] text-center">{getQty(product.id)}</span>
                    <button
                      className="material-symbols-outlined text-on-surface-variant text-[18px] px-1"
                      onClick={() => setQty(product.id, getQty(product.id) + 1)}
                    >
                      add
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, priceNum: product.priceNum ?? priceNum(product.price), img: product.img || '' })}
                    className="w-full mt-1 bg-primary-container text-on-primary font-bold py-2 rounded text-label-sm font-label-sm hover:opacity-90 transition-opacity text-xs"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Event Catering */}
      <section className="mt-xxl">
        <div className="relative rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(26,26,26,0.06)]">
          <div className="h-56 w-full bg-surface-container-highest relative">
            <img
              alt="Elegant catering setup"
              className="w-full h-full object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD88T8XnTdsJGwRIIDPDgrWzXIdry4X48PUtKWnqGgC9dg9S7TcnPIAuJOEn6KilYZfSxEOMSwMeXKc3fDog8qkIEVQdWylOT8TlYnVrunyyemZQ0ei0L1Y_iNTv69L7-GK7DNgObaYAh8n-RmVGgP2EPgG7sTJ2BcF7zfbCGD2VT2xOVKnDpc7FbFYHfa3X9pzU0r5DWnsl9LxEDdX2dzHp8Y4LUpzuhVW48Vd19BniAV1bAl0VrRI9uYu5ShHSovKDKOwSQdXEHE1"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-lg">
              <h2 className="text-headline-md font-headline-md text-on-primary font-bold mb-sm">Event Catering</h2>
              <p className="text-body-md font-body-md text-on-primary mb-md">Bulk pricing for events and gatherings (per cup).</p>
              <button onClick={() => navigate({ to: '/custom-order' })} className="w-full bg-primary-container text-on-primary font-bold py-3 rounded text-label-md font-label-md hover:opacity-90 transition-opacity">
                Inquire Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Orders */}
      <section className="mt-xxl bg-surface border border-outline-variant rounded-xl p-lg shadow-[0px_4px_20px_rgba(26,26,26,0.06)] text-center">
        <span className="material-symbols-outlined text-primary text-4xl mb-md">tune</span>
        <h2 className="text-headline-md font-headline-md text-on-surface font-bold mb-sm">Create Your Own</h2>
        <p className="text-body-md font-body-md text-on-surface-variant mb-lg">Mix and match flavors, fruits, and toppings exactly how you like it.</p>
        <button onClick={() => navigate({ to: '/custom-order' })} className="w-full bg-surface text-on-surface border-2 border-on-tertiary-fixed font-bold py-3 rounded text-label-md font-label-md hover:bg-surface-container transition-colors">
          Start Custom Order
        </button>
      </section>
    </main>
  )
}
