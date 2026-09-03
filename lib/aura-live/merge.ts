/* AURA Live — one event, however many rows recorded it.
 *
 * The source logs work the way work is done: three identical batches of
 * the same preparation become three rows, and one afternoon's spraying
 * across adjacent zones becomes one row per zone. Published straight,
 * that is three near-identical cards saying the same thing, which is the
 * failure mode this feature most needs to avoid.
 *
 * The one hard rule: merging never computes a new number. Quantities stay
 * verbatim, per row. What a merge is allowed to add is a count of the
 * rows themselves, which is a fact about the evidence rather than a claim
 * about the land — three rows really is three batches.
 */

import type { Candidate } from './normalize'

/** Rows merge only when every one of these matches. */
function groupKey(c: Candidate): string {
  return [
    c.category,
    c.kind,
    c.time.occurredOn,
    /* Subject is normalised so "Buttermilk" and "buttermilk " group. */
    c.subject.toLowerCase().replace(/\s+/g, ' ').trim(),
    c.actor?.label ?? '',
  ].join('|')
}

export type MergedCandidate = Candidate & {
  /** How many source rows this card stands for. 1 for an unmerged event. */
  rowCount: number
  /** Verbatim, de-duplicated, never summed. */
  quantities: string[]
  /** Every distinct place the merged rows named. */
  places: string[]
}

export function mergeCandidates(candidates: Candidate[]): MergedCandidate[] {
  const groups = new Map<string, Candidate[]>()
  for (const c of candidates) {
    const k = groupKey(c)
    const existing = groups.get(k)
    if (existing) existing.push(c)
    else groups.set(k, [c])
  }

  const out: MergedCandidate[] = []
  for (const group of groups.values()) {
    if (group.length === 1) {
      const c = group[0]
      out.push({
        ...c,
        rowCount: 1,
        quantities: c.quantity ? [c.quantity] : [],
        places: c.location ? [c.location.label] : [],
      })
      continue
    }

    /* The lead row is the one with the most evidence on it, so a merged
       card inherits media and a time window if any row had them. */
    const lead = [...group].sort((a, b) => weight(b) - weight(a))[0]
    const quantities = [...new Set(group.map((c) => c.quantity).filter((q): q is string => Boolean(q)))]
    const places = [...new Set(group.map((c) => c.location?.label).filter((p): p is string => Boolean(p)))]
    const keys = group.map((c) => c.canonicalKey)

    /* A merged card is identified by its lead row, so that a card keeps
       its identity when a later run finds a fourth batch. */
    out.push({
      ...lead,
      canonicalKey: lead.canonicalKey,
      contributingKeys: [...new Set(keys)].sort(),
      rowCount: group.length,
      quantities,
      places,
      media: group.flatMap((c) => c.media),
      allowedTerms: [...new Set(group.flatMap((c) => c.allowedTerms))],
      /* The newest mutation across the group drives the watermark. */
      sourceUpdatedAt: group
        .map((c) => c.sourceUpdatedAt)
        .filter((s): s is string => Boolean(s))
        .sort()
        .at(-1),
    })
  }
  return out
}

function weight(c: Candidate): number {
  return (
    c.media.length * 10 +
    (c.time.precision === 'exact' ? 4 : c.time.precision === 'window' ? 2 : 0) +
    (c.location ? 2 : 0) +
    (c.quantity ? 1 : 0) +
    (c.description ? 1 : 0)
  )
}
