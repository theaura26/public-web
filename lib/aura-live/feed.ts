/* AURA Live — what the page is allowed to see.
 *
 * The ledger holds scores, rejection reasons, gateway confidence and an
 * audit trail. None of that belongs on a public page: a card that shows
 * its own score invites a reader to argue with the score instead of
 * reading the card, and the audit trail names internal source documents.
 *
 * So the read path is a projection, not a pass-through. Everything a
 * reader is allowed to see is listed explicitly below; anything added to
 * the ledger later stays private until somebody adds it here on purpose.
 */

import { loadConfig } from './config'
import { getStore } from './store'
import { fetchStatus } from './gateway'
import type { AuraFeedEntry } from './schema'

/** The subset of an entry that reaches the browser. */
export type PublicEntry = Omit<AuraFeedEntry, 'editorial' | 'contributingKeys' | 'evidence'> & {
  evidence: {
    /** Reader-facing only: when the source was last read. */
    syncedAt?: string
    /** How many lines of that book stand behind the entry. */
    records?: number
    /** True when the picture is archive imagery, not event evidence. */
    hasEventMedia: boolean
  }
}

export type FeedFreshness = {
  state: 'live' | 'stale' | 'unknown'
  lastCheckedAt: string | null
  minutesSinceSync: number | null
}

export type FeedView = {
  entries: PublicEntry[]
  freshness: FeedFreshness
  /** True when the ledger could not be read at all. */
  failed: boolean
  /** Why the ledger could not be read. Null when it could. */
  failure: string | null
  lastRunAt: string | null
}

function toPublic(e: AuraFeedEntry): PublicEntry {
  return {
    id: e.id,
    canonicalKey: e.canonicalKey,
    estate: e.estate,
    category: e.category,
    headline: e.headline,
    body: e.body,
    significance: e.significance,
    details: e.details,
    actor: e.actor,
    location: e.location,
    occurredAt: e.occurredAt,
    occurredOn: e.occurredOn,
    timePrecision: e.timePrecision,
    timeWindow: e.timeWindow,
    publishedAt: e.publishedAt,
    updatedAt: e.updatedAt,
    media: e.media,
    evidence: {
      syncedAt: e.evidence.syncedAt,
      records: e.evidence.records,
      hasEventMedia: e.media.some((m) => !m.isEditorialImagery),
    },
  }
}

/**
 * Read the feed for rendering.
 *
 * Never throws. A gateway that is down costs the freshness indicator, not
 * the page: the cards were verified when they were published and are
 * still true now. Losing the ledger is different and is reported, because
 * an empty page that looks deliberate is worse than one that says
 * something went wrong.
 */
export async function readFeed(): Promise<FeedView> {
  const cfg = loadConfig()

  let entries: AuraFeedEntry[] = []
  let lastRunAt: string | null = null
  let failed = false
  let failure: string | null = null
  try {
    const doc = await getStore(cfg).read()
    entries = doc.entries
    lastRunAt = doc.lastRunAt
  } catch (err) {
    failed = true
    /* Carried, not only logged. `failed` alone told us the ledger could
       not be read and nothing about why, and the logs for this site sit
       in an account not everyone working on it can open — so a fault
       that was already understood took a deploy to see. */
    failure = err instanceof Error ? err.message : String(err)
    console.error(JSON.stringify({ evt: 'aura-live.ledger-unreadable', message: failure }))
  }

  let freshness: FeedFreshness = { state: 'unknown', lastCheckedAt: null, minutesSinceSync: null }
  try {
    /* Cached for a quarter of the gateway's own sync interval — checking
       more often than the source can change is just load. */
    const status = await fetchStatus({ revalidate: 900 })
    const minutes = status.lastSuccessAt
      ? Math.floor((Date.now() - new Date(status.lastSuccessAt).getTime()) / 60000)
      : null
    freshness = {
      state: !status.healthy || minutes === null || minutes > cfg.staleAfterMinutes ? 'stale' : 'live',
      lastCheckedAt: status.lastSuccessAt,
      minutesSinceSync: minutes,
    }
  } catch {
    /* Truthful: we do not know, so we do not claim to be live. */
    freshness = { state: 'unknown', lastCheckedAt: null, minutesSinceSync: null }
  }

  return {
    entries: entries.slice(0, cfg.maxFeedEntries).map(toPublic),
    freshness,
    failed,
    failure,
    lastRunAt,
  }
}
