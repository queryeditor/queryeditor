// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import slugtree from 'slugtree/astro'
import preact from '@astrojs/preact'

export default defineConfig({
  output: 'static',
  integrations: [
    slugtree({
      basePath: import.meta.env.BASE_URL || '/'
    }),
    preact()
  ],
  site: process.env.DOCS_PAGE_URL || import.meta.env.DOCS_PAGE_URL,
  vite: {
    envDir: '../../',
    plugins: [tailwindcss()]
  }
})
