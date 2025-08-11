<template>
  <SearchNetworkInput @selectNetwork="handleSelectedNetwork" />
  <div v-if="selectedNetwork && networkInfo.infoOverlappingNetworks" class="display-data-container">
    <h2>{{ selectedNetwork }}</h2>
    <div class="network-details-container">
      <h4>Type: {{ networkInfo.networkType }}</h4>
      <h4>Czy jest bezposrednio zdefiniowane w serwisie: {{ networkInfo.isInService }}</h4>
      <h4>Wszystkie powiązane sieci:</h4>
      <ul class="overlapping-networks-list">
        <li
          @click="handleClickAutocomplete(item.name)"
          v-for="(item, index) in sortedOverlappingNetworks"
          :key="index"
          class="autocomplete-itemff"
        >
          {{ item.name }} {{ item.status }}
        </li>
      </ul>
      <div class="inService-info-wrapper" v-if="networkInfo.isInService">
        <div class="inService-list-wrapper">
          <h6>Pod</h6>
          <ul>
            <li
              @click="handleClickAutocomplete(item.name)"
              v-for="(item, index) in networkInfo.serviceOverlappingNetworks.lowerPriority"
              :key="index"
              class="autocomplete-itemff"
            >
              {{ item.name }} {{ item.status }}
            </li>
          </ul>
        </div>
        <div class="inService-list-wrapper">
          <h6>Nad</h6>
          <ul>
            <li
              @click="handleClickAutocomplete(item.name)"
              v-for="(item, index) in networkInfo.serviceOverlappingNetworks.higherPriority"
              :key="index"
              class="autocomplete-itemff"
            >
              {{ item.name }} {{ item.status }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="domain-section-container" v-if="displayDomainSection">
      <div class="content">
        <h1>Weryfikacja domeny</h1>
        <button @click="openDomain" class="open-btn">Otwórz w nowej karcie</button>
        <div class="verify-box">
          <label>Typ serwera:</label>
          <select v-model="domainType">
            <option value="">-- Wybierz --</option>
            <option value="ISP">ISP</option>
            <option value="HOSTING">Hosting</option>
          </select>
        </div>
        <button
          :disabled="validateDomainVerificationSave"
          class="save-btn"
          @click="saveVerifications"
        >
          Zapisz weryfikacje
        </button>
      </div>
    </div>
    <div class="unblock-section-container">
      <h1>Reczne odblokowywanie z Azure/Cloudflare</h1>
      <button @click="handleManualUnblocking">CLICK</button>
    </div>
  </div>
</template>

<script setup>
import { checkServiceNetwork, searchNetwork } from '@/api/serviceApi'
import { computed, ref, watch } from 'vue'
import SearchNetworkInput from '@/components/searchNetworkInput/SearchNetworkInput.vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
const router = useRouter()
const globalStore = useGlobalStore()

const selectedNetwork = ref('')
const networkInfo = ref({})
const domainType = ref('')

const displayDomainSection = computed(() => {
  return networkInfo.value.networkType == 'domain'
})

watch(selectedNetwork, async (newValue) => {
  await checkServiceNetwork(newValue)
    .then((r) => {
      networkInfo.value = r.data
      if (r.data.networkType == 'domain') {
        if (r.data.providerType) {
          domainType.value = r.data.providerType
        }
      }
    })
    .catch((err) => console.log(err))
})

const saveVerifications = () => {
  console.log('saveVerifications')
}

const handleManualUnblocking = () => {
  globalStore.addManualUnblockNetwork(selectedNetwork.value)
  router.push('/manualUnblocking')
}

const handleSelectedNetwork = (networkName) => {
  selectedNetwork.value = networkName
}

const sortedOverlappingNetworks = computed(() => {
  return [...(networkInfo.value.infoOverlappingNetworks || [])]
    .sort((a, b) => a.name.localeCompare(b.name))
    .reverse()
})

const validateDomainVerificationSave = computed(() => {
  return domainType.value == networkInfo.value.providerType
})

function openDomain() {
  if (selectedNetwork.value) {
    window.open(`http://${selectedNetwork.value}`, '_blank')
  }
}

const handleClickAutocomplete = (netName) => {
  selectedNetwork.value = netName
}
</script>

<style>
.unblock-section-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.domain-section-container {
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

.save-btn {
  margin-top: 10px;
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

.save-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.verify-box {
  margin: 20px 0;
}

.verify-box select {
  padding: 5px;
  font-size: 1em;
  margin-left: 10px;
}

.open-btn:hover {
  background-color: #0056b3;
}
.inService-list-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.inService-info-wrapper {
  width: 380px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}
.overlapping-networks-list {
  max-height: 500px;
  min-width: 380px;
  overflow-y: scroll;
}

.network-details-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.display-data-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
