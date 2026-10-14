<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/users'

const props = defineProps<{ id: string }>()

const store = useUsersStore()
const { currentUser: user, isLoading, error } = storeToRefs(store)

// з URL id завжди рядок, а API працює з числами
const userId = computed<number>(() => Number(props.id))

// Vue перевикористовує компонент, коли змінюється лише :id, тож стежимо за ним
watch(userId, (id) => store.fetchUser(id), { immediate: true })
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