<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ServiceProvider } from '@/services/service-provider'
import type { User } from '@/types/user'

const props = defineProps<{ id: string }>()

const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// з URL id завжди рядок, а API працює з числами
const userId = computed<number>(() => Number(props.id))

async function loadUser(): Promise<void> {
  isLoading.value = true
  error.value = null
  try {
    user.value = await ServiceProvider.users.getById(userId.value)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    isLoading.value = false
  }
}

// Vue перевикористовує компонент, коли змінюється лише :id, тож стежимо за ним
watch(userId, loadUser, { immediate: true })
</script>

<template>
  <section>
    <RouterLink to="/users">← До списку</RouterLink>

    <p v-if="error" class="text-danger">Помилка: {{ error }}</p>
    <p v-else-if="isLoading">Завантаження...</p>

    <template v-else-if="user">
      <h1>{{ user.firstName }} {{ user.lastName }}</h1>

      <dl>
        <dt>Email</dt>
        <dd>{{ user.email }}</dd>
        <dt>Username</dt>
        <dd>{{ user.username }}</dd>
        <dt>Вік</dt>
        <dd>{{ user.age }}</dd>
        <dt>Стать</dt>
        <dd>{{ user.gender }}</dd>
        <dt>Телефон</dt>
        <dd>{{ user.phone }}</dd>
      </dl>

      <RouterLink :to="{ name: 'user-edit', params: { id } }">Редагувати</RouterLink>

      <!-- сюди підставиться вкладений маршрут /edit -->
      <RouterView />
    </template>
  </section>
</template>