<template>
  <Navbar v-if="route.name !== 'login'" />
  <div class="view-container">
    <RouterView />
  </div>
</template>

<script setup>
import Navbar from './components/navbar/Navbar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.view-container {
  margin-top: 60px;
  height: calc(100vh - 60px);
}
</style>
