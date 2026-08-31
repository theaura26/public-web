/* AURA Live — what may and may not be published.
 *
 * This file is the whole safety argument for the feature. Everything here
 * is a hard gate: it runs before scoring, it cannot be outvoted by a high
 * score, and a candidate that fails any rule is rejected with a named
 * reason that goes into the audit trail.
 *
 * The bias is deliberate and one-directional. A rule that is unsure
 * rejects. Publishing nothing on a given day is a completely acceptable
 * outcome for a feed whose entire value is that a reader can believe it;
 * publishing one wrong card is not.
 *
 * The plain-English version of this file, for people who do not read
 * TypeScript, is docs/aura-live/editorial-policy.md. Both must change
 * together.
 */

import type { Candidate } from './normalize'
import type { AuraLiveConfig } from './config'

export type Verdict =
  | { ok: true }
  | { ok: false; reasons: string[] }

/* ── Status values that are not "this happened" ──────────────────────────
   Read off the live source: Done, In Progress, Instructed, Planned,
   Pending, Ongoing, Risk, "Risk – ongoing", Missed, WIP. Exactly one of
   those describes a completed event.
*/
const COMPLETED_STATUSES = new Set([
  'done', 'complete', 'completed', 'yes',
  /* The preparation sheet signs a batch off in its Testing Status
     column: Pass, then Approved. Both mean the batch was tested and
     cleared. "Concern" is the third value that column takes and is
     deliberately absent — a flagged batch is a real event, but the sheet
     records no context for the flag, and publishing it as a finished
     preparation would say the opposite of what the estate meant. */
  'pass', 'approved',
])

const NOT_COMPLETED = /^(missed|pending|planned|scheduled|cancelled|canceled|instructed|in ?progress|wip|ongoing|risk|deferred|fail(ed)?|hold|on hold)\b/i

/* ── Text that means "this is internal" ──────────────────────────────────
   Matched against the title and the source’s own description. These are
   the shapes an operations log takes when it is recording the running of
   the estate rather than the life of it.
*/
const INTERNAL_TEXT = [
  /\bbrief(ing|ed)?\b/i,
  /\bmeeting\b/i,
  /\battendance\b/i,
  /\bpayroll\b|\bsalar(y|ies)\b|\bwages?\b/i,
  /\bmuster\b/i,
  /\baction plan\b|\bmaster plan\b|\b\d+-point plan\b/i,
  /\binstruction[: ]/i,
  /\bto be (done|carried out|completed)\b/i,
  /\bwill be\b|\bplan(ned)? to\b|\bscheduled for\b/i,
  /\bsupervision\b|\breview meeting\b/i,
  /\bshared (a |the )?(comprehensive )?.*plan\b/i,
  /* Labour headcounts. The estate needs them; a reader does not, and
     publishing "Labour today: 2" turns a crew into a statistic on a
     public page. Rows that lead with a headcount are not published at
     all, rather than published with the number quietly removed — the
     number is usually the only thing the row is about. */
  /\blabour(ers)?\s*(today|:)/i,
  /\bcumul\b|\bcumulative labour\b/i,
  /\bteam of \d+\b|\+\s*\d+\s*(workers?|labourers?)\b/i,
  /* A day on which nothing moved is a real thing to record internally
     and not an event to publish. */
  /\bno progress\b|\b0\.00\s*ac\b|\bnil\b/i,
]

/* Warnings the gateway can raise that make a record unsafe to publish as
   stated. Anything else is recorded on the entry and shown to nobody. */
const MATERIAL_WARNING = /conflict|mismatch|unverified|disputed|duplicate|ambiguous|missing source|low confidence/i

/**
 * Species whose exact location is not published.
 *
 * Poaching and collection pressure are real in the Western Ghats, and a
 * public feed that says which block holds a Gaur herd or where an orchid
 * grows is a map for someone. The sighting is still published — the block
 * is not. Configurable, because which taxa are sensitive is an ecologist's
 * call and it changes.
 */
const DEFAULT_SENSITIVE = [
  'gaur', 'bison', 'elephant', 'tiger', 'leopard', 'panther', 'pangolin',
  'hornbill', 'orchid', 'slender loris', 'civet', 'python', 'king cobra',
]

export function sensitiveTaxa(): string[] {
  const raw = process.env.AURA_LIVE_SENSITIVE_TAXA
  return (raw ? raw.split(',') : DEFAULT_SENSITIVE).map((s) => s.trim().toLowerCase()).filter(Boolean)
}

export function isSensitiveSubject(subject: string): boolean {
  const s = subject.toLowerCase()
  return sensitiveTaxa().some((t) => s.includes(t))
}

/** Strip the location from a candidate whose subject is sensitive.
 *  Returns the candidate unchanged when it is not. */
export function applyLocationSafety(candidate: Candidate): Candidate {
  if (candidate.category !== 'biodiversity') return candidate
  if (!isSensitiveSubject(candidate.subject)) return candidate
  const place = candidate.location
  if (!place) return candidate
  const stripped = { ...candidate }
  delete stripped.location
  return {
    ...stripped,
    /* The place has to leave the allowed vocabulary too, or the claim
       check would happily verify a sentence that named the block. */
    allowedTerms: candidate.allowedTerms.filter(
      (t) => t !== place.label && t !== place.block && t !== place.zone,
    ),
  }
}

/**
 * The hard gate.
 *
 * Order matters only for the readability of the audit trail — every rule
 * is evaluated so a rejected candidate carries every reason it failed,
 * not just the first.
 */
export function isPublishable(candidate: Candidate, cfg: AuraLiveConfig): Verdict {
  const reasons: string[] = []
  const record = candidate.raw

  /* — It has to be an event, not a reference — */
  if (record.record_type === 'entity') reasons.push('static-entity-not-an-event')
  if (record.resultKind === 'recommendation') reasons.push('recommendation-not-an-event')
  if (record.resultKind === 'reference') reasons.push('reference-not-an-event')

  /* — Actuality. `fact` is admitted only for a wildlife observation,
       where the gateway uses it for an unambiguous logged sighting. — */
  const actuality = (candidate.evidence.actuality ?? '').toLowerCase()
  if (actuality === 'possible' || actuality === 'reference') {
    reasons.push(`actuality-${actuality}`)
  } else if (actuality !== 'actual') {
    const wildlifeFact = actuality === 'fact' && candidate.kind === 'observation'
    if (!wildlifeFact) reasons.push(`actuality-${actuality || 'missing'}`)
  }

  /* — Reviewed — */
  const review = (candidate.evidence.reviewStatus ?? '').toLowerCase()
  if (!cfg.acceptedReviewStatuses.includes(review)) {
    reasons.push(`review-status-${review || 'missing'}`)
  }

  /* — Confidence — */
  const confidence = candidate.evidence.confidence
  if (confidence == null) reasons.push('confidence-missing')
  else if (confidence < cfg.minConfidence) reasons.push(`confidence-below-${cfg.minConfidence}`)

  /* — A date it actually happened on — */
  if (!candidate.time?.occurredOn) reasons.push('no-occurrence-date')

  /* — Completed, not planned, missed or in flight — */
  const status = candidate.status
  if (status) {
    if (NOT_COMPLETED.test(status)) reasons.push(`status-${status.toLowerCase().replace(/\s+/g, '-')}`)
    else if (!COMPLETED_STATUSES.has(status.toLowerCase())) reasons.push(`status-unrecognised-${status.toLowerCase().replace(/\s+/g, '-')}`)
  }

  /* — Internal life of the estate, not the life of the land — */
  const text = [record.title, candidate.description, candidate.subject].filter(Boolean).join(' · ')
  for (const rx of INTERNAL_TEXT) {
    if (rx.test(text)) { reasons.push('internal-operations-text'); break }
  }

  /* — Unresolved material warnings — */
  const material = (candidate.evidence.warnings ?? []).filter((w) => MATERIAL_WARNING.test(w))
  if (material.length) reasons.push('material-warning')

  /* — Enough evidence to answer What, Who/What, and When —
       "Who" is satisfied by a species, an animal or a natural process as
       readily as by a person, so a vine snake is not rejected for having
       no human attached to it. */
  if (!candidate.subject || candidate.subject.length < 3) reasons.push('no-subject')
  if (!candidate.category) reasons.push('no-category')

  /* — People stories carry an extra bar. A person appears only when they
       did something externally interesting, which the category mapping has
       to have concluded on its own. — */
  if (candidate.category === 'people' && candidate.actor?.type !== 'person') {
    reasons.push('people-story-without-a-named-person')
  }

  return reasons.length ? { ok: false, reasons } : { ok: true }
}

/**
 * A setback is publishable, but only on terms.
 *
 * Credibility needs honest selectivity, so this is not a blanket
 * suppression of bad news — it is a requirement that bad news arrives with
 * its context. A row that says "5 Arabica plants dead" and nothing else is
 * not a story; the same row with what was done about it is.
 */
export function isPublishableSetback(candidate: Candidate): boolean {
  const negative = /\b(dead|died|loss|lost|damage|infest|disease|fail|erosion|pest|borer)\b/i
  const text = [candidate.raw.title, candidate.description, candidate.note].filter(Boolean).join(' ')
  if (!negative.test(text)) return true
  /* Consequential, safe, and accompanied by the response or the lesson. */
  return Boolean(candidate.note && candidate.note.length > 20)
}
