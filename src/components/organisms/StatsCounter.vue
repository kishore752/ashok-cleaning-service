<template>
  <section class="stats section-sm" ref="sectionRef">
    <div class="container stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-item">
        <div class="stat-number">
          <span class="count">{{ stat.displayed }}</span
          >{{ stat.suffix }}
        </div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

interface Stat {
  target: number
  suffix: string
  label: string
  displayed: number
}

const stats: Stat[] = reactive([
  { target: 500, suffix: '+', label: 'Happy Clients', displayed: 0 },
  { target: 10, suffix: '+', label: 'Years Experience', displayed: 0 },
  { target: 2000, suffix: '+', label: 'Jobs Completed', displayed: 0 },
  { target: 100, suffix: '%', label: 'Satisfaction Rate', displayed: 0 },
])

const sectionRef = ref<HTMLElement | null>(null)
let hasAnimated = false
let observer: IntersectionObserver | null = null

function animateCounters() {
  if (hasAnimated) return
  hasAnimated = true

  stats.forEach((stat) => {
    const duration = 1800
    const steps = 60
    const increment = stat.target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= stat.target) {
        stat.displayed = stat.target
        clearInterval(timer)
      } else {
        stat.displayed = Math.floor(current)
      }
    }, duration / steps)
  })
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) animateCounters()
    },
    { threshold: 0.3 },
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.stats {
  background: linear-gradient(135deg, #14532d 0%, #166534 40%, #15803d 100%);
  position: relative;
  overflow: hidden;
}

.stats::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(74, 222, 128, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(134, 239, 172, 0.06) 0%, transparent 50%);
  pointer-events: none;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
  position: relative;
}

.stat-item {
  text-align: center;
  padding: var(--space-8) var(--space-4);
}

.stat-item + .stat-item {
  border-left: 1px solid rgba(255, 255, 255, 0.12);
}

.stat-number {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 900;
  color: #fff;
  line-height: 1;
  margin-bottom: var(--space-3);
  letter-spacing: -0.02em;
}

.count {
  display: inline-block;
}

.stat-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stat-item + .stat-item:nth-child(odd) {
    border-left: none;
  }
}

@media (max-width: 400px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .stat-item + .stat-item {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }
}
</style>
