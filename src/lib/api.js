import { appConfig } from './env'

const buildUrl = (path = '') => {
  const cleanedPath = String(path || '').replace(/^\/+/, '')
  return `${appConfig.apiBaseUrl}/${cleanedPath}`
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload?.error
        ? payload.error
        : typeof payload === 'string'
          ? payload
          : 'API request gagal.'
    throw new Error(message)
  }

  return payload
}
