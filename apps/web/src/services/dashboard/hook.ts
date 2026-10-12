import { useQuery } from '@tanstack/react-query'
import { getDashboardMetricsApi } from './index'

export const DASHBOARD_QUERY_KEY = ['dashboard', 'metrics']

export const useDashboardMetricsQuery = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getDashboardMetricsApi,
    staleTime: 60 * 1000,
  })
}
