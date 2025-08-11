<template>
  <!-- <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header> -->
  <Navbar />
  <div class="view-container">
    <RouterView />
  </div>
</template>
<script setup>
import Navbar from './components/navbar/Navbar.vue'
</script>
<style scoped>
.view-container {
  margin-top: 60px;
  height: calc(100vh - 60px);
}
</style>
