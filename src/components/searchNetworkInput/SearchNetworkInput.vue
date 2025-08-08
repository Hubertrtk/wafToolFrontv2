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
</template>
<script setup>
import { checkServiceNetwork, searchNetwork } from '@/api/serviceApi'
import { ref, watch } from 'vue'

const query = ref('')
const suggestions = ref([])
const selectedNetwork = ref('')
const networkInfo = ref({})
const domainType = ref('')
let debounceTimeout = null

const emit = defineEmits(['selectNetwork']) // deklarujemy eventy

watch(selectedNetwork, async (newValue) => {
  emit('selectNetwork', newValue) // wysyłamy event z danymi
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
  position: absolute;
  list-style: none;
  margin: 5px 0 0;
  padding: 0;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  background: #181a1b;
  border: 2px solid white;
  border-radius: 8px;
  min-width: 217px;
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
