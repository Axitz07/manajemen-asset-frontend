const normalizeBasePath = (value = '/') => {
  const trimmed = String(value ?? '').trim()

  if (!trimmed || trimmed === '/' || trimmed === 'undefined' || trimmed === 'null') {
    return '/'
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`
}

const normalizeRoutePath = (value = '/') => {
  const trimmed = String(value ?? '').trim()

  if (!trimmed || trimmed === '/' || trimmed === 'undefined' || trimmed === 'null') {
    return '/'
  }

  return `/${trimmed.replace(/^\/+/, '')}`
}

export const appConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Manajemen Asset',
  basePath: normalizeBasePath(import.meta.env.VITE_APP_BASE_PATH ?? import.meta.env.BASE_URL ?? '/'),
  defaultRoute: normalizeRoutePath(import.meta.env.VITE_APP_DEFAULT_ROUTE ?? '/dashboard'),
  useMockData: String(import.meta.env.VITE_USE_MOCK_DATA || 'true') === 'true',
  apiBaseUrl: String(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/+$/, ''),
}

export function withBasePath(path = '/') {
  const routePath = normalizeRoutePath(path)

  if (appConfig.basePath === '/') {
    return routePath
  }

  if (routePath === '/') {
    return appConfig.basePath.replace(/\/$/, '')
  }

  return `${appConfig.basePath.replace(/\/$/, '')}${routePath}`
}

export function stripBasePath(pathname = '/') {
  if (appConfig.basePath !== '/' && pathname.startsWith(appConfig.basePath)) {
    const nextPath = pathname.slice(appConfig.basePath.length)
    return normalizeRoutePath(nextPath || '/')
  }

  return normalizeRoutePath(pathname || '/')
}
