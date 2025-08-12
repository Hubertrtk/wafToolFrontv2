<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="submitForm">
      <h2>Zaloguj się</h2>
      <div class="input-group">
        <label for="userName">User Name</label>
        <input
          id="userName"
          type="userName"
          v-model="userName"
          placeholder="wpisz swój user name"
          required
        />
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="wpisz swoje hasło"
          required
        />
      </div>

      <button type="submit">Zaloguj się</button>
    </form>
  </div>
</template>

<script setup>
import { login } from '@/api/serviceApi'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('')
const password = ref('')

async function submitForm() {
  await localStorage.setItem(
    'wtauthuser',
    JSON.stringify({
      userName: userName.value,
      password: password.value,
    }),
  )
  await login()
    .then(() => {
      router.push({ name: 'checkNetwork' })
    })
    .catch(async (err) => {
      await localStorage.removeItem('wtauthuser')
    })
}
</script>

<style scoped>
/* Podstawowy reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Kontener strony */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 1rem;
}

/* Formularz */
.login-form {
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Nagłówek */
.login-form h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 700;
}

/* Grupa inputów */
.input-group {
  margin-bottom: 1.2rem;
  text-align: left;
}

/* Label */
.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 600;
}

/* Inputy */
.input-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  border-color: #764ba2;
  outline: none;
}

/* Przycisk */
button {
  width: 100%;
  padding: 0.85rem;
  background: #764ba2;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #5b3780;
}

/* Responsywność */
@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem 1.8rem;
    border-radius: 10px;
  }

  button {
    font-size: 1rem;
  }
}
</style>
