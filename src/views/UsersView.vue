<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import BaseButton from '@/components/BaseButton.vue'
import { useUsersStore } from '@/stores/users'

const PAGE_SIZE = 10
const DEBOUNCE_MS = 400

const route = useRoute()
const router = useRouter()

const store = useUsersStore()
const { users, total, isLoading, error } = storeToRefs(store)

const page = computed<number>(() => Math.max(1, Number(route.query.page) || 1))
const q = computed<string>(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const totalPages = computed<number>(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

// значення в полі вводу; початкове береться з URL
const searchInput = ref(q.value)

function loadUsers(): Promise<void> {
  return store.fetchUsers({
    limit: PAGE_SIZE,
    skip: (page.value - 1) * PAGE_SIZE,
    q: q.value,
  })
}

// змінилась сторінка або запит в URL → завантажуємо дані (і одразу при відкритті)
watch([page, q], loadUsers, { immediate: true })

// користувач друкує → після паузи пишемо запит в URL
watch(searchInput, (value, _old, onCleanup) => {
  const timerId = setTimeout(() => {
    const trimmed = value.trim()
    if (trimmed === q.value) return
    router.replace({ query: { q: trimmed || undefined, page: 1 } })
  }, DEBOUNCE_MS)
  onCleanup(() => clearTimeout(timerId))
})

// URL змінився ззовні (кнопка «Назад», вставлене посилання) → оновлюємо поле
watch(q, (value) => {
  searchInput.value = value
})

function goToPage(value: number): void {
  router.push({ query: { ...route.query, page: value } })
}
</script>

<template>
  <section>
    <h1>Users</h1>

    <input
      v-model="searchInput"
      type="search"
      class="form-control mb-3"
      placeholder="Пошук за ім’ям, email..."
    />

    <p v-if="error" class="text-danger">Помилка: {{ error }}</p>
    <p v-else-if="isLoading">Завантаження...</p>
    <p v-else-if="users.length === 0">Нічого не знайдено</p>

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
          <td>
            <RouterLink :to="{ name: 'user-detail', params: { id: user.id } }">
            {{ user.firstName }} {{ user.lastName }}
            </RouterLink>
          </td>
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