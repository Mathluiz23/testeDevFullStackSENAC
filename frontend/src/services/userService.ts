import api from './api'
import type { RoleOption, UserModel, UserPayload } from '../types'

export const userService = {
  async list() {
    const { data } = await api.get<{ data: UserModel[] }>('/users')
    return data.data
  },
  async roles() {
    const { data } = await api.get<RoleOption[]>('/roles')
    return data
  },
  async create(payload: UserPayload) {
    const { data } = await api.post<{ data: UserModel }>('/users', payload)
    return data.data
  },
  async update(id: number, payload: Partial<UserPayload>) {
    const { data } = await api.put<{ data: UserModel }>(`/users/${id}`, payload)
    return data.data
  },
  async remove(id: number) {
    await api.delete(`/users/${id}`)
  },
}
