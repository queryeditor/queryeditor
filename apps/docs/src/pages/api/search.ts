import type { APIRoute } from 'astro'
import { searchContent } from 'slugtree'

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('query')

  if (!query) return Response.json([])

  const items = searchContent(query)

  return Response.json(items)
}
