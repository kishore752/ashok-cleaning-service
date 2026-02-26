<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <router-link v-if="actionTo" :to="actionTo" class="btn btn-primary">
      {{ actionLabel }}
    </router-link>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    title: string
    description: string
    actionLabel?: string
    actionTo?: string
  }>(),
  { icon: '📝' },
)
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: var(--space-10) var(--space-4);
  background: var(--gray-50);
  border: 2px dashed var(--gray-200);
  border-radius: var(--radius-lg);
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-3);
}

.empty-state h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gray-700);
  margin: 0 0 var(--space-2);
}

.empty-state p {
  color: var(--gray-500);
  font-size: 0.9rem;
  margin: 0 0 var(--space-5);
}
</style>
