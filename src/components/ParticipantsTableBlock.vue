<script setup lang="ts">
import type { Participant } from '@/types/participant'
import BaseButton from './BaseButton.vue'

defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  'request-delete': [participant: Participant]
}>()
</script>

<template>
  <section class="card mb-3">
    <div class="card-body">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th scope="col" class="text-secondary">#</th>
              <th scope="col">Name</th>
              <th scope="col">Date of Birth</th>
              <th scope="col">Email</th>
              <th scope="col">Phone number</th>
              <th scope="col"><span class="visually-hidden">Delete</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(participant, index) in participants" :key="participant.id">
              <td class="text-secondary">{{ index + 1 }}</td>
              <td>{{ participant.name }}</td>
              <td>{{ participant.birthDate }}</td>
              <td>{{ participant.email }}</td>
              <td>{{ participant.phone }}</td>
              <td>
                <BaseButton
                  variant="danger"
                  class="btn-sm"
                  @click="emit('request-delete', participant)"
                >
                  Видалити учасника
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>