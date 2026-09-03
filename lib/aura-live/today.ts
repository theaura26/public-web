/* AURA Live — the land, today.
 *
 * The test every figure above the feed has to pass: is it about the
 * land, and does it move? Stock counts fail the second half — forty-six
 * cows is forty-six cows for months, and a number that never changes on
 * a page called live is furniture. Row counts fail the first: nobody
 * outside the estate knows whether ninety batches is a lot.
 *
 * What survives is weather, ground and the moon. Five readings, all of
 * which are different tomorrow.
 *
 * Things tried here and taken out, so nobody re-adds them by accident:
 * the daily calendar (an intention rather than an event, and on a rest
 * day it says nothing at all); the herd and the tagged-plant count
 * (static, and the plant count contradicts the 35,000 estimate published
 * on /land); the spray window (an operations call, and shut for weeks at
 * a time in the monsoon); the species and ground-covered totals (real
 * and Aura's own, but they belong beside the feed's own evidence rather
 * than in a strip of live readings).
 *
 * Aura's own record is not absent from the page — it is the feed. This
 * strip is the conditions it happens in.
 */

import { estateParts } from './time'
import { readConditions, type Conditions } from './conditions'
import { moonFor, type Moon } from './moon'

export type Today = {
  /** "Monday, 31 August 2026", estate local. */
  dateLabel: string
  /** Weather and ground, modelled off the estate and labelled as such. */
  conditions: Conditions | null
  /** Computed, not fetched. The other calendar the estate works to. */
  moon: Moon
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

function estateToday(now: Date): string {
  const p = estateParts(now)
  const weekday = WEEKDAYS[new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay()]
  return `${weekday}, ${p.day} ${MONTHS[p.month - 1]} ${p.year}`
}

/**
 * Read today. Never throws — a page that loses this strip still has its
 * feed, and a strip that guessed would be worse than one that is absent.
 */
export async function readToday(now = new Date()): Promise<Today> {
  return {
    dateLabel: estateToday(now),
    conditions: await readConditions(),
    moon: moonFor(now),
  }
}
