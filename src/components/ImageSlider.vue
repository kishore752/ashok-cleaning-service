<template>
  <div class="slider-container">
    <div class="slides-container" :class="{ 'is-transitioning': isTransitioning }">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="slide"
        :class="{
          active: currentIndex === index,
          'slide-next': index > currentIndex,
          'slide-prev': index < currentIndex,
          'slide-current': index === currentIndex,
        }"
        @click="navigateToService(image.serviceId)"
      >
        <img :src="image.url" :alt="image.title" @error="handleImageError(index)" />
        <div class="slide-content" @click.stop="navigateToService(image.serviceId)">
          <h2>{{ image.title }}</h2>
          <p>{{ image.description }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation Dots -->
    <div class="slider-dots">
      <button
        v-for="(_, index) in images"
        :key="index"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>

    <!-- Navigation Arrows -->
    <button
      class="slider-arrow prev"
      @click="prevSlide"
      @mouseenter="stopAutoSlide"
      @mouseleave="startAutoSlide"
      aria-label="Previous slide"
    >
      <span>❮</span>
    </button>
    <button
      class="slider-arrow next"
      @click="nextSlide"
      @mouseenter="stopAutoSlide"
      @mouseleave="startAutoSlide"
      aria-label="Next slide"
    >
      <span>❯</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const images = [
  {
    url: 'images/slider/cleaning-service-1.jpg',
    title: 'Professional Cleaning Services',
    description: 'Expert cleaning solutions for your home and business',
    serviceId: 'residential-cleaning',
  },
  {
    url: 'images/slider/cleaning-service-2.jpg',
    title: 'Deep Cleaning Specialists',
    description: 'Thorough cleaning for every corner of your space',
    serviceId: 'deep-cleaning',
  },
  {
    url: 'images/slider/cleaning-service-3.jpg',
    title: 'Office Cleaning Services',
    description: 'Maintain a professional and healthy work environment',
    serviceId: 'office-cleaning',
  },
  {
    url: 'images/slider/cleaning-service-4.jpg',
    title: 'Residential Cleaning',
    description: 'Quality cleaning solutions for your home',
    serviceId: 'residential-cleaning',
  },
  {
    url: 'images/slider/cleaning-service-5.jpg',
    title: 'Window Cleaning',
    description: 'Crystal clear windows for maximum visibility',
    serviceId: 'window-cleaning',
  },
]

const currentIndex = ref(0)
let intervalId: number | null = null
const isTransitioning = ref(false)

const handleImageError = (index: number) => {
  console.error(`Failed to load image: ${images[index].url}`)
  // Try to load the image again with a different path
  const img = new Image()
  img.onload = () => {
    console.log(`Image loaded successfully: ${images[index].url}`)
  }
  img.onerror = () => {
    console.error(`Image failed to load again: ${images[index].url}`)
  }
  img.src = images[index].url
}

const goToSlide = (index: number) => {
  if (isTransitioning.value || currentIndex.value === index) return
  isTransitioning.value = true
  currentIndex.value = index
  resetAutoSlide()
  setTimeout(() => {
    isTransitioning.value = false
  }, 800)
}

const nextSlide = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentIndex.value = (currentIndex.value + 1) % images.length
  resetAutoSlide()
  setTimeout(() => {
    isTransitioning.value = false
  }, 800)
}

const prevSlide = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
  resetAutoSlide()
  setTimeout(() => {
    isTransitioning.value = false
  }, 800)
}

const startAutoSlide = () => {
  if (intervalId) clearInterval(intervalId)
  intervalId = window.setInterval(nextSlide, 6000)
}

const stopAutoSlide = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const resetAutoSlide = () => {
  stopAutoSlide()
  startAutoSlide()
}

const navigateToService = (serviceId: string) => {
  router.push(`/services#${serviceId}`)
}

onMounted(() => {
  // Fix for mobile viewport height
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)

  // Update on resize
  window.addEventListener('resize', () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  })

  startAutoSlide()
  // Preload all images
  images.forEach((image) => {
    const img = new Image()
    img.src = image.url
  })
})

onUnmounted(() => {
  stopAutoSlide()
  window.removeEventListener('resize', () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  })
})
</script>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  height: 85vh;
  height: 85dvh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: stretch;
}

.slides-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex: 1;
}

.slides-container.is-transitioning .slide {
  transition: none;
}

.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
  cursor: pointer;
  overflow: hidden;
  opacity: 0;
  display: flex;
  align-items: stretch;
  flex: 1;
}

.slide.active {
  opacity: 1;
  z-index: 2;
}

.slide::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 1;
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide.active::before {
  opacity: 0.8;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.1);
  transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(0.8);
  margin: 0;
  padding: 0;
  flex: 1;
}

.slide.active img {
  transform: scale(1);
  filter: brightness(1);
}

.slide-content {
  position: absolute;
  bottom: 15%;
  left: 0;
  right: 0;
  padding: 3rem 4rem;
  z-index: 2;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide.active .slide-content {
  opacity: 1;
  transform: translateY(0);
}

.slide-content h2 {
  font-size: 3rem;
  margin-bottom: 0.8rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  transform: translateY(40px) scale(0.95);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}

.slide.active .slide-content h2 {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.slide-content p {
  font-size: 1.2rem;
  max-width: 600px;
  line-height: 1.5;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  transform: translateY(40px) scale(0.95);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
}

.slide.active .slide-content p {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.slider-dots {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
  padding: 0;
  align-items: center;
  justify-content: center;
}

.slider-dots button {
  appearance: none;
  width: 7px;
  height: 7px;
  min-width: 7px;
  min-height: 7px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.35);
  padding: 0;
  margin: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  flex: none;
}

.slider-dots button.active {
  background: white;
}

.slider-dots button:hover:not(.active) {
  background: rgba(255, 255, 255, 0.5);
}

.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(4px);
  opacity: 0;
}

.slider-container:hover .slider-arrow {
  opacity: 1;
}

.slider-arrow:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.prev {
  left: 2rem;
  transform: translateX(-20px);
}

.next {
  right: 2rem;
  transform: translateX(20px);
}

.slider-container:hover .prev {
  transform: translateY(-50%) translateX(0);
}

.slider-container:hover .next {
  transform: translateY(-50%) translateX(0);
}

/* Add slide direction classes */
.slide-next {
  transform: translateX(100%) scale(0.95);
  opacity: 0;
}

.slide-prev {
  transform: translateX(-100%) scale(0.95);
  opacity: 0;
}

.slide-current {
  transform: translateX(0) scale(1);
  opacity: 1;
}

@media (max-width: 768px) {
  .slider-container {
    height: 75vh;
    height: 75dvh;
    min-height: 75vh;
    min-height: 75dvh;
  }

  .slide-content {
    bottom: 20%;
    padding: 1.5rem 2rem;
  }

  .slide-content h2 {
    font-size: 1.8rem;
    margin-bottom: 0.6rem;
  }

  .slide-content p {
    font-size: 1rem;
    line-height: 1.4;
  }

  .slider-arrow {
    width: 45px;
    height: 45px;
    font-size: 1.6rem;
  }

  .prev {
    left: 1rem;
  }

  .next {
    right: 1rem;
  }

  .slider-dots {
    bottom: 1.5rem;
    gap: 6px;
  }

  .slider-dots button {
    width: 6px;
    height: 6px;
    min-width: 6px;
    min-height: 6px;
  }
}

/* Fix for mobile browsers */
@supports (-webkit-touch-callout: none) {
  .slider-container {
    height: 75vh;
    min-height: 75vh;
    max-height: 75vh;
  }
}
</style>
