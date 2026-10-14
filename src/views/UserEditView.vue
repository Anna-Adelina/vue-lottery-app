<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import UserForm from '@/components/UserForm.vue'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto } from '@/types/user'

const props = defineProps<{ id: string }>()

const router = useRouter()
const store = useUsersStore()
const { currentUser } = storeToRefs(store)

const initial = computed<CreateUserDto | undefined>(() => {
  const u = currentUser.value
  if (!u) return undefined
  const { firstName, lastName, email, username, password, age, gender, phone } = u
  return { firstName, lastName, email, username, password, age, gender, phone }
})

const isSaving = ref(false)
const saveError = ref<string | null>(null)

async function save(data: CreateUserDto): Promise<void> {
  isSaving.value = true
  saveError.value = null
  try {
    await store.updateUser(Number(props.id), data)
    await router.push({ name: 'user-detail', params: { id: props.id } })
  } catch (e) {
    saveError.value = (e as Error).message
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section>
    <h2>Редагування користувача #{{ id }}</h2>
    <UserForm
      submit-label="Зберегти"
      :initial="initial"
      :is-saving="isSaving"
      :error="saveError"
      :cancel-to="{ name: 'user-detail', params: { id } }"
      @submit="save"
    />
  </section>
</template>