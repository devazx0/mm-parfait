const galleryItems = [
  {
    category: 'Weddings',
    title: 'The Grand Buffet',
    desc: 'A stunning display for 200 guests.',
    aspect: 'aspect-[4/5]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3jZr8qwLhq4mA2sIAoVxXwbjLGQ4w56eXqy-7negTDPW3pbJjnkXBxCAdP6YHW7IaH1QZ6ycRvbCfxDPZ6d1wx_XAH9XkeXy0gehkhBZbOWdwIQ6ntI3V6JbgCQh2-tCW0NRUzA12GB1xEw0dUCYneap_XM-gCAUW5LeP0PxaQbuwjz5XWxYUwUxMAZB6tPB3jqFaAy31E_GtX3Llt4Nd4xJDQq-GNAqvkYoWGoLr0qfPuISZcZGEqq3lzEQ3M_1iLEwukBOcsSCG',
  },
  {
    category: 'New Arrivals',
    title: 'Tropical Sunrise',
    desc: 'Mango base with mixed berries.',
    aspect: 'aspect-square',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr8tM66zQDdoP_b39JXDarrEY-Adz_fPiUVfAkFjg7ejtMZzELcMdu53_FljZXzi2378H7cdWzPnTymeH5vioTS3hmuXEM14hHV5nDrrNoRlPTicjRDoAxjOfC6OUO20P5umpLay_yYlIfx72etnHf1MXyoJLHk_zpwvTVpEvgLGN6U8Css5OY0_VQL_JNP5ckZ_G4flZrPv8h0ue3Q_J8PX_VpnxN5g_X4XCE9C0McG91EwcsKyF_yWpmlwd6OecvYx-XmmAJnkmB',
  },
  {
    category: 'Birthdays',
    title: 'Raspberry Elegance',
    desc: 'Perfect individual servings.',
    aspect: 'aspect-square',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByWXcHVqlOr874m2YTSCu0F_qCT9lupmmDzqNYfJlquCsniXtwqm7filY3wnK_lu7AZxMQHCU7e9EkWk0C2yox0TTT4sotX7VriGTPfxjlwINRXUGEZPYBmWj2v3a-ixnrl4IdNfxl4WfNeYt0IzxE5xgp4ugVthQSbaKaoZEdAKuXgoNJx0R4v_8wucl1wCae5iiZ-YSVlg861IFPVUbyb_6dKY4w_39M72UltofUn6YnTJNYt3TntBzqtdv2gsCOiALSN2NRLZJj',
  },
  {
    category: 'Behind the Scenes',
    title: 'Fresh Ingredients',
    desc: 'Only the best for our clients.',
    aspect: 'aspect-[4/5]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABgg-bmjwLAp78FHJ7KYWE6ENuUyhj8bY6nQHnQKO3X80EZFKwqBcksi0BjUlNRhOzVP5UJUUba6JHqLtg5PSBL6_-wVU-ZQ0jYmOvJGbYCiJ-tFUOjTMEeSMpTL5HxhwpQI7CNKecW9zhysPHpyacyb3PW_s9B485rCPodSZ20_puVfDJRW7VKLlt_YGXzdG5-_8q8Ych13w5qZN670qgglm9L01DnNvHSn0nu2ZFEadQMUY77LYtjXMcpU1gdFKKBCyBgZ8UvNU2',
  },
  {
    category: 'Corporate',
    title: 'Morning Fuel',
    desc: 'Energizing your team.',
    aspect: 'aspect-square',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-6NjUFJmpqk9xtd_gckx8g3rZNNLj7vAmJPVe2Pa0ZqIHINiZ9X0cNsT_9OoKAq0dSPeFMa3kCuHcJFuMjFyj8IG_7rBEnJ5wnznoeIsfptq0F3pztjtdZhHC8dhVvZcUsPEdt_1kCR8JpoC4pm891pxIicfL2_F39JMoPWVNqIZ5z5YSfyjGwDJVRn5yNSPvucAt1CYnX7QySEIJ5JXfjAr0qbGsUvf7jkAJS_dEIFJSWGKHlrkUBKzPJr-SOfvJm4bu-gKrc30b',
  },
]

const filters = ['All', 'Weddings', 'Birthdays', 'New Arrivals']

export default function GalleryPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-container-margin-mobile pt-16 pb-24">
      {/* Gallery Header & Filters */}
      <section className="text-center mb-xl mt-md">
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-sm">
          Our Masterpieces
        </h2>
        <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto mb-lg">
          Explore our vibrant creations. Perfect for any occasion, crafted with passion and premium ingredients.
        </p>
        <div className="flex flex-wrap justify-center gap-sm">
          {filters.map((f) => (
            <button
              key={f}
              className={`px-md py-xs rounded-full font-label-md text-label-md transition-all duration-200 ${
                f === 'All'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high border border-surface-variant'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="grid grid-cols-2 gap-gutter md:grid-cols-3 md:gap-lg">
        {galleryItems.map((item, i) => {
          const isEven = i % 2 === 1
          const isThird = i % 3 === 2
          return (
            <div
              key={item.title}
              className={`relative rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(26,26,26,0.06)] bg-surface-container-highest cursor-pointer group ${
                isEven ? 'row-span-2' : ''
              } ${isThird ? 'col-span-2 row-span-2' : ''}`}
            >
              <img
                alt={item.title}
                className={`w-full h-full object-cover ${item.aspect}`}
                src={item.img}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-md">
                <div className="translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                  <span className="inline-block px-sm py-xs bg-surface/20 backdrop-blur-md rounded text-on-primary text-label-sm font-label-sm mb-xs">
                    {item.category}
                  </span>
                  <h3 className="text-headline-md font-headline-md text-on-primary mb-xs">
                    {item.title}
                  </h3>
                  <p className="text-body-md font-body-md text-on-primary/90">{item.desc}</p>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* CTA Section */}
      <section className="mt-xxl bg-surface-container-lowest border border-surface-variant rounded-xl p-lg text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-sm">
            Ready to Elevate Your Event?
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-[576px] mx-auto mb-lg">
            Contact us today to discuss catering options for your next wedding, corporate event, or private party.
          </p>
          <button className="bg-primary hover:bg-surface-tint text-on-primary font-label-md text-label-md py-sm px-xl rounded-full transition-colors duration-200 shadow-md">
            Book Your Event
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full flex flex-col items-center py-lg mt-xxl gap-md bg-on-background text-surface rounded-xl">
        <h2 className="text-headline-md font-headline-md font-bold text-surface">
          MM Yoghurt Parfait
        </h2>
        <div className="flex flex-wrap justify-center gap-md">
          <a className="text-surface hover:text-primary-fixed-dim transition-colors text-label-sm font-label-sm" href="#">
            Privacy Policy
          </a>
          <a className="text-surface hover:text-primary-fixed-dim transition-colors text-label-sm font-label-sm" href="#">
            Terms of Service
          </a>
          <a className="text-surface hover:text-primary-fixed-dim transition-colors text-label-sm font-label-sm" href="#">
            Catering Inquiries
          </a>
          <a className="text-surface hover:text-primary-fixed-dim transition-colors text-label-sm font-label-sm" href="#">
            Instagram
          </a>
        </div>
        <p className="text-body-md font-body-md text-surface-variant">
          &copy; 2024 MM Yoghurt Parfait. Healthy meets Delicious.
        </p>
      </footer>
    </main>
  )
}
