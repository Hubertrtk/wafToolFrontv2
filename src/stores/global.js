// src/stores/configStore.js
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    manualUnblockNetworks: [],
  }),
  actions: {
    addManualUnblockNetwork(network) {
      this.manualUnblockNetworks.push(network)
    },
    getManualUnblockNetworks() {
      return this.manualUnblockNetworks
    },
  },
})
