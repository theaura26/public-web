import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, rmSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { runFeedGeneration } from '../../lib/aura-live/pipeline'
import { getStore } from '../../lib/aura-live/store'
import { readFeed } from '../../lib/aura-live/feed'
import { loadConfig } from '../../lib/aura-live/config'

/* End-to-end runs against a stubbed gateway. Nothing here touches the
   network, so the suite is stable in CI and says the same thing next
   year as it does today. */

const fixtures = JSON.parse(readFileSync(new URL('./fixtures/activities.json', import.meta.url), 'utf8'))
const observation = JSON.parse(readFileSync(new URL('./fixtures/observation.json', import.meta.url), 'utf8'))
const media = JSON.parse(readFileSync(new URL('./fixtures/media.json', import.meta.url), 'utf8'))

const realFetch = globalThis.fetch
const realLog = console.log
let dir: string

type World = {
  activities: unknown[]
  observations: Record<string, unknown>
  media: unknown[]
  syncedAt: string
  healthy: boolean
  revision: string
}

function makeWorld(over: Partial<World> = {}): World {
  return {
    activities: [fixtures.applicationDone, fixtures.applicationMissed, fixtures.actionPlan],
    observations: { [observation.canonical_key]: observation },
    media: [media.wildlifeImage],
    syncedAt: new Date().toISOString(),
    healthy: true,
    revision: 'sha256:aaa',
    ...over,
  }
}

function serve(world: World) {
  globalThis.fetch = ((input: RequestInfo | URL) => {
    const url = String(input)
    const meta = { freshness: { lastSuccessfulSyncAt: world.syncedAt, stale: false } }
    const body = (data: unknown) => new Response(JSON.stringify({ data, ui: {}, meta }), {
      status: 200, headers: { 'content-type': 'application/json' },
    })

    if (url.includes('/status')) {
      return Promise.resolve(body({
        state: { last_success_at: world.syncedAt, last_attempt_at: world.syncedAt, last_error: world.healthy ? null : 'sync failed' },
        lastSuccessfulRun: { source_revision: world.revision },
      }))
    }
    if (url.includes('/activities')) {
      /* Category sweeps must not multiply the same rows into duplicates. */
      return Promise.resolve(body({ total: world.activities.length, items: world.activities, warnings: [] }))
    }
    if (url.includes('/media')) {
      return Promise.resolve(body({ total: world.media.length, items: world.media }))
    }
    if (url.includes('/records/')) {
      const key = decodeURIComponent(url.split('/records/')[1].split('?')[0])
      const found = world.observations[key]
      return Promise.resolve(found
        ? body(found)
        : new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: { 'content-type': 'application/json' } }))
    }
    return Promise.resolve(new Response('{}', { status: 404 }))
  }) as typeof fetch
}

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), 'aura-live-'))
  process.env.AURA_LIVE_STORE = 'file'
  process.env.AURA_LIVE_STORE_FILE = path.join(dir, 'feed.json')
  process.env.AURA_LIVE_IGNORE_WINDOWS = '1'
  process.env.AURA_LIVE_MAX_PUBLISH_PER_RUN = '10'
  process.env.AURA_LIVE_MAX_PER_CATEGORY_PER_RUN = '10'
  process.env.AURA_GATEWAY_RETRIES = '0'
  console.log = () => {}
})

afterEach(() => {
  console.log = realLog
  globalThis.fetch = realFetch
  rmSync(dir, { recursive: true, force: true })
  for (const k of [
    'AURA_LIVE_STORE', 'AURA_LIVE_STORE_FILE', 'AURA_LIVE_IGNORE_WINDOWS',
    'AURA_LIVE_MAX_PUBLISH_PER_RUN', 'AURA_LIVE_MAX_PER_CATEGORY_PER_RUN',
    'AURA_GATEWAY_RETRIES', 'AURA_LIVE_WINDOWS', 'AURA_LIVE_STALE_AFTER_MINUTES',
    'AURA_LIVE_ARCHIVE_IMAGES',
  ]) delete process.env[k]
})

const ledger = () => getStore(loadConfig()).read()

/* ── the acceptance criteria ─────────────────────────────────────────── */

test('a verified wildlife observation becomes a card with its own media', async () => {
  serve(makeWorld())
  await runFeedGeneration()
  const doc = await ledger()
  const card = doc.entries.find((e) => e.category === 'biodiversity')
  assert.ok(card, 'the sighting should be published')
  assert.equal(card.media[0].isEditorialImagery, false)
  assert.equal(card.media[0].type, 'image')
  assert.equal(card.timePrecision, 'exact')
  assert.equal(card.actor?.type, 'species')
})

test('a completed intervention becomes a card with team, place, time and quantity', async () => {
  serve(makeWorld())
  await runFeedGeneration()
  const doc = await ledger()
  const card = doc.entries.find((e) => e.category === 'sprays')
  assert.ok(card)
  assert.equal(card.actor?.label, "Sadananda's Team")
  assert.match(card.location!.label, /Block 3/)
  assert.equal(card.timePrecision, 'window')
  assert.match(card.body!, /124 L/)
  /* The team, the method and the crop are recorded — in the panel. */
  const who = card.details.find((d) => d.label === 'Who')
  assert.equal(who?.value, "Sadananda's Team")
  assert.ok(card.details.some((d) => d.label === 'Crop'))
  assert.ok(card.evidence.source, 'the entry names which book it came from')
})

test('a briefing, an action plan and a missed task never become cards', async () => {
  serve(makeWorld({
    activities: [fixtures.actionPlan, fixtures.applicationMissed, fixtures.instruction, fixtures.planned, fixtures.labourRow],
    observations: {},
    media: [],
  }))
  const outcome = await runFeedGeneration()
  assert.equal(outcome.published, 0)
  assert.equal((await ledger()).entries.length, 0)
})

/* ── identity and idempotency ────────────────────────────────────────── */

test('running twice publishes nothing the second time', async () => {
  serve(makeWorld())
  const first = await runFeedGeneration()
  assert.ok(first.published > 0)
  const second = await runFeedGeneration()
  assert.equal(second.published, 0)
  const doc = await ledger()
  assert.equal(doc.entries.length, first.published)
  assert.equal(new Set(doc.entries.map((e) => e.canonicalKey)).size, doc.entries.length)
})

test('a card keeps its id and publication time across runs', async () => {
  serve(makeWorld())
  await runFeedGeneration()
  const before = (await ledger()).entries.map((e) => ({ id: e.id, publishedAt: e.publishedAt, occurredOn: e.occurredOn }))
  await runFeedGeneration()
  const after = (await ledger()).entries.map((e) => ({ id: e.id, publishedAt: e.publishedAt, occurredOn: e.occurredOn }))
  assert.deepEqual(after, before)
})

test('merged rows do not resurface as their own cards on the next run', async () => {
  const batches = [fixtures.preparationBatch, fixtures.preparationBatch2, fixtures.preparationBatch3]
  serve(makeWorld({ activities: batches, observations: {}, media: [] }))
  await runFeedGeneration()
  const first = await ledger()
  assert.equal(first.entries.length, 1)
  assert.equal(first.entries[0].contributingKeys.length, 3)

  await runFeedGeneration()
  const second = await ledger()
  assert.equal(second.entries.length, 1, 'the two merged siblings must not come back as cards')
})

test('the watermark advances only after a successful run', async () => {
  serve(makeWorld())
  await runFeedGeneration()
  const mark = (await ledger()).watermark
  assert.ok(mark)

  /* Now break the gateway. The ledger must be left exactly as it was. */
  globalThis.fetch = (() => Promise.reject(new Error('network down'))) as typeof fetch
  const outcome = await runFeedGeneration()
  assert.equal(outcome.ran, false)
  const after = await ledger()
  assert.equal(after.watermark, mark)
  assert.ok(after.entries.length > 0, 'history survives an outage')
})

test('a source correction updates the card without resetting its age', async () => {
  serve(makeWorld())
  await runFeedGeneration()
  const before = (await ledger()).entries.find((e) => e.canonicalKey === fixtures.applicationDone.canonical_key)!
  assert.ok(before)

  await new Promise((r) => setTimeout(r, 10))
  const corrected = {
    ...fixtures.applicationDone,
    facts: { ...fixtures.applicationDone.facts, 'Quantity Used': '150 L' },
    updated_at: new Date(Date.now() + 60_000).toISOString(),
    provenance: { ...fixtures.applicationDone.provenance, syncedAt: new Date().toISOString() },
  }
  /* A corrected sheet is a changed source, so the gateway's content hash
     moves with it. Reusing the old hash would be testing a state that
     cannot occur. */
  serve(makeWorld({ activities: [corrected], revision: 'sha256:corrected' }))
  const outcome = await runFeedGeneration()
  assert.equal(outcome.updated, 1)

  const after = (await ledger()).entries.find((e) => e.canonicalKey === fixtures.applicationDone.canonical_key)!
  assert.equal(after.id, before.id, 'identity is preserved')
  assert.equal(after.publishedAt, before.publishedAt, 'a correction must not make a card look new')
  assert.equal(after.occurredOn, before.occurredOn, 'the event time is untouched')
  assert.ok(after.updatedAt, 'the correction is recorded')
  assert.match(after.body!, /150 L/)
})

/* ── freshness and failure ───────────────────────────────────────────── */

test('a stale gateway stops publication and keeps the history', async () => {
  serve(makeWorld())
  await runFeedGeneration()
  const count = (await ledger()).entries.length
  assert.ok(count > 0)

  serve(makeWorld({ syncedAt: new Date(Date.now() - 10 * 3600_000).toISOString() }))
  const outcome = await runFeedGeneration()
  assert.equal(outcome.ran, false)
  assert.match(outcome.reason, /stale/)
  assert.equal((await ledger()).entries.length, count)
})

test('an unhealthy gateway stops publication', async () => {
  serve(makeWorld({ healthy: false }))
  const outcome = await runFeedGeneration()
  assert.equal(outcome.ran, false)
  assert.match(outcome.reason, /error/)
})

test('a run outside the publishing windows exits without touching anything', async () => {
  delete process.env.AURA_LIVE_IGNORE_WINDOWS
  /* A window that cannot contain the current moment. */
  const nowMin = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false }).format(new Date()))
  const away = (nowMin + 6) % 24
  process.env.AURA_LIVE_WINDOWS = `${String(away).padStart(2, '0')}:00-${String(away).padStart(2, '0')}:30`
  serve(makeWorld())
  const outcome = await runFeedGeneration()
  assert.equal(outcome.ran, false)
  assert.match(outcome.reason, /outside publishing windows/)
  assert.equal((await ledger()).entries.length, 0)
})

test('an empty gateway produces an empty feed rather than filler', async () => {
  serve(makeWorld({ activities: [], observations: {}, media: [] }))
  const outcome = await runFeedGeneration()
  assert.equal(outcome.published, 0)
  const view = await readFeed()
  assert.equal(view.entries.length, 0)
  assert.equal(view.failed, false)
})

test('a partial failure still publishes what did arrive', async () => {
  const world = makeWorld()
  globalThis.fetch = ((input: RequestInfo | URL) => {
    const url = String(input)
    /* Media is down; activities are fine. */
    if (url.includes('/media')) return Promise.reject(new Error('media down'))
    return (serveOnce(world))(url)
  }) as typeof fetch
  const outcome = await runFeedGeneration()
  assert.ok(outcome.published > 0, 'the working half still publishes')
  assert.ok(outcome.errors.some((e) => e.startsWith('media')))
})

function serveOnce(world: World) {
  let handler!: (url: string) => Promise<Response>
  const prev = globalThis.fetch
  serve(world)
  handler = globalThis.fetch as unknown as (url: string) => Promise<Response>
  globalThis.fetch = prev
  return handler
}

/* ── what reaches the browser ────────────────────────────────────────── */

test('the public projection carries no score, confidence or source path', async () => {
  serve(makeWorld())
  await runFeedGeneration()
  const view = await readFeed()
  assert.ok(view.entries.length > 0)
  /* Keyed on the property names, not on substrings: "editorial_thumbnail"
     is a legitimate media type and must not read as a leaked score. */
  for (const key of ['editorial', 'contributingKeys', 'confidence', 'reviewStatus', 'actuality', 'warnings']) {
    for (const entry of view.entries) {
      assert.ok(!(key in (entry as Record<string, unknown>)), `${key} leaked to the browser`)
      assert.ok(!(key in entry.evidence), `evidence.${key} leaked to the browser`)
    }
  }
  const serialised = JSON.stringify(view.entries)
  assert.doesNotMatch(serialised, /"score"|sourcePath|sourceRow|sourceFileId|source_key/)
  assert.match(serialised, /"hasEventMedia"/)
})

test('the public projection says whether a picture is evidence', async () => {
  serve(makeWorld())
  await runFeedGeneration()
  const view = await readFeed()
  for (const entry of view.entries) {
    for (const m of entry.media) assert.equal(typeof m.isEditorialImagery, 'boolean')
    if (entry.media.length) {
      assert.equal(entry.evidence.hasEventMedia, entry.media.some((m) => !m.isEditorialImagery))
    }
  }
})

test('an entry with no event photograph carries no picture at all', async () => {
  serve(makeWorld({ activities: [fixtures.applicationDone], observations: {}, media: [] }))
  await runFeedGeneration()
  const card = (await ledger()).entries[0]
  /* The feed's claim is evidence. A gap is honest; an illustration in
     the same frame the photographs use is a decision to look full. */
  assert.equal(card.media.length, 0)
})

test('archive imagery returns when it is switched on, labelled as such', async () => {
  process.env.AURA_LIVE_ARCHIVE_IMAGES = '1'
  serve(makeWorld({ activities: [fixtures.applicationDone], observations: {}, media: [] }))
  await runFeedGeneration()
  const card = (await ledger()).entries[0]
  assert.equal(card.media.length, 1)
  assert.equal(card.media[0].isEditorialImagery, true)
  assert.equal(card.media[0].type, 'editorial_thumbnail')
  delete process.env.AURA_LIVE_ARCHIVE_IMAGES
})

test('every published entry answers what, who-or-what, and when', async () => {
  serve(makeWorld())
  await runFeedGeneration()
  for (const e of (await ledger()).entries) {
    assert.ok(e.headline.length > 0, 'what')
    /* A body is optional — a terse field line that already says
       everything is not padded out — but an empty string is not. */
    if (e.body !== undefined) assert.ok(e.body.length > 0, 'what, in full')
    assert.ok(e.occurredOn.match(/^\d{4}-\d{2}-\d{2}$/), 'when')
    assert.ok(['exact', 'window', 'date'].includes(e.timePrecision))
    if (e.timePrecision === 'exact') assert.ok(e.occurredAt)
    else assert.equal(e.occurredAt, undefined, 'only an exact record carries a timestamp')
  }
})

test('the audit trail records why each candidate was accepted or refused', async () => {
  serve(makeWorld())
  await runFeedGeneration()
  const doc = await ledger()
  assert.ok(doc.audit.length > 0)
  for (const a of doc.audit) {
    assert.ok(a.canonicalKey)
    assert.ok(a.generatorVersion)
    assert.ok(['accepted', 'rejected', 'merged', 'updated', 'deferred', 'unchanged'].includes(a.outcome))
  }
  assert.ok(doc.audit.some((a) => a.outcome === 'rejected' && a.reasons.length > 0))
})


/* ── the cheap gate ──────────────────────────────────────────────────── */

test('an unchanged source revision skips discovery entirely', async () => {
  let sweeps = 0
  const world = makeWorld()
  const inner = ((input: RequestInfo | URL) => {
    const url = String(input)
    if (url.includes('/activities') || url.includes('/media') || url.includes('/records/')) sweeps++
    return handler(url)
  }) as typeof fetch
  serve(world)
  const handler = globalThis.fetch as unknown as (url: string) => Promise<Response>
  globalThis.fetch = inner

  await runFeedGeneration()
  const firstSweeps = sweeps
  assert.ok(firstSweeps > 0, 'the first run must sweep')
  assert.equal((await ledger()).sourceRevision, 'sha256:aaa')

  sweeps = 0
  const second = await runFeedGeneration()
  assert.equal(sweeps, 0, 'an unchanged revision must cost no sweep at all')
  assert.match(second.reason, /source unchanged/)
})

test('a moved source revision sweeps again', async () => {
  serve(makeWorld())
  await runFeedGeneration()
  serve(makeWorld({ revision: 'sha256:bbb', activities: [fixtures.applicationDone, fixtures.preparationBatch] }))
  const outcome = await runFeedGeneration()
  assert.notEqual(outcome.reason, 'source unchanged since the last run')
  assert.ok(outcome.discovered > 0)
})

test('a failed run does not record the revision, so the next one retries', async () => {
  serve(makeWorld())
  globalThis.fetch = ((input: RequestInfo | URL) => {
    if (String(input).includes('/status')) {
      return Promise.resolve(new Response(JSON.stringify({
        data: { state: { last_success_at: new Date().toISOString(), last_error: null }, lastSuccessfulRun: { source_revision: 'sha256:ccc' } },
        ui: {}, meta: {},
      }), { status: 200, headers: { 'content-type': 'application/json' } }))
    }
    return Promise.reject(new Error('down'))
  }) as typeof fetch
  await runFeedGeneration()
  assert.equal((await ledger()).sourceRevision, null, 'a run that found nothing must not claim the revision')
})

/* The ledger shows a page and remembers a history, and those are not the
   same length. `entries` is trimmed to the page on every commit, so
   asking it alone whether something was published forgets every card
   that has scrolled off the end — which then comes back round as a new
   card with a fresh date, for ever. A drain run made it plain: 172
   records republished on a second pass with nothing new upstream. */

test('a card that has scrolled off the page is not published again', async () => {
  serve(makeWorld())
  await runFeedGeneration()

  const first = await ledger()
  assert.ok(first.entries.length, 'the first run must publish something to trim')
  assert.ok(first.publishedKeys.length >= first.entries.length,
    'the ledger must remember at least what it is showing')

  /* Empty the page but keep the memory — exactly what the trim does when
     the feed is longer than maxFeedEntries. */
  await getStore().write({ ...first, entries: [] })

  const before = (await ledger()).publishedKeys.length
  const again = await runFeedGeneration()

  assert.equal(again.published, 0,
    'nothing may be republished on the strength of an empty page')
  assert.equal((await ledger()).publishedKeys.length, before,
    'and nothing new may be remembered either')
})

test('drain lifts the per-run caps and nothing else', async () => {
  /* The world here holds three activities, one of them a missed
     application and one an internal action plan. Draining must publish
     more freely and refuse those two exactly as a capped run does:
     drain is a rate limit, not a standard. */
  serve(makeWorld())
  const drained = await runFeedGeneration({ drain: true })
  const doc = await ledger()

  assert.equal(drained.rejected > 0, true, 'the quality gates must still refuse')
  assert.ok(
    !doc.entries.some((e) => e.canonicalKey === fixtures.applicationMissed.canonical_key),
    'a missed application is not an event, however fast the run is allowed to go',
  )
  assert.ok(
    !doc.entries.some((e) => e.canonicalKey === fixtures.actionPlan.canonical_key),
    'an internal action plan is not an event either',
  )
})
