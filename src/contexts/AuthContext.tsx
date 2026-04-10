import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getSession, onAuthStateChange } from '@/services/authService'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  userId: string | null
  userName: string
  userEmail: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession()
      .then((s) => {
        setSession(s)
        setUser(s?.user ?? null)
      })
      .finally(() => {
        setLoading(false)
      })

    const {
      data: { subscription },
    } = onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value: AuthContextValue = {
    user,
    session,
    loading,
    isAuthenticated: !!session,
    userId: user?.id || null,
    userName: (user?.user_metadata?.nombre as string) || user?.email?.split('@')[0] || 'Usuario',
    userEmail: user?.email || '',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}

export default AuthContext
