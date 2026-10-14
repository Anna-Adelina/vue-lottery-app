<script setup lang="ts">
import { reactive } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { CreateUserDto } from '@/types/user'

const props = defineProps<{
  initial?: CreateUserDto
  submitLabel: string
  isSaving?: boolean
  error?: string | null
  cancelTo: RouteLocationRaw
}>()

const emit = defineEmits<{ submit: [data: CreateUserDto] }>()

const EMPTY_FORM: CreateUserDto = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  age: 18,
  gender: 'male',
  phone: '',
}

// власна копія даних: «Скасувати» нічого не псує
const form = reactive<CreateUserDto>({ ...EMPTY_FORM, ...props.initial })

function onSubmit(): void {
  emit('submit', { ...form })
}
</script>

<template>
  <form @submit.prevent="onSubmit">
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

    <p v-if="error" class="text-danger">Помилка: {{ error }}</p>

    <div class="d-flex gap-2">
      <button type="submit" class="btn btn-primary" :disabled="isSaving">
        {{ isSaving ? 'Збереження...' : submitLabel }}
      </button>
      <RouterLink :to="cancelTo" class="btn btn-secondary">Скасувати</RouterLink>
    </div>
  </form>
</template>