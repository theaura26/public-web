'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { snapshotSchema, REFRESH_MS, type Snapshot } from '@/lib/living-index/contract'
import { birthdaysOn, newestMember, eldest, cowOfTheDay, type Cow } from '@/lib/living-index/cows'
import { byWeek, lastDays, sum } from '@/lib/living-index/herd-logs'

function directory(snapshot: Snapshot) {
  const cows: Cow[] = snapshot.animals.map(a => ({
    slug:a.slug, name:a.name ?? a.cowId, cowId:a.cowId, type:a.type, sex:a.sex ?? 'Unknown',
    breed:a.breed ?? 'Unknown', born:a.born, bornEstimated:a.bornPrecision !== 'date', joined:a.joined,
    dam:a.dam, sire:a.sire, nameMeaning:a.nameMeaning,
    bornAtAura:false, role:null, markings:null, zone:null,
    hasPhoto:!!a.images.photo, hasPlates:!!a.images.green,
    images:Object.fromEntries(Object.entries(a.images).map(([kind,path]) => [kind, path.replace('/v1/public/living-index/media/','/api/living-index/media/') ])),
  })).sort((a,b) => a.name.localeCompare(b.name))
  const bySlug = new Map(cows.map(c => [c.slug,c]))
  const byId = new Map(cows.map(c => [c.cowId,c]))
  const milkFor = (cowId: string) => {
    const mine = snapshot.milk.filter(m => m.cowId === cowId && m.litres !== null)
    if (!mine.length) return null
    const recent = lastDays(mine,30,snapshot.today)
    const total30 = sum(recent.map(d => d.litres!))
    return { cowId, last30:total30, last30Days:recent.length, perDay30:recent.length ? total30/recent.length : 0,
      total:sum(mine.map(d => d.litres!)), firstMilked:mine[0].date,lastMilked:mine.at(-1)!.date,
      weeks:byWeek(mine,d => d.litres), missingSessions:sum(snapshot.milk.filter(m => m.cowId === cowId).map(m => m.missingSessions)),
    }
  }
  return { snapshot, COWS:cows, HERD_SIZE:cows.length, HERD_TO_ADD:0, HERD_IS_PLACEHOLDER:false, HERD_UPDATED:snapshot.today,
    cowBySlug:(slug?:string|null) => slug ? bySlug.get(slug) : undefined,
    cowById:(id?:string|null) => id ? byId.get(id) : undefined,
    childrenOf:(slug:string) => cows.filter(c => c.dam === slug || c.sire === slug),
    siblingsOf:(cow:Cow) => cow.dam ? cows.filter(c => c.dam === cow.dam && c.slug !== cow.slug) : [],
    birthdaysOn:(today:Parameters<typeof birthdaysOn>[0]) => birthdaysOn(today,cows),
    newestMember:(today:Parameters<typeof newestMember>[0]) => newestMember(today,cows),
    eldest:() => eldest(cows), cowOfTheDay:(today:Parameters<typeof cowOfTheDay>[0]) => cowOfTheDay(today,cows), milkFor,
  }
}
const Context = createContext<ReturnType<typeof directory> | null>(null)
export function useLivingIndex() {
  const value = useContext(Context)
  if (!value) throw new Error('Living Index provider missing')
  return value
}
export default function LivingIndexProvider({ initial, children }: { initial: Snapshot; children: React.ReactNode }) {
  const [snapshot,setSnapshot] = useState(initial)
  const [failed,setFailed] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    let busy = false
    const refresh = async () => {
      if (busy || document.visibilityState === 'hidden') return
      busy = true
      try {
        const res = await fetch('/api/living-index', { cache:'no-store',signal:AbortSignal.any([controller.signal,AbortSignal.timeout(20000)]) })
        if (!res.ok) throw new Error('Refresh failed')
        const next = snapshotSchema.parse(await res.json())
        if (!controller.signal.aborted) { setSnapshot(next);setFailed(false) }
      } catch { if (!controller.signal.aborted) setFailed(true) }
      finally { busy = false }
    }
    const interval = setInterval(refresh, REFRESH_MS)
    const visible = () => { if (document.visibilityState === 'visible') void refresh() }
    document.addEventListener('visibilitychange',visible)
    return () => { clearInterval(interval);document.removeEventListener('visibilitychange',visible);controller.abort() }
  },[])
  const value = useMemo(() => directory(snapshot),[snapshot])
  return <Context.Provider value={value}>
    {failed && <p role="status" className="section-w" style={{paddingTop:'var(--nav-h)'}}>The live connection is delayed. Showing the last successful update from {new Date(snapshot.generatedAt).toLocaleString('en-GB',{timeZone:'Asia/Kolkata'})} IST. We’ll retry automatically.</p>}
    {children}
  </Context.Provider>
}
