import { defineAction } from 'astro:actions'

export const server = {
  getDownloadURL: defineAction<string | null>({
    async handler() {
      try {
        const response = await fetch(
          'https://api.github.com/repos/queryeditor/queryeditor/releases'
        )

        if (!response.ok) {
          return null
        }

        const releases = await response.json()

        const latest = releases[0]

        const exe = latest.assets.find((asset: any) =>
          asset.name.endsWith('.exe')
        )

        if (!exe) {
          return null
        }

        return exe.browser_download_url
      } catch (error) {
        return null
      }
    }
  })
}
