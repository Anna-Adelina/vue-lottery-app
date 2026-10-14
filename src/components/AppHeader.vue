<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
import AppNavigation from '@/components/AppNavigation.vue'
</script>

<template>
  <header class="app-header">
    <AppLogo />
    <AppNavigation />
  </header>
</template>

<style scoped lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgb(0 0 0 / 15%);
}
</style>