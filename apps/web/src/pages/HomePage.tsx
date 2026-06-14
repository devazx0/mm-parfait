import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const featured = [
  {
    title: 'Berry Blast Parfait',
    price: '₦4,500',
    desc: 'A vibrant mix of seasonal berries, honey-roasted granola, and our signature creamy yogurt.',
    badge: 'Best Seller',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0iBaK8k1WlVz2mpCuat3jaMi0NXyT1gyZT2YUI55_CsU-atLPy2KM_FhqLdMB_gSO2U2Thifz9Kec55RRLeMLFXnAUn4KmxonenDlpAaNPROWB0r2baxYajK7C28wRVAmft0IBZeomMRiIYC5cP13FqJ8zRuGwAfd2rQ9jlTKycF6tAMNUgFyvVjrMdHAQX5P13y3sxCfPxPLGi_RxSffO8rPlFtfTKUHCKhcZfGeK7rsce_W1qHOroDgK4snEMHfFoLWmXUuJoO4',
  },
  {
    title: 'Creamy Fura',
    price: '₦3,800',
    desc: 'Traditional millet fura blended perfectly with our rich, unsweetened yogurt for a wholesome treat.',
    badge: null,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW56H3EsY4e9MBm3HCcXXUKN2UNPcaCFYAv7Gty0yEdNrnKlVXuYt6HuM2Ud2Rsj-tptOGK-Rd_wJeqk5hhOswR_IHkrqpEpe3JYhtSE_HnUlvo5tNu-giMTkrV3sF3WanJDYKPMZ5R0yhGdH36y8gdVJQP2P8IrHXn1jxU4_Mai9xd5jWOe_uDsRZgXv23yBEf4iVp_ue9iaRFsFRxyo2hUxX1JW_JFS7ERnFb7gGuyF88_mU1XazESXEMCIU_wDf9ut4EBJtCeT0',
  },
  {
    title: 'Tropical Delight',
    price: '₦4,200',
    desc: 'Mango, pineapple, and a hint of coconut layered with our classic yogurt.',
    badge: 'Seasonal',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBAYTpjQUCgAKn8h1BTOtLTTVw6_3llvhFvYwwmT9xagO_-alRcUCd3ekY-LjjDcAMPYG4FzlyD_8v4_m0e4M5ml719tVgWn-SQR-7LLYlP0nJMkcnqGcfC1yeJGqi5yRVPln6D9y54HDmXVJFXawCcH2zqgPyHBW8FK6o7A7ndXAHTUabxLT5qN8u18rFaB_uUS9_z3DVNTAoPqg0Coqf6wxEzAi3kDsKBfdshDKGRjTFL9EWaZDLCMFpPrPT_08Hekbbb0HB5Ft2',
  },
]

const classics = [
  {
    title: 'Small Parfait Cup',
    price: '₦1,500',
    desc: 'Perfect for a quick, healthy snack.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7KUFuaiPd16yeTf0Ne1Wzt2pIOgt3ZocqjUHP1Z1foHx14mR9V6Bvng9ntjrhIsAF0a-BjbTByiVxmdu_q1LynXNNMwUMnM_TFkPmgL7S6hxvBiQrjfl8wSQY_P9rR8athMepJ7sr1DzRjQKmzpZ7gjyuhFY3WdDhqXwjq5IwweQTA51w41pni51sfKou5jqv1xtkE-gXxlDtjaLFE7OXyFgcBmc1vEobiO8BJzbOVsMBgBortULJh3byNGmcVvKxIhUCkiZ_4dR6',
  },
  {
    title: 'Large Parfait Cup',
    price: '₦3,000',
    desc: 'A generous portion for a satisfying meal.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUvvO8K2ZMJ8LW-c4a4Sr-JRGu209XWXDrnY2eFflzdZIjKrJtxqoCsFaHxGWGKnN-Uccnp1VwjYU6UVR6YJACkHp2zKO8aLQuqjnSa-V6NYo7bF9d03eBMyWq-qt4pfHIc35R2vR9otkPIjkxLSkAsNuJ4XaGLQxzOSAEUsuFawWYrYtvDCaGstycZkn_-ik-3ir8MZEyeCCOLu-brYh0dM_eOAUm2rTQ7fsGx4wQrpDj1zp99rEsWZBkii-1Vn6nFjlp4WBZqmpw',
  },
]

const galleryPreviews = [
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3jZr8qwLhq4mA2sIAoVxXwbjLGQ4w56eXqy-7negTDPW3pbJjnkXBxCAdP6YHW7IaH1QZ6ycRvbCfxDPZ6d1wx_XAH9XkeXy0gehkhBZbOWdwIQ6ntI3V6JbgCQh2-tCW0NRUzA12GB1xEw0dUCYneap_XM-gCAUW5LeP0PxaQbuwjz5XWxYUwUxMAZB6tPB3jqFaAy31E_GtX3Llt4Nd4xJDQq-GNAqvkYoWGoLr0qfPuISZcZGEqq3lzEQ3M_1iLEwukBOcsSCG',
    label: 'Weddings',
  },
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByWXcHVqlOr874m2YTSCu0F_qCT9lupmmDzqNYfJlquCsniXtwqm7filY3wnK_lu7AZxMQHCU7e9EkWk0C2yox0TTT4sotX7VriGTPfxjlwINRXUGEZPYBmWj2v3a-ixnrl4IdNfxl4WfNeYt0IzxE5xgp4ugVthQSbaKaoZEdAKuXgoNJx0R4v_8wucl1wCae5iiZ-YSVlg861IFPVUbyb_6dKY4w_39M72UltofUn6YnTJNYt3TntBzqtdv2gsCOiALSN2NRLZJj',
    label: 'Birthdays',
  },
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-6NjUFJmpqk9xtd_gckx8g3rZNNLj7vAmJPVe2Pa0ZqIHINiZ9X0cNsT_9OoKAq0dSPeFMa3kCuHcJFuMjFyj8IG_7rBEnJ5wnznoeIsfptq0F3pztjtdZhHC8dhVvZcUsPEdt_1kCR8JpoC4pm891pxIicfL2_F39JMoPWVNqIZ5z5YSfyjGwDJVRn5yNSPvucAt1CYnX7QySEIJ5JXfjAr0qbGsUvf7jkAJS_dEIFJSWGKHlrkUBKzPJr-SOfvJm4bu-gKrc30b',
    label: 'Corporate',
  },
]

const testimonials = [
  {
    name: 'Chioma A.',
    text: 'The Berry Blast is my go-to breakfast. Fresh, filling, and absolutely delicious!',
    rating: 5,
  },
  {
    name: 'Emeka O.',
    text: 'We ordered catering for our wedding and it was a huge hit. Guests are still asking about the parfaits!',
    rating: 5,
  },
  {
    name: 'Aisha B.',
    text: 'Finally, a healthy snack that actually tastes amazing. My kids love the Tropical Delight.',
    rating: 5,
  },
]

const steps = [
  { icon: 'restaurant_menu', title: 'Choose Your Base', desc: 'Pick from classic yogurt, creamy fura, or plant-based options.' },
  { icon: 'eco', title: 'Add Your Toppings', desc: 'Fresh fruits, crunchy granola, honey drizzle, and more.' },
  { icon: 'celebration', title: 'Enjoy & Share', desc: 'Perfect for a quick bite or a gathering with friends.' },
]

const priceNum = (price: string) => Number(price.replace(/[^0-9]/g, ''))

export default function HomePage() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [classicQtys, setClassicQtys] = useState<Record<number, number>>({})
  const getClassicQty = (i: number) => classicQtys[i] ?? 1
  const setClassicQty = (i: number, v: number) => setClassicQtys((q) => ({ ...q, [i]: Math.max(1, v) }))

  return (
    <main className="pt-16 pb-[calc(64px+env(safe-area-inset-bottom,16px))]">
      {/* Hero Section */}
      <section className="relative w-full h-[65vh] min-h-[500px] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover object-center"
            alt="Fresh fruit parfait"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQPypHqLcjpZyTKNHoXAttJVtHtyElar1xzKzhR5r9T2vI4HT7EzBWZ2ThzHVqnxY5GmkQ0zasj40HBECXn8lP_DqH_Z_mmaVvuZMN3fkY1ppryT1DrJaLZanJjHByKlyd19hMw2tu3gzRVX7f_UNf678Jp4hIM8KtE2bXwQGrvUXbOOS11397FYoOyBkcPiThCjuAurmQvofG0s66b0e-_e-RAf3J0_BWvE4NOrtCYblzrhHyMaIwNuv5uXyYjtSWYGMxrMaKOfw_"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
        </div>
        <div className="relative z-10 px-container-margin-mobile pb-xl flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <span className="text-label-md font-label-md uppercase tracking-widest text-primary font-bold">
              Premium Freshness
            </span>
            <h2 className="text-headline-xl font-headline-xl text-on-surface leading-tight">
              Healthy meets<br />Delicious
            </h2>
          </div>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-[384px]">
            Experience the perfect blend of natural goodness and artisanal flavor in every bite.
          </p>
          <div className="flex flex-col gap-sm mt-sm">
            <button
              onClick={() => navigate('/shop')}
              className="w-full bg-primary-container text-on-primary font-label-md text-label-md font-bold py-4 px-6 rounded-lg shadow-[0px_8px_30px_rgba(26,26,26,0.12)] active:scale-95 transition-transform duration-200 flex items-center justify-center gap-2"
            >
              Shop Our Parfaits
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
            <button
              onClick={() => navigate('/gallery')}
              className="w-full bg-transparent text-on-surface font-label-md text-label-md font-bold py-4 px-6 rounded-lg border border-on-surface/20 hover:bg-surface-container active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Book Event Catering
              <span className="material-symbols-outlined text-[20px]">event</span>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-xl px-container-margin-mobile flex flex-col gap-lg">
        <div className="text-center">
          <h3 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">How It Works</h3>
          <p className="text-body-md font-body-md text-on-surface-variant mt-sm">Three simple steps to your perfect parfait.</p>
        </div>
        <div className="grid grid-cols-1 gap-md">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-center gap-md bg-surface-container-low rounded-xl p-md">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary">{step.icon}</span>
              </div>
              <div className="flex flex-col gap-xs">
                <div className="flex items-center gap-2">
                  <span className="text-label-sm font-label-sm text-primary font-bold">Step {i + 1}</span>
                </div>
                <h4 className="text-headline-md font-headline-md text-on-surface">{step.title}</h4>
                <p className="text-body-md font-body-md text-on-surface-variant">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Favourites */}
      <section className="py-xl px-container-margin-mobile flex flex-col gap-md">
        <div className="flex justify-between items-end">
          <h3 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
            Featured Favourites
          </h3>
          <button
            onClick={() => navigate('/shop')}
            className="text-label-md font-label-md text-primary font-bold hover:underline"
          >
            View All
          </button>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar gap-gutter pb-4 -mx-container-margin-mobile px-container-margin-mobile snap-x snap-mandatory">
          {featured.map((item) => (
            <div
              key={item.title}
              className="min-w-[280px] w-[80vw] max-w-[320px] bg-surface rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(26,26,26,0.06)] overflow-hidden snap-center flex flex-col group cursor-pointer"
            >
              <div className="h-48 w-full relative overflow-hidden bg-surface-container-low">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={item.title}
                  src={item.img}
                />
                {item.badge && (
                  <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded text-label-sm font-label-sm text-on-surface font-bold">
                    {item.badge}
                  </div>
                )}
              </div>
              <div className="p-md flex flex-col gap-xs flex-grow">
                <h4 className="text-headline-md font-headline-md text-on-surface leading-tight">
                  {item.title}
                </h4>
                <p className="text-body-md font-body-md text-on-surface-variant line-clamp-2 mt-1">
                  {item.desc}
                </p>
                <div className="mt-auto pt-sm flex justify-between items-center">
                  <span className="text-label-md font-label-md text-primary font-bold">
                    {item.price}
                  </span>
                  <button
                    onClick={() => addToCart({ id: 100 + featured.indexOf(item), name: item.title, price: item.price, priceNum: priceNum(item.price), img: item.img })}
                    className="bg-surface-container text-on-surface p-2 rounded-full hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Strip */}
      <section className="mx-container-margin-mobile bg-surface-container-low rounded-2xl py-lg px-md grid grid-cols-3 gap-md text-center">
        <div className="flex flex-col items-center gap-xs">
          <span className="text-headline-md font-headline-md text-primary">5+</span>
          <span className="text-label-sm font-label-sm text-on-surface-variant">Years Serving</span>
        </div>
        <div className="flex flex-col items-center gap-xs">
          <span className="text-headline-md font-headline-md text-primary">50K+</span>
          <span className="text-label-sm font-label-sm text-on-surface-variant">Cups Made</span>
        </div>
        <div className="flex flex-col items-center gap-xs">
          <span className="text-headline-md font-headline-md text-primary">200+</span>
          <span className="text-label-sm font-label-sm text-on-surface-variant">Events Catered</span>
        </div>
      </section>

      {/* Shop Classics */}
      <section className="py-xl px-container-margin-mobile">
        <h3 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-md">Shop Classics</h3>
        <div className="grid grid-cols-1 gap-md">
          {classics.map((item, idx) => (
            <div
              key={item.title}
              className="bg-surface border border-outline-variant rounded-lg shadow-[0px_4px_20px_rgba(26,26,26,0.06)] overflow-hidden flex flex-col"
            >
              <div className="h-44 bg-surface-container-high w-full relative">
                <img alt={item.title} className="w-full h-full object-cover" src={item.img} />
              </div>
              <div className="p-md flex flex-col flex-grow">
                <h4 className="text-body-lg font-body-lg font-bold text-on-surface mb-xs">{item.title}</h4>
                <p className="text-body-md font-body-md text-on-surface-variant mb-md flex-grow">{item.desc}</p>
                <div className="flex justify-between items-center mb-md">
                  <span className="text-body-lg font-body-lg font-bold text-on-surface">{item.price}</span>
                  <div className="flex items-center space-x-2 border border-outline-variant rounded p-1">
                    <button className="material-symbols-outlined text-on-surface-variant text-[20px]" onClick={() => setClassicQty(idx, getClassicQty(idx) - 1)}>remove</button>
                    <span className="text-body-md font-body-md text-on-surface px-2">{getClassicQty(idx)}</span>
                    <button className="material-symbols-outlined text-on-surface-variant text-[20px]" onClick={() => setClassicQty(idx, getClassicQty(idx) + 1)}>add</button>
                  </div>
                </div>
                <button
                  onClick={() => addToCart({ id: 200 + idx, name: item.title, price: item.price, priceNum: priceNum(item.price), img: item.img })}
                  className="w-full bg-primary-container text-on-primary font-bold py-3 rounded text-label-md font-label-md hover:opacity-90 transition-opacity"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Event Catering Banner */}
      <section className="px-container-margin-mobile">
        <div className="relative rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(26,26,26,0.06)]">
          <div className="h-56 w-full bg-surface-container-highest relative">
            <img
              alt="Catering setup"
              className="w-full h-full object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD88T8XnTdsJGwRIIDPDgrWzXIdry4X48PUtKWnqGgC9dg9S7TcnPIAuJOEn6KilYZfSxEOMSwMeXKc3fDog8qkIEVQdWylOT8TlYnVrunyyemZQ0ei0L1Y_iNTv69L7-GK7DNgObaYAh8n-RmVGgP2EPgG7sTJ2BcF7zfbCGD2VT2xOVKnDpc7FbFYHfa3X9pzU0r5DWnsl9LxEDdX2dzHp8Y4LUpzuhVW48Vd19BniAV1bAl0VrRI9uYu5ShHSovKDKOwSQdXEHE1"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-lg">
              <h3 className="text-headline-md font-headline-md text-on-primary font-bold mb-xs">Event Catering</h3>
              <p className="text-body-md font-body-md text-on-primary mb-md">Standard Event Parfait (₦2,000/cup)</p>
              <button
                onClick={() => navigate('/gallery')}
                className="w-full bg-primary-container text-on-primary font-bold py-3 rounded text-label-md font-label-md hover:opacity-90 transition-opacity"
              >
                Inquire Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Orders */}
      <section className="mt-xl mx-container-margin-mobile bg-surface border border-outline-variant rounded-xl p-lg shadow-[0px_4px_20px_rgba(26,26,26,0.06)] text-center">
        <span className="material-symbols-outlined text-primary text-4xl mb-md">tune</span>
        <h3 className="text-headline-md font-headline-md text-on-surface font-bold mb-sm">Create Your Own</h3>
        <p className="text-body-md font-body-md text-on-surface-variant mb-lg">
          Mix and match flavors, fruits, and toppings exactly how you like it.
        </p>
        <button onClick={() => navigate('/custom-order')} className="w-full bg-surface text-on-surface border-2 border-on-tertiary-fixed font-bold py-3 rounded text-label-md font-label-md hover:bg-surface-container transition-colors">
          Start Custom Order
        </button>
      </section>

      {/* Brand Story */}
      <section className="py-xl px-container-margin-mobile bg-surface-container-low relative overflow-hidden my-md mx-container-margin-mobile rounded-2xl">
        <div className="relative z-10 flex flex-col items-center text-center gap-md">
          <span className="material-symbols-outlined text-[32px] text-primary">eco</span>
          <h3 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
            Purity in Every Spoonful
          </h3>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-[280px]">
            We believe in uncompromised quality. Our yoghurts are crafted daily using locally sourced, fresh ingredients with zero artificial preservatives.
          </p>
          <button className="mt-2 text-label-md font-label-md font-bold text-on-surface border-b-2 border-primary pb-1 hover:text-primary transition-colors flex items-center gap-1 group">
            Read Our Story
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute -left-12 -top-12 w-32 h-32 bg-primary/5 rounded-full blur-xl" />
      </section>

      {/* Gallery Preview */}
      <section className="py-xl px-container-margin-mobile flex flex-col gap-md">
        <div className="flex justify-between items-end">
          <h3 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">From Our Gallery</h3>
          <button
            onClick={() => navigate('/gallery')}
            className="text-label-md font-label-md text-primary font-bold hover:underline"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 gap-sm">
          {galleryPreviews.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate('/gallery')}
              className="relative rounded-xl overflow-hidden aspect-square bg-surface-container-high cursor-pointer group"
            >
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.label} src={item.img} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-sm">
                <span className="text-label-sm font-label-sm text-on-primary font-bold">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-xl px-container-margin-mobile flex flex-col gap-md">
        <h3 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface text-center">What Our Customers Say</h3>
        <div className="flex overflow-x-auto hide-scrollbar gap-gutter pb-4 -mx-container-margin-mobile px-container-margin-mobile snap-x snap-mandatory">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="min-w-[280px] w-[75vw] max-w-[320px] bg-surface-container-low rounded-xl p-md shadow-[0px_4px_20px_rgba(26,26,26,0.06)] snap-center flex flex-col gap-sm"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="text-body-md font-body-md text-on-surface-variant">"{t.text}"</p>
              <span className="text-label-sm font-label-sm text-on-surface font-bold">— {t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-container-margin-mobile mt-md mb-xl bg-primary rounded-xl p-lg text-center shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-md">
          <h3 className="text-headline-md font-headline-md text-on-primary font-bold">Ready to Order?</h3>
          <p className="text-body-md font-body-md text-on-primary/90 max-w-[280px]">
            Fresh, delicious parfaits made just for you. Order now and taste the difference.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-surface text-primary font-label-md text-label-md font-bold py-3 px-xl rounded-full hover:opacity-90 transition-opacity shadow-md"
          >
            Start Your Order
          </button>
        </div>
      </section>
    </main>
  )
}
