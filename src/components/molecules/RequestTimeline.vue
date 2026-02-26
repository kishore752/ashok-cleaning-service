<template>
  <div class="timeline-wrap">
    <div class="timeline">
      <div
        v-for="(step, i) in milestones"
        :key="step.key"
        :class="[
          'milestone',
          {
            active: step.reached,
            current: step.current,
            cancelled: step.key === 'cancelled' && step.reached,
          },
        ]"
      >
        <div v-if="i > 0" :class="['connector', { filled: step.reached }]"></div>
        <div :class="['circle', { pulse: step.current }]">
          <span class="circle-icon">{{ step.icon }}</span>
        </div>
        <div class="milestone-content">
          <span class="milestone-label">{{ step.label }}</span>
          <span v-if="step.timestamp" class="milestone-time">{{
            fmt.formatRelativeDate(step.timestamp)
          }}</span>
          <span v-if="step.note" class="milestone-note">{{ step.note }}</span>

          <div v-if="step.images && step.images.length > 0" class="timeline-images">
            <template v-for="(url, imgIdx) in step.images" :key="imgIdx">
              <a :href="url" target="_blank" rel="noopener noreferrer">
                <img :src="url" alt="Submission photo" class="timeline-thumb" loading="lazy" />
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormatters, STATUS_META, STATUS_ORDER } from '../../composables'
import type { ContactSubmission, StatusUpdate } from '../../types/database'

const props = defineProps<{
  submission: ContactSubmission
  statusUpdates?: StatusUpdate[]
}>()

const fmt = useFormatters()

const milestones = computed(() => {
  const currentStatus = props.submission.status
  const isCancelled = currentStatus === 'cancelled'
  const currentIdx = STATUS_ORDER.indexOf(currentStatus as (typeof STATUS_ORDER)[number])
  const updates = props.statusUpdates || []

  const steps: Array<{
    key: string
    icon: string
    label: string
    reached: boolean
    current: boolean
    timestamp: string | null
    note: string | null
    images: string[] | null
  }> = STATUS_ORDER.map((key, i) => {
    const reached = i <= currentIdx
    const current = key === currentStatus && !isCancelled
    const update = updates.find((u) => u.new_status === key)
    return {
      key,
      icon: STATUS_META[key].icon,
      label: STATUS_META[key].label,
      reached,
      current,
      timestamp: key === 'new' ? props.submission.created_at : update?.created_at || null,
      note: update?.note || null,
      images: update?.images || null,
    }
  })

  if (isCancelled) {
    const cancelUpdate = updates.find((u) => u.new_status === 'cancelled')
    steps.push({
      key: 'cancelled',
      icon: STATUS_META.cancelled.icon,
      label: STATUS_META.cancelled.label,
      reached: true,
      current: true,
      timestamp: cancelUpdate?.created_at || null,
      note: cancelUpdate?.note || null,
      images: cancelUpdate?.images || null,
    })
  }

  return steps
})
</script>

<style scoped>
.timeline-wrap {
  padding: var(--space-2) 0;
}
.timeline {
  display: flex;
  flex-direction: column;
  position: relative;
}
.milestone {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  position: relative;
  padding-bottom: var(--space-4);
  min-height: 48px;
}
.milestone:last-child {
  padding-bottom: 0;
}

.connector {
  position: absolute;
  left: 17px;
  top: -20px;
  width: 2px;
  height: 20px;
  background: var(--gray-200);
  transition: background 0.3s ease;
}
.connector.filled {
  background: var(--brand-primary);
}

.circle {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--gray-100);
  border: 2px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}
.milestone.active .circle {
  background: var(--green-50);
  border-color: var(--brand-primary);
}
.milestone.current .circle {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.15);
}
.milestone.cancelled .circle {
  background: #fef2f2;
  border-color: #ef4444;
}
.milestone.cancelled.current .circle {
  background: #ef4444;
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
}
.circle.pulse {
  animation: pulse-ring 2s ease-in-out infinite;
}
@keyframes pulse-ring {
  0%,
  100% {
    box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.15);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(22, 163, 74, 0.05);
  }
}
.circle-icon {
  font-size: 0.9rem;
  line-height: 1;
}
.milestone:not(.active) .circle-icon {
  filter: grayscale(1);
  opacity: 0.4;
}
.milestone.current .circle-icon {
  filter: none;
  opacity: 1;
}

.milestone-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 6px;
}
.milestone-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-400);
  transition: color 0.3s;
}
.milestone.active .milestone-label {
  color: var(--gray-700);
}
.milestone.current .milestone-label {
  color: var(--gray-900);
  font-weight: 700;
}
.milestone.cancelled .milestone-label {
  color: #b91c1c;
}
.milestone-time {
  font-size: 0.78rem;
  color: var(--gray-400);
}
.milestone.active .milestone-time {
  color: var(--gray-500);
}
.milestone-note {
  font-size: 0.82rem;
  color: var(--gray-500);
  font-style: italic;
  margin-top: 2px;
  background: var(--gray-50);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  border-left: 2px solid var(--brand-primary);
}
.timeline-images {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-2);
}
.timeline-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--gray-200);
}
</style>
