<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="container py-4" style="max-width: 960px">
    <AppHeader />
    <main>
      <RouterView />
    </main>
  </div>
</template>