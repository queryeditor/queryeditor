import type { APIRoute } from 'astro'
import seo from '@/const/seo'

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site ? site.toString() : seo.url).replace(/\/$/, '')
  const routes = [
    '',
    '/about',
    '/changelog',
    '/legal/terms-and-conditions',
    '/legal/privacy-policy',
    '/legal/eula'
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  })
}
