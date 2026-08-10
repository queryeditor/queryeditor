// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import slugtree from 'slugtree/astro'
import preact from '@astrojs/preact'

const PAGE =
  process.env.DOCS_PAGE_URL ||
  import.meta.env.DOCS_PAGE_URL ||
  'https://docs.queryeditor.com'

const BASE = process.env.BASE_URL || import.meta.env.BASE_URL || '/'

export default defineConfig({
  site: PAGE,
  output: 'static',
  adapter: cloudflare({
    prerenderEnvironment: 'node'
  }),
  integrations: [
    slugtree({
      basePath: BASE
    }),
    preact()
  ],
  vite: {
    envDir: '../../',
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
