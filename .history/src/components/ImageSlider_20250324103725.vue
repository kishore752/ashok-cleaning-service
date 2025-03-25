<template>
  <div class="slider-container">
    <div class="slides-container" :class="{ 'is-transitioning': isTransitioning }">
      <div
        v-for="(image, index) in [...images, images[0], images[images.length - 1]]"
        :key="index"
        class="slide"
        :style="{
          transform: `translateX(${(index - currentIndex) * 100}%)`,
          transition: isTransitioning ? 'none' : 'transform 0.5s ease-in-out',
          opacity: '1',
        }"
      >
        <img :src="image.url" :alt="image.title" />
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
    url: '/images/slider/cleaning-service-1.jpg',
    title: 'Professional Cleaning Services',
    description: 'Expert cleaning solutions for your home and business',
  },
  {
    url: '/images/slider/cleaning-service-2.jpg',
    title: 'Deep Cleaning Specialists',
    description: 'Thorough cleaning for every corner of your space',
  },
  {
    url: '/images/slider/cleaning-service-3.jpg',
    title: 'Office Cleaning Services',
    description: 'Maintain a professional and healthy work environment',
  },
  {
    url: '/images/slider/cleaning-service-4.jpg',
    title: 'Residential Cleaning',
    description: 'Quality cleaning solutions for your home',
  },
  {
    url: '/images/slider/cleaning-service-5.jpg',
    title: 'Window Cleaning',
    description: 'Crystal clear windows for maximum visibility',
  },
]

const currentIndex = ref(0)
let intervalId: number | null = null
const isTransitioning = ref(false)

const nextSlide = () => {
  currentIndex.value++
  // If we've reached the clone of the first image
  if (currentIndex.value === images.length) {
    // Wait for the transition to complete
    setTimeout(() => {
      // Without transition, jump back to the real first image
      isTransitioning.value = true
      currentIndex.value = 0
      // Re-enable transitions
      setTimeout(() => {
        isTransitioning.value = false
      }, 50)
    }, 500)
  }
}

const prevSlide = () => {
  currentIndex.value--
  // If we've reached the clone of the last image
  if (currentIndex.value === -1) {
    // Wait for the transition to complete
    setTimeout(() => {
      // Without transition, jump back to the real last image
      isTransitioning.value = true
      currentIndex.value = images.length - 1
      // Re-enable transitions
      setTimeout(() => {
        isTransitioning.value = false
      }, 50)
    }, 500)
  }
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
  height: 600px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.slides-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slides-container.is-transitioning .slide {
  transition: none;
}

.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3rem;
  padding-left: 6rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  text-align: left;
}

.slide-content h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: left;
  font-weight: 700;
  color: #fff;
}

.slide-content p {
  font-size: 1.4rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  text-align: left;
  max-width: 600px;
  line-height: 1.5;
}

.slider-dots {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
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
  transition: all 0.3s ease;
}

.slider-dots button.active {
  background: white;
  transform: scale(1.2);
}

.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  transition: all 0.3s ease;
  z-index: 10;
}

.slider-arrow:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.prev {
  left: 2rem;
}

.next {
  right: 2rem;
}

@media (max-width: 768px) {
  .slider-container {
    height: 400px;
  }

  .slide-content {
    padding: 2rem;
    padding-left: 2rem;
  }

  .slide-content h2 {
    font-size: 2rem;
  }

  .slide-content p {
    font-size: 1.1rem;
  }

  .slider-arrow {
    width: 40px;
    height: 40px;
    font-size: 1.4rem;
  }

  .prev {
    left: 1rem;
  }

  .next {
    right: 1rem;
  }
}
</style>
