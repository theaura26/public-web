import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { GatewayRecordSchema, type GatewayRecord } from '../../lib/aura-live/schema'
import { normalise, normaliseRainfall, resolveTime, resolveCategory } from '../../lib/aura-live/normalize'
import { isPublishable, applyLocationSafety, isPublishableSetback, isSensitiveSubject } from '../../lib/aura-live/policy'
import { loadConfig } from '../../lib/aura-live/config'

const fixtures = JSON.parse(readFileSync(new URL('./fixtures/activities.json', import.meta.url), 'utf8')) as Record<string, unknown>
const observation = JSON.parse(readFileSync(new URL('./fixtures/observation.json', import.meta.url), 'utf8'))
const rainfall = JSON.parse(readFileSync(new URL('./fixtures/rainfall.json', import.meta.url), 'utf8'))

/* Every fixture is a response the live gateway actually returned, so a
   passing test means the rule fires on real estate data rather than on a
   shape somebody imagined while writing the rule. */
function record(name: string): GatewayRecord {
  return GatewayRecordSchema.parse(fixtures[name])
}

function verdict(name: string) {
  const c = normalise(record(name))
  assert.ok(c, `${name} should normalise`)
  return isPublishable(applyLocationSafety(c), loadConfig())
}

test('gateway fixtures validate against the schema', () => {
  for (const [name, raw] of Object.entries(fixtures)) {
    assert.doesNotThrow(() => GatewayRecordSchema.parse(raw), `${name} failed validation`)
  }
  assert.doesNotThrow(() => GatewayRecordSchema.parse(observation))
  assert.doesNotThrow(() => GatewayRecordSchema.parse(rainfall))
})

test('a completed application is publishable', () => {
  assert.deepEqual(verdict('applicationDone'), { ok: true })
})

test('a missed activity is never portrayed as completed', () => {
  const v = verdict('applicationMissed')
  assert.equal(v.ok, false)
  assert.ok(v.ok === false && v.reasons.some((r) => r.startsWith('status-missed')))
})

test('planned and instructed work is refused', () => {
  for (const name of ['planned', 'instruction']) {
    const v = verdict(name)
    assert.equal(v.ok, false, `${name} should be refused`)
  }
})

test('an internal action plan is not an event', () => {
  const v = verdict('actionPlan')
  assert.equal(v.ok, false)
  assert.ok(v.ok === false && v.reasons.includes('internal-operations-text'))
})

test('a row whose subject is a labour headcount is refused', () => {
  const v = verdict('labourRow')
  assert.equal(v.ok, false)
  assert.ok(v.ok === false && v.reasons.includes('internal-operations-text'))
})

test('confidence below the threshold is refused', () => {
  const raw = { ...record('applicationDone'), confidence: 0.7, provenance: { ...record('applicationDone').provenance, confidence: 0.7 } }
  const c = normalise(raw as GatewayRecord)!
  const v = isPublishable(c, loadConfig())
  assert.equal(v.ok, false)
  assert.ok(v.ok === false && v.reasons.some((r) => r.startsWith('confidence-below')))
})

test('an unreviewed record is refused', () => {
  const base = record('applicationDone')
  const raw = { ...base, review_status: 'pending', provenance: { ...base.provenance, reviewStatus: 'pending' } }
  const v = isPublishable(normalise(raw as GatewayRecord)!, loadConfig())
  assert.equal(v.ok, false)
  assert.ok(v.ok === false && v.reasons.includes('review-status-pending'))
})

test('actuality "possible" and "reference" are refused as completed events', () => {
  const base = record('applicationDone')
  for (const actuality of ['possible', 'reference']) {
    const v = isPublishable(normalise({ ...base, actuality } as GatewayRecord)!, loadConfig())
    assert.equal(v.ok, false, `${actuality} should be refused`)
    assert.ok(v.ok === false && v.reasons.includes(`actuality-${actuality}`))
  }
})

test('a recommendation is refused however confident it is', () => {
  const base = record('applicationDone')
  const raw = { ...base, resultKind: 'recommendation', confidence: 0.99 }
  const v = isPublishable(normalise(raw as GatewayRecord)!, loadConfig())
  assert.equal(v.ok, false)
  assert.ok(v.ok === false && v.reasons.includes('recommendation-not-an-event'))
})

test('an unresolved material warning is refused', () => {
  const base = record('applicationDone')
  const raw = { ...base, warnings: ['Source conflict: two rows disagree on quantity'] }
  const v = isPublishable(normalise(raw as GatewayRecord)!, loadConfig())
  assert.equal(v.ok, false)
  assert.ok(v.ok === false && v.reasons.includes('material-warning'))
})

test('a record with no usable date is refused before anything else runs', () => {
  const base = record('applicationDone')
  const raw = { ...base, occurred_at: null, facts: { ...base.facts, Date: '26 Aug' } }
  assert.equal(resolveTime(raw as GatewayRecord), null)
  assert.equal(normalise(raw as GatewayRecord), null)
})

/* ── observations ────────────────────────────────────────────────────── */

test('a wildlife observation is publishable with no human actor', () => {
  const c = normalise(GatewayRecordSchema.parse(observation))!
  assert.equal(c.actor?.type, 'species')
  assert.deepEqual(isPublishable(c, loadConfig()), { ok: true })
})

test('an observation with a Time column gets exact precision in estate time', () => {
  const c = normalise(GatewayRecordSchema.parse(observation))!
  assert.equal(c.time.precision, 'exact')
  assert.equal(c.time.occurredAt, '2026-07-29T11:25:00.000Z')
})

test('an activity with only a date stays date-only', () => {
  const c = normalise(record('labourRow'))
  assert.ok(c)
  assert.equal(c.time.precision === 'exact', false)
})

test('a work period becomes window precision, not a moment', () => {
  const c = normalise(record('applicationDone'))!
  assert.equal(c.time.precision, 'window')
  assert.equal(c.time.occurredAt, undefined)
  assert.equal(c.time.timeWindow, '3pm–7pm, 6am–9am')
})

/* ── safety ──────────────────────────────────────────────────────────── */

test('a sensitive taxon keeps its sighting and loses its location', () => {
  const base = GatewayRecordSchema.parse(observation)
  const gaur = { ...base, title: 'Gaur (Indian Bison)', facts: { ...base.facts, 'Species / Observation': 'Gaur (Indian Bison)' } }
  const c = normalise(gaur as GatewayRecord)!
  assert.equal(isSensitiveSubject(c.subject), true)
  assert.ok(c.location, 'the source does carry a block')
  const safe = applyLocationSafety(c)
  assert.equal(safe.location, undefined)
  assert.deepEqual(isPublishable(safe, loadConfig()), { ok: true })
  assert.ok(!safe.allowedTerms.includes('Block 3'))
})

test('an ordinary species keeps its block', () => {
  const c = applyLocationSafety(normalise(GatewayRecordSchema.parse(observation))!)
  assert.equal(c.location?.label, 'Block 3')
})

test('a setback without context is refused; with context it is allowed', () => {
  const c = normalise(record('cattleDamage'))!
  assert.match(c.raw.title, /dead/i)
  assert.equal(isPublishableSetback(c), true, 'this fixture carries the response note')

  const bare = { ...c, note: undefined, description: undefined }
  assert.equal(isPublishableSetback(bare), false)
})

/* ── rainfall ────────────────────────────────────────────────────────── */

test('rainfall is withheld while the source states no unit', () => {
  delete process.env.AURA_LIVE_RAINFALL_UNIT
  assert.equal(normaliseRainfall(GatewayRecordSchema.parse(rainfall)), null)
})

test('rainfall publishes the figure with the configured unit and never invents one', () => {
  process.env.AURA_LIVE_RAINFALL_UNIT = 'mm'
  const c = normaliseRainfall(GatewayRecordSchema.parse(rainfall))
  assert.ok(c)
  assert.equal(c.quantity, '0.45 mm')
  assert.equal(c.actor?.type, 'natural_process')
  assert.equal(resolveCategory(GatewayRecordSchema.parse(rainfall)), 'seasons')
  delete process.env.AURA_LIVE_RAINFALL_UNIT
})
