import { create } from 'zustand'
import { api } from '../lib/api'

type User = { id: string; role: 'admin'; fullName: string; email: string }

type AuthState = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  me: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  async login(email, password) {
    const { data } = await api.post('/api/auth/login', { email, password })
    if (data.user.role !== 'admin') throw new Error('Not admin')
    set({ user: data.user })
  },
  async logout() {
    await api.post('/api/auth/logout')
    set({ user: null })
  },
  async me() {
    try {
      const { data } = await api.get('/api/auth/me')
      if (data.user.role !== 'admin') throw new Error('Not admin')
      set({ user: data.user })
    } catch {
      set({ user: null })
    }
  },
}))

