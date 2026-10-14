import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/services/service-provider'
import type { PaginationParams } from '@/services/interfaces'
import type { User } from '@/types/user'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers(params: PaginationParams): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const result = await ServiceProvider.users.getAll(params)
      users.value = result.items
      total.value = result.total
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser(id: number): Promise<void> {
    isLoading.value = true
    error.value = null
    currentUser.value = null
    try {
      currentUser.value = await ServiceProvider.users.getById(id)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  async function deleteUser(id: number): Promise<void> {
    await ServiceProvider.users.delete(id)
    users.value = users.value.filter((u) => u.id !== id)
    total.value -= 1
    if (currentUser.value?.id === id) currentUser.value = null
  }

  return { users, total, currentUser, isLoading, error, fetchUsers, fetchUser, deleteUser }
})