import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrdersApi,
  updateOrderStatusApi,
  createOrderApi,
  type CreateOrderPayload,
  type OrderRecord,
} from './index'

export const ORDERS_QUERY_KEY = ['orders']

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrderApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY })
    },
  })
}

export const useOrdersQuery = (status?: string) => {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, status || 'all'],
    queryFn: () => getOrdersApi(status),
    staleTime: 30 * 1000,
  })
}

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderRecord['status'] }) =>
      updateOrderStatusApi(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY })
    },
  })
}
