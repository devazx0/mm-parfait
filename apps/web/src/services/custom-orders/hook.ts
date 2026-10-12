import { useMutation } from '@tanstack/react-query'
import { createCustomOrderApi, type CreateCustomOrderPayload } from './index'

export const useCreateCustomOrderMutation = () => {
  return useMutation({
    mutationFn: (payload: CreateCustomOrderPayload) => createCustomOrderApi(payload),
  })
}
