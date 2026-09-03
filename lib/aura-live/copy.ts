/* AURA Live — the words.
 *
 * Deterministic templates, one per evidence shape. This is the default
 * writer and the fallback for the optional model stage, which means the
 * feed is fully functional with no model, no key and no network beyond
 * the gateway.
 *
 * Three disciplines run through every template.
 *
 * The first: a template may only place values the candidate carries. It
 * never computes a total, never converts a unit, never infers a species
 * from a photograph, and never fills a gap with a plausible word. Where a
 * value is missing the sentence gets shorter, not vaguer.
 *
 * The second: an entry is two lines. A headline saying what happened and
 * where, and one line of the numbers underneath it. Who did the work, how,
 * on which crop, inside which hours — all recorded, all real, and all in
 * the evidence panel rather than on the surface, because a feed where
 * every card is a full dispatch note is a feed nobody reads to the end of.
 *
 * The third: enough shapes that it does not read as a mail merge. The
 * estate sprays the same preparation most weeks, and eight entries
 * opening the same way is its own kind of untruth — it makes routine work
 * look like an announcement.
 */

import type { MergedCandidate } from './merge'

export type Copy = {
  headline: string
  /** Absent when the headline already carries everything recorded. */
  body?: string
  /** Kept off the card and shown in the evidence panel. */
  significance?: string
  templateId: string
}

const NUMBER_WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']

function countWord(n: number): string {
  return n <= 10 ? NUMBER_WORDS[n] : String(n)
}

/** The estate writes in shorthand: pipes, double dashes, ALL CAPS words.
 *  Normalise the punctuation without touching a single word. */
function tidy(text: string): string {
  return text
    .replace(/\s*\|\s*/g, '. ')
    .replace(/\s*[–—-]{2,}\s*/g, ' — ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:])/g, '$1')
    .replace(/\.\s*\./g, '.')
    .trim()
}

function sentence(text: string): string {
  const t = tidy(text)
  if (!t) return t
  return /[.!?]$/.test(t) ? t : `${t}.`
}

/** ALL-CAPS words in the source are emphasis, not acronyms. */
function softenShouting(text: string): string {
  return text.replace(/\b[A-Z]{4,}\b/g, (w) => w[0] + w.slice(1).toLowerCase())
}

/* The source's place names are not all the same grammatical shape.
   "Block 10" takes "in"; "Near temple" already carries its own
   preposition; "Vegetable Garden 3" takes "at". Choosing wrongly is how
   an entry ends up saying "filmed in Near temple", so the shape of the
   label decides the word in front of it — and none of the three adds a
   syllable the estate did not write. */
function placePhrase(label: string): string {
  if (/^(block|zone)/i.test(label)) return `in ${label}`
  if (/^(near|beside|behind|around|above|below|along|by)\b/i.test(label)) {
    return label[0].toLowerCase() + label.slice(1)
  }
  return `at ${label}`
}

function placeClause(c: MergedCandidate): string {
  const label = c.places.length > 1 ? c.places.slice(0, 3).join(', ') : c.location?.label
  return label ? ` ${placePhrase(label)}` : ''
}

/* "1 acres" is the kind of small wrongness that makes a reader stop
   trusting the numbers around it — and some cells already carry the unit,
   which is how "32.24 acre acres" happens. */
function acres(value: string): string {
  const bare = value.replace(/\s*acres?\.?$/i, '').trim()
  return `${bare} ${Number(bare) === 1 ? 'acre' : 'acres'}`
}

/* ── Templates ───────────────────────────────────────────────────────── */

function wildlife(c: MergedCandidate): Copy {
  const hasPhoto = c.media.some((m) => !m.isEditorialImagery && m.type === 'image')
  const hasVideo = c.media.some((m) => !m.isEditorialImagery && m.type === 'video')
  const verb = hasVideo ? 'Filmed' : hasPhoto ? 'Photographed' : 'Recorded'

  /* The species alone. The place is on the line under it and in the
     evidence panel; a headline carrying both reads as a database row. */
  return {
    headline: c.subject,
    body: sentence(c.location ? `${verb} ${placePhrase(c.location.label)}` : `${verb} on the estate`),
    templateId: 'wildlife.observed.v2',
  }
}

function application(c: MergedCandidate): Copy {
  const facts = (c.raw.facts ?? {}) as Record<string, unknown>
  const input = c.subject
  const qty = c.quantities[0]
  const area = c.area ? acres(c.area) : undefined
  const where = c.location?.block ?? c.location?.label

  /* The input's own spelling is kept exactly as the estate wrote it,
     typos included: the sheet says "Neen Oil", and quietly correcting it
     to neem would be this feature editing the record it reports. */
  const headline = where ? `${input} applied in ${where}` : `${input} applied`

  const parts: string[] = []
  parts.push(qty ? `${qty} of ${input}` : input)
  if (area) parts.push(`across ${area}`)
  parts.push(placeClause(c).trim())

  /* The cumulative column is only quoted when the per-event column that
     establishes its unit is present on the same row. */
  const todate = str(facts['Todate Area'])
  const significance = todate && c.area
    ? `${input} has now been applied across ${acres(todate)} this round.`
    : undefined

  return {
    headline,
    body: sentence(parts.filter(Boolean).join(' ')),
    significance,
    templateId: 'practice.application.v2',
  }
}

function preparation(c: MergedCandidate): Copy {
  const input = c.subject
  const facts = (c.raw.facts ?? {}) as Record<string, unknown>
  const ingredients = str(facts['Ingredients used with Qty'])
  const testing = str(facts['Testing Status'])
  const qty = c.quantities[0]

  const headline = c.rowCount > 1
    ? `${capitalise(countWord(c.rowCount))} batches of ${input} ready`
    : `${input} batch ready`

  /* Counting rows is a fact about the evidence. Summing their volumes
     would be a number nobody wrote down, so it is not attempted. */
  const parts: string[] = []
  if (qty) parts.push(c.rowCount > 1 && c.quantities.length === 1 ? `${qty} each` : qty)
  if (ingredients) parts.push(`from ${ingredients.toLowerCase()}`)

  return {
    headline,
    body: sentence(parts.length ? parts.join(', ') : `${input}, ready for use`),
    significance: testing && /pass/i.test(testing)
      ? 'The batch was tested before it was cleared for use.'
      : undefined,
    templateId: 'craft.preparation.v2',
  }
}

function fieldwork(c: MergedCandidate): Copy {
  /* Field rows are terse log lines. Putting one in the headline and again
     in the body is the double writing this site’s editorial rules exist
     to stop, so the two carry different things: a short line makes the
     better headline and the place goes underneath it; a long line stays
     in the body where it has room, and the estate’s own category names
     the work above it. */
  const source = c.description ?? c.raw.title
  const clean = softenShouting(tidy(source))
  const work = humaniseCategory(str(c.raw.facts?.Category))
  const where = c.location?.label
  const SHORT = 52

  const significance = c.note ? sentence(softenShouting(c.note)) : undefined

  if (clean.length <= SHORT) {
    /* The estate's line is the headline. If it did not already name the
       place, the place is the line underneath; if it did, there is
       nothing left to say and the entry says nothing rather than
       restating that it was recorded. */
    const placeIsNew = where && !clean.toLowerCase().includes(where.toLowerCase())
    return {
      headline: clean.replace(/\.$/, ''),
      body: placeIsNew ? sentence(`Recorded ${placePhrase(where)}`) : undefined,
      significance,
      templateId: `field.${c.category}.v2`,
    }
  }

  const placeIsNew = Boolean(where && work && !work.toLowerCase().includes(where.toLowerCase()))
  const headline = work
    ? (placeIsNew ? `${work}, ${where}` : work)
    : `${clean.slice(0, SHORT + 20).replace(/[\s,;:.–—-]+$/, '')}…`

  return { headline, body: sentence(clean), significance, templateId: `field.${c.category}.v2` }
}

function weather(c: MergedCandidate): Copy {
  return {
    headline: 'Rainfall',
    body: sentence(`${c.quantities[0]} at the estate gauge`),
    templateId: 'weather.rainfall.v2',
  }
}

/* ── Entry point ─────────────────────────────────────────────────────── */

export function writeCopy(c: MergedCandidate): Copy {
  if (c.kind === 'observation') return wildlife(c)
  if (c.kind === 'weather') return weather(c)
  if (c.kind === 'preparation') return preparation(c)
  if (c.sourceKey === 'input_applications') return application(c)
  return fieldwork(c)
}

/* ── helpers ─────────────────────────────────────────────────────────── */

/* "Jungle & Base Cleaning" is a spreadsheet header. "Jungle and base
   cleaning" is the same words, punctuated for a sentence. An all-caps
   token is left alone: VG is the vegetable garden, and "Vg" is a typo
   this feature would have introduced. */
function humaniseCategory(raw?: string): string | undefined {
  if (!raw) return undefined
  const words = raw.replace(/&/g, 'and').replace(/\s+/g, ' ').trim()
  if (!words) return undefined
  const parts = words.split(' ').map((w, i) => {
    if (/^[A-Z0-9]{2,}$/.test(w)) return w
    const lowered = w.toLowerCase()
    return i === 0 ? capitalise(lowered) : lowered
  })
  return parts.join(' ')
}

function capitalise(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s
}

/* The sheets record an unknown as an answer: "not sure", "?", "tbd".
   Those are gaps wearing the clothes of data, and publishing "made from
   not sure" is worse than publishing nothing about the ingredients. */
const NON_ANSWER = /^(—|-|n\/?a|na|nil|none|not sure|unknown|tbd|tba|\?+|yes|no)$/i

function str(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined
  const t = v.trim()
  return !t || NON_ANSWER.test(t) ? undefined : t
}
