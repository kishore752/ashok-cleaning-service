<template>
  <header class="header">
    <div class="header-content">
      <CompanyLogo class="logo" />
      <nav class="navigation">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/services" class="nav-link">Services</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
        <router-link to="/contact" class="nav-link">Contact</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import CompanyLogo from './CompanyLogo.vue'
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

.navigation {
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

@media (max-width: 768px) {
  .navigation {
    gap: 1rem;
  }

  .nav-link {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
