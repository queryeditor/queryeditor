import fs from 'node:fs'
import path from 'node:path'

const serverDir = path.resolve(import.meta.dirname, '../dist/server')
fs.mkdirSync(serverDir, { recursive: true })

const config = {
  name: 'queryeditor-docs',
  compatibility_date: '2026-02-24',
  compatibility_flags: ['nodejs_compat', 'global_fetch_strictly_public'],
  assets: {
    directory: '../client'
  },
  observability: {
    enabled: true
  }
}

fs.writeFileSync(
  path.join(serverDir, 'wrangler.json'),
  JSON.stringify(config, null, 2)
)
