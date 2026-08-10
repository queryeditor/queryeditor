// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import slugtree from 'slugtree/astro'
import preact from '@astrojs/preact'

export default defineConfig({
  site:
    process.env.DOCS_PAGE_URL ||
    import.meta.env.DOCS_PAGE_URL ||
    'https://docs.queryeditor.dev',
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    slugtree({
      basePath: import.meta.env.BASE_URL || '/'
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
