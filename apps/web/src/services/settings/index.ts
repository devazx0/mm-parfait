import { api } from '../api'

export interface StoreSettingsRecord {
  id: string
  storeOpen: boolean
  operatingHours: string
  deliveryZones: string
  pushNotifications: boolean
  emailDigest: boolean
  updatedAt?: string
}

export interface UpdateSettingsPayload {
  storeOpen?: boolean
  operatingHours?: string
  deliveryZones?: string
  pushNotifications?: boolean
  emailDigest?: boolean
}

export const getSettingsApi = async (): Promise<StoreSettingsRecord> => {
  const { data } = await api.get<StoreSettingsRecord>('/settings')
  return data
}

export const updateSettingsApi = async (
  payload: UpdateSettingsPayload,
): Promise<{ message: string; settings: StoreSettingsRecord }> => {
  const { data } = await api.patch<{ message: string; settings: StoreSettingsRecord }>(
    '/settings',
    payload,
  )
  return data
}
