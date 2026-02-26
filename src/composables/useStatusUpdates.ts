import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { StatusUpdate } from '../types/database'

export function useStatusUpdates() {
  const statusUpdatesMap = ref<Record<string, StatusUpdate[]>>({})

  /** Load status updates for a batch of submission IDs */
  async function loadForSubmissions(ids: string[]) {
    if (ids.length === 0) return

    try {
      const { data, error } = await supabase
        .from('status_updates')
        .select('*')
        .in('submission_id', ids)
        .order('created_at', { ascending: true })

      if (error) {
        // Table might not exist yet — that's okay
        console.info('status_updates not available:', error.message)
        return
      }

      const map: Record<string, StatusUpdate[]> = {}
      for (const u of (data as StatusUpdate[]) ?? []) {
        if (!map[u.submission_id]) map[u.submission_id] = []
        map[u.submission_id].push(u)
      }
      statusUpdatesMap.value = map
    } catch (e) {
      console.info('status_updates exception:', e)
    }
  }

  /** Insert a new status update (audit trail entry) */
  async function insertUpdate(
    submissionId: string,
    oldStatus: string,
    newStatus: string,
    note: string | null,
    updatedBy: string | null,
    images: string[] | null = null,
  ) {
    try {
      const { error } = await supabase.from('status_updates').insert({
        submission_id: submissionId,
        old_status: oldStatus,
        new_status: newStatus,
        note: note || null,
        updated_by: updatedBy,
        ...(images && images.length > 0 ? { images } : {}),
      })
      if (error) {
        console.info('status_updates insert skipped:', error.message)
      }
    } catch {
      // Table might not exist yet — still proceed
      console.info('status_updates table not available yet')
    }
  }

  /** Refresh status updates (called when realtime events fire) */
  async function refresh(submissionIds: string[]) {
    await loadForSubmissions(submissionIds)
  }

  return {
    statusUpdatesMap,
    loadForSubmissions,
    insertUpdate,
    refresh,
  }
}
