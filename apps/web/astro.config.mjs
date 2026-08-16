// @ts-check
import path from 'node:path'
import { loadEnvFile } from 'node:process'
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'

try {
  loadEnvFile(path.resolve(import.meta.dirname, '../../.env'))
} catch {}

const SITE = process.env.HOME_SITE ?? 'http://localhost:4321'
const BASE = process.env.HOME_BASE ?? '/'

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  prefetch: true,
  vite: {
    envDir: '../../',
    plugins: [tailwindcss()]
  },
  integrations: [mdx()]
})
