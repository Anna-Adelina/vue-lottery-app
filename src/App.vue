<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Participant, ParticipantForm } from '@/types/participant'
import BaseButton from './components/BaseButton.vue'
import BaseModal from './components/BaseModal.vue'
import ParticipantFormFields from './components/ParticipantFormFields.vue'
import WinnersListBlock from './components/WinnersListBlock.vue'
import RegisterFormBlock from './components/RegisterFormBlock.vue'
import ParticipantsTableBlock from './components/ParticipantsTableBlock.vue'

const MAX_WINNERS = 3

const participants = ref<Participant[]>([])
const winnerIds = ref<string[]>([])
const participantToDelete = ref<Participant | null>(null)
const participantToEdit = ref<Participant | null>(null)

const winners = computed<Participant[]>(() =>
  winnerIds.value
    .map((id) => participants.value.find((p) => p.id === id))
    .filter((p): p is Participant => p !== undefined),
)

const availableParticipants = computed<Participant[]>(() =>
  participants.value.filter((p) => !winnerIds.value.includes(p.id)),
)

const canPickWinner = computed<boolean>(
  () => winnerIds.value.length < MAX_WINNERS && availableParticipants.value.length > 0,
)

const isDeleteModalOpen = computed<boolean>({
  get: () => participantToDelete.value !== null,
  set: (value) => {
    if (!value) participantToDelete.value = null
  },
})

const isEditModalOpen = computed<boolean>({
  get: () => participantToEdit.value !== null,
  set: (value) => {
    if (!value) participantToEdit.value = null
  },
})

// Початкові значення для форми редагування (без id)
const editInitial = computed<ParticipantForm | undefined>(() => {
  if (!participantToEdit.value) return undefined
  const { name, birthDate, email, phone } = participantToEdit.value
  return { name, birthDate, email, phone }
})

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

function requestDelete(participant: Participant): void {
  participantToDelete.value = participant
}

function confirmDelete(): void {
  if (!participantToDelete.value) return

  const { id } = participantToDelete.value
  participants.value = participants.value.filter((p) => p.id !== id)
  removeWinner(id)
  participantToDelete.value = null
}

function requestEdit(participant: Participant): void {
  participantToEdit.value = participant
}

function updateParticipant(data: ParticipantForm): void {
  if (!participantToEdit.value) return

  const { id } = participantToEdit.value
  participants.value = participants.value.map((p) => (p.id === id ? { id, ...data } : p))
  participantToEdit.value = null
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
    <ParticipantsTableBlock
      :participants="participants"
      @request-edit="requestEdit"
      @request-delete="requestDelete"
    />

    <BaseModal v-model="isEditModalOpen">
      <template #header>Редагування учасника</template>

      <ParticipantFormFields
        v-if="participantToEdit"
        :key="participantToEdit.id"
        :participants="participants"
        :initial="editInitial"
        :editing-id="participantToEdit.id"
        submit-label="Оновити дані"
        :reset-after-submit="false"
        @submit="updateParticipant"
      />
    </BaseModal>

    <BaseModal v-model="isDeleteModalOpen">
      <template #header>Видалення учасника</template>

      <p v-if="participantToDelete" class="mb-0">
        Ви дійсно бажаєте видалити учасника "{{ participantToDelete.name }}",
        "{{ participantToDelete.email }}"?
      </p>

      <template #footer>
        <BaseButton variant="secondary" @click="isDeleteModalOpen = false">Ні</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
      </template>
    </BaseModal>
  </main>
</template>