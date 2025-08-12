<template>
  <div class="container">
    <header class="header">
      <h1>Save Databases</h1>
      <p class="subtitle">Zapisz bazdy danych do pliku</p>
    </header>

    <main class="main">
      <p class="hint">Kliknij przycisk, aby zapisać bazy danych.</p>

      <button
        class="save-btn"
        :disabled="isSaving"
        @click="saveDatabases"
        :aria-busy="isSaving"
        aria-live="polite"
      >
        <span class="icon" aria-hidden="true" v-if="!isSaving">💾</span>
        <span class="spinner" v-if="isSaving" aria-hidden="true"></span>
        <span class="label">{{ isSaving ? 'Saving...' : 'Save Databases' }}</span>
      </button>

      <p v-if="message" class="message" :class="{ success: success, error: !success }">
        {{ message }}
      </p>
    </main>
  </div>
</template>

<script setup>
import { saveDbs } from '@/api/serviceApi'
import { ref } from 'vue'

const isSaving = ref(false)
const message = ref('')
const success = ref(false)

async function saveDatabases() {
  if (isSaving.value) return
  isSaving.value = true
  message.value = ''
  success.value = false

  try {
    // Tutaj w realnej aplikacji wywołasz API np. fetch/axios
    // symulacja zapisu
    await saveDbs()

    success.value = true
    message.value = 'Bazy danych zostały zapisane pomyślnie.'
  } catch (err) {
    success.value = false
    message.value = 'Wystąpił błąd podczas zapisu baz danych.'
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
:root {
  --bg: #fbfdff;
  --card: #ffffff;
  --accent: #0b76ff;
  --accent-dark: #075fcf;
  --muted: #6b7280;
  --success: #0f9d58;
  --error: #d23f3f;
}

* {
  box-sizing: border-box;
}

.container {
  max-width: 520px;
  margin: 48px auto;
  padding: 20px;
  border-radius: 12px;
  background: var(--card);
  box-shadow: 0 8px 30px rgba(13, 20, 30, 0.06);
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
}

.header {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
  margin-bottom: 18px;
}

.header h1 {
  margin: 0 0 6px 0;
  font-size: 18px;
  letter-spacing: 0.2px;
}

.subtitle {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.main {
  padding-top: 6px;
}

.hint {
  margin: 0 0 14px 0;
  color: var(--muted);
  font-size: 13px;
}

.save-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid rgba(11, 118, 255, 0.12);
  background: linear-gradient(180deg, var(--accent), var(--accent-dark));
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(11, 118, 255, 0.18);
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease,
    opacity 0.12s ease;
}

.save-btn:active {
  transform: translateY(1px);
}

.save-btn[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.icon {
  font-size: 16px;
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: rgba(255, 255, 255, 0.95);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.label {
  display: inline-block;
}

.message {
  margin-top: 14px;
  font-size: 13px;
}

.message.success {
  color: var(--success);
}
.message.error {
  color: var(--error);
}

/* responsywność */
@media (max-width: 520px) {
  .container {
    margin: 24px 16px;
    padding: 16px;
  }
  .save-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
