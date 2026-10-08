<script setup lang="ts">
import type { Participant, ParticipantForm } from '@/types/participant'
import ParticipantFormFields from './ParticipantFormFields.vue'

defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  register: [value: ParticipantForm]
}>()
</script>

<template>
  <section class="card mb-3">
    <div class="card-body">
      <h2 class="h6 text-uppercase fw-bold mb-1">Register form</h2>
      <p class="text-secondary small mb-3">Please fill in all the fields.</p>

      <ParticipantFormFields
        :participants="participants"
        submit-label="Save"
        @submit="emit('register', $event)"
      />
    </div>
  </section>
</template>