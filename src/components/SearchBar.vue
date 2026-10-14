<script setup lang="ts">
import { ref, watch } from 'vue'

const DEBOUNCE_MS = 300

const emit = defineEmits<{
  'filter-by-name': [value: string]
}>()

const query = ref('')

// watch спостерігає за змінами
watch(query, (value, _oldValue, onCleanup) => {
  const timerId = setTimeout(() => {
    emit('filter-by-name', value.trim())
  }, DEBOUNCE_MS)

  // Щойно користувач вводить новий символ, викликає функцію очищення
  onCleanup(() => clearTimeout(timerId))
})
</script>

<template>
  <input
    v-model="query"
    type="search"
    class="form-control"
    placeholder="Search by name"
    aria-label="Search participants by name"
  />
</template>