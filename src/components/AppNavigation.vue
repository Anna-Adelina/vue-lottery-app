<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface NavItem {
  label: string
  to: string
}

const items: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About author', to: '/about' },
  { label: 'Users', to: '/users' },
]

const auth = useAuthStore()
const router = useRouter()

async function logout(): Promise<void> {
  auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <nav class="app-navigation">
    <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="app-navigation__link">
      {{ item.label }}
    </RouterLink>

    <button v-if="auth.isAuthenticated" type="button" class="app-navigation__link" @click="logout">
      Logout
    </button>
    <RouterLink v-else to="/login" class="app-navigation__link">Login</RouterLink>
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

    // Активний пункт підсвічується
    &.router-link-active {
      font-weight: 600;
      border-bottom-color: currentColor;
    }
  }

  // кнопка Logout має виглядати як решта пунктів
  button.app-navigation__link {
    background: none;
    border-top: 0;
    border-right: 0;
    border-left: 0;
    font: inherit;
    cursor: pointer;
  }
}
</style>