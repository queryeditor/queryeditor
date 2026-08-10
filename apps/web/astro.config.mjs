// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'

const PAGE =
  process.env.DOCS_PAGE_URL ||
  import.meta.env.DOCS_PAGE_URL ||
  'https://queryeditor.com'

export default defineConfig({
  site: PAGE,
  output: 'static',
  adapter: cloudflare(),
  vite: {
    envDir: '../../',
    plugins: [tailwindcss()]
  },
  integrations: [mdx()]
})
