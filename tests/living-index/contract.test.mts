import { test } from 'node:test'
import assert from 'node:assert/strict'
import { snapshotSchema } from '../../lib/living-index/contract'
import { isBirthday, type Cow } from '../../lib/living-index/cows'
import { lastDays, byWeek } from '../../lib/living-index/herd-logs'
const empty = { schemaVersion:1,generatedAt:'2026-10-17T00:00:00.000Z',today:'2026-10-17',timezone:'Asia/Kolkata',historyDays:366,animals:[],milk:[],collections:[],notices:[] }
test('the frontend fails closed on unexpected fields and private data',() => {
 assert.ok(snapshotSchema.safeParse(empty).success)
 assert.ok(!snapshotSchema.safeParse({...empty,notes:'private'}).success)
 const animal = {cowId:'COW-0001',slug:'test',name:'Test',sex:'Female',breed:'Malnad Gidda',born:null,bornPrecision:'unknown',joined:null,type:'Cow',dam:null,sire:null,nameMeaning:null,showMilk:true,images:{}}
 assert.ok(snapshotSchema.safeParse({...empty,animals:[animal]}).success)
 for (const extra of [{notes:'private'},{images:{photo:'https://unapproved.example/file.jpg'}},{source_details:'private'}]) assert.ok(!snapshotSchema.safeParse({...empty,animals:[{...animal,...extra}]}).success)
})
test('recent means calendar days ending today, rather than stale final log date',() => {
 assert.deepEqual(lastDays([{date:'2026-07-01'},{date:'2026-10-01'}],30,'2026-10-17'),[{date:'2026-10-01'}])
 assert.deepEqual(lastDays([{date:'2026-07-01'}],30,'2026-10-17'),[])
})
test('missing chart readings remain missing and zero readings count as recorded',() => {
 const weeks = byWeek([{date:'2026-10-12',q:null},{date:'2026-10-13',q:0},{date:'2026-10-14',q:4}],d => d.q)
 assert.deepEqual(weeks,[{start:'2026-10-12',days:2,total:4,perDay:2}])
})
test('an approximate year does not create a birthday',() => {
 assert.equal(isBirthday({born:'2020-10-17',bornEstimated:true} as Cow,{y:2026,m:10,d:17}),false)
 assert.equal(isBirthday({born:'2020-10-17',bornEstimated:false} as Cow,{y:2026,m:10,d:17}),true)
})
