<template>
  <div id="app">
    <h1>{{ message }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const message = ref('Loading...')

onMounted(async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/')
    const data = await response.json()
    message.value = data.message
  } catch (error) {
    message.value = 'Failed to fetch from backend'
  }
})
</script>
