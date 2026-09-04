/* AURA Live — deciding what is worth a reader's attention.
 *
 * Deterministic, transparent, and entirely separate from the safety gate.
 * Policy decides whether something *may* be published; this decides
 * whether it *should* be. Nothing here can rescue a candidate policy has
 * already rejected.
 *
 * Every dimension returns a number and a sentence. The sentences are the
 * point: six months from now, somebody will ask why a particular card is
 * on the page, and "score 14" is not an answer.
 *
 * The score is never shown to a reader.
 */

import type { MergedCandidate } from './merge'
import type { AuraFeedEntry } from './schema'
import { isSensitiveSubject } from './policy'

export type Score = { total: number; reasons: string[] }

/* Categories a reader outside AURA came for, versus categories that
   matter to the estate but read as housekeeping from the outside. */
const PUBLIC_INTEREST: Record<string, number> = {
  'biodiversity': 5,
  'bees': 5,
  'cows': 4,
  'harvest': 4,
  'seasons': 4,
  'fermentation': 4,
  'lunar-rhythm': 3,
  'sprays': 3,
  'fertiliser-prep': 3,
  'labs': 3,
  'field-activities': 3,
  'prayers': 2,
  'people': 2,
}

/* How directly the category speaks to what AURA says it is: an estate
   that farms biodynamically and measures what it does. */
const BRAND_RELEVANCE: Record<string, number> = {
  'sprays': 5,
  'biodiversity': 5,
  'fertiliser-prep': 5,
  'labs': 4,
  'cows': 4,
  'lunar-rhythm': 4,
  'bees': 4,
  'fermentation': 4,
  'harvest': 3,
  'seasons': 3,
  'field-activities': 3,
  'people': 2,
  'prayers': 2,
}

/* Why a score would be taken without its repetition penalties.
 *
 * Those penalties exist to stop a highlight reel filling with the eighth
 * card about the same spray. They are about competing for a scarce slot,
 * and a record from the last few days is not competing for one — it has
 * its own reserved lane. Charging it for repetition there would price it
 * out of a lane built for it, which is how the estate's routine daily
 * work came to be seven days behind the day it happened.
 *
 * The same-work-same-place-same-day penalty is not in this: that one is
 * a duplicate guard, not a competition rule, and it applies everywhere. */
export type ScoreOptions = { ignoreRepetition?: boolean }

export function scoreCandidate(
  c: MergedCandidate,
  published: AuraFeedEntry[],
  options: ScoreOptions = {},
): Score {
  const reasons: string[] = []
  let total = 0

  const add = (n: number, why: string) => {
    if (n === 0) return
    total += n
    reasons.push(`${n > 0 ? '+' : ''}${n} ${why}`)
  }

  /* ── Public interest, 0–5 ── */
  add(PUBLIC_INTEREST[c.category ?? ''] ?? 1, `public interest: ${c.category}`)

  /* ── Brand relevance, 0–5 ── */
  add(BRAND_RELEVANCE[c.category ?? ''] ?? 1, `brand relevance: ${c.category}`)

  /* ── Evidence strength, 0–5 ──
     Confidence is most of it; a time the source actually recorded and a
     named place are the rest. */
  let evidence = 0
  const conf = c.evidence.confidence ?? 0
  if (conf >= 0.96) evidence += 3
  else if (conf >= 0.93) evidence += 2
  else evidence += 1
  if (c.time.precision === 'exact') evidence += 1
  else if (c.time.precision === 'window') evidence += 1
  if (c.location) evidence += 1
  add(Math.min(5, evidence), `evidence: confidence ${conf}, ${c.time.precision} time${c.location ? ', located' : ''}`)

  /* ── Visual potential, 0–3 ──
     Real media of the event itself is the whole difference between a card
     worth looking at and a paragraph. */
  const realMedia = c.media.filter((m) => !m.isEditorialImagery)
  if (realMedia.some((m) => m.type === 'video')) add(3, 'event video')
  else if (realMedia.length) add(2, 'event photograph')
  else if (c.category === 'biodiversity') add(1, 'visual subject, no event media')

  /* ── Novelty, 0–3 ── subject not seen in the published feed. */
  const subject = c.subject.toLowerCase()
  const seenSubject = published.filter((e) => e.headline.toLowerCase().includes(subject)).length
  if (seenSubject === 0) add(3, 'subject not published before')
  else if (seenSubject === 1) add(1, 'subject published once before')

  /* ── Specificity, 0–3 ── a number, a place, a method. */
  let specificity = 0
  if (c.quantities.length) specificity += 1
  if (c.area) specificity += 1
  if (c.method || c.description) specificity += 1
  add(specificity, 'specificity: quantity, area, method')

  /* ── Privacy or reputational risk, −0–5 ── */
  if (c.actor?.type === 'person') add(-1, 'names an individual')
  if (isSensitiveSubject(c.subject)) add(-1, 'sensitive taxon, location withheld')
  const risky = /\b(dead|died|loss|damage|infest|disease|fail)\b/i
  if (risky.test([c.raw.title, c.description, c.note].filter(Boolean).join(' '))) {
    add(-2, 'setback: needs its context to be worth publishing')
  }

  /* ── Repetition, −0–5 ──
     The estate sprays the same preparation every week. The first card is
     the story; the eighth is wallpaper. */
  if (!options.ignoreRepetition) {
    const sameCategoryRecent = published
      .slice(0, 12)
      .filter((e) => e.category === c.category).length
    if (sameCategoryRecent >= 6) add(-5, 'category dominates the recent feed')
    else if (sameCategoryRecent >= 4) add(-3, 'category over-represented recently')
    else if (sameCategoryRecent >= 2) add(-1, 'category seen recently')

    const sameSubjectRecent = published
      .slice(0, 8)
      .filter((e) => e.headline.toLowerCase().includes(subject)).length
    if (sameSubjectRecent >= 2) add(-2, 'same subject twice in the recent feed')
  }

  /* The same work, in the same place, on the same day. The estate logs
     that as two rows because two people wrote two updates; a reader sees
     one card apparently published twice. Merging cannot join them — the
     descriptions genuinely differ — so the second one is scored down
     instead of being pretended into the first.

     The same *work*, which means the subject has to match too. Without
     that clause this read category, date and place, and a place is blank
     on most application rows — so three different preparations applied
     on one working day counted as three copies of one event and the
     third was scored eight points down for being itself. Buttermilk is
     not CPP Balls. */
  const sameDaySamePlace = published.filter(
    (e) =>
      e.category === c.category &&
      e.occurredOn === c.time.occurredOn &&
      (e.location?.label ?? '') === (c.location?.label ?? '') &&
      e.headline.toLowerCase().includes(subject),
  ).length
  if (sameDaySamePlace) add(-4 * sameDaySamePlace, 'same work, same place, same day as a card already in the feed')

  return { total, reasons }
}
