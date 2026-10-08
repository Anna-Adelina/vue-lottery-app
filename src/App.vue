<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Participant, ParticipantForm } from '@/types/participant'
import WinnersListBlock from './components/WinnersListBlock.vue'
import RegisterFormBlock from './components/RegisterFormBlock.vue'
import ParticipantsTableBlock from './components/ParticipantsTableBlock.vue'

const MAX_WINNERS = 3

const participants = ref<Participant[]>([])
const winnerIds = ref<string[]>([])

const winners = computed<Participant[]>(() =>
  winnerIds.value
    .map((id) => participants.value.find((p) => p.id === id))
    .filter((p): p is Participant => p !== undefined),
)

// Учасники, які ще не стали переможцями
const availableParticipants = computed<Participant[]>(() =>
  participants.value.filter((p) => !winnerIds.value.includes(p.id)),
)

const canPickWinner = computed<boolean>(
  () => winnerIds.value.length < MAX_WINNERS && availableParticipants.value.length > 0,
)

function addParticipant(data: ParticipantForm): void {
  participants.value.push({ id: crypto.randomUUID(), ...data })
}

function pickWinner(): void {
  if (!canPickWinner.value) return

  const index = Math.floor(Math.random() * availableParticipants.value.length)
  const winner = availableParticipants.value[index]
  if (winner) winnerIds.value.push(winner.id)
}

function removeWinner(id: string): void {
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
}
</script>

<template>
  <main class="container py-4" style="max-width: 640px">
    <WinnersListBlock
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @new-winner="pickWinner"
      @remove-winner="removeWinner"
    />
    <RegisterFormBlock :participants="participants" @register="addParticipant" />
    <ParticipantsTableBlock :participants="participants" />
  </main>
</template>