import 'server-only'
import { snapshotSchema } from './contract'

export function apiBase() {
  const value = process.env.AURA_PUBLIC_API_BASE_URL ?? 'https://aura-api-auth-1030880733562.asia-south1.run.app'
  const url = new URL(value)
  if (url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Invalid public API base URL')
  if (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && ['localhost','127.0.0.1'].includes(url.hostname))) throw new Error('Public API requires HTTPS')
  return url.origin
}
export async function readLivingIndex() {
  const response = await fetch(`${apiBase()}/v1/public/living-index`, { cache: 'no-store', signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`Public Living Index returned ${response.status}`)
  return snapshotSchema.parse(await response.json())
}
