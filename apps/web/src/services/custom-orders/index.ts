import { api } from '../api'

export interface CreateCustomOrderPayload {
  base: string
  fruits: string[]
  toppings: string[]
  packaging: string
  quantity: number
  eventDate?: string
  notes?: string
}

export const createCustomOrderApi = async (
  payload: CreateCustomOrderPayload,
): Promise<{ message: string; request: { id: string } }> => {
  const { data } = await api.post<{ message: string; request: { id: string } }>('/custom-orders', payload)
  return data
}
