import type { APIRoute } from 'astro'
import { getSlugs } from 'slugtree'
import seo from '@/const/seo'

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site ? site.toString() : seo.url).replace(/\/$/, '')
  const slugs = getSlugs()
  const today = new Date().toISOString().split('T')[0]

  const routes = Array.from(
    new Set(
      slugs.map((slug) => {
        const pathStr = Array.isArray(slug) ? slug.join('/') : slug
        return pathStr ? `/${pathStr}` : ''
      })
    )
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const isRoot = route === ''
    const depth = route.split('/').filter(Boolean).length
    const priority = isRoot ? '1.0' : depth > 1 ? '0.6' : '0.8'
    const changefreq = isRoot ? 'daily' : 'weekly'

    return `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  })
}
