<script setup lang="ts">
import type { Participant } from '@/types/participant'

defineProps<{
  winner: Participant
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()
</script>

<template>
  <span class="badge bg-info d-inline-flex align-items-center gap-2">
    {{ winner.name }}
    <button
      type="button"
      class="btn-close btn-close-white"
      :aria-label="`Remove winner ${winner.name}`"
      @click="emit('remove', winner.id)"
    ></button>
  </span>
</template>