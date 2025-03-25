<template>
  <div class="logo-container">
    <div class="logo">
      <div class="logo-text">ACS</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for now
</script>

<style scoped>
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.logo-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.logo {
  width: 200px;
  height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.logo-text {
  font-family: 'Poppins', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2e7d32;
  text-align: center;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .logo {
    width: 150px;
    height: 150px;
  }

  .logo-text {
    font-size: 2rem;
  }
}
</style>
