<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from './components/BaseButton.vue'
import BaseInput from './components/BaseInput.vue'

const name = ref('')
</script>

<template>
  <main class="container py-4">
    <BaseInput v-model="name" label="Name" placeholder="Enter user name" :error="name ? '' : 'This value is required.'" />
    <BaseButton>Save</BaseButton>
    <BaseButton variant="danger" disabled>Disabled</BaseButton>
  </main>
</template>