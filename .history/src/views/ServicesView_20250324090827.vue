<template>
  <div class="services-view">
    <h1 class="services-title">Our Services</h1>
    <div class="services-container">
      <div v-for="service in services" :key="service.id" :id="service.id" class="service-section">
        <div class="service-content">
          <div class="service-text">
            <h2>{{ service.title }}</h2>
            <p>{{ service.description }}</p>
            <ul class="service-features">
              <li v-for="feature in service.features" :key="feature">{{ feature }}</li>
            </ul>
            <button class="quote-button" @click="scrollToContact">Get a Quote</button>
          </div>
          <div class="service-image">
            <img :src="service.image" :alt="service.title" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const services = [
  {
    id: 'residential-cleaning',
    title: 'Residential Cleaning',
    description:
      'Professional home cleaning services tailored to your needs. We ensure your living space is spotless and comfortable.',
    features: [
      'Regular house cleaning',
      'Kitchen and bathroom deep cleaning',
      'Dusting and vacuuming',
      'Floor mopping and polishing',
      'Window cleaning',
      'Custom cleaning schedules',
    ],
    image: '/images/residential-cleaning.jpg',
  },
  {
    id: 'office-cleaning',
    title: 'Office Cleaning',
    description:
      'Maintain a professional and healthy work environment with our comprehensive office cleaning services.',
    features: [
      'Daily office cleaning',
      'Desk and workspace sanitization',
      'Restroom maintenance',
      'Floor care and maintenance',
      'Trash removal',
      'Flexible scheduling options',
    ],
    image: '/images/office-cleaning.jpg',
  },
  {
    id: 'deep-cleaning',
    title: 'Deep Cleaning',
    description:
      'Thorough cleaning service that reaches every corner of your space, perfect for spring cleaning or special occasions.',
    features: [
      'Detailed room cleaning',
      'Appliance cleaning',
      'Cabinet and drawer cleaning',
      'Baseboard and trim cleaning',
      'Window track cleaning',
      'Grout cleaning',
    ],
    image: '/images/deep-cleaning.jpg',
  },
  {
    id: 'post-construction',
    title: 'Post-Construction Cleaning',
    description:
      'Specialized cleaning service to remove construction debris and prepare your space for use.',
    features: [
      'Construction debris removal',
      'Dust and particle cleanup',
      'Surface cleaning',
      'Window cleaning',
      'Floor cleaning',
      'Final inspection',
    ],
    image: '/images/post-construction.jpg',
  },
  {
    id: 'carpet-cleaning',
    title: 'Carpet Cleaning',
    description:
      'Professional carpet cleaning service to remove stains, dirt, and allergens from your carpets.',
    features: [
      'Deep carpet cleaning',
      'Stain removal',
      'Deodorizing',
      'Allergen removal',
      'Spot treatment',
      'Regular maintenance',
    ],
    image: '/images/carpet-cleaning.jpg',
  },
  {
    id: 'window-cleaning',
    title: 'Window Cleaning',
    description:
      'Crystal clear windows with our professional window cleaning service, both interior and exterior.',
    features: [
      'Interior window cleaning',
      'Exterior window cleaning',
      'Window frame cleaning',
      'Screen cleaning',
      'High-rise window cleaning',
      'Regular maintenance',
    ],
    image: '/images/window-cleaning.jpg',
  },
]

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
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
  const sectionId = route.hash.replace('#', '')
  if (sectionId) {
    setTimeout(() => scrollToSection(sectionId), 100)
  }
})

onUnmounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.services-view {
  padding: 2rem 0;
  background-color: #f9f9f9;
}

.services-title {
  text-align: center;
  color: #2e7d32;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  font-weight: 700;
}

.services-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.service-section {
  margin-bottom: 4rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.service-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.service-text {
  flex: 1;
}

.service-text h2 {
  color: #2e7d32;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.service-text p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.service-features {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
}

.service-features li {
  color: #555;
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.service-features li::before {
  content: '✓';
  color: #2e7d32;
  position: absolute;
  left: 0;
}

.service-image {
  flex: 1;
  max-width: 500px;
}

.service-image img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quote-button {
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quote-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(46, 125, 50, 0.2);
}

@media (max-width: 768px) {
  .service-content {
    flex-direction: column;
    padding: 1.5rem;
  }

  .service-image {
    max-width: 100%;
  }

  .services-title {
    font-size: 2rem;
  }

  .service-text h2 {
    font-size: 1.5rem;
  }
}
</style>
