<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/organisms/TheHeader.vue'
import TheFooter from './components/organisms/TheFooter.vue'
</script>

<template>
  <div class="app-container">
    <TheHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.main-content {
  flex: 1;
  width: 100%;
}
</style>
