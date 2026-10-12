import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  type CreateProductPayload,
  type UpdateProductPayload,
} from './index'

export const PRODUCTS_QUERY_KEY = ['products']

export const useProductsQuery = () => {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: getProductsApi,
    staleTime: 60 * 1000,
  })
}

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProductApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
    },
  })
}

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      updateProductApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
    },
  })
}

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProductApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
    },
  })
}
