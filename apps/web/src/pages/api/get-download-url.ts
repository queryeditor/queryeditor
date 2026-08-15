import getPlatformFromUserAgent from '@/utils/get-platform-from-user-agent'
import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ url, request }) => {
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase()

  const platform = getPlatformFromUserAgent(userAgent)

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

    if (!response.ok) return Response.json(null)

    const releases = await response.json()

    const latest = releases[0]

    // Windows
    const exe = latest.assets.find((asset: any) => asset.name.endsWith('.exe'))

    // macOS
    const dmg = latest.assets.find((asset: any) => asset.name.endsWith('.dmg'))

    // Linux
    const deb = latest.assets.find((asset: any) => asset.name.endsWith('.deb'))

    if (platform === 'mac') return Response.json(dmg?.browser_download_url)
    if (platform === 'linux') return Response.json(deb?.browser_download_url)
    if (platform === 'windows') return Response.json(exe?.browser_download_url)

    return Response.json(null)
  } catch (error) {
    return Response.json(null)
  }
}
