// @ts-check
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import { loadEnvFile } from 'node:process'
import { defineConfig } from 'astro/config'
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
  integrations: [
    slugtree({
      basePath: BASE
    }),
    preact({ compat: true }),
    {
      name: 'wrangler-compatibility',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const serverDir = path.join(fileURLToPath(dir), 'server')
          await fs.mkdir(serverDir, { recursive: true })
          await fs.writeFile(
            path.join(serverDir, 'wrangler.json'),
            JSON.stringify(
              {
                name: 'queryeditor-docs',
                compatibility_date: '2026-02-24',
                compatibility_flags: [
                  'nodejs_compat',
                  'global_fetch_strictly_public'
                ],
                assets: {
                  directory: '../'
                },
                observability: {
                  enabled: true
                }
              },
              null,
              2
            )
          )
        }
      }
    }
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
