// frontend/src/lib/AuthContext.jsx
// Global Auth & Profile State menggunakan Backend API (/api/*)

import { createContext, useContext, useEffect, useState } from 'react'
import {
  apiFetch,
  getToken,
  setToken,
  removeToken,
  getCachedProfile,
  setCachedProfile
} from './api'
import { supabase } from './supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [profile, setProfile]   = useState(getCachedProfile() || null)
  const [loading, setLoading]   = useState(true)

  // Load session & profile saat awal mount
  useEffect(() => {
    async function initAuth() {
      const token = getToken()

      // 1. Coba via token jika ada
      if (token) {
        try {
          const res = await apiFetch('/auth/me')
          if (res?.user) {
            setUser(res.user)
            if (res.profile) {
              setProfile(res.profile)
              setCachedProfile(res.profile)
            }
            setLoading(false)
            return
          }
        } catch (err) {
          console.warn('[AuthContext] Token verification failed:', err.message)
        }
      }

      // 2. Fallback via Supabase session
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          if (session.access_token) {
            setToken(session.access_token)
          }
          // Fetch profile dari backend API
          try {
            const profData = await apiFetch('/profile')
            setProfile(profData)
            setCachedProfile(profData)
          } catch (e) {
            // Gunakan default profil sementara
            const defaultProf = {
              full_name: session.user.user_metadata?.full_name || 'User',
              email: session.user.email,
              height_cm: 170,
              weight_kg: 65,
              age: 25,
              gender: 'male',
              goal: 'muscle_gain',
              target_weight: 70
            }
            setProfile(defaultProf)
            setCachedProfile(defaultProf)
          }
        } else {
          setUser(null)
          setProfile(null)
          removeToken()
        }
      } catch (err) {
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen auth state changes Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        if (session.access_token) setToken(session.access_token)
      } else if (_event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        removeToken()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Action Login via Backend API
  const loginApi = async (email, password) => {
    // 1. Hit Supabase client / Backend API
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
    }).catch(async (err) => {
      // Direct Supabase fallback jika backend api offline di local dev
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
      return { token: data.session?.access_token, user: data.user, session: data.session }
    })

    if (res.token) setToken(res.token)
    setUser(res.user)

    // Fetch user profile via API
    try {
      const prof = await apiFetch('/profile')
      setProfile(prof)
      setCachedProfile(prof)
    } catch {
      const defaultProf = {
        full_name: res.user?.user_metadata?.full_name || 'User',
        email: res.user?.email,
        height_cm: 170,
        weight_kg: 65,
        age: 25,
        gender: 'male',
        goal: 'muscle_gain',
        target_weight: 70
      }
      setProfile(defaultProf)
      setCachedProfile(defaultProf)
    }

    return res
  }

  // Action Register via Backend API
  const registerApi = async (email, password, fullName) => {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: { email, password, full_name: fullName },
    }).catch(async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) throw new Error(error.message)
      return { token: data.session?.access_token, user: data.user }
    })

    if (res.token) setToken(res.token)
    if (res.user) setUser(res.user)

    const initialProf = {
      full_name: fullName || 'User',
      email,
      height_cm: 170,
      weight_kg: 65,
      age: 25,
      gender: 'male',
      goal: 'muscle_gain',
      target_weight: 70
    }
    setProfile(initialProf)
    setCachedProfile(initialProf)

    return res
  }

  // Action Update Profile via Backend API
  const updateProfileApi = async (newProfileData) => {
    const updated = { ...profile, ...newProfileData }
    setProfile(updated)
    setCachedProfile(updated)

    try {
      const res = await apiFetch('/profile', {
        method: 'PUT',
        body: newProfileData,
      })
      if (res?.data) {
        const finalProfile = { ...updated, ...res.data }
        setProfile(finalProfile)
        setCachedProfile(finalProfile)
        return finalProfile
      }
    } catch (e) {
      console.warn('[AuthContext] Syncing profile to server failed, using local cache:', e.message)
    }

    return updated
  }

  // Action Logout
  const logoutApi = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.warn('Signout error:', e)
    }
    setUser(null)
    setProfile(null)
    removeToken()
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      loginApi,
      registerApi,
      updateProfileApi,
      logoutApi,
      setProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus digunakan di dalam <AuthProvider>')
  return ctx
}
