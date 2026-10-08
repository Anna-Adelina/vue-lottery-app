<script setup lang="ts">
import type { Participant } from '@/types/participant'
import BaseButton from './BaseButton.vue'
import WinnerItem from './WinnerItem.vue'

defineProps<{
  winners: Participant[]
  canPickWinner: boolean
}>()

const emit = defineEmits<{
  'new-winner': []
  'remove-winner': [id: string]
}>()
</script>

<template>
  <section class="card mb-3">
    <div class="card-body d-flex gap-3 align-items-start">
      <div class="form-control d-flex flex-wrap align-items-center gap-2 flex-grow-1 winners-field">
        <WinnerItem
          v-for="winner in winners"
          :key="winner.id"
          :winner="winner"
          @remove="emit('remove-winner', $event)"
        />
        <span v-if="winners.length === 0" class="text-secondary">Winners</span>
      </div>

      <BaseButton :disabled="!canPickWinner" @click="emit('new-winner')">New winner</BaseButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
.winners-field {
  min-height: 38px;
}
</style>