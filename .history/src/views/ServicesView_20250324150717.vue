<template>
  <div class="services-view">
    <div class="services-hero">
      <h1 class="services-title">Our Professional Cleaning Services</h1>
      <p class="services-subtitle">Quality cleaning solutions for your home and business</p>
    </div>
    <div class="services-container">
      <div
        v-for="(service, index) in services"
        :key="service.id"
        :id="service.id"
        class="service-section"
      >
        <div class="service-content" :class="{ reverse: index % 2 === 0 }">
          <div class="service-text">
            <h2>{{ service.title }}</h2>
            <p class="service-description">{{ service.description }}</p>
            <div class="service-features">
              <h3>What's Included:</h3>
              <ul>
                <li v-for="feature in service.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>
            <div class="service-cta">
              <button class="quote-button" @click="scrollToContact">Get a Free Quote</button>
              <p class="service-price">Starting from {{ service.price }}</p>
            </div>
          </div>
          <div class="service-image">
            <div class="image-placeholder">
              <span class="placeholder-text">{{ service.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const services = [
  {
    id: 'residential-cleaning',
    title: 'Residential Cleaning',
    description:
      'Our residential cleaning service provides a thorough and professional cleaning solution for your home. We use eco-friendly products and pay attention to every detail to ensure your home is spotless and healthy.',
    features: [
      'Regular house cleaning',
      'Kitchen and bathroom deep cleaning',
      'Dusting and vacuuming',
      'Floor mopping and cleaning',
      'Window cleaning',
      'Trash removal',
    ],
    price: 'Starting from $25/hour',
  },
  {
    id: 'office-cleaning',
    title: 'Office Cleaning',
    description:
      "Maintain a professional and healthy work environment with our comprehensive office cleaning services. We help create a productive workspace that reflects your company's professional image.",
    features: [
      'Daily office cleaning and maintenance',
      'Desk and workspace sanitization',
      'Restroom cleaning and sanitization',
      'Floor care and maintenance',
      'Trash removal and recycling',
      'Window cleaning (interior)',
      'Kitchen/break room cleaning',
      'Flexible scheduling options',
    ],
    price: '$30/hour',
  },
  {
    id: 'deep-cleaning',
    title: 'Deep Cleaning',
    description:
      'Our deep cleaning service is perfect for thorough cleaning of your space. We reach every corner and clean areas that are often overlooked in regular cleaning.',
    features: [
      'Detailed room-by-room cleaning',
      'Appliance cleaning (inside and out)',
      'Cabinet and drawer cleaning',
      'Baseboard and trim cleaning',
      'Window track cleaning',
      'Grout cleaning',
      'Light fixture cleaning',
      'Air vent cleaning',
    ],
    price: '$35/hour',
  },
  {
    id: 'post-construction',
    title: 'Post-Construction Cleaning',
    description:
      'Specialized cleaning service to remove construction debris and prepare your space for use. We ensure your newly renovated or constructed space is spotless and ready for occupancy.',
    features: [
      'Construction debris removal',
      'Dust and particle cleanup',
      'Surface cleaning and polishing',
      'Window cleaning (interior and exterior)',
      'Floor cleaning and sealing',
      'Final inspection and touch-ups',
      'Air quality improvement',
      'Waste disposal',
    ],
    price: '$40/hour',
  },
  {
    id: 'carpet-cleaning',
    title: 'Carpet Cleaning',
    description:
      'Professional carpet cleaning service to remove stains, dirt, and allergens from your carpets. We use eco-friendly products and advanced cleaning techniques for the best results.',
    features: [
      'Deep carpet cleaning',
      'Stain removal and treatment',
      'Deodorizing and sanitization',
      'Allergen removal',
      'Spot treatment',
      'Regular maintenance programs',
      'Pet stain removal',
      'Carpet protection treatment',
    ],
    price: '$0.25/sq ft',
  },
  {
    id: 'window-cleaning',
    title: 'Window Cleaning',
    description:
      'Crystal clear windows with our professional window cleaning service. We clean both interior and exterior windows, ensuring maximum visibility and curb appeal.',
    features: [
      'Interior window cleaning',
      'Exterior window cleaning',
      'Window frame cleaning',
      'Screen cleaning',
      'High-rise window cleaning',
      'Regular maintenance programs',
      'Hard water stain removal',
      'Window track cleaning',
    ],
    price: '$5/window',
  },
]

const scrollToService = (serviceId: string) => {
  const element = document.getElementById(serviceId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const scrollToContact = () => {
  const contactSection = document.getElementById('contact')
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  const hash = route.hash.replace('#', '')
  if (hash) {
    setTimeout(() => scrollToService(hash), 100)
  }
})

onUpdated(() => {
  const hash = route.hash.replace('#', '')
  if (hash) {
    setTimeout(() => scrollToService(hash), 100)
  }
})
</script>

<style scoped>
.services-view {
  background-color: #f9f9f9;
  min-height: 100vh;
}

.services-hero {
  background:
    linear-gradient(rgba(46, 125, 50, 0.7), rgba(46, 125, 50, 0.85)),
    url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 2.5rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.services-title {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.services-subtitle {
  font-size: 1.1rem;
  opacity: 0.95;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

.services-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.service-section {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.service-section.reverse {
  flex-direction: row-reverse;
}

.service-content {
  flex: 1;
  padding: 1rem;
}

.service-image {
  flex: 1;
  padding: 1rem;
}

.service-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.service-title {
  color: #2e7d32;
  font-size: 1.75rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.service-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.service-features {
  list-style: none;
  margin-bottom: 1.5rem;
}

.service-features li {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #555;
}

.service-features i {
  color: #2e7d32;
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.service-price {
  font-size: 1.25rem;
  color: #2e7d32;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.service-cta {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #2e7d32;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.service-cta:hover {
  background-color: #1b5e20;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(46, 125, 50, 0.2);
}

.image-placeholder {
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.placeholder-text {
  color: #2e7d32;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  padding: 1rem;
}

@media (max-width: 768px) {
  .services-hero {
    padding: 1.25rem 1rem;
  }

  .services-title {
    font-size: 1.5rem;
  }

  .services-subtitle {
    font-size: 0.9rem;
  }

  .service-section {
    padding: 1.5rem;
  }

  .service-content {
    flex-direction: column;
    gap: 2rem;
  }

  .service-content.reverse {
    flex-direction: column;
  }

  .service-image {
    max-width: 100%;
  }

  .image-placeholder {
    height: 250px;
  }

  .service-text h2 {
    font-size: 1.8rem;
  }

  .service-features ul {
    grid-template-columns: 1fr;
  }

  .service-cta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
