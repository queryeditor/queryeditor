import { DOCS_PAGE_URL } from '@queryeditor/shared/lib/env'

export default (path?: string): string => {
  let base = ''

  try {
    const { pathname } = new URL(DOCS_PAGE_URL ?? '')
    base = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  } catch {
    base = ''
  }

  const cleanPath = path?.startsWith('/') ? path : `/${path}`

  if (base && cleanPath === '/') return base

  return `${base}${cleanPath}`
}
