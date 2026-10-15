import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/services/service-provider'
import type { AuthUser, LoginCredentials } from '@/types/auth'

const STORAGE_KEY = 'auth'

interface StoredAuth {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

function loadStored(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredAuth) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const stored = loadStored()

  const accessToken = ref<string | null>(stored?.accessToken ?? null)
  const refreshToken = ref<string | null>(stored?.refreshToken ?? null)
  const user = ref<AuthUser | null>(stored?.user ?? null)

  const isAuthenticated = computed<boolean>(() => accessToken.value !== null)

  function persist(): void {
    if (!accessToken.value || !refreshToken.value || !user.value) return
    const data: StoredAuth = {
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
      user: user.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    const tokens = await ServiceProvider.auth.login(credentials)
    // /auth/me вимагає заголовок Authorization: Bearer
    const me = await ServiceProvider.auth.getMe(tokens.accessToken)

    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    user.value = me
    persist()
  }

  function logout(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { accessToken, refreshToken, user, isAuthenticated, login, logout }
})