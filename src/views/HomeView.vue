<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ImageSlider from '@/components/ImageSlider.vue'
import ContactForm from '@/components/ContactForm.vue'

const router = useRouter()
const showForm = ref(false)
const showSuccess = ref(false)

const handleFormSuccess = () => {
  showForm.value = false
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

const navigateToContact = () => {
  router.push('/contact')
}
</script>

<template>
  <main>
    <ImageSlider />
    <section class="hero">
      <div class="hero-content">
        <h1>Welcome to Ashok Cleaning Service</h1>
        <p>Professional cleaning services for your home and office</p>
        <button @click="navigateToContact" class="cta-button">Contact Us</button>
      </div>
    </section>

    <!-- Contact Form Modal -->
    <div v-if="showForm" class="modal-overlay" @click="showForm = false">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="showForm = false">&times;</button>
        <ContactForm @success="handleFormSuccess" />
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccess" class="success-message">Thank you! We will contact you soon.</div>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
}

.hero {
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  width: 100vw;
  margin: 0;
  position: relative;
  left: 0;
  right: 0;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero h1 {
  font-size: 2.5rem;
  color: #1b5e20;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.hero p {
  font-size: 1.2rem;
  color: #2e7d32;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: #1b5e20;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  background: #2e7d32;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  line-height: 1;
}

.close-button:hover {
  color: #1b5e20;
}

/* Success Message Styles */
.success-message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #1b5e20;
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .success-message {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    text-align: center;
  }
}
</style>
