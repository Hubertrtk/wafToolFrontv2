<template>
  <div class="toast-container">
    <div v-for="toast in toastStore.toasts" :key="toast.id" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toastStore'

const toastStore = useToastStore()
</script>

<style>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 9999;
}

.toast {
  padding: 10px 16px;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  min-width: 200px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  animation:
    fadeIn 0.3s ease,
    fadeOut 0.3s ease 2.7s;
}

/* Typy toastów */
.toast.success {
  background-color: #4caf50; /* zielony */
}

.toast.error {
  background-color: #f44336; /* czerwony */
}

.toast.warning {
  background-color: #ff9800; /* pomarańczowy */
  color: #000;
}

/* Animacje */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>
