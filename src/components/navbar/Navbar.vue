<template>
  <header class="navbar">
    <div class="container">
      <div class="brand">Playlive</div>
      <nav class="nav-links" :class="{ open: isOpen }">
        <a href="#">
          <RouterLink to="/checkNetwork">checkNetwork</RouterLink>
        </a>
        <a href="#">
          <RouterLink to="/manualUnblocking">manualUnblocking</RouterLink>
        </a>
        <a href="#">
          <RouterLink to="/domains">domains</RouterLink>
        </a>
        <a href="#">
          <RouterLink to="/serviceManagment">serviceManagment</RouterLink>
        </a>
        <a href="#">
          <RouterLink to="/login">login</RouterLink>
        </a>
      </nav>
      <button class="hamburger" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const isOpen = ref(false)
function toggleMenu() {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 60px;
}
.brand {
  font-weight: bold;
  font-size: 1.2rem;
}
.nav-links {
  display: flex;
  gap: 1rem;
}
.nav-links a {
  text-decoration: none;
  color: black;
  font-size: 0.95rem;
}
.hamburger {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
}
.hamburger span {
  width: 25px;
  height: 3px;
  background: black;
}
@media (max-width: 768px) {
  .nav-links {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    display: none;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .nav-links.open {
    display: flex;
  }
  .hamburger {
    display: flex;
  }
}
</style>
