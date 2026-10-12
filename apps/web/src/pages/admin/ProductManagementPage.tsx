import { useState } from 'react'
import { toast } from 'sonner'
import {
  useProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../../services/products/hook'
import { getApiErrorMessage } from '../../services/api'
import type { ProductRecord } from '../../services/products/index'

export default function ProductManagementPage() {
  const { data: products = [], isLoading, error } = useProductsQuery()
  const createMutation = useCreateProductMutation()
  const updateMutation = useUpdateProductMutation()
  const deleteMutation = useDeleteProductMutation()

  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [badge, setBadge] = useState('')
  const [img, setImg] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  const openCreateModal = () => {
    setEditingProduct(null)
    setName('')
    setPrice('₦5,000')
    setBadge('')
    setImg('')
    setCategory('')
    setDescription('')
    setIsModalOpen(true)
  }

  const openEditModal = (p: ProductRecord) => {
    setEditingProduct(p)
    setName(p.name)
    setPrice(p.price)
    setBadge(p.badge || '')
    setImg(p.img || '')
    setCategory(p.category || '')
    setDescription(p.description || '')
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price) {
      toast.error('Please fill in product name and price.')
      return
    }

    if (editingProduct) {
      updateMutation.mutate(
        {
          id: editingProduct.id,
          payload: {
            name,
            price,
            badge: badge || undefined,
            img: img || undefined,
            category: category || undefined,
            description: description || undefined,
          },
        },
        {
          onSuccess: () => {
            toast.success('Product updated successfully!')
            setIsModalOpen(false)
          },
          onError: (err) => {
            toast.error(getApiErrorMessage(err, 'Failed to update product.'))
          },
        },
      )
    } else {
      createMutation.mutate(
        { name, price, badge: badge || undefined, img: img || undefined, category: category || undefined, description: description || undefined },
        {
          onSuccess: () => {
            toast.success('Product created successfully!')
            setIsModalOpen(false)
          },
          onError: (err) => {
            toast.error(getApiErrorMessage(err, 'Failed to create product.'))
          },
        },
      )
    }
  }

  const handleDelete = (id: string, prodName: string) => {
    if (confirm(`Are you sure you want to delete "${prodName}"?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Product deleted successfully.')
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to delete product.'))
        },
      })
    }
  }

  const filteredProducts = products.filter((p) => {
    if (!searchTerm) return true
    return p.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="flex flex-col gap-xl w-full pb-20 md:pb-0 relative">
      {/* Header */}
      <div className="flex justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1 font-bold">
            Product Management
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            Manage your Parfait and Fura inventory directly in PostgreSQL database.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 bg-primary-container text-on-primary border-none font-label-md text-label-md font-bold px-3.5 py-2 sm:px-6 sm:py-3 rounded-full hover:shadow-md transition-shadow cursor-pointer shrink-0 text-xs sm:text-sm"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[24px]">add</span>
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
            search
          </span>
          <input
            className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg pl-10 pr-4 py-2 font-body-md text-body-md text-on-surface focus:border-on-surface focus:ring-0 transition-colors"
            placeholder="Search products..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="p-12 text-center flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-label-md text-secondary">Loading products from database...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-error border border-error rounded-xl">
          Failed to load products. Please check backend server.
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center text-secondary font-body-md bg-surface-container-lowest border border-surface-variant rounded-xl">
          No products found. Click "Add Product" to create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter md:gap-lg">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-surface-container-lowest border border-surface-variant rounded-xl overflow-hidden shadow-sm flex flex-col group"
            >
              <div className="relative h-48 bg-surface-container-low">
                {product.img ? (
                  <img alt={product.name} className="w-full h-full object-cover" src={product.img} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim text-4xl">image</span>
                  </div>
                )}
                {product.badge && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className="bg-surface/90 text-on-surface font-label-sm text-label-sm px-2 py-1 rounded-full backdrop-blur-sm font-bold">
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-headline-md text-headline-md text-on-surface text-[18px] leading-tight mb-1 font-bold">
                  {product.name}
                </h3>
                <p className="font-label-md text-label-md text-primary font-bold mt-auto pt-2">{product.price}</p>
              </div>
              <div className="p-4 pt-2 flex gap-2 border-t border-surface-variant">
                <button
                  onClick={() => openEditModal(product)}
                  className="flex-1 border border-on-surface text-on-surface font-label-md text-label-md font-bold py-2 rounded-lg hover:bg-surface-container transition-colors flex justify-center items-center gap-1 cursor-pointer bg-transparent"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="w-10 border border-error text-error flex justify-center items-center rounded-lg hover:bg-error-container/20 transition-colors cursor-pointer bg-transparent"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={openCreateModal}
        className="md:hidden fixed bottom-20 right-4 w-12 h-12 bg-primary-container text-on-primary rounded-full shadow-lg flex items-center justify-center z-40 active:scale-90 transition-transform cursor-pointer border-none"
        aria-label="Add Product"
      >
        <span className="material-symbols-outlined text-[24px]">add</span>
      </button>

      {/* Modal: Create / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="bg-surface-container-lowest border border-surface-variant rounded-2xl w-full max-w-2xl lg:max-w-3xl p-5 sm:p-8 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-variant pb-4 sticky top-0 bg-surface-container-lowest z-10">
              <div>
                <h2 className="font-headline-md sm:font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-bold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="font-label-sm text-label-sm text-secondary mt-0.5">
                  Fill in the details below to update your inventory in the database.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-secondary hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer bg-transparent border-none"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-bold">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Strawberry Parfait"
                  className="w-full bg-surface border border-surface-variant rounded-xl p-3.5 text-base sm:text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-bold">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Classics, Best Sellers"
                      className="w-full bg-surface border border-surface-variant rounded-xl p-3.5 text-base sm:text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-bold">Badge Tag (Optional)</label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="e.g. Vegan, Best Seller"
                      className="w-full bg-surface border border-surface-variant rounded-xl p-3.5 text-base sm:text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-bold">Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Mixed berries, honey-roasted granola, and creamy yogurt."
                    rows={2}
                    className="w-full bg-surface border border-surface-variant rounded-xl p-3.5 text-base sm:text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-bold">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-surface border border-surface-variant rounded-xl p-3.5 text-base sm:text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

              <div className="flex gap-3 justify-end mt-3 pt-3 border-t border-surface-variant/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-surface-variant text-secondary font-label-md hover:bg-surface-container transition-colors cursor-pointer bg-transparent font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-7 py-3 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-primary-container transition-all cursor-pointer border-none shadow-md active:scale-95 disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingProduct
                    ? 'Update Product'
                    : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
