import { parseYmd } from './cows'
const DAY = 86_400_000
const toMs = (iso: string) => { const { y, m, d } = parseYmd(iso); return Date.UTC(y, m - 1, d) }
const isoOf = (ms: number) => new Date(ms).toISOString().slice(0, 10)
export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** The last `n` days of a log, ending on the last day it reaches. */
export function lastDays<T extends { date: string }>(days: T[], n = 30, ending?: string): T[] {
  if (!days.length) return []
  const end = toMs(ending ?? days[days.length - 1].date)
  const start = end - (n - 1) * DAY
  return days.filter((d) => toMs(d.date) >= start)
}

export type Week = { start: string; days: number; total: number; perDay: number }

/** Monday-to-Sunday weeks. A week's bar is its average per logged day, so a
 *  part-week at either end of the log stands level with a full one. */
export function byWeek<T extends { date: string }>(days: T[], value: (d: T) => number | null): Week[] {
  const weeks = new Map<string, { days: number; total: number }>()
  for (const d of days) {
    const v = value(d)
    if (v === null) continue
    const ms = toMs(d.date)
    const dow = (new Date(ms).getUTCDay() + 6) % 7
    const key = isoOf(ms - dow * DAY)
    const w = weeks.get(key) ?? { days: 0, total: 0 }
    w.days += 1; w.total += v
    weeks.set(key, w)
  }
  return [...weeks.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([start, w]) => ({ start, days: w.days, total: w.total, perDay: w.total / w.days }))
}

/* ── Formatting ── */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** 1,104 · 338 · 11.3 · 0.8 — one decimal under 100, none above. */
export function amount(n: number): string {
  if (n >= 100) return Math.round(n).toLocaleString('en-GB')
  if (n >= 10) return String(Math.round(n * 10) / 10)
  return (Math.round(n * 10) / 10).toFixed(1)
}

export function dayMonth(iso: string, long = false): string {
  const { m, d } = parseYmd(iso)
  return `${d} ${(long ? MONTHS_LONG : MONTHS)[m - 1]}`
}

export function monthOf(iso: string): string {
  return MONTHS[parseYmd(iso).m - 1]
}
