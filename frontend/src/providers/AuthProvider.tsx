import type { ReactNode } from 'react'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { setAuthToken } from '../services/api'
import type { PermissionSet, UserModel } from '../types'

const STORAGE_KEY = 'testeDevFullStack.auth'

type AuthContextValue = {
  user: UserModel | null
  setUser: (user: UserModel | null) => void
  permissions: PermissionSet | null
  token: string | null
  isLoading: boolean
  login: (cpf: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type Props = {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserModel | null>(null)
  const [permissions, setPermissions] = useState<PermissionSet | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const persistSession = useCallback((nextToken: string | null) => {
    if (!nextToken) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: nextToken })
    )
  }, [])

  const bootstrap = useCallback(async () => {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      setIsLoading(false)
      return
    }

    try {
      const parsed = JSON.parse(stored) as { token?: string }

      if (parsed.token) {
        setAuthToken(parsed.token)
        const profile = await authService.profile()
        setToken(parsed.token)
        setUser(profile.user)
        setPermissions(profile.permissions)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('Não foi possível restaurar a sessão.', error)
      localStorage.removeItem(STORAGE_KEY)
      setAuthToken(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  const login = useCallback(async (cpf: string, password: string) => {
    setIsLoading(true)
    try {
        const auth = await authService.login(cpf, password)
        setAuthToken(auth.token)
        setUser(auth.user ?? null)
        setPermissions(auth.permissions ?? null)
        setToken(auth.token ?? null)
        persistSession(auth.token ?? null)
    } catch (error) {
      setUser(null)
      setPermissions(null)
      setToken(null)
      persistSession(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [persistSession])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setAuthToken(null)
      setUser(null)
      setPermissions(null)
      setToken(null)
      persistSession(null)
    }
  }, [persistSession])

  const value = useMemo<AuthContextValue>(() => ({
    user: user ?? null,
    setUser,
    permissions,
    token,
    isLoading,
    login,
    logout,
  }), [user, setUser, permissions, token, isLoading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
