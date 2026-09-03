/* AURA Live — the claim check.
 *
 * Runs on every sentence the feed is about to publish, whether a template
 * wrote it or a model did. Templates are checked too, and that is not
 * belt-and-braces: a template is a program, programs get edited, and a
 * check that only runs on output somebody already distrusts is a check
 * that never catches the surprising failure.
 *
 * The test is traceability, not plausibility. A number, a name or a place
 * in the copy has to appear in the candidate's evidence. Anything that
 * does not is rejected outright — there is no "probably fine" branch,
 * because the whole proposition of AURA Live is that a reader does not
 * have to take its word for anything.
 */

import type { MergedCandidate } from './merge'
import type { Copy } from './copy'
import { calendarLabel } from './time'

export type VerifyResult = { ok: true } | { ok: false; problems: string[] }

/* Words that carry no claim, so a capitalised one in the copy needs no
   evidence behind it. Months and the estate’s own name live here. */
const NEUTRAL_WORDS = new Set(
  [
    'a', 'an', 'and', 'the', 'that', 'this', 'was', 'were', 'is', 'are', 'in', 'on', 'at', 'of',
    'to', 'by', 'from', 'with', 'across', 'for', 'it', 'its', 'their', 'each', 'every', 'came',
    'ready', 'applied', 'recorded', 'observed', 'photographed', 'filmed', 'logged', 'brings',
    'batch', 'batches', 'block', 'blocks', 'zone', 'zones', 'acres', 'estate', 'gauge',
    'aura', 'mudigere', 'ist', 'sighting', 'sightings', 'date', 'photograph', 'biodiversity',
    'record', 'joins', 'round', 'made', 'started', 'tested', 'cleared', 'use', 'before', 'made',
    'january', 'february', 'march', 'april', 'may', 'june', 'july',
    'august', 'september', 'october', 'november', 'december',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
    'am', 'pm', 'today', 'yesterday',
  ],
)

/* Voice failures. These are style rules with a truth claim inside them:
   "amazing" is not a fact about a soil application. */
const BANNED_TONE: [RegExp, string][] = [
  [/!/, 'exclamation mark'],
  [/\bexciting\b|\bexcited\b/i, 'hype: exciting'],
  [/\bamazing\b|\bincredible\b|\bstunning\b/i, 'hype: superlative'],
  [/\bproud\b|\bdelighted\b|\bthrilled\b/i, 'hype: sentiment'],
  [/\bwe['’]re\b|\bwe are pleased\b/i, 'corporate announcement voice'],
  [/\bgame[- ]chang/i, 'hype: cliché'],
]

/* Claims about status, rarity or effect that the gateway does not carry
   and the estate has not published. Permitted only if the source text
   said it first. */
const UNSUPPORTED_CLAIM: [RegExp, string][] = [
  [/\bendangered\b/i, 'conservation-status claim'],
  [/\bthreatened\b|\bvulnerable\b/i, 'conservation-status claim'],
  [/\brare\b|\bfirst (ever|time)\b|\bnever before\b/i, 'novelty claim'],
  [/\bcarbon\b|\bsequest/i, 'carbon claim'],
  [/\bsustainab/i, 'sustainability claim'],
  [/\bcertified\b|\borganic certif/i, 'certification claim'],
  [/\bbiodiversity (increased|improved|rose)\b/i, 'ecological-outcome claim'],
  [/\bproves?\b|\bproven\b/i, 'proof claim'],
]

/** Every string a sentence may draw a number or a proper noun from. */
function evidenceHaystack(c: MergedCandidate): string {
  const factValues = Object.values(c.raw.facts ?? {})
    .filter((v) => typeof v === 'string' || typeof v === 'number')
    .map(String)
  return [
    ...c.allowedTerms,
    ...c.quantities,
    ...c.places,
    ...factValues,
    c.raw.title,
    c.raw.summary ?? '',
    c.subject,
    c.time.occurredOn,
    c.time.timeWindow ?? '',
    calendarLabel(c.time.occurredOn),
    /* The row count is a fact about the evidence itself. */
    String(c.rowCount),
    ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][c.rowCount] ?? '',
  ]
    .join(' ')
    .toLowerCase()
}

export function verifyCopy(copy: Copy, c: MergedCandidate): VerifyResult {
  const problems: string[] = []
  const text = [copy.headline, copy.body ?? '', copy.significance ?? ''].join(' ')
  const haystack = evidenceHaystack(c)

  for (const [rx, why] of BANNED_TONE) {
    if (rx.test(text)) problems.push(`tone: ${why}`)
  }

  for (const [rx, why] of UNSUPPORTED_CLAIM) {
    if (rx.test(text) && !rx.test(haystack)) problems.push(`unsupported: ${why}`)
  }

  /* Numbers. Every digit run in the copy has to exist in the evidence.
     Decimals are compared as written, so 5.48 does not pass on the
     strength of a 5 somewhere else. */
  for (const m of text.matchAll(/\d+(?:[.,]\d+)?/g)) {
    const n = m[0].replace(/,/g, '')
    if (!haystack.includes(n.toLowerCase()) && !haystack.includes(m[0].toLowerCase())) {
      problems.push(`untraceable number: ${m[0]}`)
    }
  }

  /* Proper nouns. A capitalised word that is not sentence-initial and not
     neutral is a name, a place or a species, and needs a source. */
  const words = text.split(/(?<=[.?!])\s+/).flatMap((s) => s.trim().split(/\s+/).slice(1))
  for (const raw of words) {
    const word = raw.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
    if (!word || word.length < 2) continue
    if (!/^\p{Lu}/u.test(word)) continue
    const lower = word.toLowerCase()
    if (NEUTRAL_WORDS.has(lower)) continue
    if (!haystack.includes(lower)) problems.push(`untraceable proper noun: ${word}`)
  }

  /* Precision. A card whose record only carries a date may not print a
     clock time — this is the failure mode the whole time module exists
     to prevent, so it is checked at the last possible moment too. */
  if (c.time.precision === 'date' && /\b\d{1,2}(:\d{2})?\s?(am|pm)\b/i.test(text)) {
    problems.push('states a time for a date-only record')
  }
  if (/\b12:00\s?am\b/i.test(text)) problems.push('midnight rendered as a time')

  return problems.length ? { ok: false, problems: [...new Set(problems)] } : { ok: true }
}
