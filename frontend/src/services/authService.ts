import api from './api'
import type { AuthResponse, ProfileResponse } from '../types'

export const authService = {
  async login(cpf: string, password: string) {
    const { data } = await api.post<AuthResponse>('/login', { cpf, password })
    return data
  },
  async profile() {
    const { data } = await api.get<ProfileResponse>('/me')
    return data
  },
  async logout() {
    await api.post('/logout')
  },
}
