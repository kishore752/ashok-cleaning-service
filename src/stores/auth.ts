import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile, AppRole } from '../types/database'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)
  const role = computed<AppRole | null>(() => profile.value?.role ?? null)
  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isEmployee = computed(() =>
    profile.value?.role === 'employee' || profile.value?.role === 'admin'
  )
  const isCustomer = computed(() => profile.value?.role === 'customer' || !profile.value?.role)

  async function fetchProfile(uid: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()
    if (error) {
      console.error('Fetch profile error:', error)
      return null
    }
    profile.value = data as Profile
    return profile.value
  }

  async function init() {
    loading.value = true
    const {
      data: { session },
    } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    if (session?.user) {
      await fetchProfile(session.user.id)
    } else {
      profile.value = null
    }
    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user ?? null
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        profile.value = null
      }
    })
    loading.value = false
  }

  async function signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw error
    if (data.user) await fetchProfile(data.user.id)
    return data
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (data.user) await fetchProfile(data.user.id)
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user.value) return
    const { role: _r, id: _id, ...safeUpdates } = updates as Partial<Profile> & { role?: AppRole; id?: string }
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...safeUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.value.id)
      .select()
      .single()
    if (error) throw error
    profile.value = data as Profile
    return profile.value
  }

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    role,
    isAdmin,
    isEmployee,
    isCustomer,
    init,
    signUp,
    signIn,
    signOut,
    fetchProfile,
    updateProfile,
  }
})
