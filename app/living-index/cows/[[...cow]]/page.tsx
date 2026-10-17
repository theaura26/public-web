import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CowIndex from '@/components/living-index/CowIndex'
import Provider from '@/components/living-index/LivingIndexProvider'
import Unavailable from '@/components/living-index/Unavailable'
import { readLivingIndex } from '@/lib/living-index/server'
export const dynamic = 'force-dynamic'
type Params = {cow?:string[]}
export async function generateMetadata({params}:{params:Promise<Params>}):Promise<Metadata> {
  const {cow} = await params
  const slug = cow?.[0]
  // Keep metadata public and stable even if the live service is unavailable.
  return { title:'Cows of Aura — Living Index',description:'The published herd register and daily records at Aura, Mudigere.',
    alternates:{canonical:slug ? `/living-index/cows/${encodeURIComponent(slug)}` : '/living-index/cows'},
    openGraph:{images:[{url:'/living-index/video/cows-of-aura-poster.jpg'}]} }
}
export default async function Page({params}:{params:Promise<Params>}) {
  const {cow} = await params
  if (cow && (cow.length > 1 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cow[0]))) notFound()
  const data = await readLivingIndex().catch(() => null)
  if (!data) return <Unavailable />
  if (cow && !data.animals.some(a => a.slug === cow[0])) notFound()
  return <Provider initial={data}><CowIndex /></Provider>
}
