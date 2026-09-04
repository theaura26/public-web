/* AURA Live — every number a human might want to change.
 *
 * The rule this file exists to enforce: thresholds, publishing windows,
 * freshness limits and taxonomy weights are configuration, not code. An
 * editor who wants the feed to be stricter should be able to set an
 * environment variable, not open a pull request.
 *
 * Read once per process. Nothing here reaches the browser: the page is
 * server-rendered and the only values that cross are the finished feed
 * entries.
 */

import { ESTATE_TZ } from './time'

function num(name: string, fallback: number): number {
  const raw = process.env[name]
  if (raw == null || raw.trim() === '') return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? n : fallback
}

function str(name: string, fallback: string): string {
  const raw = process.env[name]
  return raw == null || raw.trim() === '' ? fallback : raw.trim()
}

function bool(name: string, fallback: boolean): boolean {
  const raw = process.env[name]
  if (raw == null || raw.trim() === '') return fallback
  return /^(1|true|yes|on)$/i.test(raw.trim())
}

/** "06:00-10:00,15:00-19:30" → minutes-from-midnight pairs, estate local. */
export type Window = { startMin: number; endMin: number; label: string }

export function parseWindows(spec: string): Window[] {
  const out: Window[] = []
  for (const part of spec.split(',')) {
    const m = part.trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/)
    if (!m) continue
    const startMin = Number(m[1]) * 60 + Number(m[2])
    const endMin = Number(m[3]) * 60 + Number(m[4])
    if (startMin >= endMin) continue
    out.push({ startMin, endMin, label: `${m[1].padStart(2, '0')}:${m[2]}–${m[3].padStart(2, '0')}:${m[4]}` })
  }
  return out.sort((a, b) => a.startMin - b.startMin)
}

export type AuraLiveConfig = ReturnType<typeof loadConfig>

export function loadConfig() {
  return {
    /* ── Source ── */
    gatewayBaseUrl: str(
      'AURA_GATEWAY_BASE_URL',
      'https://aura-mcp-seven.vercel.app/api/v1/gateway',
    ),
    gatewayTimeoutMs: num('AURA_GATEWAY_TIMEOUT_MS', 12_000),
    gatewayRetries: num('AURA_GATEWAY_RETRIES', 2),

    /* ── Estate ── */
    estate: 'mudigere' as const,
    timezone: ESTATE_TZ,

    /* ── Publishing windows, estate local time ──
       Runs outside every window exit without touching the ledger. */
    windows: parseWindows(str('AURA_LIVE_WINDOWS', '06:00-10:00,15:00-19:30')),
    /** Set true to let a run publish at any hour. For backfills and tests. */
    ignoreWindows: bool('AURA_LIVE_IGNORE_WINDOWS', false),

    /* ── Eligibility ──
       0.90 is not arbitrary: the gateway emits 0.94–0.98 on reviewed
       operational records and drops to 0.72 on recommendations, so the
       threshold sits in the gap between "confirmed" and "suggested". */
    minConfidence: num('AURA_LIVE_MIN_CONFIDENCE', 0.9),
    acceptedReviewStatuses: str('AURA_LIVE_REVIEW_STATUSES', 'reviewed,approved')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),

    /* ── Editorial ── */
    minScore: num('AURA_LIVE_MIN_SCORE', 8),
    /** How far back a run will look for events it has never seen. */
    lookbackDays: num('AURA_LIVE_LOOKBACK_DAYS', 120),
    /** Re-examined on every run, so a corrected row is picked up. */
    watermarkOverlapHours: num('AURA_LIVE_WATERMARK_OVERLAP_HOURS', 72),
    /** Cards published per run. Keeps a first run from dumping the archive. */
    maxPublishPerRun: num('AURA_LIVE_MAX_PUBLISH_PER_RUN', 6),
    /** And no more than this many from any one category in a single run,
        so a busy spraying week cannot take the whole page. */
    maxPerCategoryPerRun: num('AURA_LIVE_MAX_PER_CATEGORY_PER_RUN', 2),
    /* ── The recent lane ──
       A page called NOW ranked the last few days against the best of the
       last five months and lost, every run. Nothing in the score knows
       what day it is, so the estate's routine daily work — a spray
       applied, a preparation made — sat at rank 255 of 263 behind a
       backlog it could never out-argue, and the page's newest card was
       days old while the source had that morning's.

       So the last few days get their own slots, taken before the ranked
       queue is opened, judged on whether they qualify rather than on
       whether they beat an archive. */
    /** How recent is recent. Two days covers yesterday's work written up
        this morning, which is how the estate actually files. */
    recentDays: num('AURA_LIVE_RECENT_DAYS', 2),
    /** Slots held for those days, taken from the run's total. The estate
        files three or four applications on a working day. */
    maxRecentPerRun: num('AURA_LIVE_MAX_RECENT_PER_RUN', 4),
    /** Feed length on the page. */
    maxFeedEntries: num('AURA_LIVE_MAX_FEED_ENTRIES', 60),
    /** How many canonical keys the ledger remembers publishing, past the
        cards it still shows. Comfortably more than the lookback window
        can surface, so nothing is forgotten while it is still
        discoverable — and cheap, because a key is not an entry. */
    maxRememberedKeys: num('AURA_LIVE_MAX_REMEMBERED_KEYS', 5000),

    /* ── Pictures ──
       Off. An entry carries a photograph when the estate took one of the
       event, and otherwise carries none. Archive imagery filled the space
       and was labelled honestly, but a feed whose whole claim is evidence
       reads better with a gap than with an illustration — the entries
       that do have a picture are the ones that earned it.
       Turn it on and the gallery fallback returns, disclosure and all. */
    archiveImages: bool('AURA_LIVE_ARCHIVE_IMAGES', false),

    /* ── Freshness ──
       Above this, the page keeps its history but stops claiming to be
       live, and the job stops publishing anything new. */
    staleAfterMinutes: num('AURA_LIVE_STALE_AFTER_MINUTES', 180),

    /* ── Optional copy stage ──
       Off unless explicitly enabled AND a key is present. Deterministic
       templates are the default and the fallback. */
    llmEnabled: bool('AURA_LIVE_LLM', false) && Boolean(process.env.OPENAI_API_KEY),
    llmModel: str('AURA_LIVE_LLM_MODEL', 'gpt-4.1-mini'),

    /* ── Storage ── */
    store: str('AURA_LIVE_STORE', process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file'),
    storeKey: str('AURA_LIVE_STORE_KEY', 'aura-live/feed.json'),
    storeFilePath: str('AURA_LIVE_STORE_FILE', '.aura-live/feed.json'),

    /** Bumped whenever copy generation changes, so the audit trail can
        explain why the same evidence produced different words. */
    generatorVersion: 'aura-live/1.0.0',
  }
}
