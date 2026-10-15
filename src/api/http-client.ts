const BASE_URL = import.meta.env.VITE_API_URL

// ці запити токена не потребують, і оновлювати його при їхньому 401 безглуздо
const PUBLIC_PATHS = ['/auth/login', '/auth/refresh']

interface AuthHandlers {
  getAccessToken: () => string | null
  // повертає новий accessToken або null, якщо оновити не вдалось
  refreshAccessToken: () => Promise<string | null>
}

let authHandlers: AuthHandlers | null = null

export function configureAuth(handlers: AuthHandlers): void {
  authHandlers = handlers
}

function request(path: string, options: RequestInit, token: string | null): Promise<Response> {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  new Headers(options.headers).forEach((value, key) => headers.set(key, value))
  if (token) headers.set('Authorization', `Bearer ${token}`)

  return fetch(`${BASE_URL}${path}`, { ...options, headers })
}

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isPublic = PUBLIC_PATHS.includes(path)
  const token = isPublic ? null : (authHandlers?.getAccessToken() ?? null)

  let response = await request(path, options, token)

  // токен протух → оновлюємо і повторюємо запит один раз
  if (response.status === 401 && !isPublic && authHandlers) {
    const newToken = await authHandlers.refreshAccessToken()
    if (newToken) response = await request(path, options, newToken)
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}