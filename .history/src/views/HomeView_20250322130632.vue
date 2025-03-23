<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <div class="home-container">
    <header class="header">
      <h1>Ashok Cleaning Services</h1>
    </header>

    <main class="main-content">
      <!-- Main content will go here -->
    </main>

    <footer class="footer">
      <p>&copy; 2024 Ashok Cleaning Services. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.footer {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
}
</style>
