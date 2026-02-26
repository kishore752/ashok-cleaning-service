import { onUnmounted } from 'vue'
import { supabase } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

type EventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

interface SubscriptionConfig {
  event: EventType
  table: string
  schema?: string
  filter?: string
  callback: (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => void
}

export function useRealtime(channelName: string) {
  let channel: RealtimeChannel | null = null

  /**
   * Subscribe to one or more Postgres changes on the same channel.
   * Automatically unsubscribes on component unmount.
   */
  function subscribe(configs: SubscriptionConfig[]) {
    if (channel) {
      supabase.removeChannel(channel)
    }

    let ch = supabase.channel(channelName)

    for (const cfg of configs) {
      ch = ch.on(
        'postgres_changes' as 'system',
        {
          event: cfg.event,
          schema: cfg.schema ?? 'public',
          table: cfg.table,
          ...(cfg.filter ? { filter: cfg.filter } : {}),
        } as unknown as { event: 'system' },
        cfg.callback as unknown as (payload: {
          extension: string
          status: string
          type: string
        }) => void,
      )
    }

    channel = ch.subscribe()
  }

  function unsubscribe() {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
  }

  // Auto-cleanup on component unmount
  onUnmounted(unsubscribe)

  return { subscribe, unsubscribe }
}
