import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fetchStatus, fetchActivities, fetchMedia, fetchRecord, GatewayError } from '../../lib/aura-live/gateway'

const fixtures = JSON.parse(readFileSync(new URL('./fixtures/activities.json', import.meta.url), 'utf8'))
const observation = JSON.parse(readFileSync(new URL('./fixtures/observation.json', import.meta.url), 'utf8'))

const realFetch = globalThis.fetch
function stub(handler: (url: string) => Promise<Response> | Response) {
  globalThis.fetch = ((input: RequestInfo | URL) =>
    Promise.resolve(handler(String(input)))) as typeof fetch
}

beforeEach(() => {
  process.env.AURA_GATEWAY_RETRIES = '1'
  process.env.AURA_GATEWAY_TIMEOUT_MS = '300'
})
afterEach(() => {
  globalThis.fetch = realFetch
  delete process.env.AURA_GATEWAY_RETRIES
  delete process.env.AURA_GATEWAY_TIMEOUT_MS
})

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

test('a well-formed envelope parses', async () => {
  stub(() => json({ data: { total: 1, items: [fixtures.applicationDone] }, ui: {}, meta: { freshness: { stale: false } } }))
  const page = await fetchActivities()
  assert.equal(page.items.length, 1)
  assert.equal(page.items[0].canonical_key, fixtures.applicationDone.canonical_key)
})

test('a malformed envelope raises rather than degrading', async () => {
  stub(() => json({ nonsense: true }))
  await assert.rejects(() => fetchActivities(), (e: unknown) => e instanceof GatewayError)
})

test('an item missing a required field raises', async () => {
  const broken = { ...fixtures.applicationDone }
  delete (broken as Record<string, unknown>).canonical_key
  stub(() => json({ data: { items: [broken] }, ui: {} }))
  await assert.rejects(() => fetchActivities(), (e: unknown) => e instanceof GatewayError)
})

test('non-JSON is a failure, not an empty feed', async () => {
  stub(() => new Response('<html>502</html>', { status: 200, headers: { 'content-type': 'text/html' } }))
  await assert.rejects(() => fetchActivities())
})

test('a 5xx is retried and then surfaces', async () => {
  let calls = 0
  stub(() => { calls++; return json({ error: 'boom' }, 503) })
  await assert.rejects(() => fetchActivities(), (e: unknown) => e instanceof GatewayError)
  assert.equal(calls, 2, 'one retry, as configured')
})

test('a 4xx is not retried', async () => {
  let calls = 0
  stub(() => { calls++; return json({ error: 'bad request' }, 400) })
  await assert.rejects(() => fetchActivities())
  assert.equal(calls, 1)
})

test('a recovering endpoint succeeds on the retry', async () => {
  let calls = 0
  stub(() => {
    calls++
    return calls === 1 ? json({ error: 'boom' }, 500) : json({ data: { items: [] }, ui: {} })
  })
  const page = await fetchActivities()
  assert.equal(page.items.length, 0)
  assert.equal(calls, 2)
})

test('a hanging endpoint times out instead of holding the run open', async () => {
  globalThis.fetch = ((_input: RequestInfo | URL, init?: RequestInit) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
    })) as typeof fetch
  const started = Date.now()
  await assert.rejects(() => fetchActivities())
  assert.ok(Date.now() - started < 3000, 'must not hang')
})

test('a missing record is null, not an exception', async () => {
  stub(() => json({ error: 'not found' }, 404))
  assert.equal(await fetchRecord('observation:nope'), null)
})

test('a record detail parses with its linked media', async () => {
  stub(() => json({ data: observation, ui: {} }))
  const record = await fetchRecord('observation:x')
  assert.ok(record)
  assert.equal(record.media?.length, 1)
  assert.equal(record.media?.[0].mediaType, 'image')
})

test('status reports freshness and health', async () => {
  stub(() => json({
    data: {
      state: { last_success_at: '2026-08-29T13:00:25Z', last_attempt_at: '2026-08-29T13:00:25Z', last_error: null },
    },
    ui: {},
    meta: { freshness: { lastSuccessfulSyncAt: '2026-08-29T13:00:25Z', stale: false } },
  }))
  const status = await fetchStatus()
  assert.equal(status.healthy, true)
  assert.equal(status.lastSuccessAt, '2026-08-29T13:00:25Z')
})

test('a sync error is reported as unhealthy', async () => {
  stub(() => json({ data: { state: { last_success_at: null, last_error: 'drive quota exceeded' } }, ui: {} }))
  const status = await fetchStatus()
  assert.equal(status.healthy, false)
  assert.equal(status.lastError, 'drive quota exceeded')
})

test('media items validate', async () => {
  const media = JSON.parse(readFileSync(new URL('./fixtures/media.json', import.meta.url), 'utf8'))
  stub(() => json({ data: { total: 1, items: [media.wildlifeVideo] }, ui: {} }))
  const page = await fetchMedia()
  assert.equal(page.items[0].mediaType, 'video')
  assert.ok(page.items[0].posterUrl)
})
