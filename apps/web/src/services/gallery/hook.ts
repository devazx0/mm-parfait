import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGalleryApi, updateGalleryApi, type UpdateGalleryPayload } from './index'

export const GALLERY_QUERY_KEY = ['gallery']

export const useGalleryQuery = () => {
  return useQuery({
    queryKey: GALLERY_QUERY_KEY,
    queryFn: getGalleryApi,
    staleTime: 5 * 60 * 1000,
  })
}

export const useUpdateGalleryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateGalleryPayload) => updateGalleryApi(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(GALLERY_QUERY_KEY, data.items)
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEY })
    },
  })
}
