<template>
  <div class="container">
    <header class="top-panel">
      <h1>Playlive</h1>
      <div class="controls">
        <SearchNetworkInput />
        <select v-model="selectedStatus">
          <option value="block">BLOCK</option>
          <option value="disblock">DISBLOCK</option>
        </select>
        <label class="checkbox-label">
          <input type="checkbox" v-model="highPriority" />
          High priority
        </label>
        <button @click="addNetworkToHandle">+</button>
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
import SearchNetworkInput from '@/components/searchNetworkInput/SearchNetworkInput.vue'
import { ref, computed } from 'vue'

const networks = ref({
  AS16276: {
    lowerPriority: [],
    higherPriority: ['ovh.net'],
    utb: true,
    status: 'block',
  },
  'ovh.net': {
    lowerPriority: ['AS16276', 'AS35540'],
    higherPriority: [],
    utb: true,
    status: 'disblock',
  },
  AS14618: {
    lowerPriority: [],
    higherPriority: [],
    utb: true,
    status: 'block',
  },
  AS21003: {
    lowerPriority: [],
    higherPriority: [],
    utb: true,
    status: 'block',
  },
  AS21334: {
    lowerPriority: [],
    higherPriority: [],
    utb: true,
    status: 'block',
  },
  AS16509: {
    lowerPriority: [],
    higherPriority: [],
    utb: true,
    status: 'block',
  },
  AS24940: {
    lowerPriority: [],
    higherPriority: [],
    utb: true,
    status: 'block',
  },
})

const networksToHandle = ref(['AS16276', 'AS14618'])
const newNetwork = ref('')
const selectedStatus = ref('block')
const highPriority = ref(false)

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

function handleNetworks() {
  // Tu będzie wywołanie backendu
  console.log('Handling networks:', {
    networksToHandle: networksToHandle.value,
    selectedStatus: selectedStatus.value,
    highPriority: highPriority.value,
  })
}
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-gap: 20px;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #222;
  background: #f9f9f9;
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
}

.top-panel h1 {
  flex: 1 1 100%;
  margin: 0 0 8px 0;
  font-weight: 700;
  font-size: 1.8rem;
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
  min-width: 180px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.controls input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 4px #3b82f6;
}

.controls select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
  font-size: 1rem;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  user-select: none;
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
}

.networks-to-handle h2 {
  margin-top: 0;
  font-weight: 700;
  font-size: 1.3rem;
  margin-bottom: 12px;
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
  background: #dbeafe;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 0.9rem;
  user-select: none;
}

.lists {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.blocked,
.disblocked {
  background: white;
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
}

.blocked ul,
.disblocked ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 300px;
}

.blocked li,
.disblocked li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-bottom: 1px solid #eee;
  font-size: 1rem;
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
  background: #dbeafe;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 0.9rem;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
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
