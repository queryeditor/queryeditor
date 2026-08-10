// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import node from '@astrojs/node'
import mdx from '@astrojs/mdx'

export default defineConfig({
  site: process.env.HOME_PAGE_URL || import.meta.env.HOME_PAGE_URL,
  output: 'server',
  adapter:
    import.meta.env.NODE_ENV === 'production'
      ? cloudflare()
      : node({
          mode: 'standalone'
        }),
  vite: {
    envDir: '../../',
    plugins: [tailwindcss()]
  },

  integrations: [mdx()]
})
