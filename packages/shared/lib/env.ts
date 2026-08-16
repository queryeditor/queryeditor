export const HOME_SITE: string =
  import.meta.env.HOME_SITE ||
  (typeof process !== 'undefined' ? process.env.HOME_SITE : '') ||
  'http://localhost:4321'

export const HOME_BASE: string =
  import.meta.env.HOME_BASE ||
  (typeof process !== 'undefined' ? process.env.HOME_BASE : '') ||
  '/'

export const DOCS_SITE: string =
  import.meta.env.DOCS_SITE ||
  (typeof process !== 'undefined' ? process.env.DOCS_SITE : '') ||
  'http://localhost:4322'

export const DOCS_BASE: string =
  import.meta.env.DOCS_BASE ||
  (typeof process !== 'undefined' ? process.env.DOCS_BASE : '') ||
  '/'
