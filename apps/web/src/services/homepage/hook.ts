import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getHomepageContentApi, updateHomepageContentApi, type UpdateHomepagePayload } from './index'

export const HOMEPAGE_QUERY_KEY = ['homepage', 'content']

export const useHomepageContentQuery = () => {
  return useQuery({
    queryKey: HOMEPAGE_QUERY_KEY,
    queryFn: getHomepageContentApi,
    staleTime: 5 * 60 * 1000,
  })
}

export const useUpdateHomepageContentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateHomepagePayload) => updateHomepageContentApi(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(HOMEPAGE_QUERY_KEY, data.content)
      queryClient.invalidateQueries({ queryKey: HOMEPAGE_QUERY_KEY })
    },
  })
}
