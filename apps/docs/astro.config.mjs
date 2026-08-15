// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import slugtree from 'slugtree/astro'
import preact from '@astrojs/preact'

const SITE = import.meta.env.DOCS_SITE || 'http://localhost:4322'
const BASE = import.meta.env.DOCS_BASE || '/'

export default defineConfig({
  site: SITE,
  output: 'static',
  base: BASE,
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
