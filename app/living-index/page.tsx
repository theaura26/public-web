import LivingIndexHub from '@/components/living-index/LivingIndexHub'
import Provider from '@/components/living-index/LivingIndexProvider'
import Unavailable from '@/components/living-index/Unavailable'
import { readLivingIndex } from '@/lib/living-index/server'
export const dynamic = 'force-dynamic'
export default async function Page() {
  const data = await readLivingIndex().catch(() => null)
  if (!data) return <Unavailable />
  return <Provider initial={data}><LivingIndexHub /></Provider>
}
