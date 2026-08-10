// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import slugtree from 'slugtree/astro'
import node from '@astrojs/node'
import preact from '@astrojs/preact'

export default defineConfig({
  output: 'server',
  adapter:
    import.meta.env.NODE_ENV === 'production'
      ? cloudflare()
      : node({
          mode: 'standalone'
        }),
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
