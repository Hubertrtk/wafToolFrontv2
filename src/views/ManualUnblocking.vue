<template>
  <div class="container">
    <SearchNetworkInput @selectNetwork="handleSelectedNetwork" />

    <!-- Lista sieci do odblokowania -->
    <div class="card">
      <h2>Networks to Unblock</h2>
      <ul class="network-list">
        <li v-for="(item, index) in networksToUnblock" :key="index" class="network-item">
          <span>{{ item }}</span>
          <button class="remove-btn" @click="removeNetwork(index)">×</button>
        </li>
      </ul>
    </div>
    <button @click="handleGetNetworksButton" class="get-networks-button">GET</button>
    <!-- Dane z response -->
    <div v-if="response" class="card">
      <h2>Azure delete:</h2>
      <ul>
        <li v-for="(ips, key) in response.azure.toDelete" :key="key">
          <strong>{{ key }}:</strong> {{ ips.join(', ') }}
        </li>
      </ul>

      <h2>Azure to add:</h2>
      <ul>
        <li v-for="(ip, idx) in response.azure.toAdd" :key="idx">
          {{ ip }}
        </li>
      </ul>

      <h2>Cloudflare:</h2>
      <p class="cloudflare-list">{{ response.cloudflare }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { manualUnblocking } from '@/api/serviceApi'
import SearchNetworkInput from '@/components/searchNetworkInput/SearchNetworkInput.vue'
import { useGlobalStore } from '@/stores/global'
import { onMounted, ref } from 'vue'

const networksToUnblock = ref([])
const globalStore = useGlobalStore()

onMounted(() => {
  const nets = globalStore.getManualUnblockNetworks()
  networksToUnblock.value.push(...nets)
})

const handleSelectedNetwork = (networkName) => {
  if (!networksToUnblock.value.includes(networkName)) {
    networksToUnblock.value.push(networkName)
  }
}

const handleGetNetworksButton = async () => {
  manualUnblocking(networksToUnblock.value).then((res) => {
    response.value = res.data
  })
}

const response = ref(false)

const removeNetwork = (index: number) => {
  networksToUnblock.value.splice(index, 1)
}
</script>
<style scoped>
.get-networks-button {
  width: 300px;
  height: 50px;
  margin: auto;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
.get-networks-button:hover {
  background-color: #333;
  transition: 200ms;
}
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1rem 1.5rem;
}

h2 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.25rem;
  color: #333;
}

.network-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.network-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.8rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: background 0.2s ease;
}

.network-item:hover {
  background: #eef2f7;
}

.remove-btn {
  background: #ff4d4f;
  border: none;
  color: white;
  font-size: 1.1rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
}

.remove-btn:hover {
  background: #d9363e;
}

.cloudflare-list {
  word-break: break-all;
  background: #f9fafb;
  padding: 0.5rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .container {
    padding: 0.5rem;
  }

  h2 {
    font-size: 1rem;
  }
}
</style>
