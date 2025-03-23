<template>
  <div class="slider-container">
    <div class="slider" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(image, index) in images" :key="index" class="slide">
        <img :src="image.url" :alt="image.alt" />
        <div class="slide-content">
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
        @click="currentIndex = index"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>

    <!-- Navigation Arrows -->
    <button class="slider-arrow prev" @click="prevSlide" aria-label="Previous slide">
      <span>❮</span>
    </button>
    <button class="slider-arrow next" @click="nextSlide" aria-label="Next slide">
      <span>❯</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const images = [
  {
    url: '/images/slider/cleaning-1.jpg',
    title: 'Professional Cleaning Services',
    description: 'Experience the difference with our expert cleaning team',
    alt: 'Professional cleaning service',
  },
  {
    url: '/images/slider/cleaning-2.jpg',
    title: 'Quality You Can Trust',
    description: 'Using eco-friendly products for a healthier environment',
    alt: 'Quality cleaning service',
  },
  {
    url: '/images/slider/cleaning-3.jpg',
    title: 'Satisfaction Guaranteed',
    description: '100% satisfaction guaranteed on all our services',
    alt: 'Satisfaction guaranteed',
  },
]

const currentIndex = ref(0)
let intervalId: number | null = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
}

const startAutoSlide = () => {
  intervalId = window.setInterval(nextSlide, 5000) // Change slide every 5 seconds
}

const stopAutoSlide = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.slider {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  height: 100%;
  position: relative;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}

.slide-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.slide-content p {
  font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.slider-dots {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.slider-dots button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.3s ease;
}

.slider-dots button.active {
  background: white;
}

.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: background-color 0.3s ease;
  z-index: 10;
}

.slider-arrow:hover {
  background: rgba(0, 0, 0, 0.8);
}

.prev {
  left: 1rem;
}

.next {
  right: 1rem;
}

@media (max-width: 768px) {
  .slider-container {
    height: 300px;
  }

  .slide-content h2 {
    font-size: 1.8rem;
  }

  .slide-content p {
    font-size: 1rem;
  }

  .slider-arrow {
    width: 30px;
    height: 30px;
    font-size: 1.2rem;
  }
}
</style>
