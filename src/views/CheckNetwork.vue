<template>
  <SearchNetworkInput @selectNetwork="handleSelectedNetwork" />
  <div v-if="selectedNetwork && networkInfo.infoOverlappingNetworks" class="display-data-container">
    <h2>{{ selectedNetwork }}</h2>
    <div class="network-details-container">
      <h4>Type: {{ networkInfo.networkType }}</h4>
      <h4 v-if="networkInfo.ipStatus">Ip status: {{ networkInfo.ipStatus }}</h4>
      <h4>Czy jest bezposrednio zdefiniowane w serwisie: {{ networkInfo.isInService }}</h4>
      <h4 v-if="overlappingIp.length">Wszystkie powiązane ip:</h4>
      <ul v-if="overlappingIp.length" class="overlapping-networks-list">
        <li
          @click="handleClickAutocomplete(item.name)"
          v-for="(item, index) in overlappingIp"
          :key="index"
          class="autocomplete-itemff"
        >
          {{ item.name }} {{ item.status }}
        </li>
      </ul>
      <h4 v-if="overlappingDomains.length">Wszystkie powiązane domeny:</h4>
      <ul v-if="overlappingDomains.length" class="overlapping-networks-list">
        <li
          @click="handleClickAutocomplete(item.name)"
          v-for="(item, index) in overlappingDomains"
          :key="index"
          class="autocomplete-itemff"
        >
          {{ item.name }} {{ item.status }}
        </li>
      </ul>
      <h4 v-if="overlappingAsn.length">Wszystkie powiązane asn:</h4>
      <ul v-if="overlappingAsn.length" class="overlapping-networks-list">
        <li
          @click="handleClickAutocomplete(item.name)"
          v-for="(item, index) in overlappingAsn"
          :key="index"
          class="autocomplete-itemff"
        >
          {{ item.name }} {{ item.status }}
        </li>
      </ul>
      <h4 v-if="networkInfo.isInService">Serwis:</h4>
      <div class="inService-info-wrapper" v-if="networkInfo.isInService">
        <div class="inService-list-wrapper">
          <h6>Pod</h6>
          <ul>
            <li
              @click="handleClickAutocomplete(item.name)"
              v-for="(item, index) in networkInfo.serviceOverlappingNetworks.lowerPriority"
              :key="index"
              class="autocomplete-itemff"
              :class="{
                blocked: item.status === 'block',
                disblocked: item.status === 'disblock',
              }"
            >
              <span class="status-dot"></span>
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
              :class="{
                blocked: item.status === 'block',
                disblocked: item.status === 'disblock',
              }"
            >
              <span class="status-dot"></span>

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
  <LoadingSpinner v-if="isLoading" />
</template>

<script setup>
import { checkServiceNetwork, searchNetwork } from '@/api/serviceApi'
import { computed, onMounted, ref, watch } from 'vue'
import SearchNetworkInput from '@/components/searchNetworkInput/SearchNetworkInput.vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import { getNetworkType } from '@/helpers/getNetworkType'
import { NETWORK_TYPE } from '@/helpers/constants'
import LoadingSpinner from '@/components/loadingSpinner/LoadingSpinner.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const globalStore = useGlobalStore()

const selectedNetwork = ref('')
const networkInfo = ref({})
const domainType = ref('')
const isLoading = ref(false)

const displayDomainSection = computed(() => {
  return networkInfo.value.networkType == 'domain'
})

onMounted(async () => {
  const networkToCheck = route?.query?.network
  if (networkToCheck) {
    selectedNetwork.value = networkToCheck
  }
})

watch(selectedNetwork, async (newValue) => {
  isLoading.value = true
  await checkServiceNetwork(newValue)
    .then((r) => {
      isLoading.value = false
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

const overlappingDomains = computed(() => {
  return [...(networkInfo.value.infoOverlappingNetworks || [])].filter((el) => {
    const type = getNetworkType(el.name)
    return type == NETWORK_TYPE.DOMAIN
  })
})

const overlappingAsn = computed(() => {
  return [...(networkInfo.value.infoOverlappingNetworks || [])].filter((el) => {
    const type = getNetworkType(el.name)
    return type == NETWORK_TYPE.ASN
  })
})

const overlappingIp = computed(() => {
  return [...(networkInfo.value.infoOverlappingNetworks || [])].filter((el) => {
    const type = getNetworkType(el.name)
    return type == NETWORK_TYPE.IPV4 || type == NETWORK_TYPE.IPV6
  })
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

<style scoped>
.unblock-section-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  list-style: none; /* bez kropek */
  padding: 0;
  margin: 0 0 20px 0;
  max-height: 500px;
  min-width: 380px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #1d2021;
  overflow-x: hidden;
}

.autocomplete-itemff {
  padding: 10px 14px;
  border-bottom: 1px solid #eaeaea;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.1s;
}

.autocomplete-itemff:last-child {
  border-bottom: none;
}

.autocomplete-itemff:hover {
  background-color: #3f4041;
  transform: translateX(2px);
  overflow: hidden;
}
.autocomplete-itemff {
  position: relative;
  padding-left: 24px; /* miejsce na kółeczko */
}

.status-dot {
  position: absolute;
  right: 0;
  top: 3px;
  bottom: 3px;
  /* transform: translateY(-50%); */
  width: 10px;
  border-radius: 4px;
}

.blocked .status-dot {
  background-color: #9f0e0e;
}

.disblocked .status-dot {
  background-color: #0062cc;
}

.network-details-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.network-details-container h4 {
  margin-top: 15px;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
  border-left: 4px solid #007bff;
  padding-left: 8px;
}

.inService-list-wrapper h6 {
  margin: 10px 0 6px;
  font-size: 0.95rem;
  color: #555;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
}

.inService-list-wrapper ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.inService-list-wrapper li {
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.inService-list-wrapper li:hover {
  background-color: #f7f7f7;
}

/* .overlapping-networks-list::-webkit-scrollbar {
  width: 8px;
}

.overlapping-networks-list::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 4px;
}

.overlapping-networks-list::-webkit-scrollbar-thumb:hover {
  background-color: #999;
} */

.display-data-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #121414;
}

.autocomplete-list {
  box-sizing: border-box; /* wlicza border i padding w szerokość */
  overflow-x: hidden;
}
</style>
