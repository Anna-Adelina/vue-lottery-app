<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import type { CreateUserDto } from '@/types/user'
import { userSchema } from '@/validation/schemas'

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

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(userSchema),
  initialValues: { ...EMPTY_FORM, ...props.initial },
})

const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')
const [age, ageAttrs] = defineField('age')
const [gender, genderAttrs] = defineField('gender')
const [phone, phoneAttrs] = defineField('phone')

// викликається, лише коли всі поля пройшли валідацію
const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div class="mb-2">
      <label for="firstName" class="form-label">Ім’я</label>
      <input
        id="firstName"
        v-model="firstName"
        v-bind="firstNameAttrs"
        class="form-control"
        :class="{ 'is-invalid': errors.firstName }"
      />
      <div class="invalid-feedback">{{ errors.firstName }}</div>
    </div>

    <div class="mb-2">
      <label for="lastName" class="form-label">Прізвище</label>
      <input
        id="lastName"
        v-model="lastName"
        v-bind="lastNameAttrs"
        class="form-control"
        :class="{ 'is-invalid': errors.lastName }"
      />
      <div class="invalid-feedback">{{ errors.lastName }}</div>
    </div>

    <div class="mb-2">
      <label for="email" class="form-label">Email</label>
      <input
        id="email"
        v-model="email"
        v-bind="emailAttrs"
        type="email"
        class="form-control"
        :class="{ 'is-invalid': errors.email }"
      />
      <div class="invalid-feedback">{{ errors.email }}</div>
    </div>

    <div class="mb-2">
      <label for="username" class="form-label">Username</label>
      <input
        id="username"
        v-model="username"
        v-bind="usernameAttrs"
        class="form-control"
        :class="{ 'is-invalid': errors.username }"
      />
      <div class="invalid-feedback">{{ errors.username }}</div>
    </div>

    <div class="mb-2">
      <label for="password" class="form-label">Пароль</label>
      <input
        id="password"
        v-model="password"
        v-bind="passwordAttrs"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': errors.password }"
      />
      <div class="invalid-feedback">{{ errors.password }}</div>
    </div>

    <div class="mb-2">
      <label for="age" class="form-label">Вік</label>
      <input
        id="age"
        v-model.number="age"
        v-bind="ageAttrs"
        type="number"
        class="form-control"
        :class="{ 'is-invalid': errors.age }"
      />
      <div class="invalid-feedback">{{ errors.age }}</div>
    </div>

    <div class="mb-2">
      <label for="gender" class="form-label">Стать</label>
      <select
        id="gender"
        v-model="gender"
        v-bind="genderAttrs"
        class="form-select"
        :class="{ 'is-invalid': errors.gender }"
      >
        <option value="male">male</option>
        <option value="female">female</option>
      </select>
      <div class="invalid-feedback">{{ errors.gender }}</div>
    </div>

    <div class="mb-3">
      <label for="phone" class="form-label">Телефон</label>
      <input
        id="phone"
        v-model="phone"
        v-bind="phoneAttrs"
        class="form-control"
        :class="{ 'is-invalid': errors.phone }"
      />
      <div class="invalid-feedback">{{ errors.phone }}</div>
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