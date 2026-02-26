<template>
  <span class="status-badge" :style="badgeStyle"> {{ meta.icon }} {{ meta.label }} </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { STATUS_META } from '../../composables/useFormatters'

const props = defineProps<{
  status: string
}>()

const meta = computed(
  () =>
    STATUS_META[props.status] ?? {
      icon: '📋',
      label: props.status,
      color: '#6b7280',
      bg: '#e5e7eb',
    },
)

const badgeStyle = computed(() => ({
  color: meta.value.color,
  background: meta.value.bg,
}))
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.25rem 0.7rem;
  border-radius: 9999px;
  white-space: nowrap;
}
</style>
