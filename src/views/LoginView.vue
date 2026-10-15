<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

// куди повернути після логіну; приймаємо лише внутрішні шляхи
function getRedirectTarget(): string {
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }
  return '/users'
}

async function onSubmit(): Promise<void> {
  isLoading.value = true
  error.value = null
  try {
    await auth.login({ username: username.value.trim(), password: password.value })
    await router.push(getRedirectTarget())
  } catch (e) {
    const message = (e as Error).message
    error.value = message.startsWith('HTTP 400') ? 'Невірний логін або пароль' : message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section>
    <h1>Login</h1>
    <p class="text-muted">Тестовий акаунт: emilys / emilyspass</p>

    <form @submit.prevent="onSubmit">
      <div class="mb-2">
        <label for="username" class="form-label">Username</label>
        <input
          id="username"
          v-model="username"
          class="form-control"
          autocomplete="username"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Пароль</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-control"
          autocomplete="current-password"
          required
        />
      </div>

      <p v-if="error" class="text-danger">{{ error }}</p>

      <button type="submit" class="btn btn-primary" :disabled="isLoading">
        {{ isLoading ? 'Вхід...' : 'Увійти' }}
      </button>
    </form>
  </section>
</template>