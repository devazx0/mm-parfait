import { api } from '../api'

export interface ProductRecord {
  id: string
  name: string
  price: string
  priceNum?: number | null
  badge?: string | null
  img?: string | null
  category?: string
  description?: string | null
  isAvailable?: boolean
}

export interface CreateProductPayload {
  name: string
  price: string
  badge?: string
  img?: string
  category?: string
  description?: string
}

export interface UpdateProductPayload {
  name?: string
  price?: string
  badge?: string
  img?: string
  category?: string
  description?: string
}

export const getProductsApi = async (): Promise<ProductRecord[]> => {
  const { data } = await api.get<ProductRecord[]>('/products')
  return data
}

export const createProductApi = async (payload: CreateProductPayload): Promise<ProductRecord> => {
  const { data } = await api.post<ProductRecord>('/products', payload)
  return data
}

export const updateProductApi = async (id: string, payload: UpdateProductPayload): Promise<ProductRecord> => {
  const { data } = await api.patch<ProductRecord>(`/products/${id}`, payload)
  return data
}

export const deleteProductApi = async (id: string): Promise<{ message: string; product: ProductRecord }> => {
  const { data } = await api.delete<{ message: string; product: ProductRecord }>(`/products/${id}`)
  return data
}
