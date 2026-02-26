<template>
  <Transition name="modal-fade">
    <div
      v-if="show"
      class="modal-overlay"
      @click.self="$emit('close')"
      @keydown.escape="$emit('close')"
    >
      <div class="modal-panel" :style="{ maxWidth }" role="dialog" aria-modal="true">
        <div v-if="title" class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div v-if="$slots.actions" class="modal-actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const props = withDefaults(
  defineProps<{
    show: boolean
    title?: string
    subtitle?: string
    maxWidth?: string
  }>(),
  { maxWidth: '460px' },
)

defineEmits<{
  (e: 'close'): void
}>()

// Handle escape key globally when modal open
watch(
  () => props.show,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal-panel {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  width: 100%;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
  animation: modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-pop {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  margin-bottom: var(--space-5);
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--gray-900);
  margin: 0 0 var(--space-1);
}

.modal-subtitle {
  font-size: 0.9rem;
  color: var(--gray-500);
  margin: 0;
}

.modal-body {
  /* Content slot */
}

.modal-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  margin-top: var(--space-5);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
