<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <section>
    <h2>Редагування користувача #{{ id }}</h2>
    <p>Форма буде на наступному етапі.</p>
    <RouterLink :to="{ name: 'user-detail', params: { id } }">Скасувати</RouterLink>
  </section>
</template>