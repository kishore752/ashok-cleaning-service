<template>
  <div class="skeleton" :class="[variant]" aria-busy="true" aria-live="polite">
    <template v-if="variant === 'cards'">
      <div v-for="i in count" :key="i" class="skeleton-card">
        <div class="skeleton-line title"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line medium"></div>
      </div>
    </template>
    <template v-else-if="variant === 'list'">
      <div v-for="i in count" :key="i" class="skeleton-list-item">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line medium"></div>
      </div>
    </template>
    <template v-else>
      <div class="skeleton-line long"></div>
      <div class="skeleton-line medium"></div>
      <div class="skeleton-line short"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'cards' | 'list'
    count?: number
  }>(),
  { variant: 'default', count: 3 }
)
</script>

<style scoped>
.skeleton {
  animation: skeleton-shimmer 1.2s ease-in-out infinite;
}
.skeleton-line {
  height: 1rem;
  border-radius: var(--radius-sm);
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
}
.skeleton-line.title {
  height: 1.25rem;
  width: 60%;
  margin-bottom: var(--space-3);
}
.skeleton-line.medium {
  width: 85%;
  margin-bottom: var(--space-2);
}
.skeleton-line.short {
  width: 40%;
  margin-bottom: var(--space-2);
}
.skeleton-line.long {
  width: 100%;
  margin-bottom: var(--space-3);
}
.skeleton.cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.skeleton-card {
  padding: var(--space-5);
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
}
.skeleton-list-item {
  padding: var(--space-4);
  background: var(--gray-50);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-3);
}
@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
.skeleton-line {
  background: var(--gray-200);
}
.skeleton .skeleton-line {
  background: linear-gradient(
    90deg,
    var(--gray-200) 0%,
    var(--gray-100) 50%,
    var(--gray-200) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.2s ease-in-out infinite;
}
</style>
