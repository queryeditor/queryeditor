export const HOME_PAGE_URL: string =
  import.meta.env.HOME_PAGE_URL ||
  (typeof process !== 'undefined' ? process.env.HOME_PAGE_URL : '') ||
  'https://queryeditor.dev'

export const DOCS_PAGE_URL: string =
  import.meta.env.DOCS_PAGE_URL ||
  (typeof process !== 'undefined' ? process.env.DOCS_PAGE_URL : '') ||
  'https://docs.queryeditor.dev'
