<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from '@/components/UserForm.vue'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto } from '@/types/user'

const router = useRouter()
const store = useUsersStore()

const isSaving = ref(false)
const saveError = ref<string | null>(null)

async function create(data: CreateUserDto): Promise<void> {
  isSaving.value = true
  saveError.value = null
  try {
    await store.createUser(data)
    await router.push({ name: 'users' })
  } catch (e) {
    saveError.value = (e as Error).message
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section>
    <h1>Новий користувач</h1>
    <UserForm
      submit-label="Створити"
      :is-saving="isSaving"
      :error="saveError"
      :cancel-to="{ name: 'users' }"
      @submit="create"
    />
  </section>
</template>