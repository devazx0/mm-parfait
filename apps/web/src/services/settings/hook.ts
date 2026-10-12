import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSettingsApi, updateSettingsApi, type UpdateSettingsPayload } from './index'

export const SETTINGS_QUERY_KEY = ['settings']

export const useSettingsQuery = () => {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: getSettingsApi,
    staleTime: 5 * 60 * 1000,
  })
}

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => updateSettingsApi(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, data.settings)
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
    },
  })
}
