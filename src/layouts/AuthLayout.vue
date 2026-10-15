<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
</script>

<template>
  <div class="container py-5" style="max-width: 420px">
    <div class="text-center mb-4">
      <AppLogo />
    </div>
    <main>
      <slot />
    </main>
  </div>
</template>