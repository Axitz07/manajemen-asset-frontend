import { ref } from 'vue'
import { apiRequest } from '../lib/api'

const AUTH_STORAGE_KEY = 'asset-app-auth'

const readStoredUser = () => {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeStoredUser = (user) => {
  if (typeof window === 'undefined') return

  if (!user) {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }

  window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

export const currentUser = ref(readStoredUser())

export function isAuthenticated() {
  return Boolean(currentUser.value?.id)
}

export function isAdmin() {
  return currentUser.value?.role === 'admin'
}

export function isStaff() {
  return currentUser.value?.role === 'staff'
}

export function getDefaultRouteByRole(role = currentUser.value?.role) {
  return role === 'admin' ? '/dashboard' : '/assets'
}

export async function login(payload) {
  const response = await apiRequest('login', {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
  })

  currentUser.value = response.data || null
  writeStoredUser(currentUser.value)
  return currentUser.value
}

export function logout() {
  currentUser.value = null
  writeStoredUser(null)
}
