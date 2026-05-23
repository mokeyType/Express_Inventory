import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import AuthContext from './AuthContextInstance'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    setLoading(true)

    try {
      const response = await api.get('/auth/me')
      setUser(response.data)
      return response.data
    } catch {
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    })

    setUser(response.data)
    return response.data
  }

  const register = async (accountData) => {
    const response = await api.post('/auth/register', {
      name: accountData.name,
      email: accountData.email,
      password: accountData.password,
    })

    setUser(response.data)
    return response.data
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      setUser(null)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function verifySession() {
      try {
        const response = await api.get('/auth/me')
        if (isMounted) {
          setUser(response.data)
        }
      } catch {
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    verifySession()

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
      checkAuth,
    }),
    [checkAuth, loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
