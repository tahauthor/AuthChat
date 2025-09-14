import { create } from 'zustand'
import { api } from '../lib/api'

type User = {
  id: string
  role: 'owner' | 'tenant' | 'admin'
  fullName: string
  email: string
}

type AuthState = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string, role: 'owner' | 'tenant') => Promise<void>
  fetchMe: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  async login(email, password) {
    set({ loading: true })
    const { data } = await api.post('/api/auth/login', { email, password })
    set({ user: data.user, token: data.token, loading: false })
  },
  async register(fullName, email, password, role) {
    set({ loading: true })
    const { data } = await api.post('/api/auth/register', { fullName, email, password, role })
    set({ user: data.user, token: data.token, loading: false })
  },
  async fetchMe() {
    set({ loading: true })
    try {
      const { data } = await api.get('/api/auth/me')
      set({ user: data.user, loading: false })
    } catch {
      set({ user: null, token: null, loading: false })
    }
  },
  async logout() {
    await api.post('/api/auth/logout')
    set({ user: null, token: null })
  },
}))

