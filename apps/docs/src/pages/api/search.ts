import type { APIRoute } from 'astro'
import {searchContent} from 'slugtree'


export const GET: APIRoute = async (request) => {
  const query = new URL(request.url).searchParams.get('query')

  if (!query) return Response.json([])

  const items = searchContent(query)

  return Response.json(items)
}
