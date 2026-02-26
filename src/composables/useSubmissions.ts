import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { ContactSubmission, SubmissionStatus } from '../types/database'

export function useSubmissions() {
  const submissions = ref<ContactSubmission[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  /** Load all submissions (for staff views) */
  async function loadAll() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) {
        console.error('loadAll error:', err)
        error.value = err.message
      } else {
        submissions.value = (data as ContactSubmission[]) ?? []
      }
    } catch (e) {
      console.error('loadAll exception:', e)
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  /** Load submissions for a specific user (customer dashboard) */
  async function loadMine(userId: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (err) {
        console.error('loadMine error:', err)
        error.value = err.message
      } else {
        submissions.value = (data as ContactSubmission[]) ?? []
      }
    } catch (e) {
      console.error('loadMine exception:', e)
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  /** Update a submission's status (for staff) */
  async function updateStatus(id: string, newStatus: SubmissionStatus) {
    const { error: err } = await supabase
      .from('contact_submissions')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (err) {
      console.error('updateStatus error:', err)
      throw err
    }
    // Update local state
    const idx = submissions.value.findIndex((s) => s.id === id)
    if (idx !== -1) {
      submissions.value[idx] = { ...submissions.value[idx], status: newStatus }
    }
  }

  /** Patch a submission in local state (for realtime updates) */
  function patchLocal(updated: Partial<ContactSubmission> & { id: string }) {
    const idx = submissions.value.findIndex((s) => s.id === updated.id)
    if (idx !== -1) {
      submissions.value[idx] = { ...submissions.value[idx], ...updated }
    }
  }

  return {
    submissions,
    loading,
    error,
    loadAll,
    loadMine,
    updateStatus,
    patchLocal,
  }
}
