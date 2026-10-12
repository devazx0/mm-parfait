import axios, { type InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9001'

const ACCESS_TOKEN_KEY = 'mm_parfait_access_token'
const REFRESH_TOKEN_KEY = 'mm_parfait_refresh_token'

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
  _startTime?: number
}

export const getAccessToken = () =>
  typeof window === 'undefined' ? null : window.localStorage.getItem(ACCESS_TOKEN_KEY)

export const getRefreshToken = () =>
  typeof window === 'undefined' ? null : window.localStorage.getItem(REFRESH_TOKEN_KEY)

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const clearTokens = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string | string[]
    }
  }
}

export const getApiErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const message = (err as ApiErrorResponse).response?.data?.message
    if (Array.isArray(message)) return message.join(', ')
    if (message) return message
  }
  return fallback
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach Bearer Token & Log Requests
api.interceptors.request.use(
  (config) => {
    ;(config as RetryableConfig)._startTime = Date.now()
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (import.meta.env.DEV) {
      const sanitize = (data: unknown): unknown => {
        if (!data || typeof data !== 'object' || Array.isArray(data)) return data
        const clone: Record<string, unknown> = { ...data }
        for (const k of Object.keys(clone)) {
          if (['password', 'token', 'refreshToken', 'accessToken'].includes(k)) {
            clone[k] = '***'
          }
        }
        return clone
      }
      console.log(
        `%c[API Req] ${config.method?.toUpperCase()} ${config.url}`,
        'color: #3B82F6; font-weight: bold;',
        {
          params: config.params,
          body: sanitize(config.data),
        },
      )
    }

    return config
  },
  (error) => Promise.reject(error),
)

// Response Interceptor: Auto Refresh Token on 401 & Log Responses
let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else if (token) {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      const duration = Date.now() - ((response.config as RetryableConfig)._startTime || Date.now())
      console.log(
        `%c[API Res] ${response.config.method?.toUpperCase()} ${response.config.url} ${response.status} (${duration}ms)`,
        'color: #10B981; font-weight: bold;',
        response.data,
      )
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config as RetryableConfig | undefined
    if (import.meta.env.DEV && error.response) {
      const duration = Date.now() - (originalRequest?._startTime || Date.now())
      console.warn(
        `%c[API Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} ${error.response.status} (${duration}ms)`,
        'color: #EF4444; font-weight: bold;',
        error.response.data,
      )
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearTokens()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post<{ accessToken: string }>(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        const newAccessToken = data.accessToken
        window.localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        processQueue(null, newAccessToken)
        return api(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        clearTokens()
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)
