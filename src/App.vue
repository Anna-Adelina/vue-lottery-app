<script setup lang="ts">
import { ref } from 'vue'
import type { Participant, ParticipantForm } from '@/types/participant'
import RegisterFormBlock from './components/RegisterFormBlock.vue'
import ParticipantsTableBlock from './components/ParticipantsTableBlock.vue'

const participants = ref<Participant[]>([])

function addParticipant(data: ParticipantForm): void {
  participants.value.push({ id: crypto.randomUUID(), ...data })
}
</script>

<template>
  <main class="container py-4" style="max-width: 640px">
    <RegisterFormBlock :participants="participants" @register="addParticipant" />
    <ParticipantsTableBlock :participants="participants" />
  </main>
</template>