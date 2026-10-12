import { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import {
  useHomepageContentQuery,
  useUpdateHomepageContentMutation,
} from '../../services/homepage/hook'
import { useProductsQuery } from '../../services/products/hook'
import { getApiErrorMessage } from '../../services/api'
import type {
  FeaturedItem,
  ClassicItem,
  TestimonialItem,
  StatItem,
} from '../../services/homepage/index'

export default function HomepageEditorPage() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useHomepageContentQuery()
  const { data: products = [] } = useProductsQuery()
  const updateMutation = useUpdateHomepageContentMutation()

  const [activeTab, setActiveTab] = useState<'featured' | 'classics' | 'testimonials' | 'stats'>('featured')

  // Accordion state to collapse/expand cards easily on mobile
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Local editable data state
  const [featured, setFeatured] = useState<FeaturedItem[]>([])
  const [classics, setClassics] = useState<ClassicItem[]>([])
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [stats, setStats] = useState<StatItem[]>([])
  const [prevData, setPrevData] = useState(data)

  // Sync loaded data into local editing state when it changes
  if (data !== prevData) {
    setPrevData(data)
    setFeatured(data.featured || [])
    setClassics(data.classics || [])
    setTestimonials(data.testimonials || [])
    setStats(data.stats || [])
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-body-md text-secondary font-label-md">Loading homepage content...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-lg bg-error-container/20 border border-error rounded-xl text-center">
        <p className="text-on-surface font-headline-md">Failed to load homepage content.</p>
        <p className="text-secondary font-body-md mt-1">Please make sure NestJS API server is running.</p>
      </div>
    )
  }

  // Product Selection Handlers for Featured & Classics
  const selectFeaturedProduct = (itemId: string, selectedProdId: string) => {
    const prod = products.find((p) => p.id === selectedProdId)
    if (!prod) return
    setFeatured((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              productId: prod.id,
              title: prod.name,
              price: prod.price,
              desc: prod.description || prod.name,
              img: prod.img || '',
              badge: prod.badge || item.badge || 'Featured',
            }
          : item,
      ),
    )
  }

  const selectClassicProduct = (itemId: string, selectedProdId: string) => {
    const prod = products.find((p) => p.id === selectedProdId)
    if (!prod) return
    setClassics((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              productId: prod.id,
              title: prod.name,
              price: prod.price,
              desc: prod.description || prod.name,
              img: prod.img || '',
            }
          : item,
      ),
    )
  }

  // Save handler: Persists to PostgreSQL DB via NestJS API
  const handleSave = () => {
    const cleanFeatured = featured.map((item) => ({
      id: item.id,
      productId: item.productId || undefined,
      title: item.title,
      price: item.price,
      desc: item.desc,
      badge: item.badge || undefined,
      img: item.img || undefined,
    }))

    const cleanClassics = classics.map((item) => ({
      id: item.id,
      productId: item.productId || undefined,
      title: item.title,
      price: item.price,
      desc: item.desc,
      img: item.img || undefined,
    }))

    const cleanTestimonials = testimonials.map((item) => ({
      id: item.id,
      name: item.name,
      text: item.text,
      rating: Number(item.rating),
    }))

    const cleanStats = stats.map((item) => ({
      id: item.id,
      label: item.label,
      value: item.value,
    }))

    updateMutation.mutate(
      {
        featured: cleanFeatured,
        classics: cleanClassics,
        testimonials: cleanTestimonials,
        stats: cleanStats,
      },
      {
        onSuccess: () => {
          toast.success('Homepage contents saved to database successfully!')
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to save homepage changes.'))
        },
      },
    )
  }

  // Reset handler
  const handleReset = () => {
    if (data) {
      setFeatured(data.featured || [])
      setClassics(data.classics || [])
      setTestimonials(data.testimonials || [])
      setStats(data.stats || [])
      toast.info('Changes reset to database version.')
    }
  }

  // Featured CRUD
  const updateFeatured = (id: string, key: keyof FeaturedItem, val: string) => {
    setFeatured((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: val } : item)))
  }
  const addFeatured = () => {
    const newId = `f_${Date.now()}`
    const defaultProd = products[0]
    const newItem: FeaturedItem = {
      id: newId,
      productId: defaultProd?.id,
      title: defaultProd ? defaultProd.name : 'New Featured Product',
      price: defaultProd ? defaultProd.price : '₦3,500',
      desc: defaultProd ? (defaultProd.description || defaultProd.name) : 'Delicious parfait item.',
      badge: defaultProd?.badge || 'Best Seller',
      img: defaultProd?.img || '',
    }
    setFeatured([newItem, ...featured])
    setExpandedIds((prev) => ({ ...prev, [newId]: true }))
    toast.success('Added new featured item.')
  }
  const deleteFeatured = (id: string) => {
    setFeatured(featured.filter((item) => item.id !== id))
    toast.info('Removed item from homepage. Click "Save Changes" to publish.')
  }

  // Classics CRUD
  const updateClassic = (id: string, key: keyof ClassicItem, val: string) => {
    setClassics((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: val } : item)))
  }
  const addClassic = () => {
    const newId = `c_${Date.now()}`
    const defaultProd = products[0]
    const newItem: ClassicItem = {
      id: newId,
      productId: defaultProd?.id,
      title: defaultProd ? defaultProd.name : 'Classic Product Cup',
      price: defaultProd ? defaultProd.price : '₦2,000',
      desc: defaultProd ? (defaultProd.description || defaultProd.name) : 'Tasty classic product.',
      img: defaultProd?.img || '',
    }
    setClassics([newItem, ...classics])
    setExpandedIds((prev) => ({ ...prev, [newId]: true }))
    toast.success('Added new classic item.')
  }
  const deleteClassic = (id: string) => {
    setClassics(classics.filter((item) => item.id !== id))
    toast.info('Removed item from homepage. Click "Save Changes" to publish.')
  }

  // Testimonials CRUD
  const updateTestimonial = (id: string, key: keyof TestimonialItem, val: string | number) => {
    setTestimonials((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: val } : item)))
  }
  const addTestimonial = () => {
    const newId = `t_${Date.now()}`
    const newItem: TestimonialItem = {
      id: newId,
      name: 'Happy Customer',
      text: 'Amazing taste and super fast delivery. Highly recommended!',
      rating: 5,
    }
    setTestimonials([newItem, ...testimonials])
    setExpandedIds((prev) => ({ ...prev, [newId]: true }))
    toast.success('Added new testimonial.')
  }
  const deleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((item) => item.id !== id))
    toast.info('Removed testimonial from homepage. Click "Save Changes" to publish.')
  }

  // Stats CRUD
  const updateStat = (id: string, key: keyof StatItem, val: string) => {
    setStats((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: val } : item)))
  }

  return (
    <div className="flex flex-col gap-md w-full pb-32 md:pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-xs border-b border-surface-container pb-sm">
        <div className="flex items-center justify-between">
          <h1 className="font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg font-bold text-on-surface">
            Homepage Editor
          </h1>
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-1 text-primary hover:underline font-label-md text-label-md cursor-pointer bg-transparent border-none"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span className="hidden sm:inline">Preview Live</span>
          </button>
        </div>
        <p className="font-body-md text-body-md text-secondary">
          Tap any card section to edit its content directly in PostgreSQL database.
        </p>
      </div>

      {/* Touch-Friendly Horizontal Scroll Tabs */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-md py-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
          <button
            onClick={() => setActiveTab('featured')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
              activeTab === 'featured'
                ? 'bg-primary-container text-on-primary-container font-bold border-primary-container shadow-sm'
                : 'bg-surface border-surface-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">star</span>
            Featured ({featured.length})
          </button>
          <button
            onClick={() => setActiveTab('classics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
              activeTab === 'classics'
                ? 'bg-primary-container text-on-primary-container font-bold border-primary-container shadow-sm'
                : 'bg-surface border-surface-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            Classics ({classics.length})
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
              activeTab === 'testimonials'
                ? 'bg-primary-container text-on-primary-container font-bold border-primary-container shadow-sm'
                : 'bg-surface border-surface-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">rate_review</span>
            Reviews ({testimonials.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
              activeTab === 'stats'
                ? 'bg-primary-container text-on-primary-container font-bold border-primary-container shadow-sm'
                : 'bg-surface border-surface-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">analytics</span>
            Stats ({stats.length})
          </button>
        </div>
      </div>

      {/* Section Header & Add Action */}
      <div className="flex justify-between items-center bg-surface-container-lowest border border-surface-variant p-3 rounded-xl">
        <span className="font-label-md text-label-md text-on-surface font-bold">
          {activeTab === 'featured' && 'Featured Favourites'}
          {activeTab === 'classics' && 'Shop Classics'}
          {activeTab === 'testimonials' && 'Customer Reviews'}
          {activeTab === 'stats' && 'Key Stats & Highlights'}
        </span>
        {activeTab !== 'stats' && (
          <button
            onClick={() => {
              if (activeTab === 'featured') addFeatured()
              if (activeTab === 'classics') addClassic()
              if (activeTab === 'testimonials') addTestimonial()
            }}
            className="flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md font-bold px-3 py-1.5 rounded-lg hover:bg-primary-container transition-colors cursor-pointer border-none active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Item
          </button>
        )}
      </div>

      {/* TAB CONTENT: FEATURED */}
      {activeTab === 'featured' && (
        <div className="flex flex-col gap-md">
          {featured.map((item, idx) => {
            const isExpanded = expandedIds[item.id] ?? false
            return (
              <div
                key={item.id}
                className="bg-surface-container-lowest border border-surface-variant rounded-xl overflow-hidden shadow-sm transition-all"
              >
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors select-none"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="w-7 h-7 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-label-sm font-bold text-xs shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="font-label-md text-label-md text-on-surface font-bold truncate">
                        {item.title || 'Untitled Item'}
                      </div>
                      <div className="font-label-sm text-label-sm text-secondary flex items-center gap-2 mt-0.5">
                        <span className="text-primary font-bold">{item.price}</span>
                        {item.badge && (
                          <span className="bg-surface-variant px-2 py-0.5 rounded-full text-[10px] text-on-surface-variant font-medium">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteFeatured(item.id)
                      }}
                      className="p-2 rounded-lg text-error hover:bg-error-container/20 transition-colors cursor-pointer bg-transparent border-none active:scale-90"
                      title="Delete item"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                    <span className="material-symbols-outlined text-secondary transition-transform duration-200">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-surface-variant/50 flex flex-col gap-md mt-2">
                    {/* Product Selection from Inventory */}
                    <div className="flex flex-col gap-1.5 bg-primary-container/10 p-3 rounded-xl border border-primary-container/30">
                      <label className="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                        Select Product from Inventory
                      </label>
                      <select
                        value={item.productId || ''}
                        onChange={(e) => selectFeaturedProduct(item.id, e.target.value)}
                        className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface font-bold focus:border-primary focus:outline-none cursor-pointer"
                      >
                        <option value="" disabled>-- Select Created Product --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-secondary font-semibold">Title (Display Name)</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateFeatured(item.id, 'title', e.target.value)}
                        className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-md">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-sm text-label-sm text-secondary font-semibold">Price (₦)</label>
                        <input
                          type="text"
                          value={item.price}
                          onChange={(e) => updateFeatured(item.id, 'price', e.target.value)}
                          className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-sm text-label-sm text-secondary font-semibold">Badge Tag</label>
                        <input
                          type="text"
                          value={item.badge || ''}
                          placeholder="e.g. Best Seller"
                          onChange={(e) => updateFeatured(item.id, 'badge', e.target.value)}
                          className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-secondary font-semibold">Short Description</label>
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={(e) => updateFeatured(item.id, 'desc', e.target.value)}
                        className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* TAB CONTENT: CLASSICS */}
      {activeTab === 'classics' && (
        <div className="flex flex-col gap-md">
          {classics.map((item, idx) => {
            const isExpanded = expandedIds[item.id] ?? false
            return (
              <div
                key={item.id}
                className="bg-surface-container-lowest border border-surface-variant rounded-xl overflow-hidden shadow-sm transition-all"
              >
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors select-none"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="w-7 h-7 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-label-sm font-bold text-xs shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="font-label-md text-label-md text-on-surface font-bold truncate">
                        {item.title || 'Untitled Classic'}
                      </div>
                      <div className="font-label-sm text-label-sm text-primary font-bold mt-0.5">
                        {item.price}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteClassic(item.id)
                      }}
                      className="p-2 rounded-lg text-error hover:bg-error-container/20 transition-colors cursor-pointer bg-transparent border-none active:scale-90"
                      title="Delete item"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                    <span className="material-symbols-outlined text-secondary transition-transform duration-200">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-surface-variant/50 flex flex-col gap-md mt-2">
                    {/* Product Selection from Inventory */}
                    <div className="flex flex-col gap-1.5 bg-primary-container/10 p-3 rounded-xl border border-primary-container/30">
                      <label className="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                        Select Product from Inventory
                      </label>
                      <select
                        value={item.productId || ''}
                        onChange={(e) => selectClassicProduct(item.id, e.target.value)}
                        className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface font-bold focus:border-primary focus:outline-none cursor-pointer"
                      >
                        <option value="" disabled>-- Select Created Product --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-sm text-label-sm text-secondary font-semibold">Title (Display Name)</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateClassic(item.id, 'title', e.target.value)}
                          className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-sm text-label-sm text-secondary font-semibold">Price (₦)</label>
                        <input
                          type="text"
                          value={item.price}
                          onChange={(e) => updateClassic(item.id, 'price', e.target.value)}
                          className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-secondary font-semibold">Description</label>
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={(e) => updateClassic(item.id, 'desc', e.target.value)}
                        className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* TAB CONTENT: TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="flex flex-col gap-md">
          {testimonials.map((item, idx) => {
            const isExpanded = expandedIds[item.id] ?? false
            return (
              <div
                key={item.id}
                className="bg-surface-container-lowest border border-surface-variant rounded-xl overflow-hidden shadow-sm transition-all"
              >
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors select-none"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="w-7 h-7 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-label-sm font-bold text-xs shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="font-label-md text-label-md text-on-surface font-bold truncate">
                        {item.name || 'Anonymous Review'}
                      </div>
                      <div className="text-amber-500 text-xs font-bold mt-0.5">
                        {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTestimonial(item.id)
                      }}
                      className="p-2 rounded-lg text-error hover:bg-error-container/20 transition-colors cursor-pointer bg-transparent border-none active:scale-90"
                      title="Delete review"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                    <span className="material-symbols-outlined text-secondary transition-transform duration-200">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-surface-variant/50 flex flex-col gap-md mt-2">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-secondary font-semibold">Customer Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateTestimonial(item.id, 'name', e.target.value)}
                        className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-secondary font-semibold">Star Rating</label>
                      <div className="flex items-center gap-1 bg-surface border border-surface-variant p-2 rounded-lg justify-around">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateTestimonial(item.id, 'rating', star)}
                            className={`p-2 rounded-md transition-all cursor-pointer bg-transparent border-none flex items-center justify-center ${
                              star <= item.rating ? 'text-amber-500 scale-110' : 'text-surface-variant hover:text-amber-300'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              star
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-secondary font-semibold">Review Text</label>
                      <textarea
                        rows={3}
                        value={item.text}
                        onChange={(e) => updateTestimonial(item.id, 'text', e.target.value)}
                        className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* TAB CONTENT: STATS */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
          {stats.map((st) => (
            <div
              key={st.id}
              className="bg-surface-container-lowest border border-surface-variant rounded-xl p-4 shadow-sm flex flex-col gap-3"
            >
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-secondary font-semibold">Metric Label</label>
                <input
                  type="text"
                  value={st.label}
                  onChange={(e) => updateStat(st.id, 'label', e.target.value)}
                  className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-secondary font-semibold">Display Value</label>
                <input
                  type="text"
                  value={st.value}
                  onChange={(e) => updateStat(st.id, 'value', e.target.value)}
                  className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none font-bold text-primary"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sticky Action Footer Bar for Mobile */}
      <div className="fixed bottom-16 md:bottom-6 left-0 right-0 z-30 p-3 px-4 bg-surface/95 backdrop-blur-md border-t border-surface-container shadow-[0px_-4px_20px_rgba(26,26,26,0.1)] flex items-center justify-between gap-3 max-w-[1200px] mx-auto md:px-6 md:rounded-2xl">
        <button
          onClick={handleReset}
          className="flex-1 sm:flex-none border border-surface-variant bg-surface text-secondary font-label-md text-label-md py-2.5 px-4 rounded-xl hover:bg-surface-container transition-colors cursor-pointer text-center font-semibold"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex-[2] sm:flex-none bg-primary text-on-primary font-label-md text-label-md font-bold py-2.5 px-6 rounded-xl hover:bg-primary-container transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
