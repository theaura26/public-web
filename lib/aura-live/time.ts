/* AURA Live — time, handled honestly.
 *
 * Three separate clocks run through this feature and conflating any two
 * of them produces a lie:
 *
 *   occurredAt   when the thing happened on the land
 *   publishedAt  when AURA Live first showed it
 *   syncedAt     when the gateway last read the source
 *
 * The source is Google Sheets typed up by people, so most rows carry a
 * date and no time — the gateway renders that as midnight UTC. Printing
 * "12:00 AM" from a midnight timestamp is the single most likely way this
 * feature tells a reader something untrue, so precision is carried
 * explicitly on every entry and midnight-from-a-date-only-row is never
 * shown as a time.
 *
 * Asia/Kolkata has no daylight saving and has been +05:30 since 1945, but
 * the offset is derived through Intl rather than hard-coded, so a tzdata
 * change is the platform's problem rather than ours.
 */

export const ESTATE_TZ = 'Asia/Kolkata'

export type TimePrecision = 'exact' | 'window' | 'date'

const PARTS = new Intl.DateTimeFormat('en-GB', {
  timeZone: ESTATE_TZ,
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: false,
})

export type EstateParts = {
  year: number; month: number; day: number
  hour: number; minute: number; second: number
  /** Minutes since local midnight. */
  minuteOfDay: number
  /** YYYY-MM-DD, estate local. */
  dateKey: string
}

/** Break an instant into estate-local calendar parts. */
export function estateParts(input: Date | string | number): EstateParts {
  const d = input instanceof Date ? input : new Date(input)
  const map: Record<string, string> = {}
  for (const p of PARTS.formatToParts(d)) if (p.type !== 'literal') map[p.type] = p.value
  const year = Number(map.year)
  const month = Number(map.month)
  const day = Number(map.day)
  /* en-GB renders midnight as "24" in some runtimes. Normalise. */
  const hour = Number(map.hour) % 24
  const minute = Number(map.minute)
  const second = Number(map.second)
  return {
    year, month, day, hour, minute, second,
    minuteOfDay: hour * 60 + minute,
    dateKey: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  }
}

/** The estate's UTC offset in minutes at a given instant. */
export function estateOffsetMinutes(at: Date = new Date()): number {
  const p = estateParts(at)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60000)
}

/** Build the instant for an estate-local wall-clock reading. */
export function fromEstateWallClock(
  year: number, month: number, day: number, hour = 0, minute = 0,
): Date {
  const naive = Date.UTC(year, month - 1, day, hour, minute)
  /* One correction pass is enough for a fixed-offset zone, and two is
     enough for any zone with a sane DST rule. */
  let guess = new Date(naive)
  for (let i = 0; i < 2; i++) {
    const p = estateParts(guess)
    const seen = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute)
    const drift = seen - naive
    if (drift === 0) break
    guess = new Date(guess.getTime() - drift)
  }
  return guess
}

/** True when an ISO timestamp lands exactly on midnight UTC — the
 *  gateway's signature for a row that carried a date and no time. */
export function isUtcMidnight(iso: string): boolean {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return false
  return d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0
}

/** The estate-local calendar date of a date-only record.
 *  A date-only row means "this day", not "midnight UTC on this day", so
 *  the calendar fields are read straight off the UTC timestamp rather
 *  than shifted into IST — shifting would move 26 Aug to 26 Aug 05:30,
 *  which is a time nobody recorded. */
export function dateOnlyKey(iso: string): string {
  return iso.slice(0, 10)
}

/* ── Parsing the shapes the source actually contains ─────────────────── */

/** "16:55" → 995. Returns null for anything that is not a clock reading. */
export function parseClock(v: unknown): number | null {
  if (typeof v !== 'string') return null
  const m = v.trim().match(/^(\d{1,2})[:.](\d{2})\s*(am|pm)?$/i)
  if (!m) return null
  let h = Number(m[1])
  const min = Number(m[2])
  if (min > 59) return null
  const mer = m[3]?.toLowerCase()
  if (mer === 'pm' && h < 12) h += 12
  if (mer === 'am' && h === 12) h = 0
  if (h > 23) return null
  return h * 60 + min
}

/** Tidy a work period for display. The source writes these by hand, so
 *  they arrive as "3 PM– 7 PM, 6 AM– 9 AM" and "7:30 AM-- 4 PM".
 *  Returns null for the non-periods the same column carries — "Week Off",
 *  "Do Not Spray" — which are instructions, not times. */
export function parseTimeWindow(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const raw = v.trim()
  if (!raw) return null
  if (!/\d/.test(raw)) return null
  const ranges: string[] = []
  const re = /(\d{1,2}(?::\d{2})?)\s*(am|pm)?\s*(?:-{1,2}|–|—|to)\s*(\d{1,2}(?::\d{2})?)\s*(am|pm)?/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(raw))) {
    const a = normaliseClockText(m[1], m[2])
    const b = normaliseClockText(m[3], m[4])
    if (a && b) ranges.push(`${a}–${b}`)
  }
  if (!ranges.length) return null
  /* The source repeats the same pair in different orders across rows.
     De-duplicate and sort so one window reads the same everywhere. */
  const uniq = [...new Set(ranges)].sort()
  return uniq.join(', ')
}

function normaliseClockText(clock: string, meridiem?: string): string | null {
  const [hStr, mStr] = clock.split(':')
  let h = Number(hStr)
  const min = mStr ? Number(mStr) : 0
  if (!Number.isFinite(h) || !Number.isFinite(min) || min > 59) return null
  const mer = meridiem?.toLowerCase()
  if (mer === 'pm' && h < 12) h += 12
  if (mer === 'am' && h === 12) h = 0
  if (h > 23) return null
  const suffix = h < 12 ? 'am' : 'pm'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return min ? `${h12}:${String(min).padStart(2, '0')}${suffix}` : `${h12}${suffix}`
}

/* ── Display ─────────────────────────────────────────────────────────── */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "29 Aug" within the current estate year, "29 Aug 2025" before it. */
export function calendarLabel(dateKey: string, now: Date = new Date()): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  if (!y || !m || !d) return dateKey
  const thisYear = estateParts(now).year
  const base = `${d} ${MONTHS[m - 1]}`
  return y === thisYear ? base : `${base} ${y}`
}

/** 995 → "4:55 pm". */
export function clockLabel(minuteOfDay: number): string {
  const h = Math.floor(minuteOfDay / 60) % 24
  const min = minuteOfDay % 60
  const suffix = h < 12 ? 'am' : 'pm'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(min).padStart(2, '0')} ${suffix}`
}

export type FeedTime = {
  precision: TimePrecision
  /** Present only when precision is `exact`. */
  occurredAt?: string
  /** Estate-local calendar day. Always present. */
  occurredOn: string
  /** Present only when precision is `window`. */
  timeWindow?: string
}

/**
 * The relative label shown in the feed.
 *
 * Date-only and window events never get an hours-ago reading: "3h" from a
 * row that only says "26 Aug" is a precision the record does not have.
 * They fall through to the calendar label, except for today and
 * yesterday, which are true at day resolution.
 */
export function relativeLabel(time: FeedTime, now: Date = new Date()): string {
  const nowParts = estateParts(now)

  if (time.precision === 'exact' && time.occurredAt) {
    const then = new Date(time.occurredAt)
    const deltaSec = Math.floor((now.getTime() - then.getTime()) / 1000)
    if (deltaSec < 0) return calendarLabel(time.occurredOn, now)
    if (deltaSec < 60) return 'Just now'
    if (deltaSec < 3600) return `${Math.floor(deltaSec / 60)}m`
    if (deltaSec < 86400) return `${Math.floor(deltaSec / 3600)}h`
    if (time.occurredOn === yesterdayKey(nowParts)) return 'Yesterday'
    return calendarLabel(time.occurredOn, now)
  }

  if (time.occurredOn === nowParts.dateKey) return 'Today'
  if (time.occurredOn === yesterdayKey(nowParts)) return 'Yesterday'
  return calendarLabel(time.occurredOn, now)
}

function yesterdayKey(p: EstateParts): string {
  const d = new Date(Date.UTC(p.year, p.month - 1, p.day))
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

/** The full, unambiguous reading revealed on hover, focus and expansion. */
export function exactLabel(time: FeedTime, now: Date = new Date()): string {
  const day = calendarLabel(time.occurredOn, now)
  const year = time.occurredOn.slice(0, 4)
  const withYear = day.endsWith(year) ? day : `${day} ${year}`
  if (time.precision === 'exact' && time.occurredAt) {
    const p = estateParts(time.occurredAt)
    return `${withYear}, ${clockLabel(p.minuteOfDay)} IST`
  }
  if (time.precision === 'window' && time.timeWindow) {
    return `${withYear}, ${time.timeWindow} IST`
  }
  return `${withYear} — recorded as a date, without a time`
}

/**
 * The stamp shown on an entry: "16:55, 29 Jul 2026".
 *
 * Absolute, and the year is always written, because a feed that spans a
 * season should not make a reader work out which one they are in. What it
 * will not do is manufacture the time half: a record that only carries a
 * date is stamped with a date, and a record that carries a work period is
 * stamped with the period. The midnight a date-only row is stored as
 * never reaches this function's output.
 */
export function absoluteLabel(time: FeedTime): string {
  const [y, m, d] = time.occurredOn.split('-').map(Number)
  const day = `${d} ${MONTHS[m - 1]} ${y}`
  if (time.precision === 'exact' && time.occurredAt) {
    const p = estateParts(time.occurredAt)
    return `${clockLabel(p.minuteOfDay)}, ${day}`
  }
  /* A single work period is short enough to stamp. Two of them — the
     source often records a morning and an evening pass on one row — is
     longer than the headline it sits above, so the stamp keeps the day
     and the periods move into the entry’s own detail. */
  if (time.precision === 'window' && time.timeWindow && !time.timeWindow.includes(',')) {
    return `${time.timeWindow}, ${day}`
  }
  return day
}

/** True when absoluteLabel had to drop the work period to stay short. */
export function windowIsElided(time: FeedTime): boolean {
  return time.precision === 'window' && Boolean(time.timeWindow?.includes(','))
}

/** What goes in the `datetime` attribute. Date-only entries carry a plain
 *  date, which is exactly what the HTML spec wants for a day. */
export function datetimeAttr(time: FeedTime): string {
  return time.precision === 'exact' && time.occurredAt ? time.occurredAt : time.occurredOn
}

/** Is `now` inside one of the estate's publishing windows? */
export function inWindow(
  windows: { startMin: number; endMin: number; label: string }[],
  now: Date = new Date(),
): { open: boolean; window?: string } {
  const { minuteOfDay } = estateParts(now)
  for (const w of windows) {
    if (minuteOfDay >= w.startMin && minuteOfDay <= w.endMin) return { open: true, window: w.label }
  }
  return { open: false }
}
