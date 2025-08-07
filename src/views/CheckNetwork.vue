<template>
  <div class="autocomplete-container">
    <input
      type="text"
      v-model="query"
      placeholder="Wpisz minimum 3 litery..."
      class="autocomplete-input"
    />
    <ul v-if="suggestions.length > 0" class="autocomplete-list">
      <li
        @click="handleClickAutocomplete(item)"
        v-for="(item, index) in suggestions"
        :key="index"
        class="autocomplete-item"
      >
        {{ item }}
      </li>
    </ul>
  </div>
  <div v-if="selectedNetwork" class="display-data-container">
    <h2>{{ selectedNetwork }}</h2>
    <div class="network-details-container">
      <h4>Type: {{ networkInfo.networkType }}</h4>
      <h4>Czy jest bezposrednio zdefiniowane w serwisie: {{ networkInfo.isInService }}</h4>
      <h4>Wszystkie powiązane sieci:</h4>
      <ul class="overlapping-networks-list">
        <li
          @click="handleClickAutocomplete(item.name)"
          v-for="(item, index) in networkInfo.infoOverlappingNetworks.sort().reverse()"
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
  </div>
</template>

<script setup>
import { checkServiceNetwork, searchNetwork } from '@/api/serviceApi'
import { ref, watch } from 'vue'

const query = ref('')
const suggestions = ref([])
const selectedNetwork = ref('')
const networkInfo = ref({})
let debounceTimeout = null

watch(selectedNetwork, async (newValue) => {
  await checkServiceNetwork(newValue)
    .then((r) => {
      console.log(r.data)
      networkInfo.value = r.data
    })
    .catch((err) => console.log(err))
})

// Funkcja symulująca zapytanie do backendu
const fetchSuggestions = async (searchText) => {
  let resData = []
  await searchNetwork(searchText).then((r) => {
    resData = r.data
  })
  return resData
}

const handleClickAutocomplete = (netName) => {
  selectedNetwork.value = netName
  query.value = ''
  suggestions.value = []
}

// Obserwujemy zmiany w inputcie
watch(query, (newQuery) => {
  clearTimeout(debounceTimeout)

  if (newQuery.length < 3) {
    suggestions.value = []
    return
  }

  debounceTimeout = setTimeout(async () => {
    suggestions.value = await fetchSuggestions(newQuery)
  }, 1000)
})
</script>

<style>
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
  margin-top: 100px;
}
.overlapping-networks-list {
  max-height: 500px;
  min-width: 380px;
  overflow-y: scroll;
  margin-top: 100px;
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

.autocomplete-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 10px;
  box-sizing: border-box;
}

.autocomplete-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.autocomplete-list {
  list-style: none;
  margin: 5px 0 0;
  padding: 0;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
}

.autocomplete-item {
  padding: 10px;
  cursor: pointer;
  background-color: white;
}

.autocomplete-item:hover {
  background-color: #f0f0f0;
}

/* Responsywność */
@media (max-width: 600px) {
  .autocomplete-container {
    padding: 5px;
  }

  .autocomplete-input {
    font-size: 14px;
    padding: 8px;
  }

  .autocomplete-item {
    padding: 8px;
  }
}
</style>
