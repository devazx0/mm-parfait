import { api } from '../api'

export type DeliveryMethodId = 'standard' | 'express' | 'pickup'

export interface DeliveryMethod {
  id: DeliveryMethodId
  label: string
  desc: string
  fee: number
  icon: string
}

export const DELIVERY_METHODS: DeliveryMethod[] = [
  { id: 'standard', label: 'Standard Delivery', desc: '3-5 business days', fee: 1500, icon: 'local_shipping' },
  { id: 'express', label: 'Express Delivery', desc: '1-2 business days', fee: 3500, icon: 'rocket_launch' },
  { id: 'pickup', label: 'Pick Up', desc: 'Ready in 2 hours', fee: 0, icon: 'store' },
]

export const FREE_DELIVERY_THRESHOLD = 5000

export interface OrderItemDetail {
  id: string
  name: string
  price: string
  quantity: number
}

export interface OrderRecord {
  id: string
  orderNumber: string
  customerName: string
  initials: string
  date: string
  total: string;
  totalAmount: number
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled'
  statusStyle: string
  deliveryMethod?: DeliveryMethodId | null
  items?: OrderItemDetail[]
}

export interface CreateOrderItemPayload {
  name: string
  price: string
  priceNum: number
  quantity: number
}

export interface CreateOrderPayload {
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  deliveryMethod: DeliveryMethodId
  notes?: string
  items: CreateOrderItemPayload[]
}

export const createOrderApi = async (payload: CreateOrderPayload): Promise<OrderRecord> => {
  const { data } = await api.post<OrderRecord>('/orders', payload)
  return data
}

export const getOrdersApi = async (status?: string): Promise<OrderRecord[]> => {
  const { data } = await api.get<OrderRecord[]>('/orders', {
    params: { status },
  })
  return data
}

export const updateOrderStatusApi = async (
  id: string,
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled',
): Promise<OrderRecord> => {
  const { data } = await api.patch<OrderRecord>(`/orders/${id}/status`, { status })
  return data
}
