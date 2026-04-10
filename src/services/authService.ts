import { supabase } from './supabaseClient'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

const isLocalAuthMode =
  import.meta.env.VITE_AUTH_MODE === 'local' ||
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY
const LOCAL_AUTH_USER_KEY = 'finanzasu_local_auth_user'
const LOCAL_AUTH_SESSION_KEY = 'finanzasu_local_auth_session'

type LocalAuthUser = {
  id: string
  email: string
  password: string
  nombre: string
}

const localAuthListeners = new Set<(event: AuthChangeEvent, session: Session | null) => void>()

function createMockSession(user: LocalAuthUser): Session {
  const nowIso = new Date().toISOString()
  const mockUser = {
    id: user.id,
    email: user.email,
    user_metadata: { nombre: user.nombre },
  } as Session['user']

  return {
    access_token: 'local-access-token',
    refresh_token: 'local-refresh-token',
    expires_in: 86400,
    expires_at: Math.floor(Date.now() / 1000) + 86400,
    token_type: 'bearer',
    user: mockUser,
    provider_token: null,
    provider_refresh_token: null,
  } as Session & { created_at?: string }
}

function getLocalStoredUser(): LocalAuthUser | null {
  const raw = localStorage.getItem(LOCAL_AUTH_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as LocalAuthUser
  } catch {
    return null
  }
}

function setLocalStoredUser(user: LocalAuthUser) {
  localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(user))
}

function getLocalStoredSession(): Session | null {
  const raw = localStorage.getItem(LOCAL_AUTH_SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

function setLocalStoredSession(session: Session | null) {
  if (!session) {
    localStorage.removeItem(LOCAL_AUTH_SESSION_KEY)
    return
  }
  localStorage.setItem(LOCAL_AUTH_SESSION_KEY, JSON.stringify(session))
}

function emitLocalAuthChange(event: AuthChangeEvent, session: Session | null) {
  for (const listener of localAuthListeners) {
    listener(event, session)
  }
}

export async function signUp(email: string, password: string, nombre: string) {
  if (isLocalAuthMode) {
    const normalizedEmail = email.trim().toLowerCase()
    const localUser: LocalAuthUser = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      password,
      nombre: nombre.trim() || normalizedEmail.split('@')[0],
    }
    const session = createMockSession(localUser)
    setLocalStoredUser(localUser)
    setLocalStoredSession(session)
    emitLocalAuthChange('SIGNED_IN', session)
    return { user: session.user, session }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre },
    },
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  if (isLocalAuthMode) {
    const normalizedEmail = email.trim().toLowerCase()
    const existing = getLocalStoredUser()

    // Si no hay usuario local guardado, creamos uno para acceso rápido en desarrollo.
    if (!existing) {
      const fallbackUser: LocalAuthUser = {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        password,
        nombre: normalizedEmail.split('@')[0] || 'Usuario',
      }
      const fallbackSession = createMockSession(fallbackUser)
      setLocalStoredUser(fallbackUser)
      setLocalStoredSession(fallbackSession)
      emitLocalAuthChange('SIGNED_IN', fallbackSession)
      return { user: fallbackSession.user, session: fallbackSession }
    }

    if (existing.email !== normalizedEmail || existing.password !== password) {
      throw new Error('Credenciales incorrectas')
    }

    const session = createMockSession(existing)
    setLocalStoredSession(session)
    emitLocalAuthChange('SIGNED_IN', session)
    return { user: session.user, session }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  if (isLocalAuthMode) {
    setLocalStoredSession(null)
    emitLocalAuthChange('SIGNED_OUT', null)
    return
  }

  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  if (isLocalAuthMode) {
    return getLocalStoredSession()
  }

  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export async function getUser() {
  if (isLocalAuthMode) {
    return getLocalStoredSession()?.user ?? null
  }

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function updatePassword(newPassword: string) {
  if (isLocalAuthMode) {
    const user = getLocalStoredUser()
    if (!user) throw new Error('No hay sesión activa')
    const updatedUser: LocalAuthUser = { ...user, password: newPassword }
    setLocalStoredUser(updatedUser)
    const updatedSession = createMockSession(updatedUser)
    setLocalStoredSession(updatedSession)
    emitLocalAuthChange('USER_UPDATED', updatedSession)
    return { user: updatedSession.user }
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (error) throw error
  return data
}

export async function updateProfile(nombre: string) {
  if (isLocalAuthMode) {
    const user = getLocalStoredUser()
    if (!user) throw new Error('No hay sesión activa')
    const updatedUser: LocalAuthUser = { ...user, nombre: nombre.trim() || user.nombre }
    setLocalStoredUser(updatedUser)
    const updatedSession = createMockSession(updatedUser)
    setLocalStoredSession(updatedSession)
    emitLocalAuthChange('USER_UPDATED', updatedSession)
    return { user: updatedSession.user }
  }

  const { data, error } = await supabase.auth.updateUser({
    data: { nombre },
  })
  if (error) throw error
  return data
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  if (isLocalAuthMode) {
    localAuthListeners.add(callback)
    callback('INITIAL_SESSION', getLocalStoredSession())

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            localAuthListeners.delete(callback)
          },
        },
      },
    }
  }

  return supabase.auth.onAuthStateChange(callback)
}
