<template>
  <header class="header">
    <div class="header-content">
      <CompanyLogo />
      <nav class="nav-desktop">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/services" class="nav-link">Services</RouterLink>
        <RouterLink to="/about" class="nav-link">About</RouterLink>
        <RouterLink to="/contact" class="nav-link">Contact</RouterLink>
      </nav>
      <div class="mobile-menu">
        <button class="menu-button" @click="toggleMenu">
          <span class="selected-option">{{ selectedOption }}</span>
          <span class="arrow">▼</span>
        </button>
        <div v-if="isMenuOpen" class="dropdown-menu">
          <RouterLink to="/" class="dropdown-item" @click="selectOption('Home')">Home</RouterLink>
          <RouterLink to="/about" class="dropdown-item" @click="selectOption('About')"
            >About</RouterLink
          >
          <RouterLink to="/contact" class="dropdown-item" @click="selectOption('Contact')"
            >Contact</RouterLink
          >
          <div class="services-dropdown">
            <div class="services-header" @click="selectOption('Services')">Services</div>
            <div class="services-list">
              <RouterLink
                v-for="service in services"
                :key="service"
                to="/services"
                class="service-item"
                @click="selectOption(service)"
              >
                {{ service }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import CompanyLogo from './CompanyLogo.vue'

const isMenuOpen = ref(false)
const selectedOption = ref('Services')

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const selectOption = (option: string) => {
  selectedOption.value = option
  isMenuOpen.value = false
}

const services = [
  'Residential Cleaning',
  'Office Cleaning',
  'Deep Cleaning',
  'Post-Construction Cleaning',
  'Carpet Cleaning',
  'Window Cleaning',
]
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  height: 50px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.nav-desktop {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.mobile-menu {
  display: none;
  position: relative;
}

.menu-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #2e7d32;
  border-radius: 4px;
  color: #2e7d32;
  font-weight: 600;
  cursor: pointer;
}

.selected-option {
  font-size: 1rem;
}

.arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #2e7d32;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
}

.dropdown-item {
  display: block;
  padding: 12px 16px;
  color: #2e7d32;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.services-dropdown {
  border-top: 1px solid #eee;
}

.services-header {
  padding: 12px 16px;
  color: #2e7d32;
  font-weight: 600;
  cursor: pointer;
}

.services-list {
  background-color: #f9f9f9;
}

.service-item {
  display: block;
  padding: 8px 16px 8px 32px;
  color: #2e7d32;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.service-item:hover {
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .nav-desktop {
    display: none;
  }

  .mobile-menu {
    display: block;
  }
}
</style>
