// @ts-check
import path from 'node:path'
import { loadEnvFile } from 'node:process'
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import slugtree from 'slugtree/astro'
import preact from '@astrojs/preact'

try {
  loadEnvFile(path.resolve(import.meta.dirname, '../../.env'))
} catch {}

const SITE = process.env.DOCS_SITE ?? 'http://localhost:4322'
const BASE = process.env.DOCS_BASE ?? '/'

export default defineConfig({
  site: SITE,
  output: 'static',
  base: BASE,
  prefetch: true,
  adapter: cloudflare({
    prerenderEnvironment: 'node'
  }),
  integrations: [
    slugtree({
      basePath: BASE
    }),
    preact({ compat: true })
  ],
  vite: {
    envDir: '../../',
    resolve: {
      dedupe: ['preact', 'preact/hooks', 'preact/compat']
    },
    plugins: [
      tailwindcss(),
      {
        name: 'ssr-gray-matter-stub',
        enforce: 'pre',
        resolveId(id, _importer, opts) {
          if (opts?.ssr && id === 'gray-matter') return '\0gray-matter-stub'
        },
        load(id) {
          if (id === '\0gray-matter-stub') {
            return `const matter = () => ({ data: {}, content: '' });
export default matter;`
          }
        }
      }
    ]
  }
})
