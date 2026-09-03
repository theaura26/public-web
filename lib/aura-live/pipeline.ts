/* AURA Live — the run.
 *
 * One function, called by the cron route and by nothing else. It is
 * idempotent by construction: identity comes from the gateway's
 * canonical_key, and a key already in the ledger is either left alone or
 * updated in place. Running it twice in a minute produces the same feed
 * as running it once.
 *
 * The order is load-bearing and matches docs/aura-live/architecture.md:
 *
 *   window → health → discover → normalise → safety → policy
 *          → dedupe → merge → score → write → verify → store
 *
 * Scoring sits after policy so a high score can never rescue something
 * the policy rejected, and copy generation sits after scoring so nothing
 * is written for a card that will not run.
 */

import { loadConfig, type AuraLiveConfig } from './config'
import { inWindow, estateParts } from './time'
import { fetchStatus, fetchActivities, fetchMedia, fetchRecord, GatewayError } from './gateway'
import { normalise, clearedNames, sourceName, type Candidate } from './normalize'
import { isPublishable, applyLocationSafety, isPublishableSetback } from './policy'
import { mergeCandidates, type MergedCandidate } from './merge'
import { scoreCandidate } from './score'
import { writeCopy } from './copy'
import { verifyCopy } from './verify'
import { writeCopyWithModel } from './llm'
import { pickGalleryImage } from './gallery'
import { getStore } from './store'
import { appendAudit, logLine } from './audit'
import { buildRoster, OPEN_ROSTER, type Roster } from './roster'
import { AuraFeedEntrySchema, type AuraFeedEntry, type AuditRecord, type GatewayRecord } from './schema'

export type RunOutcome = {
  ran: boolean
  reason: string
  window?: string
  discovered: number
  eligible: number
  merged: number
  published: number
  updated: number
  rejected: number
  entries: number
  freshnessMinutes: number | null
  errors: string[]
}

/** Stable across processes, unlike anything seeded per-run. */
function stableId(canonicalKey: string): string {
  let h = 2166136261
  for (let i = 0; i < canonicalKey.length; i++) {
    h ^= canonicalKey.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return 'al_' + (h >>> 0).toString(36)
}

function minutesSince(iso: string | null | undefined): number | null {
  if (!iso) return null
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return null
  return Math.floor((Date.now() - t) / 60000)
}

/* ── Discovery ───────────────────────────────────────────────────────────
   /activities caps every response at 500 rows and sorts newest first, so
   a single call silently hides whole categories — 12 biodiversity rows
   exist, and the unfiltered top 500 contains 2 of them. Discovery
   therefore sweeps three ways and unions the results: a date window, one
   pass per category, and the media index for observations.
*/
const SWEEP_CATEGORIES = [
  'fertilizer', 'sprays', 'field_activities', 'harvest', 'biodiversity', 'cows',
]

async function discover(cfg: AuraLiveConfig, errors: string[]): Promise<GatewayRecord[]> {
  const byKey = new Map<string, GatewayRecord>()
  const take = (records: GatewayRecord[]) => {
    for (const r of records) if (!byKey.has(r.canonical_key)) byKey.set(r.canonical_key, r)
  }

  const now = new Date()
  const from = new Date(now.getTime() - cfg.lookbackDays * 86400_000)

  /* Month-sized windows keep each response well under the 500 cap. */
  const windows: [string, string][] = []
  for (let cursor = new Date(from); cursor < now;) {
    const next = new Date(cursor)
    next.setUTCDate(next.getUTCDate() + 30)
    windows.push([cursor.toISOString(), (next < now ? next : now).toISOString()])
    cursor = next
  }

  const jobs: Promise<void>[] = []
  for (const [a, b] of windows) {
    jobs.push(
      fetchActivities({ from: a, to: b })
        .then((p) => take(p.items))
        .catch((e) => { errors.push(`activities ${a.slice(0, 10)}: ${String(e instanceof Error ? e.message : e)}`) }),
    )
  }
  for (const category of SWEEP_CATEGORIES) {
    jobs.push(
      fetchActivities({ category })
        .then((p) => take(p.items))
        .catch((e) => { errors.push(`activities/${category}: ${String(e instanceof Error ? e.message : e)}`) }),
    )
  }
  await Promise.all(jobs)

  /* Observations are not in /activities at all. The media index is the
     only route to them: each approved asset names the record it belongs
     to, and that record carries the sighting and its exact time. */
  try {
    const media = await fetchMedia({ limit: 100 })
    const keys = new Set<string>()
    for (const m of media.items) {
      const linked = (m.metadata as Record<string, unknown> | null | undefined)?.linkedRecordKey
      if (typeof linked === 'string' && linked) keys.add(linked)
    }
    const records = await Promise.all(
      [...keys].map((k) =>
        fetchRecord(k).catch((e) => {
          errors.push(`record ${k}: ${String(e instanceof Error ? e.message : e)}`)
          return null
        }),
      ),
    )
    take(records.filter((r): r is GatewayRecord => r !== null))
  } catch (e) {
    errors.push(`media: ${String(e instanceof Error ? e.message : e)}`)
  }

  /* Rainfall is addressable only by canonical key — no list endpoint
     returns it — so recent days are probed directly. Skipped entirely
     unless a unit has been confirmed, since the source does not state one. */
  if (process.env.AURA_LIVE_RAINFALL_UNIT?.trim()) {
    const days: string[] = []
    for (let i = 1; i <= 14; i++) {
      const d = new Date(now.getTime() - i * 86400_000)
      days.push(d.toISOString().slice(0, 10))
    }
    const rain = await Promise.all(days.map((d) => fetchRecord(`rainfall:${d}`).catch(() => null)))
    take(rain.filter((r): r is GatewayRecord => r !== null))
  }

  return [...byKey.values()]
}

/* ── The run ─────────────────────────────────────────────────────────── */

export async function runFeedGeneration(
  opts: { force?: boolean; now?: Date } = {},
): Promise<RunOutcome> {
  const cfg = loadConfig()
  const now = opts.now ?? new Date()
  const errors: string[] = []
  const base: RunOutcome = {
    ran: false, reason: '', discovered: 0, eligible: 0, merged: 0,
    published: 0, updated: 0, rejected: 0, entries: 0, freshnessMinutes: null, errors,
  }

  /* 1. Is the estate publishing right now? */
  const window = inWindow(cfg.windows, now)
  if (!window.open && !cfg.ignoreWindows && !opts.force) {
    const p = estateParts(now)
    return { ...base, reason: `outside publishing windows (${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')} IST)` }
  }

  /* 2. Is the source healthy and current? */
  let freshnessMinutes: number | null = null
  let sourceRevision: string | null = null
  try {
    const status = await fetchStatus()
    sourceRevision = status.sourceRevision
    freshnessMinutes = minutesSince(status.lastSuccessAt)
    if (!status.healthy) {
      return { ...base, reason: `gateway reported an error on its last sync`, freshnessMinutes }
    }
    if (freshnessMinutes !== null && freshnessMinutes > cfg.staleAfterMinutes) {
      /* The page keeps everything it has already published. It just stops
         growing while the source is behind, and says so. */
      return { ...base, reason: `gateway stale (${freshnessMinutes} min since last sync)`, freshnessMinutes }
    }
  } catch (e) {
    return { ...base, reason: `gateway status unavailable: ${String(e instanceof Error ? e.message : e)}`, freshnessMinutes }
  }

  const store = getStore(cfg)
  const doc = await store.read()

  /* 2b. Has anything upstream actually changed?
     The gateway publishes a content hash of everything it read. When that
     has not moved since our last completed discovery, there is provably
     nothing new, and a full sweep would be about a hundred requests to
     learn that. This matters more than it looks: each source sheet in the
     corpus carries exactly one edit day across eleven weeks, so the
     overwhelming majority of scheduled runs have nothing to find. Two
     requests instead of a hundred is what makes a half-hourly schedule
     reasonable against a source that changes every few weeks. */
  if (
    sourceRevision &&
    doc.sourceRevision === sourceRevision &&
    doc.entries.length > 0 &&
    !opts.force
  ) {
    return {
      ...base,
      reason: 'source unchanged since the last run',
      window: window.window,
      entries: doc.entries.length,
      freshnessMinutes,
    }
  }

  const published = new Map(doc.entries.map((e) => [e.canonicalKey, e]))
  /* A row that contributed to a merged card must not resurface as its
     own card on the next run. */
  const claimed = new Set(doc.entries.flatMap((e) => e.contributingKeys.length ? e.contributingKeys : [e.canonicalKey]))

  /* 3. Discover. */
  const records = await discover(cfg, errors)
  base.discovered = records.length

  /* Built from the whole corpus, not from one record, because the note on
     a tagging row can name somebody who only ever appears in a different
     row’s Done By column. */
  const roster = buildRoster(records, clearedNames())

  const audits: AuditRecord[] = []
  const at = now.toISOString()
  const audit = (
    canonicalKey: string, outcome: AuditRecord['outcome'], reasons: string[],
    contributingKeys: string[] = [canonicalKey], score?: number,
  ) => {
    const rec: AuditRecord = { at, canonicalKey, contributingKeys, outcome, reasons, score, generatorVersion: cfg.generatorVersion }
    audits.push(rec)
    console.log(logLine(rec))
  }

  /* 4–6. Normalise, safety, policy. */
  const eligible: Candidate[] = []
  const corrections: GatewayRecord[] = []
  for (const record of records) {
    const existing = published.get(record.canonical_key)
    const isNew = !claimed.has(record.canonical_key)
    if (!isNew && existing) {
      /* Already on the page. Only a genuine source correction matters. */
      const seen = existing.evidence.syncedAt
      const nowSynced = record.provenance?.syncedAt
      if (record.updated_at && seen && nowSynced && record.updated_at > (existing.updatedAt ?? existing.publishedAt)) {
        corrections.push(record)
      }
      continue
    }
    if (!isNew) continue

    const raw = normalise(record)
    if (!raw) { audit(record.canonical_key, 'rejected', ['unnormalisable-or-no-date']); continue }

    const candidate = applyLocationSafety(raw)
    const verdict = isPublishable(candidate, cfg)
    if (!verdict.ok) { audit(record.canonical_key, 'rejected', verdict.reasons); continue }
    if (!isPublishableSetback(candidate)) {
      audit(record.canonical_key, 'rejected', ['setback-without-context'])
      continue
    }
    eligible.push(candidate)
  }
  base.eligible = eligible.length

  /* 7. Merge rows that describe one event. */
  const merged = mergeCandidates(eligible)
  base.merged = merged.length
  for (const m of merged) {
    if (m.rowCount > 1) audit(m.canonicalKey, 'merged', [`${m.rowCount} source rows describe one event`], m.contributingKeys)
  }

  /* 8. Score, and take the best of what clears the bar. */
  const feed = [...doc.entries]

  /* Ordered by a first-pass score, then re-scored one at a time against
     the feed as it grows. Scoring the whole set up front and taking the
     top six is the bug that produced four near-identical spraying cards
     in a row: the repetition penalty could only see the feed as it was
     before the run, never the cards the run was itself adding. */
  const queue = merged
    .map((c) => ({ candidate: c, provisional: scoreCandidate(c, feed).total }))
    .sort((a, b) => b.provisional - a.provisional)

  const accepted: AuraFeedEntry[] = []
  const perCategory = new Map<string, number>()
  /* The gallery matches on subject, which is evidence rather than copy,
     so it has to survive the walk from candidate to stored entry. */
  const subjects = new Map<string, string>()

  for (const { candidate } of queue) {
    const score = scoreCandidate(candidate, feed)

    if (accepted.length >= cfg.maxPublishPerRun) {
      audit(candidate.canonicalKey, 'deferred', ['run publication limit reached'], candidate.contributingKeys, score.total)
      continue
    }
    if (score.total < cfg.minScore) {
      audit(candidate.canonicalKey, 'rejected', [...score.reasons, `below-threshold-${cfg.minScore}`], candidate.contributingKeys, score.total)
      continue
    }
    const category = candidate.category ?? 'field-activities'
    if ((perCategory.get(category) ?? 0) >= cfg.maxPerCategoryPerRun) {
      audit(candidate.canonicalKey, 'deferred', [`already published ${cfg.maxPerCategoryPerRun} ${category} entries this run`], candidate.contributingKeys, score.total)
      continue
    }

    const entry = await buildEntry(candidate, score.total, score.reasons, at, cfg, roster)
    if (!entry) {
      audit(candidate.canonicalKey, 'rejected', ['copy-failed-verification-or-name-policy'], candidate.contributingKeys, score.total)
      continue
    }
    accepted.push(entry)
    subjects.set(entry.id, candidate.subject)
    feed.unshift(entry)
    perCategory.set(category, (perCategory.get(category) ?? 0) + 1)
    audit(candidate.canonicalKey, 'accepted', score.reasons, candidate.contributingKeys, score.total)
  }

  /* 9. Corrections. The copy is rewritten; the identity, the event time
        and the publication time are not — a card does not become new
        because a spreadsheet cell was fixed. */
  let updatedCount = 0
  for (const record of corrections) {
    const existing = published.get(record.canonical_key)
    if (!existing) continue
    const raw = normalise(record)
    if (!raw) continue
    const candidate = applyLocationSafety(raw)
    if (!isPublishable(candidate, cfg).ok) {
      /* A record that no longer qualifies is withdrawn rather than left
         standing with copy that is now wrong. */
      const idx = doc.entries.findIndex((e) => e.canonicalKey === record.canonical_key)
      if (idx >= 0) doc.entries.splice(idx, 1)
      audit(record.canonical_key, 'updated', ['source correction made the record unpublishable; card withdrawn'])
      updatedCount++
      continue
    }
    const [only] = mergeCandidates([candidate])
    const score = scoreCandidate(only, doc.entries)
    const rebuilt = await buildEntry(only, score.total, score.reasons, at, cfg, roster)
    if (!rebuilt) continue
    const idx = doc.entries.findIndex((e) => e.canonicalKey === record.canonical_key)
    if (idx < 0) continue
    doc.entries[idx] = {
      ...rebuilt,
      id: existing.id,
      publishedAt: existing.publishedAt,
      updatedAt: at,
    }
    audit(record.canonical_key, 'updated', ['source correction applied'], only.contributingKeys, score.total)
    updatedCount++
  }

  /* 10. Commit. Newest event first; publication time breaks ties so two
         cards from the same day keep the order they were published in. */
  const entries = [...accepted, ...doc.entries]
    .sort((a, b) => {
      const byEvent = (b.occurredAt ?? b.occurredOn).localeCompare(a.occurredAt ?? a.occurredOn)
      return byEvent !== 0 ? byEvent : b.publishedAt.localeCompare(a.publishedAt)
    })
    .slice(0, cfg.maxFeedEntries)

  /* 10b. Archive imagery, when it is switched on.
     Assigned last and in reading order, because "what the reader just
     saw" is a fact about the feed’s final order and the order is not
     known until the sort above has run. Only entries published by this
     run are touched: an entry already on the page keeps the picture it
     was published with, whatever moves around it, because a photograph
     that changes under a reader is one they were never really shown. */
  if (cfg.archiveImages) {
    const isNew = new Set(accepted.map((e) => e.id))
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      if (!isNew.has(entry.id) || entry.media.length) continue
      const neighbours = [entries[i - 2], entries[i - 1], entries[i + 1], entries[i + 2]]
        .filter(Boolean)
        .flatMap((n) => n.media.filter((m) => m.isEditorialImagery).map((m) => m.url))
      const picture = pickGalleryImage(
        entry.id,
        entry.category,
        subjects.get(entry.id) ?? entry.headline,
        neighbours,
      )
      if (picture) entries[i] = { ...entry, media: [picture] }
    }
  }

  /* The watermark advances only now, after everything above succeeded. */
  const watermark = records
    .map((r) => r.updated_at)
    .filter((v): v is string => Boolean(v))
    .sort()
    .at(-1) ?? doc.watermark

  /* What the estate holds, captured on the same pass that reads it.
     Counts and dates only: what is in date *today* is worked out at
     render, because today moves and a stored answer would be stale by
     the next morning. */
  await store.write({
    version: 1,
    watermark,
    /* Recorded only now, and only when every sweep succeeded. A partial
       failure means we cannot know what we did not see, so the revision
       stays where it was and the next run does the work again — the same
       reasoning as the watermark, and the reason this optimisation cannot
       silently swallow an event. */
    sourceRevision: errors.length ? doc.sourceRevision : sourceRevision,
    lastRunAt: at,
    entries,
    audit: appendAudit(doc.audit, audits),
  })

  return {
    ...base,
    ran: true,
    reason: accepted.length || updatedCount ? 'published' : 'nothing new met the bar',
    window: window.window,
    published: accepted.length,
    updated: updatedCount,
    rejected: audits.filter((a) => a.outcome === 'rejected').length,
    entries: entries.length,
    freshnessMinutes,
  }
}

/**
 * What the card does not say but the record does.
 *
 * Every value here is verbatim from a named source column — nothing is
 * derived, combined or rounded — so the panel is the evidence, not a
 * summary of it. Anything absent from the record is absent here; a row
 * with no method recorded gets no method line rather than a shrug.
 */
function detailsFor(c: MergedCandidate): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = []
  const add = (label: string, value?: string) => { if (value) out.push({ label, value }) }

  add(c.actor?.type === 'species' ? 'Observed' : 'Who', c.actor?.label)
  add('Quantity', c.quantities.join(', ') || undefined)
  if (c.area) {
    const bare = c.area.replace(/\s*acres?\.?$/i, '').trim()
    add('Area', `${bare} ${Number(bare) === 1 ? 'acre' : 'acres'}`)
  }
  add('Method', c.method)
  add('Crop', c.crop)
  if (c.rowCount > 1) add('Records', `${c.rowCount} lines of the estate record`)
  return out
}

/** Assemble and validate one entry. Returns null if its copy could not be
 *  traced back to the evidence — the one failure that must never ship. */
async function buildEntry(
  c: MergedCandidate,
  score: number,
  reasons: string[],
  at: string,
  cfg: AuraLiveConfig,
  roster: Roster = OPEN_ROSTER,
): Promise<AuraFeedEntry | null> {
  const template = writeCopy(c)
  const templateVerdict = verifyCopy(template, c)
  if (!templateVerdict.ok) {
    console.log(JSON.stringify({ evt: 'aura-live.template-rejected', key: c.canonicalKey, problems: templateVerdict.problems }))
    return null
  }

  const { copy: written, generatedBy, rejection } = await writeCopyWithModel(c, template, cfg)
  if (rejection) console.log(JSON.stringify({ evt: 'aura-live.llm-fallback', key: c.canonicalKey, rejection }))

  /* Last gate before storage. A worker's name in the headline or body is
     fatal to the card; in the supplementary line it costs the line. */
  const inMain = roster.has(`${written.headline} ${written.body}`)
  if (inMain) {
    console.log(JSON.stringify({ evt: 'aura-live.name-policy', key: c.canonicalKey, where: 'body' }))
    return null
  }
  const copy = written.significance && roster.has(written.significance)
    ? { ...written, significance: undefined }
    : written
  if (copy !== written) {
    console.log(JSON.stringify({ evt: 'aura-live.name-policy', key: c.canonicalKey, where: 'significance' }))
  }

  const id = stableId(c.canonicalKey)

  /* Event media always wins. A card left with no media here is one the
     gateway had no approved photograph for; the gallery fills it in the
     pass below, once the feed’s final order is known. */
  const media = c.media.filter((m) => !m.isEditorialImagery).slice(0, 4)

  const entry = {
    id,
    canonicalKey: c.canonicalKey,
    contributingKeys: c.contributingKeys,
    estate: 'mudigere' as const,
    category: c.category!,
    headline: copy.headline,
    body: copy.body,
    significance: copy.significance,
    details: detailsFor(c),
    actor: c.actor,
    location: c.location,
    occurredAt: c.time.occurredAt,
    occurredOn: c.time.occurredOn,
    timePrecision: c.time.precision,
    timeWindow: c.time.timeWindow,
    publishedAt: at,
    media,
    evidence: {
      actuality: c.evidence.actuality,
      confidence: c.evidence.confidence,
      reviewStatus: c.evidence.reviewStatus,
      syncedAt: c.evidence.syncedAt,
      warnings: c.evidence.warnings,
      source: sourceName(c.sourceKey),
      records: c.contributingKeys.length,
    },
    editorial: {
      score,
      reasons,
      templateId: copy.templateId,
      generatedBy,
      generatorVersion: cfg.generatorVersion,
    },
  }

  const parsed = AuraFeedEntrySchema.safeParse(entry)
  if (!parsed.success) {
    console.log(JSON.stringify({ evt: 'aura-live.entry-invalid', key: c.canonicalKey, issues: parsed.error.issues.slice(0, 3) }))
    return null
  }
  return parsed.data
}

export { GatewayError }
