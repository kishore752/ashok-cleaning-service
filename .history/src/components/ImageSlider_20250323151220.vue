<template>
  <div class="slider-container">
    <div class="slider" :style="sliderStyle">
      <div v-for="(image, index) in images" :key="index" class="slide">
        <img :src="image.url" :alt="image.alt" />
      </div>
      <!-- Clone first image for smooth transition -->
      <div class="slide">
        <img :src="images[0].url" :alt="images[0].alt" />
      </div>
    </div>
    <button class="slider-button prev" @click="prevSlide">&lt;</button>
    <button class="slider-button next" @click="nextSlide">&gt;</button>
    <div class="slider-dots">
      <button
        v-for="(_, index) in images"
        :key="index"
        class="dot"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const images = [
  {
    url: '/images/cleaning1.jpg',
    alt: 'Professional cleaning service',
  },
  {
    url: '/images/cleaning2.jpg',
    alt: 'Deep cleaning service',
  },
  {
    url: '/images/cleaning3.jpg',
    alt: 'Office cleaning service',
  },
]

const currentIndex = ref(0)
const isTransitioning = ref(false)
let autoplayInterval: number | null = null

const sliderStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
  transition: isTransitioning.value ? 'transform 0.8s ease-in-out' : 'none',
}))

const nextSlide = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentIndex.value++

  // If we're at the cloned slide (last one)
  if (currentIndex.value === images.length) {
    setTimeout(() => {
      isTransitioning.value = false
      currentIndex.value = 0
    }, 800) // Match this with the transition duration
  }
}

const prevSlide = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentIndex.value--

  // If we're at the first slide and going backwards
  if (currentIndex.value < 0) {
    setTimeout(() => {
      isTransitioning.value = false
      currentIndex.value = images.length - 1
    }, 800) // Match this with the transition duration
  }
}

const goToSlide = (index: number) => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentIndex.value = index
  setTimeout(() => {
    isTransitioning.value = false
  }, 800) // Match this with the transition duration
}

const startAutoplay = () => {
  autoplayInterval = window.setInterval(nextSlide, 5000)
}

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  height: 600px;
  overflow: hidden;
}

.slider {
  display: flex;
  width: calc(100% * (v-bind(images.length) + 1));
  height: 100%;
  transition: transform 0.8s ease-in-out;
}

.slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slider-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.7);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  color: #333;
  transition: all 0.3s ease;
  z-index: 10;
}

.slider-button:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

.slider-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.dot.active {
  background: white;
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .slider-container {
    height: 400px;
  }

  .slider-button {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }

  .dot {
    width: 8px;
    height: 8px;
  }
}
</style>
