/* AURA Live — why each card is, or is not, on the page.
 *
 * Written on every run for every candidate, accepted or not. Kept in the
 * ledger rather than only in logs, because the question this answers —
 * "why did that get published?" — is usually asked long after a log line
 * has rolled off.
 *
 * Nothing here is public. The route that serves the feed strips it.
 */

import type { AuditRecord } from './schema'

/** Entries older than this are dropped so the ledger stays small. */
const KEEP = 500

export function appendAudit(existing: AuditRecord[], added: AuditRecord[]): AuditRecord[] {
  return [...added, ...existing].slice(0, KEEP)
}

/** A one-line, source-safe summary for structured logs. Deliberately
 *  carries no source path, file id or row number: those identify a
 *  private Drive document and have no business in a log line that may be
 *  shipped off-platform. */
export function logLine(a: AuditRecord): string {
  return JSON.stringify({
    evt: 'aura-live.candidate',
    outcome: a.outcome,
    key: a.canonicalKey,
    rows: a.contributingKeys.length,
    score: a.score,
    reasons: a.reasons.slice(0, 6),
    gen: a.generatorVersion,
  })
}
