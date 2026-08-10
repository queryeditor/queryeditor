// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import slugtree from 'slugtree/astro'
import preact from '@astrojs/preact'

export default defineConfig({
  site: process.env.DOCS_PAGE_URL || import.meta.env.DOCS_PAGE_URL || 'https://docs.queryeditor.dev',
  output: 'static',
  integrations: [
    slugtree({
      basePath: import.meta.env.BASE_URL || '/'
    }),
    preact()
  ],
  vite: {
    envDir: '../../',
    plugins: [tailwindcss()]
  }
})
