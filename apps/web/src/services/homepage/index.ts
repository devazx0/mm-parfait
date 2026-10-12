import { api } from '../api'

export interface FeaturedItem {
  id: string
  productId?: string | null
  title: string
  price: string
  desc: string
  badge?: string | null
  img?: string | null
}

export interface ClassicItem {
  id: string
  productId?: string | null
  title: string
  price: string
  desc: string
  img?: string | null
}

export interface TestimonialItem {
  id: string
  name: string
  text: string
  rating: number
}

export interface StatItem {
  id: string
  label: string
  value: string
}

export interface HomepageContentResponse {
  featured: FeaturedItem[]
  classics: ClassicItem[]
  testimonials: TestimonialItem[]
  stats: StatItem[]
}

export interface UpdateHomepagePayload {
  featured?: FeaturedItem[]
  classics?: ClassicItem[]
  testimonials?: TestimonialItem[]
  stats?: StatItem[]
}

export const getHomepageContentApi = async (): Promise<HomepageContentResponse> => {
  const { data } = await api.get<HomepageContentResponse>('/homepage')
  return data
}

export const updateHomepageContentApi = async (
  payload: UpdateHomepagePayload,
): Promise<{ message: string; content: HomepageContentResponse }> => {
  const { data } = await api.put<{ message: string; content: HomepageContentResponse }>(
    '/homepage',
    payload,
  )
  return data
}
