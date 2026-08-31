/* AURA Live — turning a gateway row into an evidence object.
 *
 * Nothing downstream of this file is allowed to read `facts` directly.
 * Everything a card can say has to arrive here first, as a named field
 * traced to a named source column, because that is what makes the
 * claim-verification stage possible: if a sentence contains a number the
 * candidate does not carry, the sentence is wrong and gets thrown away.
 *
 * The source is a set of Google Sheets kept by people on an estate. It
 * spells "Manual" as "Mannual", writes dates as both "26 Aug" and
 * "29/07/26", and puts "Week Off" in a column called "Time window". All
 * of that is handled here so that no later stage has to know about it.
 */

import type { GatewayRecord, GatewayMedia } from './schema'
import type { AuraFeedCategory } from './taxonomy'
import {
  parseClock, parseTimeWindow, fromEstateWallClock, dateOnlyKey, isUtcMidnight,
  type FeedTime,
} from './time'
import type { FeedMedia } from './schema'

export type Actor = { label: string; type: 'person' | 'team' | 'species' | 'animal' | 'natural_process' }
export type Place = { label: string; block?: string; zone?: string }

export type Candidate = {
  canonicalKey: string
  contributingKeys: string[]
  category: AuraFeedCategory | null
  kind: 'activity' | 'observation' | 'weather' | 'preparation'
  sourceKey: string
  /** The thing the event is about: an input, a species, a crop. */
  subject: string
  /** Free text the source wrote about what happened. */
  description?: string
  /** The source's own note on how it went. */
  note?: string
  actor?: Actor
  location?: Place
  time: FeedTime
  /** Verbatim from the source, unit included. Never re-computed. */
  quantity?: string
  area?: string
  method?: string
  status?: string
  crop?: string
  media: FeedMedia[]
  evidence: {
    actuality: string
    confidence?: number
    reviewStatus?: string
    syncedAt?: string
    warnings: string[]
  }
  /** Every scalar a generated sentence is permitted to contain. */
  allowedTerms: string[]
  /** Newest source mutation time, for the discovery watermark. */
  sourceUpdatedAt?: string
  raw: GatewayRecord
}

/* ── Names ───────────────────────────────────────────────────────────────
   The site has cleared exactly three individuals for publication —
   Pulkit, Rao and Chander (docs/editorial/open-questions.md §4). Everyone
   else who appears in a "Done By" column is a worker whose name AURA has
   not asked to publish, and a public feed is not the place to decide that
   for them. Uncleared individuals collapse to the estate team.

   Team-level attributions are different, and are kept: "Sadananda’s Team"
   is how the source’s own People column credits a crew, and crediting a
   crew is not the same as publishing a person’s name against their work.
*/
export function clearedNames(): string[] {
  return (process.env.AURA_LIVE_CLEARED_NAMES ?? 'Pulkit,Rao,Chander')
    .split(',').map((s) => s.trim()).filter(Boolean)
}

const TEAM_FALLBACK = 'Aura’s estate team'

function isCleared(name: string): boolean {
  const lower = name.toLowerCase()
  return clearedNames().some((c) => lower === c.toLowerCase() || lower.startsWith(c.toLowerCase() + ' '))
}

/** "Prashanth Mna + 13 workers" → "Prashanth Mna". Headcounts are the
 *  estate's business, not the reader's. */
function stripCrewSize(v: string): string {
  return v
    .replace(/\s*\+\s*\d+\s*(workers?|labourers?|labor(er)?s?)\b/gi, '')
    .replace(/\s*\+\s*team of\s*\d+/gi, '')
    .replace(/\s*\+\s*\d+\s*$/g, '')
    .trim()
}

function resolveActor(facts: Record<string, unknown>): Actor | undefined {
  /* A team column is a team credit and is used as written. */
  const people = str(facts.People)
  if (people) return { label: people, type: 'team' }

  const doneBy = str(facts['Done By']) ?? str(facts.Supervisor) ?? str(facts.Sender)
  if (!doneBy) return undefined

  /* "Rao → Chanderdeep", "Nayana (spotted), Pulkit Aura (reported)" —
     the source records a chain. Take the individuals it names. */
  const names = doneBy
    .split(/[,→>/]|\band\b/i)
    .map((s) => stripCrewSize(s.replace(/\([^)]*\)/g, '')).trim())
    .filter(Boolean)

  const cleared = names.filter(isCleared)
  if (cleared.length) {
    /* Use the source's own spelling of a cleared name, first mention. */
    return { label: cleared[0], type: 'person' }
  }
  /* Uncleared. Say the team did it — but only because these columns are
     the estate’s own field-work log, which establishes that it was
     estate work. Anywhere that is not true, the actor is omitted. */
  return names.length ? { label: TEAM_FALLBACK, type: 'team' } : undefined
}

/* ── Small readers ───────────────────────────────────────────────────── */

function str(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined
  const t = v.trim()
  /* The sheets use an em dash as "nothing here". */
  if (!t || t === '—' || t === '-' || t === 'N/A' || t.toLowerCase() === 'null') return undefined
  return t
}

/* The source lists places the way a person writes them into a cell:
   "Block 3, Block 2, Block 1" for three blocks, "1,2,3" for three zones
   of one block, and "3, 3" for one zone written twice. Reading them into
   a canonical form asserts nothing new — the same blocks, the same zones,
   in a stable order — and it is the difference between a card that says
   "Blocks 1, 2 and 3" and one that says "Block 3, Block 2, Block 1 ·
   Zone 3, 3". */
function normaliseBlocks(raw: string): string | undefined {
  const numbers = [...raw.matchAll(/block\s*([0-9]+[a-z]?)/gi)].map((m) => m[1])
  const unique = [...new Set(numbers)]
  if (!unique.length) return raw
  unique.sort((a, b) => (parseInt(a, 10) - parseInt(b, 10)) || a.localeCompare(b))
  if (unique.length === 1) return `Block ${unique[0]}`
  return `Blocks ${unique.slice(0, -1).join(', ')} and ${unique[unique.length - 1]}`
}

function normaliseZones(raw: string): string | undefined {
  const tokens = raw.split(/[,;/]+/).map((t) => t.replace(/zone/i, '').trim()).filter(Boolean)
  const unique = [...new Set(tokens)]
  if (!unique.length) return undefined
  unique.sort((a, b) => (parseInt(a, 10) - parseInt(b, 10)) || a.localeCompare(b))
  return unique.length === 1 ? `Zone ${unique[0]}` : `Zones ${unique.join(', ')}`
}

function resolveLocation(facts: Record<string, unknown>): Place | undefined {
  const rawBlock = str(facts.Block) ?? str(facts['Block / Zone'])
  const rawZone = str(facts.Zone)
  if (!rawBlock && !rawZone) return undefined

  const block = rawBlock ? normaliseBlocks(rawBlock) : undefined
  /* A zone is only meaningful beside the block it belongs to, and a
     multi-block row cannot say which zone belongs to which. */
  const oneBlock = Boolean(block && /^Block\s/.test(block))
  const zone = rawZone && oneBlock ? normaliseZones(rawZone) : undefined

  const label = [block, zone].filter(Boolean).join(' · ')
  if (!label) return undefined
  return { label, block, zone }
}

/**
 * Resolve the three-way time question for one record.
 *
 * The gateway renders a date-only row as midnight UTC. Treating that as a
 * timestamp would put "12:00 AM" on a card, so a midnight `occurred_at`
 * is only ever read for its calendar date, and a real clock reading has
 * to come from a column that actually holds one.
 */
export function resolveTime(record: GatewayRecord): FeedTime | null {
  const facts = record.facts ?? {}
  const occurred = record.occurred_at

  /* A genuine timestamp — not midnight — is the best evidence there is. */
  if (occurred && !isUtcMidnight(occurred)) {
    return { precision: 'exact', occurredAt: new Date(occurred).toISOString(), occurredOn: dateOnlyKey(occurred) }
  }

  const dateKey = occurred ? dateOnlyKey(occurred) : isoFromSourceDate(facts)
  if (!dateKey) return null

  /* An explicit clock column upgrades a date-only row to exact. */
  const clock = parseClock(facts.Time)
  if (clock != null) {
    const [y, m, d] = dateKey.split('-').map(Number)
    return {
      precision: 'exact',
      occurredAt: fromEstateWallClock(y, m, d, Math.floor(clock / 60), clock % 60).toISOString(),
      occurredOn: dateKey,
    }
  }

  /* A work period is real information and is shown as a period. */
  const window = parseTimeWindow(facts['Time window'])
  if (window) return { precision: 'window', occurredOn: dateKey, timeWindow: window }

  return { precision: 'date', occurredOn: dateKey }
}

/** "29/07/26" and "2026-08-25" both appear. "26 Aug" does not carry a
 *  year and is never used as the sole source of a date. */
function isoFromSourceDate(facts: Record<string, unknown>): string | null {
  const raw = str(facts.date) ?? str(facts.Date)
  if (!raw) return null
  let m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (m) return raw
  m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/)
  if (m) {
    const d = Number(m[1]), mo = Number(m[2])
    let y = Number(m[3])
    if (y < 100) y += 2000
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null
    return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }
  return null
}

/* ── Category ────────────────────────────────────────────────────────────
   Keyed on the source’s own editorial buckets first, because those were
   chosen by the people doing the work; the gateway’s coarser category is
   the fallback. Both maps are data, so adding a bucket is an edit here
   rather than a change to the pipeline.

   Several of the site’s thirteen subjects have nothing mapped to them yet
   — bees, fermentation, prayers, the lunar rhythm. That is not an
   oversight: the estate does not currently log them in a form the gateway
   carries, and inventing a mapping so the category is not empty would be
   the feature deciding what the estate did.
*/
const BY_SOURCE_CATEGORY: Record<string, AuraFeedCategory> = {
  'vedic': 'sprays',
  'biodynamic': 'sprays',
  'bd inputs & spraying': 'sprays',
  'decomposer': 'sprays',
  'bd prep': 'fertiliser-prep',
  'bd & prep': 'fertiliser-prep',
  'composting & soil': 'fertiliser-prep',
  'shade management': 'field-activities',
  'jungle & base cleaning': 'field-activities',
  'planting & nursery': 'field-activities',
  'tree tagging & data': 'field-activities',
  'infrastructure & proc': 'field-activities',
  'vg & harvest': 'harvest',
  'biodiversity & obs': 'biodiversity',
}

const BY_GATEWAY_CATEGORY: Record<string, AuraFeedCategory> = {
  fertilizer: 'sprays',
  sprays: 'sprays',
  harvest: 'harvest',
  biodiversity: 'biodiversity',
  cows: 'cows',
  weather: 'seasons',
  field_activities: 'field-activities',
}

export function resolveCategory(record: GatewayRecord): AuraFeedCategory | null {
  /* Making a preparation and applying one are different subjects on this
     site, and the gateway files both under "fertilizer". The source key
     is what separates them. */
  if (record.source_key === 'fertilizer_production') return 'fertiliser-prep'
  if (record.record_type === 'observation') return 'biodiversity'
  const own = str(record.facts?.Category)?.toLowerCase()
  if (own && BY_SOURCE_CATEGORY[own]) return BY_SOURCE_CATEGORY[own]
  return BY_GATEWAY_CATEGORY[record.category] ?? null
}

/* ── Where a fact came from, in English ──────────────────────────────────
   A reader weighing an entry is entitled to know which of the estate’s
   books it came out of. What they are not entitled to — and what would be
   a leak rather than transparency — is the Drive path, the file id or the
   row number, so this maps the source key to a name and stops there. */
const SOURCE_NAME: Record<string, string> = {
  input_applications: 'The estate’s daily application log',
  fertilizer_production: 'The preparation batch record',
  field_activities: 'The daily field-work log',
  biodiversity_observations: 'The biodiversity observation sheet',
  rainfall_2026: 'The estate rain gauge record',
  animals_bovines: 'The herd register',
  coffee_harvest: 'The harvest record',
}

export function sourceName(sourceKey: string | null | undefined): string | undefined {
  if (!sourceKey) return undefined
  return SOURCE_NAME[sourceKey]
}

/* ── Media ───────────────────────────────────────────────────────────── */

export function toFeedMedia(m: GatewayMedia): FeedMedia {
  const alt = m.caption ?? m.speciesName ?? 'Photograph from Aura Estate, Mudigere'
  const ratio = m.width && m.height ? m.width / m.height : undefined
  return {
    type: m.mediaType,
    url: m.mediaType === 'video' ? m.contentUrl : m.imageUrl,
    thumbnailUrl: m.thumbnailUrl,
    posterUrl: m.posterUrl ?? m.thumbnailUrl,
    alt,
    width: m.width ?? undefined,
    height: m.height ?? undefined,
    ratio,
    isEditorialImagery: false,
  }
}

/* ── The normalisers ─────────────────────────────────────────────────── */

function baseEvidence(record: GatewayRecord) {
  return {
    actuality: record.actuality,
    confidence: record.confidence ?? record.provenance?.confidence ?? undefined,
    reviewStatus: record.review_status ?? record.provenance?.reviewStatus ?? undefined,
    syncedAt: record.provenance?.syncedAt ?? undefined,
    warnings: record.warnings ?? [],
  }
}

/** Every scalar a sentence about this candidate may contain. The verifier
 *  rejects any generated number, name or place that is not in this set. */
function collectTerms(c: Omit<Candidate, 'allowedTerms'>): string[] {
  const terms = [
    c.subject, c.quantity, c.area, c.method, c.crop,
    c.actor?.label, c.location?.label, c.location?.block, c.location?.zone,
    c.description, c.note, c.time.timeWindow, c.time.occurredOn,
  ].filter((v): v is string => Boolean(v))
  return terms
}

export function normaliseActivity(record: GatewayRecord): Candidate | null {
  const time = resolveTime(record)
  if (!time) return null
  const facts = (record.facts ?? {}) as Record<string, unknown>

  const subject =
    str(facts.Input) ?? str(facts['Bio- input']) ?? str(facts['Activity / Description']) ?? record.title
  const description = str(facts['Activity / Description']) ?? undefined
  const note = str(facts['Challenges / Observations']) ?? str(facts.Notes) ?? undefined

  const partial: Omit<Candidate, 'allowedTerms'> = {
    canonicalKey: record.canonical_key,
    contributingKeys: [record.canonical_key],
    category: resolveCategory(record),
    kind: record.source_key === 'fertilizer_production' ? 'preparation' : 'activity',
    sourceKey: record.source_key ?? 'unknown',
    subject,
    description,
    note,
    actor: resolveActor(facts),
    location: resolveLocation(facts),
    time,
    quantity: str(facts['Quantity Used']) ?? joinQty(facts.Qty, facts.Unit),
    area: str(facts['Area (acres)']),
    method: str(facts.Method),
    status: str(facts.Status) ?? str(facts['Testing Status']),
    crop: str(facts.Crop),
    media: (record.media ?? []).map(toFeedMedia),
    evidence: baseEvidence(record),
    sourceUpdatedAt: record.updated_at ?? record.provenance?.sourceModifiedTime ?? undefined,
    raw: record,
  }
  return { ...partial, allowedTerms: collectTerms(partial) }
}

function joinQty(qty: unknown, unit: unknown): string | undefined {
  const q = str(qty)
  const u = str(unit)
  if (!q) return undefined
  return u ? `${q} ${u}` : q
}

export function normaliseObservation(record: GatewayRecord): Candidate | null {
  const time = resolveTime(record)
  if (!time) return null
  const facts = (record.facts ?? {}) as Record<string, unknown>
  const species = str(facts['Species / Observation']) ?? record.title

  const partial: Omit<Candidate, 'allowedTerms'> = {
    canonicalKey: record.canonical_key,
    contributingKeys: [record.canonical_key],
    category: 'biodiversity',
    kind: 'observation',
    sourceKey: record.source_key ?? 'biodiversity_observations',
    subject: species,
    /* The observation sheet's Notes column is a process note about how the
       row was logged, not a fact about the animal. It is not published. */
    description: undefined,
    /* The observed thing is the actor. A vine snake needs no human. */
    actor: { label: species, type: 'species' },
    location: resolveLocation(facts),
    time,
    media: (record.media ?? []).map(toFeedMedia),
    evidence: baseEvidence(record),
    sourceUpdatedAt: record.updated_at ?? record.provenance?.sourceModifiedTime ?? undefined,
    raw: record,
  }
  return { ...partial, allowedTerms: collectTerms(partial) }
}

/**
 * Rainfall.
 *
 * The source records one number a day in a column called `primary` and
 * never says what it measures. 3.32 could be inches or millimetres and
 * the two tell completely different stories about a monsoon. Printing
 * either would be inventing a unit, so rainfall stays unpublishable until
 * AURA confirms it — set AURA_LIVE_RAINFALL_UNIT and this turns on.
 */
export function normaliseRainfall(record: GatewayRecord): Candidate | null {
  const unit = process.env.AURA_LIVE_RAINFALL_UNIT?.trim()
  if (!unit) return null
  const time = resolveTime(record)
  if (!time) return null
  const facts = (record.facts ?? {}) as Record<string, unknown>
  const amount = str(facts.primary)
  if (!amount) return null

  const partial: Omit<Candidate, 'allowedTerms'> = {
    canonicalKey: record.canonical_key,
    contributingKeys: [record.canonical_key],
    category: 'seasons',
    kind: 'weather',
    sourceKey: record.source_key ?? 'rainfall',
    subject: 'Rainfall',
    actor: { label: 'Rainfall', type: 'natural_process' },
    time,
    quantity: `${amount} ${unit}`,
    media: [],
    evidence: baseEvidence(record),
    sourceUpdatedAt: record.updated_at ?? undefined,
    raw: record,
  }
  return { ...partial, allowedTerms: collectTerms(partial) }
}

export function normalise(record: GatewayRecord): Candidate | null {
  if (record.record_type === 'observation') return normaliseObservation(record)
  if (record.record_type === 'weather') return normaliseRainfall(record)
  if (record.record_type === 'activity') return normaliseActivity(record)
  return null
}
