import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const categories = ['All', 'Classics', 'Best Sellers', 'Seasonal', 'New Arrivals', 'Catering']

const products = [
  {
    name: 'Small Parfait Cup',
    price: '₦1,500',
    desc: 'Perfect for a quick, healthy snack.',
    category: 'Classics',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7KUFuaiPd16yeTf0Ne1Wzt2pIOgt3ZocqjUHP1Z1foHx14mR9V6Bvng9ntjrhIsAF0a-BjbTByiVxmdu_q1LynXNNMwUMnM_TFkPmgL7S6hxvBiQrjfl8wSQY_P9rR8athMepJ7sr1DzRjQKmzpZ7gjyuhFY3WdDhqXwjq5IwweQTA51w41pni51sfKou5jqv1xtkE-gXxlDtjaLFE7OXyFgcBmc1vEobiO8BJzbOVsMBgBortULJh3byNGmcVvKxIhUCkiZ_4dR6',
  },
  {
    name: 'Large Parfait Cup',
    price: '₦3,000',
    desc: 'A generous portion for a satisfying meal.',
    category: 'Classics',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUvvO8K2ZMJ8LW-c4a4Sr-JRGu209XWXDrnY2eFflzdZIjKrJtxqoCsFaHxGWGKnN-Uccnp1VwjYU6UVR6YJACkHp2zKO8aLQuqjnSa-V6NYo7bF9d03eBMyWq-qt4pfHIc35R2vR9otkPIjkxLSkAsNuJ4XaGLQxzOSAEUsuFawWYrYtvDCaGstycZkn_-ik-3ir8MZEyeCCOLu-brYh0dM_eOAUm2rTQ7fsGx4wQrpDj1zp99rEsWZBkii-1Vn6nFjlp4WBZqmpw',
  },
  {
    name: 'Berry Blast Parfait',
    price: '₦4,500',
    desc: 'Mixed berries, honey-roasted granola, and creamy yogurt.',
    category: 'Best Sellers',
    badge: 'Hot',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0iBaK8k1WlVz2mpCuat3jaMi0NXyT1gyZT2YUI55_CsU-atLPy2KM_FhqLdMB_gSO2U2Thifz9Kec55RRLeMLFXnAUn4KmxonenDlpAaNPROWB0r2baxYajK7C28wRVAmft0IBZeomMRiIYC5cP13FqJ8zRuGwAfd2rQ9jlTKycF6tAMNUgFyvVjrMdHAQX5P13y3sxCfPxPLGi_RxSffO8rPlFtfTKUHCKhcZfGeK7rsce_W1qHOroDgK4snEMHfFoLWmXUuJoO4',
  },
  {
    name: 'Creamy Fura',
    price: '₦3,800',
    desc: 'Traditional millet fura blended with unsweetened yogurt.',
    category: 'Best Sellers',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW56H3EsY4e9MBm3HCcXXUKN2UNPcaCFYAv7Gty0yEdNrnKlVXuYt6HuM2Ud2Rsj-tptOGK-Rd_wJeqk5hhOswR_IHkrqpEpe3JYhtSE_HnUlvo5tNu-giMTkrV3sF3WanJDYKPMZ5R0yhGdH36y8gdVJQP2P8IrHXn1jxU4_Mai9xd5jWOe_uDsRZgXv23yBEf4iVp_ue9iaRFsFRxyo2hUxX1JW_JFS7ERnFb7gGuyF88_mU1XazESXEMCIU_wDf9ut4EBJtCeT0',
  },
  {
    name: 'Tropical Delight',
    price: '₦4,200',
    desc: 'Mango, pineapple, and coconut with classic yogurt.',
    category: 'Seasonal',
    badge: 'Seasonal',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBAYTpjQUCgAKn8h1BTOtLTTVw6_3llvhFvYwwmT9xagO_-alRcUCd3ekY-LjjDcAMPYG4FzlyD_8v4_m0e4M5ml719tVgWn-SQR-7LLYlP0nJMkcnqGcfC1yeJGqi5yRVPln6D9y54HDmXVJFXawCcH2zqgPyHBW8FK6o7A7ndXAHTUabxLT5qN8u18rFaB_uUS9_z3DVNTAoPqg0Coqf6wxEzAi3kDsKBfdshDKGRjTFL9EWaZDLCMFpPrPT_08Hekbbb0HB5Ft2',
  },
  {
    name: 'Sunrise Smoothie Bowl',
    price: '₦3,500',
    desc: 'Blended mango, banana, topped with granola and seeds.',
    category: 'New Arrivals',
    badge: 'New',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr8tM66zQDdoP_b39JXDarrEY-Adz_fPiUVfAkFjg7ejtMZzELcMdu53_FljZXzi2378H7cdWzPnTymeH5vioTS3hmuXEM14hHV5nDrrNoRlPTicjRDoAxjOfC6OUO20P5umpLay_yYlIfx72etnHf1MXyoJLHk_zpwvTVpEvgLGN6U8Css5OY0_VQL_JNP5ckZ_G4flZrPv8h0ue3Q_J8PX_VpnxN5g_X4XCE9C0McG91EwcsKyF_yWpmlwd6OecvYx-XmmAJnkmB',
  },
  {
    name: 'Standard Event Parfait',
    price: '₦2,000',
    desc: 'Bulk pricing for events and gatherings (per cup).',
    category: 'Catering',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD88T8XnTdsJGwRIIDPDgrWzXIdry4X48PUtKWnqGgC9dg9S7TcnPIAuJOEn6KilYZfSxEOMSwMeXKc3fDog8qkIEVQdWylOT8TlYnVrunyyemZQ0ei0L1Y_iNTv69L7-GK7DNgObaYAh8n-RmVGgP2EPgG7sTJ2BcF7zfbCGD2VT2xOVKnDpc7FbFYHfa3X9pzU0r5DWnsl9LxEDdX2dzHp8Y4LUpzuhVW48Vd19BniAV1bAl0VrRI9uYu5ShHSovKDKOwSQdXEHE1',
  },
  {
    name: 'Premium Event Parfait',
    price: '₦3,500',
    desc: 'Premium ingredients for upscale events (per cup).',
    category: 'Catering',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-6NjUFJmpqk9xtd_gckx8g3rZNNLj7vAmJPVe2Pa0ZqIHINiZ9X0cNsT_9OoKAq0dSPeFMa3kCuHcJFuMjFyj8IG_7rBEnJ5wnznoeIsfptq0F3pztjtdZhHC8dhVvZcUsPEdt_1kCR8JpoC4pm891pxIicfL2_F39JMoPWVNqIZ5z5YSfyjGwDJVRn5yNSPvucAt1CYnX7QySEIJ5JXfjAr0qbGsUvf7jkAJS_dEIFJSWGKHlrkUBKzPJr-SOfvJm4bu-gKrc30b',
  },
  {
    name: 'Raspberry Elegance',
    price: '₦4,800',
    desc: 'Raspberry coulis, dark chocolate shavings, fresh cream.',
    category: 'New Arrivals',
    badge: 'New',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByWXcHVqlOr874m2YTSCu0F_qCT9lupmmDzqNYfJlquCsniXtwqm7filY3wnK_lu7AZxMQHCU7e9EkWk0C2yox0TTT4sotX7VriGTPfxjlwINRXUGEZPYBmWj2v3a-ixnrl4IdNfxl4WfNeYt0IzxE5xgp4ugVthQSbaKaoZEdAKuXgoNJx0R4v_8wucl1wCae5iiZ-YSVlg861IFPVUbyb_6dKY4w_39M72UltofUn6YnTJNYt3TntBzqtdv2gsCOiALSN2NRLZJj',
  },
]

const priceNum = (price: string) => Number(price.replace(/[^0-9]/g, ''))

export default function ShopPage() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  const getQty = (i: number) => quantities[i] ?? 1
  const setQty = (i: number, v: number) => setQuantities((q) => ({ ...q, [i]: Math.max(1, v) }))

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
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-xxl gap-md text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">search_off</span>
            <p className="text-body-md font-body-md text-on-surface-variant">No parfaits match your search.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All') }} className="text-label-md font-label-md text-primary font-bold hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-md">
            {filtered.map((product) => {
              const realIdx = products.indexOf(product)
              return (
                <div
                  key={product.name}
                  className="bg-surface border border-outline-variant rounded-lg shadow-[0px_4px_20px_rgba(26,26,26,0.06)] overflow-hidden flex flex-col"
                >
                  <div className="aspect-[4/3] bg-surface-container-high w-full relative overflow-hidden">
                    <img alt={product.name} className="w-full h-full object-cover" src={product.img} />
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
                    <p className="text-label-sm font-label-sm text-on-surface-variant line-clamp-2">{product.desc}</p>
                    <span className="text-body-md font-body-md font-bold text-primary mt-auto pt-1">{product.price}</span>
                    <div className="flex items-center justify-between border border-outline-variant rounded mt-1">
                      <button
                        className="material-symbols-outlined text-on-surface-variant text-[18px] px-1"
                        onClick={() => setQty(realIdx, getQty(realIdx) - 1)}
                      >
                        remove
                      </button>
                      <span className="text-label-sm font-label-sm text-on-surface min-w-[20px] text-center">{getQty(realIdx)}</span>
                      <button
                        className="material-symbols-outlined text-on-surface-variant text-[18px] px-1"
                        onClick={() => setQty(realIdx, getQty(realIdx) + 1)}
                      >
                        add
                      </button>
                    </div>
                    <button
                      onClick={() => addToCart({ id: realIdx, name: product.name, price: product.price, priceNum: priceNum(product.price), img: product.img })}
                      className="w-full mt-1 bg-primary-container text-on-primary font-bold py-2 rounded text-label-sm font-label-sm hover:opacity-90 transition-opacity text-xs"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )
            })}
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
              <p className="text-body-md font-body-md text-on-primary mb-md">Standard Event Parfait (₦2,000/cup)</p>
              <button onClick={() => navigate('/custom-order')} className="w-full bg-primary-container text-on-primary font-bold py-3 rounded text-label-md font-label-md hover:opacity-90 transition-opacity">
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
        <button onClick={() => navigate('/custom-order')} className="w-full bg-surface text-on-surface border-2 border-on-tertiary-fixed font-bold py-3 rounded text-label-md font-label-md hover:bg-surface-container transition-colors">
          Start Custom Order
        </button>
      </section>
    </main>
  )
}
