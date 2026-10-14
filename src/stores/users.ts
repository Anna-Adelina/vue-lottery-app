import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/services/service-provider'
import type { PaginationParams } from '@/services/interfaces'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'

// DummyJSON завжди повертає id 209 для нових юзерів, тож id видаємо самі
const LOCAL_ID_START = 1000

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // локальні зміни, яких сервер (DummyJSON) не зберігає
  const createdUsers = ref<User[]>([])
  const updatedById = ref<Record<number, User>>({})
  const deletedIds = ref<number[]>([])

  function isLocal(id: number): boolean {
    return createdUsers.value.some((u) => u.id === id)
  }

  function applyLocalChanges(list: User[]): User[] {
    return list
      .filter((u) => !deletedIds.value.includes(u.id))
      .map((u) => updatedById.value[u.id] ?? u)
  }

  async function fetchUsers(params: PaginationParams): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const result = await ServiceProvider.users.getAll(params)
      const items = applyLocalChanges(result.items)
      // нові юзери показуються на першій сторінці без пошуку, найновіші зверху
      const isFirstPage = !params.skip && !params.q
      users.value = isFirstPage
        ? [...applyLocalChanges([...createdUsers.value].reverse()), ...items]
        : items
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
      const local = createdUsers.value.find((u) => u.id === id)
      const fetched = local ?? (await ServiceProvider.users.getById(id))
      currentUser.value = updatedById.value[id] ?? fetched
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(data: CreateUserDto): Promise<void> {
    const created = await ServiceProvider.users.create(data)
    const user: User = {
      ...data,
      ...created,
      id: LOCAL_ID_START + createdUsers.value.length,
    }
    createdUsers.value.push(user)
  }

  async function updateUser(id: number, data: UpdateUserDto): Promise<void> {
    // локальні юзери на сервері не існують, тож запит для них не шлемо
    const updated = isLocal(id) ? {} : await ServiceProvider.users.update(id, data)
    const base =
      currentUser.value?.id === id ? currentUser.value : users.value.find((u) => u.id === id)
    const merged = { ...base, ...data, ...updated } as User

    updatedById.value = { ...updatedById.value, [id]: merged }
    users.value = users.value.map((u) => (u.id === id ? merged : u))
    if (currentUser.value?.id === id) currentUser.value = merged
  }

  async function deleteUser(id: number): Promise<void> {
    if (!isLocal(id)) await ServiceProvider.users.delete(id)
    deletedIds.value.push(id)
    users.value = users.value.filter((u) => u.id !== id)
    total.value -= 1
    if (currentUser.value?.id === id) currentUser.value = null
  }

  return {
    users,
    total,
    currentUser,
    isLoading,
    error,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
  }
})