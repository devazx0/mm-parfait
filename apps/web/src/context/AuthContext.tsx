import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { toast } from 'sonner'
import { loginApi, logoutApi, getMeApi, type AuthUser } from '../services/auth'
import { getAccessToken, clearTokens, getApiErrorMessage } from '../services/api'

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getAccessToken())
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verify auth session on initial load
  useEffect(() => {
    async function verifyAuth() {
      const existingToken = getAccessToken()
      if (!existingToken) {
        setIsLoading(false)
        return
      }

      try {
        const me = await getMeApi()
        setUser(me)
        setToken(existingToken)
      } catch {
        clearTokens()
        setToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await loginApi({ email, password })
      setToken(res.accessToken)
      setUser(res.user)
      toast.success(`Welcome back, ${res.user.name || 'Admin'}!`)
      return true
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Login failed'))
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch {
      clearTokens()
    } finally {
      setToken(null)
      setUser(null)
      toast.success('Logged out successfully')
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
