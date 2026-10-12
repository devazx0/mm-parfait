import { api } from '../api'

export interface GalleryItem {
  id: string
  title: string
  category: string
  desc: string
  img: string
  aspect: string
}

export interface UpdateGalleryPayload {
  items: Omit<GalleryItem, 'id'>[]
}

export const getGalleryApi = async (): Promise<GalleryItem[]> => {
  const { data } = await api.get<GalleryItem[]>('/gallery')
  return data
}

export const updateGalleryApi = async (
  payload: UpdateGalleryPayload,
): Promise<{ message: string; items: GalleryItem[] }> => {
  const { data } = await api.put<{ message: string; items: GalleryItem[] }>('/gallery', payload)
  return data
}
