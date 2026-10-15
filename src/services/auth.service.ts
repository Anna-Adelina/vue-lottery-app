import { http } from '@/api/http-client'
import type { AuthUser, LoginCredentials, LoginResponse, RefreshResponse } from '@/types/auth'

export class AuthService {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  getMe(accessToken: string): Promise<AuthUser> {
    return http<AuthUser>('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }

  refresh(refreshToken: string): Promise<RefreshResponse> {
    return http<RefreshResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  }
}