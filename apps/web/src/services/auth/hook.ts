import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { loginApi, logoutApi, getMeApi, type LoginPayload } from './index'

export const AUTH_QUERY_KEY = ['auth', 'me']

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user)
    },
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null)
      queryClient.clear()
    },
  })
}

export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getMeApi,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
