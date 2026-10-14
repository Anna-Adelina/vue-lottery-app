<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import { ServiceProvider } from '@/services/service-provider'
import type { User } from '@/types/user'

const PAGE_SIZE = 10

const route = useRoute()
const router = useRouter()

const users = ref<User[]>([])
const total = ref(0)
const isLoading = ref(false)
const error = ref<string | null>(null)

const page = computed<number>(() => Math.max(1, Number(route.query.page) || 1))
const totalPages = computed<number>(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

async function loadUsers(): Promise<void> {
  isLoading.value = true
  error.value = null
  try {
    const result = await ServiceProvider.users.getAll({
      limit: PAGE_SIZE,
      skip: (page.value - 1) * PAGE_SIZE,
    })
    users.value = result.items
    total.value = result.total
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    isLoading.value = false
  }
}

// сторінка змінилась в URL → завантажуємо дані (і одразу при відкритті)
watch(page, loadUsers, { immediate: true })

function goToPage(value: number): void {
  router.push({ query: { ...route.query, page: value } })
}
</script>

<template>
  <section>
    <h1>Users</h1>

    <p v-if="error" class="text-danger">Помилка: {{ error }}</p>
    <p v-else-if="isLoading">Завантаження...</p>

    <table v-else class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Ім’я</th>
          <th>Email</th>
          <th>Username</th>
          <th>Вік</th>
          <th>Телефон</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.firstName }} {{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.age }}</td>
          <td>{{ user.phone }}</td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex align-items-center gap-3">
      <BaseButton variant="secondary" :disabled="page <= 1" @click="goToPage(page - 1)">
        Назад
      </BaseButton>
      <span>Сторінка {{ page }} з {{ totalPages }}</span>
      <BaseButton variant="secondary" :disabled="page >= totalPages" @click="goToPage(page + 1)">
        Далі
      </BaseButton>
    </div>
  </section>
</template>