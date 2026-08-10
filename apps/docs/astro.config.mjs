// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import slugtree from 'slugtree/astro'
import preact from '@astrojs/preact'

const PAGE =
  process.env.DOCS_PAGE_URL ||
  import.meta.env.DOCS_PAGE_URL ||
  'https://docs.queryeditor.com'

const BASE_URL = process.env.BASE_URL || import.meta.env.BASE_URL || '/'

export default defineConfig({
  site: PAGE,
  output: 'server',
  integrations: [
    slugtree({
      basePath: BASE_URL
    }),
    preact()
  ],
  vite: {
    envDir: '../../',
    plugins: [tailwindcss()]
  }
})
