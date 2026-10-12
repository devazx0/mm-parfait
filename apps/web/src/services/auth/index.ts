import { api, setTokens, clearTokens, getRefreshToken } from '../api'

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: AuthUser
}

export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  setTokens(data.accessToken, data.refreshToken)
  return data
}

export const logoutApi = async (): Promise<{ message: string }> => {
  const refreshToken = getRefreshToken()
  try {
    const { data } = await api.post<{ message: string }>('/auth/logout', { refreshToken })
    return data
  } finally {
    clearTokens()
  }
}

export const getMeApi = async (): Promise<AuthUser> => {
  const { data } = await api.get<AuthUser>('/auth/me')
  return data
}
