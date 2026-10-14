<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto } from '@/types/user'

const props = defineProps<{ id: string }>()

const router = useRouter()
const store = useUsersStore()
const { currentUser } = storeToRefs(store)

// копія даних юзера: редагуємо її, а не сам стор, щоб «Скасувати» нічого не псувало
const form = reactive<CreateUserDto>({
  firstName: currentUser.value?.firstName ?? '',
  lastName: currentUser.value?.lastName ?? '',
  email: currentUser.value?.email ?? '',
  username: currentUser.value?.username ?? '',
  password: currentUser.value?.password ?? '',
  age: currentUser.value?.age ?? 0,
  gender: currentUser.value?.gender ?? 'male',
  phone: currentUser.value?.phone ?? '',
})

const isSaving = ref(false)
const saveError = ref<string | null>(null)

async function save(): Promise<void> {
  isSaving.value = true
  saveError.value = null
  try {
    await store.updateUser(Number(props.id), { ...form })
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

    <form @submit.prevent="save">
      <div class="mb-2">
        <label for="firstName" class="form-label">Ім’я</label>
        <input id="firstName" v-model="form.firstName" class="form-control" required />
      </div>
      <div class="mb-2">
        <label for="lastName" class="form-label">Прізвище</label>
        <input id="lastName" v-model="form.lastName" class="form-control" required />
      </div>
      <div class="mb-2">
        <label for="email" class="form-label">Email</label>
        <input id="email" v-model="form.email" type="email" class="form-control" required />
      </div>
      <div class="mb-2">
        <label for="username" class="form-label">Username</label>
        <input id="username" v-model="form.username" class="form-control" required />
      </div>
      <div class="mb-2">
        <label for="password" class="form-label">Пароль</label>
        <input id="password" v-model="form.password" type="password" class="form-control" required />
      </div>
      <div class="mb-2">
        <label for="age" class="form-label">Вік</label>
        <input id="age" v-model.number="form.age" type="number" min="0" class="form-control" />
      </div>
      <div class="mb-2">
        <label for="gender" class="form-label">Стать</label>
        <select id="gender" v-model="form.gender" class="form-select">
          <option value="male">male</option>
          <option value="female">female</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="phone" class="form-label">Телефон</label>
        <input id="phone" v-model="form.phone" class="form-control" />
      </div>

      <p v-if="saveError" class="text-danger">Помилка: {{ saveError }}</p>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary" :disabled="isSaving">
          {{ isSaving ? 'Збереження...' : 'Зберегти' }}
        </button>
        <RouterLink :to="{ name: 'user-detail', params: { id } }" class="btn btn-secondary">
          Скасувати
        </RouterLink>
      </div>
    </form>
  </section>
</template>