import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { configureAuth } from '@/api/http-client'
import { useAuthStore } from '@/stores/auth'
import './assets/styles/main.scss'

const app = createApp(App)
app.use(createPinia())
app.use(router)

const auth = useAuthStore()

configureAuth({
  getAccessToken: () => auth.accessToken,
  refreshAccessToken: async () => {
    const token = await auth.refreshAccessToken()
    // refresh не вдався → юзера розлогінено, відправляємо на логін
    if (!token && router.currentRoute.value.name !== 'login') {
      await router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
    }
    return token
  },
})

void auth.checkSession()

app.mount('#app')