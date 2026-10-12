import { useMemo, useState } from 'react'
import { useGalleryQuery } from '../services/gallery/hook'

export default function GalleryPage() {
  const { data: items = [], isLoading, error } = useGalleryQuery()
  const [activeFilter, setActiveFilter] = useState('All')

  const filters = useMemo(
    () => ['All', ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  )

  const filtered = activeFilter === 'All' ? items : items.filter((i) => i.category === activeFilter)

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
              onClick={() => setActiveFilter(f)}
              className={`px-md py-xs rounded-full font-label-md text-label-md transition-all duration-200 cursor-pointer ${
                f === activeFilter
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
      {isLoading ? (
        <div className="flex items-center justify-center py-xxl">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-xxl gap-md text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">error</span>
          <p className="text-body-md font-body-md text-on-surface-variant">Unable to load gallery. Please try again later.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-xxl gap-md text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">photo_library</span>
          <p className="text-body-md font-body-md text-on-surface-variant">No gallery items found in this category.</p>
        </div>
      ) : (
        <section className="grid grid-cols-2 gap-gutter md:grid-cols-3 md:gap-lg">
          {filtered.map((item, i) => {
            const isEven = i % 2 === 1
            const isThird = i % 3 === 2
            return (
              <div
                key={item.id}
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
      )}

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
