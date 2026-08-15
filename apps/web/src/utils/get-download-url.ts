import getPlatformFromUserAgent from './get-platform-from-user-agent'

export const getDownloadURL = async (): Promise<string | null> => {
  try {
    const userAgent = (navigator.userAgent || '').toLowerCase()
    const platform = getPlatformFromUserAgent(userAgent)

    const response = await fetch(
      'https://api.github.com/repos/queryeditor/queryeditor/releases',
      {
        headers: {
          Accept: 'application/vnd.github+json'
        }
      }
    )

    if (!response.ok) return null

    const releases = await response.json()
    const latest = releases[0]

    if (!latest?.assets) return null

    // Windows
    const exe = latest.assets.find((asset: any) => asset.name.endsWith('.exe'))

    // macOS
    const dmg = latest.assets.find((asset: any) => asset.name.endsWith('.dmg'))

    // Linux
    const deb = latest.assets.find((asset: any) => asset.name.endsWith('.deb'))

    if (platform === 'mac' && dmg) return dmg.browser_download_url
    if (platform === 'linux' && deb) return deb.browser_download_url
    if (exe) return exe.browser_download_url

    return null
  } catch (error) {
    return null
  }
}

export default getDownloadURL
