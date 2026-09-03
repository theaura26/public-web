/* AURA Live — the gateway client.
 *
 * Read-only, always. Nothing in this file writes to the gateway, to
 * Google Drive, or to anything upstream; the whole surface is GET.
 *
 * Every response is validated before it leaves this module, because the
 * alternative is a schema drift upstream turning into a wrong sentence on
 * a public page. A response that fails validation raises rather than
 * degrades: the pipeline treats a bad fetch as "publish nothing this
 * run", which is always safe.
 *
 * Two things learned by probing the live service, encoded here so nobody
 * has to rediscover them:
 *
 *   · /activities caps at 500 items whatever `limit` says, and sorts
 *     newest first. Anything wanting the whole corpus must page by date
 *     window, not by limit.
 *   · `q` returns zero rows on /activities and /entities. It is not a
 *     usable filter and this client does not offer it.
 */

import {
  RecordEnvelopeSchema, RecordDetailEnvelopeSchema, MediaEnvelopeSchema,
  StatusEnvelopeSchema,
  type GatewayRecord, type GatewayMedia, type Freshness,
} from './schema'
import { loadConfig } from './config'

export class GatewayError extends Error {
  constructor(message: string, readonly status?: number, readonly cause?: unknown) {
    super(message)
    this.name = 'GatewayError'
  }
}

type FetchOpts = {
  /** Seconds Next.js may serve this response from its data cache. */
  revalidate?: number
  signal?: AbortSignal
}

async function get(path: string, params: Record<string, string | number | undefined>, opts: FetchOpts = {}): Promise<unknown> {
  const cfg = loadConfig()
  const url = new URL(cfg.gatewayBaseUrl.replace(/\/$/, '') + path)
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
  }

  let lastError: unknown
  for (let attempt = 0; attempt <= cfg.gatewayRetries; attempt++) {
    const timer = new AbortController()
    const timeoutId = setTimeout(() => timer.abort(), cfg.gatewayTimeoutMs)
    /* The caller's signal and our timeout both need to abort the fetch. */
    const onAbort = () => timer.abort()
    opts.signal?.addEventListener('abort', onAbort, { once: true })
    try {
      const res = await fetch(url, {
        signal: timer.signal,
        headers: { accept: 'application/json' },
        ...(opts.revalidate === undefined
          ? { cache: 'no-store' as const }
          : { next: { revalidate: opts.revalidate } }),
      })
      if (!res.ok) {
        /* 4xx is our fault and will not fix itself; 5xx might. */
        if (res.status < 500) throw new GatewayError(`Gateway ${res.status} for ${path}`, res.status)
        lastError = new GatewayError(`Gateway ${res.status} for ${path}`, res.status)
      } else {
        return await res.json()
      }
    } catch (err) {
      if (err instanceof GatewayError && err.status && err.status < 500) throw err
      lastError = err
    } finally {
      clearTimeout(timeoutId)
      opts.signal?.removeEventListener('abort', onAbort)
    }
    if (attempt < cfg.gatewayRetries) {
      await new Promise((r) => setTimeout(r, 250 * 2 ** attempt))
    }
  }
  throw new GatewayError(`Gateway unreachable for ${path}`, undefined, lastError)
}

function parse<T>(schema: { safeParse: (v: unknown) => { success: boolean; data?: T; error?: unknown } }, raw: unknown, what: string): T {
  const result = schema.safeParse(raw)
  if (!result.success || result.data === undefined) {
    throw new GatewayError(`Gateway returned an unexpected shape for ${what}`, undefined, result.error)
  }
  return result.data
}

export type GatewayStatus = {
  healthy: boolean
  lastSuccessAt: string | null
  lastAttemptAt: string | null
  lastError: string | null
  /** Content hash of the source as of the gateway's last successful sync. */
  sourceRevision: string | null
  freshness: Freshness | null
}

export async function fetchStatus(opts: FetchOpts = {}): Promise<GatewayStatus> {
  const env = parse(StatusEnvelopeSchema, await get('/status', {}, opts), 'status')
  const state = env.data.state ?? null
  const lastSuccessAt = state?.last_success_at ?? env.meta?.freshness?.lastSuccessfulSyncAt ?? null
  return {
    healthy: !state?.last_error,
    lastSuccessAt: lastSuccessAt ?? null,
    lastAttemptAt: state?.last_attempt_at ?? env.meta?.freshness?.lastAttemptAt ?? null,
    lastError: state?.last_error ?? null,
    sourceRevision: env.data.lastSuccessfulRun?.source_revision ?? null,
    freshness: env.meta?.freshness ?? null,
  }
}

export type RecordPage = {
  items: GatewayRecord[]
  total: number
  warnings: string[]
  freshness: Freshness | null
}

/** The gateway's hard ceiling on a single /activities response. */
export const ACTIVITIES_PAGE_CAP = 500

export async function fetchActivities(
  params: { category?: string; from?: string; to?: string; date?: string; limit?: number } = {},
  opts: FetchOpts = {},
): Promise<RecordPage> {
  const env = parse(
    RecordEnvelopeSchema,
    await get('/activities', { ...params, limit: params.limit ?? ACTIVITIES_PAGE_CAP }, opts),
    'activities',
  )
  return {
    items: env.data.items,
    total: env.data.total ?? env.data.items.length,
    warnings: env.data.warnings ?? [],
    freshness: env.meta?.freshness ?? null,
  }
}

export async function fetchMedia(
  params: { category?: string; limit?: number } = {},
  opts: FetchOpts = {},
): Promise<{ items: GatewayMedia[]; total: number; freshness: Freshness | null }> {
  const env = parse(
    MediaEnvelopeSchema,
    await get('/media', { ...params, limit: params.limit ?? 100 }, opts),
    'media',
  )
  return {
    items: env.data.items,
    total: env.data.total ?? env.data.items.length,
    freshness: env.meta?.freshness ?? null,
  }
}

/**
 * How many of something the estate currently holds.
 *
 * `count=true` is the gateway's own metric mode; the row payload is
 * discarded and only the total is kept, so this stays cheap against a
 * twenty-thousand-row master sheet.
 */
export async function fetchEntityCount(
  category?: string,
  opts: FetchOpts = {},
): Promise<number | null> {
  try {
    const env = parse(
      RecordEnvelopeSchema,
      await get('/entities', { category, count: 'true', limit: 1 }, opts),
      'entity count',
    )
    return env.data.total ?? null
  } catch {
    return null
  }
}

/** One record and its linked approved media. Returns null on 404 rather
 *  than raising: a media item pointing at a record that no longer exists
 *  is a fact about the data, not a failure of the run. */
export async function fetchRecord(canonicalKey: string, opts: FetchOpts = {}): Promise<GatewayRecord | null> {
  try {
    const env = parse(
      RecordDetailEnvelopeSchema,
      await get(`/records/${encodeURIComponent(canonicalKey)}`, {}, opts),
      'record detail',
    )
    return env.data
  } catch (err) {
    if (err instanceof GatewayError && err.status === 404) return null
    throw err
  }
}
