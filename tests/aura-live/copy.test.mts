import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { GatewayRecordSchema, type GatewayRecord } from '../../lib/aura-live/schema'
import { normalise, toFeedMedia } from '../../lib/aura-live/normalize'
import { mergeCandidates } from '../../lib/aura-live/merge'
import { writeCopy } from '../../lib/aura-live/copy'
import { verifyCopy } from '../../lib/aura-live/verify'
import { pickGalleryImage, galleryAssetCount } from '../../lib/aura-live/gallery'
import { buildRoster } from '../../lib/aura-live/roster'
import { scoreCandidate } from '../../lib/aura-live/score'

const fixtures = JSON.parse(readFileSync(new URL('./fixtures/activities.json', import.meta.url), 'utf8')) as Record<string, unknown>
const observation = JSON.parse(readFileSync(new URL('./fixtures/observation.json', import.meta.url), 'utf8'))
const media = JSON.parse(readFileSync(new URL('./fixtures/media.json', import.meta.url), 'utf8'))

function merged(name: string) {
  const c = normalise(GatewayRecordSchema.parse(fixtures[name]))!
  return mergeCandidates([c])[0]
}

/* ── what the templates produce ──────────────────────────────────────── */

test('an application entry is the quantity, the ground and the blocks', () => {
  const c = merged('applicationDone')
  const copy = writeCopy(c)
  assert.match(copy.headline, /Buttermilk applied in Block 3/)
  assert.match(copy.body!, /124 L/)
  assert.match(copy.body!, /Buttermilk/)
  assert.match(copy.body!, /5\.48 acres/)
  assert.match(copy.body!, /Block 3/)
  assert.deepEqual(verifyCopy(copy, c), { ok: true })
})

test('the surface carries none of what belongs in the panel', () => {
  const copy = writeCopy(merged('applicationDone'))
  const surface = `${copy.headline} ${copy.body ?? ''}`
  /* Who did it, how, on which crop, and the date all exist in the
     record. None of them belongs on a two-line entry — the timestamp is
     on the rail and the rest is one click away. */
  assert.doesNotMatch(surface, /Sadananda/)
  assert.doesNotMatch(surface, /power pump|mist spray|spray gun/i)
  assert.doesNotMatch(surface, /\bcoffee\b|\btea\b/i)
  assert.doesNotMatch(surface, /26 Aug|3pm|6am/)
})

test('a wildlife observation is the species, then where it was seen', () => {
  const c = mergeCandidates([normalise(GatewayRecordSchema.parse(observation))!])[0]
  const copy = writeCopy(c)
  assert.equal(copy.headline, 'Heterotis rotundifolia')
  assert.match(copy.body!, /^(Photographed|Filmed|Recorded)/)
  assert.match(copy.body!, /Block 3/)
  assert.deepEqual(verifyCopy(copy, c), { ok: true })
})

test('an event with a video says filmed; with a photograph, photographed', () => {
  const base = normalise(GatewayRecordSchema.parse(observation))!
  const withVideo = mergeCandidates([{ ...base, media: [toFeedMedia(media.wildlifeVideo)] }])[0]
  assert.match(writeCopy(withVideo).body!, /Filmed/)
  const withPhoto = mergeCandidates([{ ...base, media: [toFeedMedia(media.wildlifeImage)] }])[0]
  assert.match(writeCopy(withPhoto).body!, /Photographed/)
})

test('a singular area does not read "1 acres"', () => {
  const base = GatewayRecordSchema.parse(fixtures.applicationDone)
  const one = { ...base, facts: { ...base.facts, 'Area (acres)': '1' } }
  const copy = writeCopy(mergeCandidates([normalise(one as GatewayRecord)!])[0])
  assert.match(copy.body!, /across 1 acre\b/)
  assert.doesNotMatch(copy.body!, /1 acres/)
})

test('a cell that already carries its unit is not given a second one', () => {
  const base = GatewayRecordSchema.parse(fixtures.applicationDone)
  const dup = { ...base, facts: { ...base.facts, 'Area (acres)': '32.24 acre' } }
  const copy = writeCopy(mergeCandidates([normalise(dup as GatewayRecord)!])[0])
  assert.doesNotMatch(copy.body!, /acre acres/)
  assert.match(copy.body!, /32\.24 acres/)
})

test('an unknown written as an answer is not published as one', () => {
  const copy = writeCopy(merged('preparationBatch'))
  assert.doesNotMatch(`${copy.body!} ${copy.significance ?? ''}`, /not sure/i)
})

test('the estate spelling is kept, not corrected', () => {
  const base = GatewayRecordSchema.parse(fixtures.applicationDone)
  const neen = { ...base, facts: { ...base.facts, Input: 'Neen Oil' } }
  const copy = writeCopy(mergeCandidates([normalise(neen as GatewayRecord)!])[0])
  assert.match(copy.body!, /Neen Oil/)
  assert.doesNotMatch(copy.body!, /neen Oil|Neem/)
})

test('a headline and its body never carry the same sentence', () => {
  for (const name of ['applicationDone', 'treeTagCorrection', 'preparationBatch']) {
    const copy = writeCopy(merged(name))
    if (!copy.body) continue
    const h = copy.headline.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()
    assert.ok(!copy.body.toLowerCase().includes(h) || h.length < 12, `${name} repeats its headline in its body`)
  }
})

test('a terse field line is a headline on its own, not padded out', () => {
  const copy = writeCopy(merged('treeTagCorrection'))
  /* Either there is something more to say, or there is not. What there
     never is, is a sentence restating that the estate recorded it. */
  if (copy.body) assert.doesNotMatch(copy.body, /^Recorded in the estate field log/)
})

/* ── the claim check ─────────────────────────────────────────────────── */

test('an untraceable number is rejected', () => {
  const c = merged('applicationDone')
  const v = verifyCopy({ headline: 'Buttermilk applied', body: 'The team applied 999 L of Buttermilk.', templateId: 't' }, c)
  assert.equal(v.ok, false)
  assert.ok(v.ok === false && v.problems.some((p) => p.includes('999')))
})

test('an untraceable name is rejected', () => {
  const c = merged('applicationDone')
  const v = verifyCopy({ headline: 'Buttermilk applied', body: 'Ramesh applied 124 L of Buttermilk in Block 3.', templateId: 't' }, c)
  assert.equal(v.ok, false)
  assert.ok(v.ok === false && v.problems.some((p) => p.includes('Ramesh')))
})

test('an untraceable place is rejected', () => {
  const c = merged('applicationDone')
  const v = verifyCopy({ headline: 'Buttermilk applied', body: 'Applied 124 L of Buttermilk in Coorg.', templateId: 't' }, c)
  assert.equal(v.ok, false)
  assert.ok(v.ok === false && v.problems.some((p) => p.includes('Coorg')))
})

test('hype and announcement voice are rejected', () => {
  const c = merged('applicationDone')
  for (const body of [
    'Exciting news from the estate.',
    'Our amazing team applied 124 L of Buttermilk.',
    'Buttermilk applied in Block 3!',
  ]) {
    assert.equal(verifyCopy({ headline: 'x', body, templateId: 't' }, c).ok, false, body)
  }
})

test('unsupported ecological and certification claims are rejected', () => {
  const c = merged('applicationDone')
  for (const body of [
    'This endangered species was seen in Block 3.',
    'The practice sequesters carbon across the estate.',
    'Aura is certified organic.',
    'This proves the soil is improving.',
  ]) {
    assert.equal(verifyCopy({ headline: 'x', body, templateId: 't' }, c).ok, false, body)
  }
})

test('a clock time on a date-only record is rejected at the last gate', () => {
  const c = merged('labourRow')
  assert.equal(c.time.precision, 'date')
  const v = verifyCopy({ headline: 'x', body: 'Recorded at 6:30 am.', templateId: 't' }, c)
  assert.equal(v.ok, false)
  assert.ok(v.ok === false && v.problems.includes('states a time for a date-only record'))
})

test('midnight is never rendered as a time', () => {
  const c = merged('applicationDone')
  const v = verifyCopy({ headline: 'x', body: 'Recorded at 12:00 am on 26 Aug.', templateId: 't' }, c)
  assert.equal(v.ok, false)
  assert.ok(v.ok === false && v.problems.includes('midnight rendered as a time'))
})

/* ── merging ─────────────────────────────────────────────────────────── */

test('three identical batches become one card that keeps every key', () => {
  const rows = ['preparationBatch', 'preparationBatch2', 'preparationBatch3']
    .map((n) => normalise(GatewayRecordSchema.parse(fixtures[n]))!)
  const out = mergeCandidates(rows)
  assert.equal(out.length, 1)
  assert.equal(out[0].rowCount, 3)
  assert.equal(out[0].contributingKeys.length, 3)
  const copy = writeCopy(out[0])
  assert.match(copy.headline, /Three batches/)
  assert.deepEqual(verifyCopy(copy, out[0]), { ok: true })
})

test('merging never invents a total', () => {
  const rows = ['preparationBatch', 'preparationBatch2', 'preparationBatch3']
    .map((n) => normalise(GatewayRecordSchema.parse(fixtures[n]))!)
  const out = mergeCandidates(rows)[0]
  const copy = writeCopy(out)
  /* Each batch is 200 L. 600 is the sum nobody wrote down. */
  assert.doesNotMatch(`${copy.headline} ${copy.body!}`, /600/)
  assert.match(copy.body!, /200 L each/)
})

test('different events do not merge', () => {
  const a = normalise(GatewayRecordSchema.parse(fixtures.applicationDone))!
  const b = normalise(GatewayRecordSchema.parse(observation))!
  assert.equal(mergeCandidates([a, b]).length, 2)
})

/* ── gallery ─────────────────────────────────────────────────────────── */

test('the gallery manifest is loaded', () => {
  assert.ok(galleryAssetCount() > 0)
})

test('gallery selection is deterministic and always discloses itself', () => {
  const first = pickGalleryImage('al_abc123', 'sprays', 'Jeevamrit')
  assert.ok(first)
  assert.equal(first.isEditorialImagery, true)
  assert.equal(first.type, 'editorial_thumbnail')
  assert.ok(first.alt.length > 0)
  for (let i = 0; i < 20; i++) {
    assert.equal(pickGalleryImage('al_abc123', 'sprays', 'Jeevamrit')!.url, first.url)
  }
})

test('different cards do not all draw the same picture', () => {
  const urls = new Set(
    ['al_1', 'al_2', 'al_3', 'al_4', 'al_5', 'al_6'].map(
      (id) => pickGalleryImage(id, 'biodiversity', 'Something')?.url,
    ),
  )
  assert.ok(urls.size > 1)
})

test('a subject tag steers the picture, without pinning every card to one asset', () => {
  /* The tagged pool for Jeevamrit holds a single tank photograph. Used
     alone it would put the same picture on every Jeevamrit card in the
     feed, so a thin tagged pool is widened with the category's untagged
     assets: the tagged asset still appears, and the feed still varies. */
  const picks = Array.from({ length: 12 }, (_, i) =>
    pickGalleryImage(`al_seed${i}`, 'sprays', 'Jeevamrit')!.url)
  assert.ok(picks.some((u) => /jeevamrut/.test(u)), 'the tagged asset should still be reachable')
  assert.ok(new Set(picks).size > 1, 'and it should not be the only one')
  /* Everything chosen must still be declared for this category. */
  for (const u of picks) assert.match(u, /circular|shade|herd|aura-/)
})

/* ── roster ──────────────────────────────────────────────────────────── */

const roster = buildRoster(
  [{ facts: { 'Done By': 'Nayana, Prashanth Mna', People: "Sadananda's Team", Supervisor: 'Sadananda' } } as unknown as GatewayRecord],
  ['Pulkit', 'Rao', 'Chander'],
)

test('an uncleared individual in free text is caught', () => {
  assert.equal(roster.has('Initial report stated 420; Nayana corrected to 410.'), 'nayana')
})

test('a team credit is not treated as naming an individual', () => {
  assert.equal(roster.has("Sadananda's Team applied 124 L of Buttermilk in Block 3."), null)
})

test('the estate-team fallback is not itself a name', () => {
  assert.equal(roster.has('Aura’s estate team recorded this on 19 Jun.'), null)
})

test('a name inside another word does not fire', () => {
  assert.equal(roster.has('The nayanaish thing is not a person.'), null)
})

/* ── scoring ─────────────────────────────────────────────────────────── */

test('a repeated category is penalised as the run fills up', () => {
  const c = merged('applicationDone')
  const alone = scoreCandidate(c, [])
  const crowded = scoreCandidate(
    c,
    Array.from({ length: 6 }, (_, i) => ({
      id: `x${i}`, category: 'sprays', headline: 'Something else', occurredOn: '2026-08-01',
    })) as never,
  )
  assert.ok(crowded.total < alone.total, 'a crowded category must score lower')
  assert.ok(crowded.reasons.some((r) => /dominates|over-represented/.test(r)))
})

test('every score carries its reasons', () => {
  const s = scoreCandidate(merged('applicationDone'), [])
  assert.ok(s.reasons.length >= 4)
  assert.ok(s.reasons.every((r) => /^[+-]\d/.test(r)))
})

test('the gallery avoids a picture the reader has just seen', () => {
  const first = pickGalleryImage('al_a', 'field-activities', 'Jungle clearing')!
  const second = pickGalleryImage('al_b', 'field-activities', 'Jungle clearing', [first.url])
  assert.ok(second)
  assert.notEqual(second.url, first.url)
})

test('an exhausted pool repeats rather than leaving a card blank', () => {
  const all = ['al_x', 'al_y', 'al_z'].map((id) => pickGalleryImage(id, 'cows', 'Herd')!.url)
  const forced = pickGalleryImage('al_w', 'cows', 'Herd', all)
  assert.ok(forced, 'a picture is still returned when everything has been used')
})
