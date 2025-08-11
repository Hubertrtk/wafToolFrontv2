<template>
  <div class="autocomplete-container">
    <input
      @click="setIsFocused(true)"
      type="text"
      v-model="query"
      placeholder="Wpisz minimum 3 litery..."
      class="autocomplete-input"
    />
    <button :disabled="validateLearn" class="learn-button" @click="handleLearnButton">Learn</button>
    <ul v-if="showBackground" class="autocomplete-list">
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
  <div @click="setIsFocused(false)" class="background-black" v-if="showBackground"></div>
</template>
<script setup>
import { identifyNetworks, searchNetwork } from '@/api/serviceApi'
import { checkInputType } from '@/helpers/checkSearchInput'
import { computed, ref, watch } from 'vue'

const query = ref('')
const suggestions = ref([])
const selectedNetwork = ref('')
const isFocused = ref(false)
let debounceTimeout = null

const emit = defineEmits(['selectNetwork']) // deklarujemy eventy

const setIsFocused = (arg) => {
  console.log('setting to : ' + arg)
  isFocused.value = arg
}

watch(selectedNetwork, async (newValue) => {
  emit('selectNetwork', newValue) // wysyłamy event z danymi
})

const validateLearn = computed(() => {
  return !checkInputType(query.value)
})

const handleLearnButton = async () => {
  await identifyNetworks([query.value])
    .then((r) => {
      const { data } = r
      if (data.isError) {
        console.log('Error')
      } else {
        handleClickAutocomplete(query.value)
      }
    })
    .catch((r) => {
      console.log(r)
    })
}

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

const showBackground = computed(() => {
  return suggestions.value.length > 0 && isFocused.value == true
})

// Obserwujemy zmiany w inputcie
watch(query, (newQuery) => {
  clearTimeout(debounceTimeout)
  setIsFocused(true)
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
.background-black {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #222222d2;
  z-index: 10;
}

.autocomplete-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
}
.learn-button {
  margin-left: 10px;
  font-size: 16px;
  box-sizing: content-box;
  border: 2px solid transparent; /* stały border */
  border-radius: 4px;
  cursor: pointer;
  z-index: 11;
}

.learn-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  border-color: transparent; /* zamiast border: none */
}

.autocomplete-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 11;
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
  background: #181a1b;
  border: 2px solid white;
  border-radius: 8px;
  min-width: 417px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 11;
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
