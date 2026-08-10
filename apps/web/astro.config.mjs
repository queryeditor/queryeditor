// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'

export default defineConfig({
  site: process.env.HOME_PAGE_URL || import.meta.env.HOME_PAGE_URL || 'https://queryeditor.dev',
  output: 'static',
  adapter: cloudflare(),
  vite: {
    envDir: '../../',
    plugins: [tailwindcss()]
  },
  integrations: [mdx()]
})
