import { readLivingIndex } from '@/lib/living-index/server'
export const dynamic = 'force-dynamic'
export async function GET() {
  try { return Response.json(await readLivingIndex(),{headers:{'cache-control':'no-store'}}) }
  catch { return Response.json({error:'Living Index is temporarily unavailable.'},{status:503,headers:{'cache-control':'no-store'}}) }
}
