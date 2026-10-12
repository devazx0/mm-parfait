import { api } from '../api'

export interface MetricTrend {
  icon: string
  label: string
  color: string
}

export interface MetricAlert {
  icon: string
  label: string
  color: string
}

export interface MetricItem {
  title: string
  icon: string
  iconColor: string
  value: string
  sub?: string
  trend?: MetricTrend
  alert?: MetricAlert
  bgDeco: string
}

export interface RecentActivityItem {
  icon: string
  bg: string
  color: string
  title: string
  sub: string
  amount: string
  badge: string
  badgeBg: string
  badgeText: string
}

export interface StockAlertItem {
  dot: string
  title: string
  desc: string
  action?: string
}

export interface DashboardMetricsResponse {
  metrics: MetricItem[]
  recentActivity: RecentActivityItem[]
  stockAlerts: StockAlertItem[]
}

export const getDashboardMetricsApi = async (): Promise<DashboardMetricsResponse> => {
  const { data } = await api.get<DashboardMetricsResponse>('/dashboard/metrics')
  return data
}
