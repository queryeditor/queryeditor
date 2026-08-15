import { defineAction } from 'astro:actions'
import getPlatformFromUserAgent from '../utils/get-platform-from-user-agent'

export const server = {
  getDownloadURL: defineAction<string | null>({
    async handler(_, context) {
      try {
        const response = await fetch(
          'https://api.github.com/repos/queryeditor/queryeditor/releases',
          {
            headers: {
              Accept: 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
              'User-Agent': 'QueryEditor'
            }
          }
        )

        if (!response.ok) {
          return null
        }

        const releases = await response.json()
        const latest = releases[0]

        if (!latest?.assets) {
          return null
        }

        const userAgent = context.request.headers.get('user-agent')?.toLowerCase() || ''
        const platform = getPlatformFromUserAgent(userAgent)

        const extensionMap: Record<string, string[]> = {
          windows: ['.exe'],
          mac: ['.dmg', '.zip'],
          linux: ['.AppImage', '.deb']
        }

        const targetExtensions = extensionMap[platform] || ['.exe']

        const asset =
          latest.assets.find((item: any) =>
            targetExtensions.some((ext) => item.name.toLowerCase().endsWith(ext.toLowerCase()))
          ) || latest.assets.find((item: any) => item.name.endsWith('.exe'))

        if (!asset) {
          return null
        }

        return asset.browser_download_url
      } catch (error) {
        return null
      }
    }
  })
}
