import { ref } from 'vue'
import { apiRequest } from '../lib/api'

const AUTH_STORAGE_KEY = 'asset-app-auth'

const readStoredAuth = () => {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (parsed?.user && parsed?.token) {
      return parsed
    }

    if (parsed?.id) {
      return {
        user: parsed,
        token: '',
      }
    }

    return null
  } catch {
    return null
  }
}

const writeStoredAuth = (user, token) => {
  if (typeof window === 'undefined') return

  if (!user || !token) {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }

  window.sessionStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      user,
      token,
    }),
  )
}

const storedAuth = readStoredAuth()

export const currentUser = ref(storedAuth?.user ?? null)
export const authToken = ref(storedAuth?.token ?? '')

export function isAuthenticated() {
  return Boolean(currentUser.value?.id && authToken.value)
}

export function isAdmin() {
  return currentUser.value?.role === 'admin'
}

export function getDefaultRouteByRole() {
  return '/dashboard'
}

export function getAuthToken() {
  return authToken.value
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
  authToken.value = response.token || ''
  writeStoredAuth(currentUser.value, authToken.value)
  return currentUser.value
}

export function logout() {
  currentUser.value = null
  authToken.value = ''
  writeStoredAuth(null, '')
}
