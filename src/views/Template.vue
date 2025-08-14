<template>
  <div class="app">
    <aside class="sidebar">
      <h3>Templates</h3>
      <ul>
        <li
          v-for="tpl in filteredTemplates"
          :key="tpl.timestamp"
          :class="{ active: tpl.timestamp === selected?.timestamp }"
          @click="selectTemplate(tpl)"
        >
          <!-- wyświetlamy tylko datę -->
          {{ formatDateOnly(tpl.timestamp) }} {{ tpl.source }}
        </li>
      </ul>
    </aside>
    <main class="main">
      <div class="controls">
        <div class="provider-toggle">
          <label> <input type="radio" value="Azure" v-model="provider" /> AZURE </label>
          <label> <input type="radio" value="CloudFlare" v-model="provider" /> CLOUDFLARE </label>
        </div>

        <button class="build-btn" @click="build">Build</button>
        <button class="deploy-btn" @click="deploy">Deploy</button>
      </div>

      <section class="editor">
        <h4 v-if="selected">Wybrana templatka: {{ selected.fileName }}</h4>
        <textarea v-model="output" readonly rows="18"></textarea>
      </section>
    </main>
  </div>
</template>
<script setup>
import { buildTemplate, getTemplate, getTemplates } from '@/api/serviceApi'
import { reactive, ref, computed, watch, onMounted } from 'vue'

// dane trzymane w stanie
const templates = ref([])

// provider - kontrolka przełącznika
const provider = ref('Azure')
onMounted(async () => {
  await getTemplates().then((r) => {
    templates.value = r.data
  })
})

// sortowanie: od najstarszych do najnowszych (timestamp rosnąco)
const filteredTemplates = computed(() => {
  return templates.value
    .filter((t) => t.provider === provider.value)
    .slice()
    .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
})

// aktualnie wybrana templatka
const selected = ref(filteredTemplates.value[0] || null)

// jeśli zmieni się lista (np. provider) to ustaw pierwszy element
watch(filteredTemplates, (newList) => {
  selected.value = newList[0] || null
})

watch(selected, async (newValue) => {
  console.log(newValue)
  if (newValue && newValue.fileName) {
    await getTemplate(newValue.fileName).then((r) => {
      console.log(r.data)
      output.value = JSON.stringify(prettifyTemplate(r.data), null, 2)
    })
  }
})

// textarea output
const output = ref('')

function selectTemplate(tpl) {
  selected.value = tpl
}

const deploy = async () => {
  console.log(selected.value)
  console.log(provider.value)
}

async function build() {
  console.log(provider.value)
  await buildTemplate(provider.value.toUpperCase())
    .then(async (r) => {
      await getTemplates().then((r) => {
        templates.value = r.data
      })
      const newTemplate = templates.value.find((el) => {
        return el.fileName == `${r.data.newTemplate}.json`
      })
      selected.value = newTemplate
    })
    .catch((err) => {
      console.log(err)
    })
}

function prettifyTemplate(tpl) {
  // przykładowo dodajemy pole generatedAt, można modyfikować według potrzeb
  return {
    ...tpl,
    generatedAt: Date.now(),
  }
}

function formatDateOnly(ts) {
  // zwracamy samą datę w formacie YYYY-MM-DD (zgodnie z wymaganiem "tylko data")
  const d = new Date(Number(ts))
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<style scoped>
/* Prosty layout: sidebar + content */
* {
  box-sizing: border-box;
}
.app {
  display: flex;
  height: calc(100vh - 60px);
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
  background-color: #121414;
}

.sidebar {
  width: 220px;
  background: #1d2021;
  border-right: 1px solid #e0e6eb;
  padding: 16px;
  overflow-y: auto;
}
.sidebar h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar li {
  padding: 8px 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  text-align: center; /* tylko data, wycentrowane */
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
  background: #181a1b;
}
.sidebar li.active {
  outline: 2px solid #2b8aef;
  background: #1e2022;
}

.main {
  flex: 1;
  padding: 18px;
  display: flex;
  flex-direction: column;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.provider-toggle label {
  margin-right: 12px;
  font-weight: 600;
  font-size: 13px;
}

.build-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  background: #2b8aef;
  color: white;
  cursor: pointer;
  font-weight: 600;
}
.build-btn:hover {
  opacity: 0.95;
}

.deploy-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  background: #2b8aef;
  color: white;
  cursor: pointer;
  font-weight: 600;
}
.deploy-btn:hover {
  opacity: 0.95;
}

.editor {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.editor h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

textarea {
  width: 100%;
  flex: 1;
  resize: vertical;
  padding: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #dbe6f3;
  background: #1a1c1d;
  color: #d3cfc9;
}

@media (max-width: 700px) {
  .app {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    height: 120px;
    order: 2;
  }
  .main {
    order: 1;
  }
}
</style>
