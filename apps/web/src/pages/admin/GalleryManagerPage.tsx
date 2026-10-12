import { useState } from 'react'
import { toast } from 'sonner'
import { useGalleryQuery, useUpdateGalleryMutation } from '../../services/gallery/hook'
import { getApiErrorMessage } from '../../services/api'
import type { GalleryItem } from '../../services/gallery'

const ASPECT_OPTIONS = ['aspect-square', 'aspect-[4/5]', 'aspect-[4/3]', 'aspect-video']

export default function GalleryManagerPage() {
  const { data, isLoading, error } = useGalleryQuery()
  const updateMutation = useUpdateGalleryMutation()

  const [items, setItems] = useState<GalleryItem[]>([])
  const [prevData, setPrevData] = useState(data)

  if (data !== prevData) {
    setPrevData(data)
    setItems(data)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-body-md text-secondary font-label-md">Loading gallery...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-lg bg-error-container/20 border border-error rounded-xl text-center">
        <p className="text-on-surface font-headline-md">Failed to load gallery.</p>
        <p className="text-secondary font-body-md mt-1">Please check backend API connection.</p>
      </div>
    )
  }

  const updateItem = (id: string, key: keyof GalleryItem, val: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: val } : item)))
  }

  const addItem = () => {
    const newId = `g_${Date.now()}`
    setItems((prev) => [
      {
        id: newId,
        title: 'New Gallery Item',
        category: 'Weddings',
        desc: 'Short description of this piece.',
        img: '',
        aspect: 'aspect-square',
      },
      ...prev,
    ])
  }

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    toast.info('Removed gallery item. Click "Save Changes" to publish.')
  }

  const handleSave = () => {
    updateMutation.mutate(
      {
        items: items.map(({ title, category, desc, img, aspect }) => ({
          title,
          category,
          desc,
          img,
          aspect,
        })),
      },
      {
        onSuccess: () => toast.success('Gallery saved to database successfully!'),
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to save gallery.'))
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-md w-full pb-32 md:pb-12">
      <div className="flex flex-col gap-xs border-b border-surface-container pb-sm">
        <div className="flex items-center justify-between">
          <h1 className="font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg font-bold text-on-surface">
            Gallery Manager
          </h1>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md font-bold px-3 py-1.5 rounded-lg hover:bg-primary-container transition-colors cursor-pointer border-none active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Item
          </button>
        </div>
        <p className="font-body-md text-body-md text-secondary">
          Manage gallery images displayed on the public site.
        </p>
      </div>

      <div className="flex flex-col gap-md">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-surface-container-lowest border border-surface-variant rounded-xl p-4 shadow-sm flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-20 h-20 rounded-lg bg-surface-container-high overflow-hidden shrink-0">
                {item.img ? (
                  <img alt={item.title} className="w-full h-full object-cover" src={item.img} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim text-3xl">image</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1.5 flex-grow">
                <label className="font-label-sm text-label-sm text-secondary font-semibold">Title</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                  className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-secondary font-semibold">Category</label>
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                      className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-secondary font-semibold">Aspect Ratio</label>
                    <select
                      value={item.aspect}
                      onChange={(e) => updateItem(item.id, 'aspect', e.target.value)}
                      className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none cursor-pointer"
                    >
                      {ASPECT_OPTIONS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="p-2 rounded-lg text-error hover:bg-error-container/20 transition-colors cursor-pointer bg-transparent border-none active:scale-90"
                title="Delete item"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-secondary font-semibold">Image URL</label>
              <input
                type="url"
                value={item.img}
                onChange={(e) => updateItem(item.id, 'img', e.target.value)}
                placeholder="https://..."
                className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-secondary font-semibold">Description</label>
              <textarea
                rows={2}
                value={item.desc}
                onChange={(e) => updateItem(item.id, 'desc', e.target.value)}
                className="w-full bg-surface border border-surface-variant rounded-lg px-3 py-2.5 text-base md:text-sm text-on-surface focus:border-primary focus:outline-none resize-none"
              />
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="p-12 text-center text-secondary font-body-md bg-surface-container-lowest border border-surface-variant rounded-xl">
            No gallery items yet. Click "Add Item" to create one.
          </div>
        )}
      </div>

      <div className="fixed bottom-16 md:bottom-6 left-0 right-0 z-30 p-3 px-4 bg-surface/95 backdrop-blur-md border-t border-surface-container shadow-[0px_-4px_20px_rgba(26,26,26,0.1)] flex items-center justify-end gap-3 max-w-[1200px] mx-auto md:px-6 md:rounded-2xl">
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="bg-primary text-on-primary font-label-md text-label-md font-bold py-2.5 px-6 rounded-xl hover:bg-primary-container transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
