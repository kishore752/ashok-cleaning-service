<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
  </nav>

  <RouterView />
</template>

<style scoped>
nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  padding: 1rem 0;
  background-color: #f8f9fa;
}

nav a {
  color: #2c3e50;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: #e9ecef;
}

nav a.router-link-active {
  color: #42b983;
  font-weight: bold;
}
</style>
