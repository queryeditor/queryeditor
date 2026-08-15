// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'

const SITE = import.meta.env.HOME_SITE || 'http://localhost:4321'
const BASE = import.meta.env.HOME_BASE || '/'

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  adapter: cloudflare({
    prerenderEnvironment: 'node'
  }),
  vite: {
    envDir: '../../',
    plugins: [tailwindcss()]
  },
  integrations: [mdx()]
})
