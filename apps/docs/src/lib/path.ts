import { APP } from '@queryeditor/shared/lib/const'

export default (path?: string): string => {
  let base = ''
  try {
    const { pathname } = new URL(
      APP.urls.docs.site + (APP.urls.docs.base ?? '')
    )

    base = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  } catch {
    base = ''
  }

  const cleanPath = path?.startsWith('/') ? path : `/${path}`

  if (base && cleanPath === '/') return base

  return `${base}${cleanPath}`
}
