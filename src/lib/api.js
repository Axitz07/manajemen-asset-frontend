import { appConfig } from './env'

const AUTH_STORAGE_KEY = 'asset-app-auth'

const buildUrl = (path = '') => {
  if (!appConfig.apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL belum diatur di file .env')
  }

  const cleanedPath = String(path || '').replace(/^\/+/, '')
  return `${appConfig.apiBaseUrl}/${cleanedPath}`
}

const readStoredToken = () => {
  if (typeof window === 'undefined') return ''

  try {
    const storages = [window.localStorage, window.sessionStorage]

    for (const storage of storages) {
      const raw = storage.getItem(AUTH_STORAGE_KEY)
      if (!raw) continue

      const parsed = JSON.parse(raw)
      const token = String(parsed?.token || '').trim()
      if (token) return token
    }
  } catch {
    return ''
  }

  return ''
}

const buildHeaders = (options = {}) => {
  const headers = new Headers(options.headers || {})

  headers.set('Accept', 'application/json')

  if (options.body !== undefined && options.body !== null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = readStoredToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return headers
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: buildHeaders(options),
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload?.message
        ? payload.message
        : typeof payload === 'object' && payload?.error
          ? payload.error
        : typeof payload === 'string'
          ? payload
          : 'API request gagal.'
    throw new Error(message)
  }

  return payload
}
