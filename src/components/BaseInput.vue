<script setup lang="ts">
import { useId } from 'vue'

interface Props {
  label: string
  type?: 'text' | 'email' | 'tel' | 'date'
  placeholder?: string
  error?: string
}

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  error: '',
})

const model = defineModel<string>({ required: true })
const inputId = useId()
</script>

<template>
  <div class="mb-3">
    <label :for="inputId" class="form-label fw-semibold">{{ label }}</label>
    <input
      :id="inputId"
      v-model="model"
      v-bind="$attrs"
      :type="type"
      class="form-control"
      :class="{ 'is-invalid': error }"
      :placeholder="placeholder"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>