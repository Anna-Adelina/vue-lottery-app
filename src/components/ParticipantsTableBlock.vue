<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Participant } from '@/types/participant'
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import SearchBar from './SearchBar.vue'

type SortKey = 'name' | 'birthDate'
type SortDirection = 'asc' | 'desc'

const props = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  'request-edit': [participant: Participant]
  'request-delete': [participant: Participant]
}>()

const nameFilter = ref('')
const sortKey = ref<SortKey | null>(null)
const sortDirection = ref<SortDirection>('asc')

// Спочатку фільтруємо, потім сортуємо. Вихідний масив не змінюється
const displayedParticipants = computed<Participant[]>(() => {
  const query = nameFilter.value.toLowerCase()

  const filtered = props.participants.filter((p) => p.name.toLowerCase().includes(query))

  const key = sortKey.value
  if (!key) return filtered

  const factor = sortDirection.value === 'asc' ? 1 : -1

  // filtered вже новий масив, тому sort не зачіпає props.participants
  return filtered.sort((a, b) => {
    const result =
      key === 'name'
        ? a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        : a.birthDate.localeCompare(b.birthDate) // yyyy-mm-dd порівнюється як рядок
    return result * factor
  })
})

function toggleSort(key: SortKey): void {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

function ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
  if (sortKey.value !== key) return 'none'
  return sortDirection.value === 'asc' ? 'ascending' : 'descending'
}

const nameIcon = computed<string>(() =>
  sortKey.value === 'name' && sortDirection.value === 'desc' ? 'sort-alpha-up' : 'sort-alpha-down',
)

const birthDateIcon = computed<string>(() =>
  sortKey.value === 'birthDate' && sortDirection.value === 'desc' ? 'sort-up' : 'sort-down',
)
</script>

<template>
  <section class="card mb-3">
    <div class="card-body">
      <div class="mb-3">
        <SearchBar @filter-by-name="nameFilter = $event" />
      </div>

      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th scope="col" class="text-secondary">#</th>
              <th scope="col" :aria-sort="ariaSort('name')">
                <span class="d-inline-flex align-items-center gap-2">
                  Name
                  <BaseButton
                    :variant="sortKey === 'name' ? 'info' : 'outline-secondary'"
                    class="btn-sm"
                    aria-label="Sort by name"
                    @click="toggleSort('name')"
                  >
                    <BaseIcon :name="nameIcon" />
                  </BaseButton>
                </span>
              </th>
              <th scope="col" :aria-sort="ariaSort('birthDate')">
                <span class="d-inline-flex align-items-center gap-2">
                  Date of Birth
                  <BaseButton
                    :variant="sortKey === 'birthDate' ? 'info' : 'outline-secondary'"
                    class="btn-sm"
                    aria-label="Sort by date of birth"
                    @click="toggleSort('birthDate')"
                  >
                    <BaseIcon :name="birthDateIcon" />
                  </BaseButton>
                </span>
              </th>
              <th scope="col">Email</th>
              <th scope="col">Phone number</th>
              <th scope="col"><span class="visually-hidden">Edit</span></th>
              <th scope="col"><span class="visually-hidden">Delete</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(participant, index) in displayedParticipants" :key="participant.id">
              <td class="text-secondary">{{ index + 1 }}</td>
              <td>{{ participant.name }}</td>
              <td>{{ participant.birthDate }}</td>
              <td>{{ participant.email }}</td>
              <td>{{ participant.phone }}</td>
              <td>
                <BaseButton
                  variant="secondary"
                  class="btn-sm"
                  @click="emit('request-edit', participant)"
                >
                  Редагувати дані
                </BaseButton>
              </td>
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
            <tr v-if="displayedParticipants.length === 0">
              <td colspan="7" class="text-center text-secondary py-3">No participants found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>