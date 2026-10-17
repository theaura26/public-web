import assert from 'node:assert/strict'
import { snapshotSchema } from '../lib/living-index/contract'
const base = (process.env.LIVING_INDEX_SITE_URL ?? 'http://localhost:3010').replace(/\/$/,'')
const res = await fetch(base+'/api/living-index')
assert.equal(res.status,200)
assert.equal(res.headers.get('cache-control'),'no-store')
const data = snapshotSchema.parse(await res.json())
assert.ok(data.animals.length > 0,'No published animals returned')
assert.equal(new Set(data.animals.map(c => c.slug)).size,data.animals.length)
for (const path of ['/living-index','/living-index/cows','/living-index/cows/'+data.animals[0].slug]) {
 const page = await fetch(base+path);assert.equal(page.status,200,path)
 const html = await page.text();assert.ok(html.includes('Cows of Aura'),path);assert.ok(!html.includes('temporarily unavailable'),path)
}
assert.equal((await fetch(base+'/living-index/cows/not-a-published-cow')).status,404)
const image = Object.values(data.animals.find(c => c.images.photo)?.images ?? {})[0]
if (image) { const photo = await fetch(base+image.replace('/v1/public/living-index/media/','/api/living-index/media/'));assert.equal(photo.status,200);assert.equal(photo.headers.get('content-type'),'image/webp') }
console.log(JSON.stringify({base,publishedAnimals:data.animals.length,milkDaysByCow:data.milk.length,collectionDays:data.collections.length,generatedAt:data.generatedAt,checks:'passed'},null,2))
