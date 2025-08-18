// src/stores/toastStore.js
import { defineStore } from 'pinia'

let id = 0

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [], // { id, message, type }
  }),
  actions: {
    addToast(message, type = 'success', duration = 3000) {
      id++
      const toast = { id, message, type }
      this.toasts.push(toast)

      // Auto-usuwanie po czasie
      setTimeout(() => {
        this.removeToast(toast.id)
      }, duration)
    },
    removeToast(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },
  },
})
