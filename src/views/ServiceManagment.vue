<template>
  <div class="container">
    <header class="top-panel">
      <h1>Playlive</h1>
      <div class="controls">
        <SearchNetworkInput @selectNetwork="handleSelectedNetwork" />
        <select v-model="selectedStatus">
          <option value="block">BLOCK</option>
          <option value="disblock">DISBLOCK</option>
          <option value="remove">REMOVE</option>
        </select>
        <label class="checkbox-label">
          High priority:
          <input type="checkbox" v-model="highPriority" />
        </label>
        <button @click="handleNetworks">Handle</button>
      </div>
    </header>

    <section class="networks-to-handle">
      <h2>Networks To Handle</h2>
      <ul>
        <li v-for="(el, idx) in networksToHandle" :key="idx">
          {{ el }}
          <button class="remove-btn" @click="removeFromHandle(el)">×</button>
        </li>
      </ul>
    </section>

    <section class="lists">
      <div class="blocked">
        <h2>Blokowane</h2>
        <ul>
          <li v-for="(el, idx) in blockedNetworks" :key="idx">
            {{ el }}
            <button class="add-btn" @click="addToHandle(el)">+</button>
          </li>
        </ul>
      </div>
      <div class="disblocked">
        <h2>Odblokowane</h2>
        <ul>
          <li v-for="(el, idx) in disBlockedNetworks" :key="idx">
            {{ el }}
            <button class="add-btn" @click="addToHandle(el)">+</button>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { getGlobalBlockAzureNetworks, globalBlockAzureNetworks } from '@/api/serviceApi'
import SearchNetworkInput from '@/components/searchNetworkInput/SearchNetworkInput.vue'
import { ref, computed, onMounted } from 'vue'

const networks = ref({})

const networksToHandle = ref([])
const newNetwork = ref('')
const selectedStatus = ref('block')
const highPriority = ref(false)

onMounted(async () => {
  await getGlobalBlockAzureNetworks().then((r) => {
    networks.value = r.data
  })
})

const handleSelectedNetwork = (networkName) => {
  if (!networksToHandle.value.includes(networkName)) {
    networksToHandle.value.push(networkName)
  }
}

const blockedNetworks = computed(() =>
  Object.entries(networks.value)
    .filter(([, data]) => data.status === 'block')
    .map(([name]) => name),
)

const disBlockedNetworks = computed(() =>
  Object.entries(networks.value)
    .filter(([, data]) => data.status === 'disblock')
    .map(([name]) => name),
)

function addNetworkToHandle() {
  const net = newNetwork.value.trim()
  if (net && !networksToHandle.value.includes(net)) {
    networksToHandle.value.push(net)
  }
  newNetwork.value = ''
}

function addToHandle(networkName) {
  if (!networksToHandle.value.includes(networkName)) {
    networksToHandle.value.push(networkName)
  }
}

function removeFromHandle(networkName) {
  networksToHandle.value = networksToHandle.value.filter((n) => n !== networkName)
}

async function handleNetworks() {
  // Tu będzie wywołanie backendu
  console.log('Handling networks:', {
    networksToHandle: networksToHandle.value,
    selectedStatus: selectedStatus.value,
    highPriority: highPriority.value,
  })
  let reqData = networksToHandle.value.map((el) => {
    let network = {}
    network.priority = highPriority.value ? 'higher_priority' : 'lower_priority'
    network.status = selectedStatus.value
    network.network = el
    return network
  })
  await globalBlockAzureNetworks(reqData)
    .then(async (r) => {
      networksToHandle.value = []
      await getGlobalBlockAzureNetworks().then((r) => {
        networks.value = r.data
      })
    })
    .catch((r) => {
      console.log(r)
    })
}
</script>
<style scoped>
::-webkit-scrollbar-track {
  background: #c52525;
}

/* Suwak (thumb) */
::-webkit-scrollbar-thumb {
  background: #db1414;
  border-radius: 6px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-gap: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #222;
  background: #1b1e1f;
  height: 100%;
}

.top-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgb(0 0 0 / 0.1);
  background-color: #181a1b;
}

.top-panel h1 {
  flex: 1 1 100%;
  margin: 0 0 8px 0;
  font-weight: 700;
  font-size: 1.8rem;
  color: #d3cfc9;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.controls input {
  flex-grow: 1;
  min-width: 40px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  /* margin-left: -60px; */
}

.controls input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 4px #3b82f6;
}

.controls select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #1f2222;
  font-size: 1rem;
  cursor: pointer;
  background-color: #181818;
  color: #d3cfc9;
}

.checkbox-label {
  display: flex;
  align-items: center;
  /* gap: 6px; */
  justify-content: flex-start;
  font-size: 0.9rem;
  user-select: none;
  color: #d3cfc9;
}

.controls button {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.controls button:hover {
  background: #2563eb;
}

.networks-to-handle {
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgb(0 0 0 / 0.1);
  background-color: #181a1b;
}

.networks-to-handle h2 {
  margin-top: 0;
  font-weight: 700;
  font-size: 1.3rem;
  margin-bottom: 12px;
  color: #d3cfc9;
}

.networks-to-handle ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background-color: #181a1b;
}

.networks-to-handle li {
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 0.9rem;
  user-select: none;
  background-color: #181a1b;
}

.lists {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  background-color: #181a1b;
}

.blocked,
.disblocked {
  background-color: #181a1b;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
}

.blocked h2,
.disblocked h2 {
  margin-top: 0;
  font-weight: 700;
  font-size: 1.3rem;
  margin-bottom: 12px;
  color: #d3cfc9;
}

.blocked ul,
.disblocked ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 45vh;
}

.blocked li,
.disblocked li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-bottom: 1px solid #1f2222;
  font-size: 1rem;
  color: #d3cfc9;
}

.add-btn {
  background: #10b981;
  border: none;
  color: white;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.add-btn:hover {
  background: #059669;
}

@media (max-width: 768px) {
  .lists {
    grid-template-columns: 1fr;
  }
  .networks-to-handle ul {
    justify-content: flex-start;
  }
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  .controls input {
    width: 100%;
  }
}

.networks-to-handle ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.networks-to-handle li {
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 0.9rem;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #1b1e1f;
  color: #d3cfc9;
}

.remove-btn {
  background: #ef4444; /* czerwony */
  border: none;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-weight: 700;
  cursor: pointer;
  line-height: 18px;
  text-align: center;
  padding: 0;
  transition: background-color 0.2s ease;
}

.remove-btn:hover {
  background: #b91c1c;
}
</style>
