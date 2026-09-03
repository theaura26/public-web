/* AURA Live — keeping workers out of the public feed.
 *
 * The actor field is easy: it comes from a known column, so an uncleared
 * name there collapses to the estate team. Free text is the hard case,
 * and it is where the leak actually happened. A note reading "Initial
 * report stated 420 todate; Nayana corrected to 410" is a correction the
 * estate needs and a public statement about a named worker's mistake that
 * nobody asked to publish.
 *
 * The roster solves it without guessing at what looks like a name. Every
 * run already fetches the whole activity corpus, and that corpus names
 * its own people in four columns — Done By, People, Supervisor, Sender.
 * Those values, minus the individuals AURA has cleared, are the set of
 * names that may not appear in published prose. It is built from the data
 * on every run, so a new worker is protected the first time they are
 * logged rather than the first time somebody remembers to add them.
 *
 * A name in a headline or body kills the card. A name in a note only
 * costs the note, because the note is supplementary and the event
 * underneath it is still worth publishing.
 */

import type { GatewayRecord } from './schema'

const PEOPLE_COLUMNS = ['Done By', 'People', 'Supervisor', 'Sender']

/* Words that turn up in those columns without being anybody's name. */
const NOT_A_NAME = new Set([
  'team', 'teams', 'sir', 'aura', 'estate', 'labour', 'labourers', 'workers',
  'worker', 'and', 'the', 'mna', 'k', 'r', 'a', 'm', 'supervisor', 'spotted',
  'reported', 'plus', 'group', 'staff',
])

export type Roster = { has(text: string): string | null }

export function buildRoster(records: GatewayRecord[], cleared: string[]): Roster {
  const clearedLower = cleared.map((c) => c.toLowerCase())
  const names = new Set<string>()

  for (const record of records) {
    const facts = (record.facts ?? {}) as Record<string, unknown>
    for (const column of PEOPLE_COLUMNS) {
      const raw = facts[column]
      if (typeof raw !== 'string') continue
      for (const token of raw.split(/[,+→>()/]|\band\b/i)) {
        for (const word of token.split(/\s+/)) {
          const name = word
            .replace(/[^\p{L}\p{M}'’-]/gu, '')
            /* "Sadananda's" is the possessive of a name, not a name. Left
               in, it stores a token that can never match the team-credit
               rule below, and every crew credit gets killed as if it had
               named an individual. */
            .replace(/['’]s$/u, '')
            .trim()
          if (name.length < 3) continue
          const lower = name.toLowerCase()
          if (NOT_A_NAME.has(lower)) continue
          if (clearedLower.some((c) => lower === c || lower.startsWith(c))) continue
          names.add(lower)
        }
      }
    }
  }

  const sorted = [...names]
  return {
    /** The first uncleared name found in the text, or null. */
    has(text: string): string | null {
      const lower = text.toLowerCase()
      for (const name of sorted) {
        /* Word-boundary match, so "Uma" does not fire on "human". */
        const rx = new RegExp(`(^|[^\\p{L}])${escapeRx(name)}([^\\p{L}]|$)`, 'u')
        if (!rx.test(lower)) continue
        /* A crew credited by its lead — "Sadananda's Team" — is not the
           same act as naming an individual against their work, and the
           source keeps the two in different columns for that reason. The
           People column is a team column; crediting the crew that did the
           spraying is the point of the card. So a name is allowed through
           when it is wearing its team. */
        if (TEAM_CREDIT(name).test(lower)) continue
        return name
      }
      return null
    },
  }
}

/** A roster that permits everything. For tests and for the correction
 *  path, where the full corpus is not in hand. */
export const OPEN_ROSTER: Roster = { has: () => null }

/* "sadananda's team", "sadananda’s crew". Anything else is an individual. */
function TEAM_CREDIT(name: string): RegExp {
  return new RegExp(`${escapeRx(name)}['\u2019]s\\s+(team|crew|group)`, 'u')
}

function escapeRx(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
