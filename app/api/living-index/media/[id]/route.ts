import { apiBase } from '@/lib/living-index/server'
export const dynamic = 'force-dynamic'
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}) {
  const {id} = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return new Response(null,{status:404})
  try {
    const response = await fetch(`${apiBase()}/v1/public/living-index/media/${id}`,{cache:'no-store',signal:AbortSignal.timeout(15000)})
    if (!response.ok) return new Response(null,{status:response.status === 404 ? 404 : 503,headers:{'cache-control':'no-store'}})
    if (response.headers.get('content-type') !== 'image/webp') throw new Error('Unexpected media type')
    return new Response(response.body,{headers:{'content-type':'image/webp','cache-control':'public, max-age=120, must-revalidate','x-content-type-options':'nosniff'}})
  } catch { return new Response(null,{status:503,headers:{'cache-control':'no-store'}}) }
}
