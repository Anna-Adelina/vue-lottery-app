<script setup lang="ts">
interface NavItem {
  label: string
  to: string
}

const items: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About author', to: '/about' },
  { label: 'Users', to: '/users' },
  { label: 'Login', to: '/login' },
]
</script>

<template>
  <nav class="app-navigation">
    <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="app-navigation__link">
      {{ item.label }}
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.app-navigation {
  display: flex;
  gap: 1rem;

  &__link {
    color: inherit;
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    border-bottom: 2px solid transparent;

    // клас додає vue-router, коли маршрут активний
    &.router-link-active {
      font-weight: 600;
      border-bottom-color: currentColor;
    }
  }
}
</style>