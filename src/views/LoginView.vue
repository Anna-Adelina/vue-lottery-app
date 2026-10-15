<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { useAuthStore } from '@/stores/auth'
import { loginSchema } from '@/validation/schemas'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

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

// handleSubmit викличе функцію лише тоді, коли всі поля пройшли валідацію
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  error.value = null
  try {
    await auth.login(values)
    await router.push(getRedirectTarget())
  } catch (e) {
    const message = (e as Error).message
    error.value = message.startsWith('HTTP 400') ? 'Невірний логін або пароль' : message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section>
    <h1>Login</h1>
    <p class="text-muted">Тестовий акаунт: emilys / emilyspass</p>

    <form novalidate @submit.prevent="onSubmit">
      <div class="mb-2">
        <label for="username" class="form-label">Username</label>
        <input
          id="username"
          v-model="username"
          v-bind="usernameAttrs"
          class="form-control"
          :class="{ 'is-invalid': errors.username }"
          autocomplete="username"
        />
        <div class="invalid-feedback">{{ errors.username }}</div>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Пароль</label>
        <input
          id="password"
          v-model="password"
          v-bind="passwordAttrs"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
          autocomplete="current-password"
        />
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>

      <p v-if="error" class="text-danger">{{ error }}</p>

      <button type="submit" class="btn btn-primary" :disabled="isLoading">
        {{ isLoading ? 'Вхід...' : 'Увійти' }}
      </button>
    </form>
  </section>
</template>