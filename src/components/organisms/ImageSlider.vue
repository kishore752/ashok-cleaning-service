<template>
  <div
    ref="sliderRef"
    class="slider-container"
    @mouseenter="stopAuto"
    @mouseleave="startAuto"
    @keydown="onKeydown"
    tabindex="0"
    role="region"
    aria-roledescription="carousel"
    :aria-label="`Image carousel, slide ${currentIndex + 1} of ${slides.length}`"
  >
    <!-- Slides -->
    <div class="slider" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        class="slide"
        :aria-hidden="currentIndex !== index"
        :aria-label="`Slide ${index + 1}: ${slide.title.replace(/\n/g, ' ')}`"
      >
        <img
          :src="slide.url"
          :alt="slide.alt"
          :loading="index <= currentIndex + 1 ? 'eager' : 'lazy'"
          fetchpriority="high"
        />
        <div class="slide-overlay"></div>
        <div class="slide-content">
          <span class="slide-tag">{{ slide.tag }}</span>
          <h2>{{ slide.title }}</h2>
          <p>{{ slide.description }}</p>
        </div>
      </div>
    </div>

    <!-- Arrow buttons -->
    <button class="arrow prev" @click="prevSlide" aria-label="Previous slide">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
    <button class="arrow next" @click="nextSlide" aria-label="Next slide">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>

    <!-- Progress bar -->
    <div class="progress-track" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
    </div>

    <!-- Dots + counter -->
    <div class="slider-footer">
      <div class="dots">
        <button
          v-for="(slide, i) in slides"
          :key="slide.id"
          :class="['dot', { active: currentIndex === i }]"
          @click="goTo(i)"
          :aria-label="`Go to slide ${i + 1}`"
          :aria-current="currentIndex === i ? 'true' : undefined"
        ></button>
      </div>
      <span class="slide-counter" aria-live="polite">{{ currentIndex + 1 }} / {{ slides.length }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

const sliderRef = ref<HTMLElement | null>(null)
const slides = [
  {
    id: 'residential',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&q=85',
    alt: 'Professional house cleaning - clean living room',
    tag: 'Residential Cleaning',
    title: 'Spotless Homes,\nHappy Families',
    description: 'Expert residential cleaning tailored to your schedule and standards.',
  },
  {
    id: 'commercial',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=85',
    alt: 'Office cleaning service - modern workspace',
    tag: 'Commercial Cleaning',
    title: 'Professional Spaces,\nMaximum Productivity',
    description: 'We keep your workplace clean, healthy, and impressive — 365 days a year.',
  },
  {
    id: 'eco',
    url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1400&q=85',
    alt: 'Eco-friendly cleaning products and supplies',
    tag: 'Eco-Friendly',
    title: 'Green Cleaning\nfor a Better World',
    description: 'Non-toxic, biodegradable products safe for kids, pets, and the planet.',
  },
  {
    id: 'deep',
    url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1400&q=85',
    alt: 'Deep cleaning - sparkling clean kitchen',
    tag: 'Deep Clean',
    title: 'Every Corner,\nEvery Detail',
    description: 'Thorough deep cleans that go beyond the surface for a truly fresh space.',
  },
]

const currentIndex = ref(0)
const progress = ref(0)
const SWIPE_THRESHOLD = 50
const INTERVAL_MS = 5500
let intervalId: ReturnType<typeof setInterval> | null = null
let progressIntervalId: ReturnType<typeof setInterval> | null = null
let touchStartX = 0
let touchEndX = 0

const progressPercent = computed(() => (progress.value / INTERVAL_MS) * 100)

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % slides.length
  resetProgress()
}
function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length
  resetProgress()
}
function goTo(i: number) {
  currentIndex.value = i
  resetProgress()
}

function resetProgress() {
  progress.value = 0
}

function tickProgress() {
  progress.value += 100
  if (progress.value >= INTERVAL_MS) {
    progress.value = 0
    nextSlide()
  }
}

function startAuto() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  progress.value = 0
  intervalId = setInterval(nextSlide, INTERVAL_MS)
  progressIntervalId = setInterval(tickProgress, 100)
}
function stopAuto() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  if (progressIntervalId) {
    clearInterval(progressIntervalId)
    progressIntervalId = null
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prevSlide()
  }
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    nextSlide()
  }
}

function onTouchStart(e: TouchEvent) {
  touchStartX = e.changedTouches[0].screenX
}
function onTouchEnd(e: TouchEvent) {
  touchEndX = e.changedTouches[0].screenX
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > SWIPE_THRESHOLD) {
    if (diff > 0) nextSlide()
    else prevSlide()
  }
}

function onVisibility() {
  if (document.hidden) stopAuto()
  else startAuto()
}

onMounted(() => {
  startAuto()
  const el = sliderRef.value
  if (el) {
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
  }
  document.addEventListener('visibilitychange', onVisibility)
})

watch(currentIndex, () => {
  resetProgress()
})

onUnmounted(() => {
  stopAuto()
  const el = sliderRef.value
  if (el) {
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchend', onTouchEnd)
  }
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  height: clamp(450px, 65vh, 680px);
  overflow: hidden;
  background: #111;
  outline: none;
}

.slider-container:focus-visible {
  box-shadow: 0 0 0 3px var(--brand-primary);
}

.slider {
  display: flex;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide {
  min-width: 100%;
  height: 100%;
  position: relative;
  flex-shrink: 0;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.4) 55%,
    rgba(0, 0, 0, 0.1) 100%
  );
}

.slide-content {
  position: absolute;
  top: 50%;
  left: 8%;
  transform: translateY(-50%);
  color: #fff;
  max-width: 560px;
}

.slide-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: var(--brand-primary);
  color: #fff;
  padding: 0.3rem 0.9rem;
  border-radius: var(--radius-full);
  margin-bottom: 1rem;
}

.slide-content h2 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 1rem;
  white-space: pre-line;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.4);
}

.slide-content p {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
  max-width: 420px;
  line-height: 1.6;
}

/* Progress bar */
.progress-track {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 10;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--brand-primary);
  transition: width 0.1s linear;
}

/* Footer: dots + counter */
.slider-footer {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  z-index: 10;
}

.dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.45);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all var(--transition-base);
}

.dot:hover {
  background: rgba(255, 255, 255, 0.7);
}

.dot.active {
  background: #fff;
  width: 24px;
}

.slide-counter {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

/* Arrows */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
  z-index: 10;
}

.arrow:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.08);
}

.arrow:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--brand-primary);
}

.prev {
  left: 1.5rem;
}
.next {
  right: 1.5rem;
}

@media (max-width: 768px) {
  .slide-content {
    left: 5%;
    right: 5%;
    max-width: 100%;
  }
  .arrow {
    width: 40px;
    height: 40px;
  }
  .prev {
    left: 0.75rem;
  }
  .next {
    right: 0.75rem;
  }
  .slider-footer {
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-2);
  }
  .slide-counter {
    width: 100%;
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .slider {
    transition: none;
  }
  .progress-fill {
    transition: none;
  }
}
</style>
