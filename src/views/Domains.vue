<template>
  <div class="container">
    <aside class="sidebar">
      <h2>Lista domen</h2>
      <ul>
        <li
          v-for="(domain, index) in domains"
          :key="index"
          :class="[
            { active: selectedDomain === domain },
            domainTypes[domain], // dodaje klasę 'isp' lub 'hosting' jeśli istnieje
          ]"
          @click="selectDomain(domain)"
        >
          {{ domain }}
        </li>
      </ul>
    </aside>

    <main class="content" v-if="selectedDomain">
      <h1>Weryfikacja domeny</h1>
      <p><strong>Domena:</strong> {{ selectedDomain }}</p>
      <button @click="openDomain" class="open-btn">Otwórz w nowej karcie</button>

      <div class="verify-box">
        <label>Typ serwera:</label>
        <select v-model="domainTypes[selectedDomain]">
          <option value="">-- Wybierz --</option>
          <option value="isp">ISP</option>
          <option value="hosting">Hosting</option>
        </select>
      </div>

      <div class="status">
        <p>
          Status: <strong>{{ domainTypes[selectedDomain] || 'Niezweryfikowana' }}</strong>
        </p>
      </div>
      <button class="save-btn" @click="saveVerifications">Zapisz weryfikacje</button>
    </main>
  </div>
</template>

<script setup>
import { domainIdentification, getUnidentifiedDomains } from '@/api/serviceApi'
import { ref, onMounted } from 'vue'

async function saveVerifications() {
  let reqData = []
  for (const [domainName, domainType] of Object.entries(domainTypes.value)) {
    if (domainType) {
      reqData.push({ name: domainName, providerType: domainType.toUpperCase() })
    }
  }
  await domainIdentification(reqData).catch((err) => console.log(err))
}

// symulacja pobierania z backendu
async function handleGetUndefinedDomains() {
  let data
  await getUnidentifiedDomains().then((r) => {
    data = r
  })
  return data.data
}

const domains = ref([])
const selectedDomain = ref(null)
const domainTypes = ref({})

onMounted(async () => {
  domains.value = await handleGetUndefinedDomains()
})

function selectDomain(domain) {
  selectedDomain.value = domain
}

function openDomain() {
  if (selectedDomain.value) {
    window.open(`http://${selectedDomain.value}`, '_blank')
  }
}
</script>

<style scoped>
.save-btn {
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
}

.save-btn:hover {
  background-color: #218838;
}

.sidebar li.verified {
  background-color: #d4edda; /* jasny zielony */
  color: #155724;
  font-weight: bold;
}

.sidebar li.isp {
  background-color: #cce5ff; /* jasnoniebieski */
  color: #004085;
  font-weight: bold;
}

.sidebar li.hosting {
  background-color: #d4edda; /* jasnozielony */
  color: #155724;
  font-weight: bold;
}

.container {
  display: flex;
  height: 100%; /* <--- ważne! Ustawiamy całą wysokość okna */
  overflow: hidden; /* zapobiega przewijaniu całej strony */
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 250px;
  background: #f4f4f4;
  padding: 20px;
  border-right: 1px solid #ddd;
  overflow-y: auto; /* <--- to dodaje scroll tylko w sidebarze */
  height: 100%;
}

.sidebar h2 {
  margin-top: 0;
  font-size: 1.2em;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 5px;
  transition: background 0.3s;
}

.sidebar li:hover {
  background-color: #e0e0e0;
}

.sidebar li.active {
  background-color: #007bff;
  color: white;
}

.content {
  flex: 1;
  padding: 30px;
}

.open-btn {
  margin: 10px 0;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.open-btn:hover {
  background-color: #0056b3;
}

.verify-box {
  margin: 20px 0;
}

.verify-box select {
  padding: 5px;
  font-size: 1em;
}

.status {
  margin-top: 20px;
  font-size: 1.1em;
  color: #333;
}

/* Responsywność */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }

  .content {
    padding: 20px;
  }
}
</style>
