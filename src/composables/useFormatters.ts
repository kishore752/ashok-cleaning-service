import type { SubmissionStatus } from '../types/database'

// ── Status metadata (single source of truth) ──────────────────

export const STATUS_META: Record<
  string,
  { icon: string; label: string; color: string; bg: string }
> = {
  new: { icon: '📋', label: 'Submitted', color: '#1d4ed8', bg: '#dbeafe' },
  contacted: { icon: '📞', label: 'Contacted', color: '#b45309', bg: '#fef3c7' },
  scheduled: { icon: '📅', label: 'Scheduled', color: '#4338ca', bg: '#e0e7ff' },
  in_progress: { icon: '🧹', label: 'In Progress', color: '#047857', bg: '#d1fae5' },
  pending_review: { icon: '🔍', label: 'Pending Review', color: '#7c3aed', bg: '#ede9fe' },
  completed: { icon: '✅', label: 'Completed', color: '#15803d', bg: '#dcfce7' },
  cancelled: { icon: '❌', label: 'Cancelled', color: '#6b7280', bg: '#e5e7eb' },
}

// ── Service options (single source of truth) ──────────────────

export const SERVICE_OPTIONS: { value: string; label: string }[] = [
  { value: 'house', label: 'House Cleaning' },
  { value: 'office', label: 'Office Cleaning' },
  { value: 'deep', label: 'Deep Cleaning' },
  { value: 'movein', label: 'Move-In / Move-Out' },
  { value: 'construction', label: 'Post-Construction' },
  { value: 'eco', label: 'Eco-Friendly Clean' },
]

const SERVICE_MAP = Object.fromEntries(SERVICE_OPTIONS.map((o) => [o.value, o.label]))

// ── All status keys in pipeline order ─────────────────────────

export const STATUS_ORDER: SubmissionStatus[] = [
  'new',
  'contacted',
  'scheduled',
  'in_progress',
  'pending_review',
  'completed',
]

// ── Composable ────────────────────────────────────────────────

export function useFormatters() {
  /** Relative or calendar date, e.g. "5m ago" or "Feb 25, 09:57 PM" */
  function formatDate(iso: string | null | undefined): string {
    if (!iso) return '—'
    try {
      const d = new Date(iso)
      if (isNaN(d.getTime())) return iso.slice(0, 10)
      return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return iso.slice(0, 10)
    }
  }

  /** "5m ago", "2h ago", "3d ago" — for timelines */
  function formatRelativeDate(iso: string | null | undefined): string {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      const now = Date.now()
      const diffMs = now - d.getTime()
      const diffMin = Math.floor(diffMs / 60_000)
      const diffHr = Math.floor(diffMs / 3_600_000)
      const diffDay = Math.floor(diffMs / 86_400_000)

      if (diffMin < 1) return 'Just now'
      if (diffMin < 60) return `${diffMin}m ago`
      if (diffHr < 24) return `${diffHr}h ago`
      if (diffDay < 7) return `${diffDay}d ago`
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    } catch {
      return iso.slice(0, 10)
    }
  }

  function formatStatus(s: SubmissionStatus | string): string {
    return STATUS_META[s]?.label ?? s
  }

  function formatService(key: string | null | undefined): string {
    if (!key) return 'General Inquiry'
    return SERVICE_MAP[key] ?? key
  }

  function statusIcon(s: string): string {
    return STATUS_META[s]?.icon ?? '📋'
  }

  return {
    formatDate,
    formatRelativeDate,
    formatStatus,
    formatService,
    statusIcon,
    STATUS_META,
    SERVICE_OPTIONS,
    STATUS_ORDER,
  }
}
