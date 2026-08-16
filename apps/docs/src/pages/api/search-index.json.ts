import type { APIRoute } from 'astro'
import { getAllNodes } from 'slugtree'

export const prerender = true

export const GET: APIRoute = async () => {
  const nodes = getAllNodes()
    .filter(
      (node) =>
        node.type === 'page' ||
        (node.type === 'folder' && node.href !== undefined)
    )
    .map((node) => ({
      id: node.slug.join('/'),
      title: node.frontMatter.title || '',
      description: node.frontMatter.description || '',
      icon: node.frontMatter.icon || '',
      href: node.href || '',
      toc: node.toc || [],
      rawContent: node.rawContent || ''
    }))

  return new Response(JSON.stringify(nodes), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  })
}
