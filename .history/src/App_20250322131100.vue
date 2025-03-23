<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header class="header">
      <div class="header-content">
        <h1>Ashok Cleaning Services</h1>
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Ashok Cleaning Services. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.header {
  width: 100%;
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header h1 {
  margin: 0;
  font-size: 1.8rem;
  text-align: center;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.footer {
  width: 100%;
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.5rem;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>
