<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Participant, ParticipantForm } from '@/types/participant'
import { EMAIL_REGEX, PHONE_REGEX, isFutureDate } from '@/utils/validators'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'

interface Props {
  participants: Participant[]
  initial?: ParticipantForm
  editingId?: string
  submitLabel?: string
  resetAfterSubmit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initial: undefined,
  editingId: undefined,
  submitLabel: 'Save',
  resetAfterSubmit: true,
})

const emit = defineEmits<{
  submit: [value: ParticipantForm]
}>()

type FieldName = keyof ParticipantForm
type FormErrors = Record<FieldName, string>
type FormTouched = Record<FieldName, boolean>

const REQUIRED_MESSAGE = 'This value is required.'

const createEmptyForm = (): ParticipantForm => ({
  name: '',
  birthDate: '',
  email: '',
  phone: '',
})

const createTouched = (): FormTouched => ({
  name: false,
  birthDate: false,
  email: false,
  phone: false,
})

const form = reactive<ParticipantForm>(props.initial ? { ...props.initial } : createEmptyForm())
const touched = reactive<FormTouched>(createTouched())
const submitted = ref(false)

// Без урахування регістру; власний email при редагуванні дублікатом не вважається
function isEmailTaken(email: string): boolean {
  const normalized = email.toLowerCase()
  return props.participants.some(
    (p) => p.id !== props.editingId && p.email.trim().toLowerCase() === normalized,
  )
}

const errors = computed<FormErrors>(() => {
  const email = form.email.trim()
  const phone = form.phone.trim()

  return {
    name: form.name.trim() ? '' : REQUIRED_MESSAGE,
    birthDate: !form.birthDate
      ? REQUIRED_MESSAGE
      : isFutureDate(form.birthDate)
        ? 'Date of birth cannot be in the future.'
        : '',
    email: !email
      ? REQUIRED_MESSAGE
      : !EMAIL_REGEX.test(email)
        ? 'Enter a valid email address.'
        : isEmailTaken(email)
          ? 'A participant with this email already exists.'
          : '',
    phone: !phone
      ? REQUIRED_MESSAGE
      : !PHONE_REGEX.test(phone)
        ? 'Phone must be in the format +380XXXXXXXXX.'
        : '',
  }
})

const hasErrors = computed(() => Object.values(errors.value).some(Boolean))

// Помилка показується, лише якщо поле «торкнули» або була спроба збереження
function errorFor(field: FieldName): string {
  return touched[field] || submitted.value ? errors.value[field] : ''
}

function reset(): void {
  Object.assign(form, createEmptyForm())
  Object.assign(touched, createTouched())
  submitted.value = false
}

function onSubmit(): void {
  submitted.value = true
  if (hasErrors.value) return

  emit('submit', {
    name: form.name.trim(),
    birthDate: form.birthDate,
    email: form.email.trim(),
    phone: form.phone.trim(),
  })

  if (props.resetAfterSubmit) reset()
}
</script>

<template>
  <form novalidate @submit.prevent="onSubmit" @keydown.enter.prevent="onSubmit">
    <BaseInput
      v-model="form.name"
      label="Name"
      placeholder="Enter user name"
      :error="errorFor('name')"
      @blur="touched.name = true"
    />
    <BaseInput
      v-model="form.birthDate"
      label="Date of Birth"
      type="date"
      :error="errorFor('birthDate')"
      @blur="touched.birthDate = true"
    />
    <BaseInput
      v-model="form.email"
      label="Email"
      type="email"
      placeholder="Enter email"
      :error="errorFor('email')"
      @blur="touched.email = true"
    />
    <BaseInput
      v-model="form.phone"
      label="Phone number"
      type="tel"
      placeholder="+380XXXXXXXXX"
      :error="errorFor('phone')"
      @blur="touched.phone = true"
    />

    <div class="d-flex justify-content-end mt-4">
      <BaseButton type="submit">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>