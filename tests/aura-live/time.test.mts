import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  estateParts, fromEstateWallClock, isUtcMidnight, parseClock, parseTimeWindow,
  relativeLabel, exactLabel, datetimeAttr, calendarLabel, inWindow, type FeedTime,
} from '../../lib/aura-live/time'
import { parseWindows } from '../../lib/aura-live/config'

/* Time is where this feature is most likely to say something untrue, so
   the tests are written against the exact shapes the live gateway emits
   rather than against tidy invented ones. */

test('estate parts are read in Asia/Kolkata, not UTC', () => {
  /* 18:45 UTC is 00:15 the next day in Mudigere. */
  const p = estateParts('2026-08-29T18:45:00Z')
  assert.equal(p.dateKey, '2026-08-30')
  assert.equal(p.hour, 0)
  assert.equal(p.minute, 15)
})

test('a wall-clock reading round-trips through the estate offset', () => {
  const d = fromEstateWallClock(2026, 7, 29, 16, 55)
  assert.equal(d.toISOString(), '2026-07-29T11:25:00.000Z')
  const back = estateParts(d)
  assert.equal(back.hour, 16)
  assert.equal(back.minute, 55)
})

test('midnight UTC is recognised as the gateway signature for date-only', () => {
  assert.equal(isUtcMidnight('2026-08-26T00:00:00+00:00'), true)
  assert.equal(isUtcMidnight('2026-07-29T11:25:00+00:00'), false)
})

test('clock columns parse, and non-clocks do not', () => {
  assert.equal(parseClock('16:55'), 16 * 60 + 55)
  assert.equal(parseClock('7:30 am'), 7 * 60 + 30)
  assert.equal(parseClock('12:00 am'), 0)
  assert.equal(parseClock('Week Off'), null)
  assert.equal(parseClock('25:00'), null)
})

test('the hand-written time-window column is normalised, and non-periods are refused', () => {
  assert.equal(parseTimeWindow('3 PM– 7 PM, 6 AM– 9 AM'), '3pm–7pm, 6am–9am')
  assert.equal(parseTimeWindow('7:30 AM-- 4 PM'), '7:30am–4pm')
  /* The same column carries instructions. Those are not times. */
  assert.equal(parseTimeWindow('Week Off'), null)
  assert.equal(parseTimeWindow('Do Not Spray'), null)
  assert.equal(parseTimeWindow(''), null)
})

test('the same window written in two orders yields one label', () => {
  assert.equal(
    parseTimeWindow('3 PM– 7 PM, 6 AM– 9 AM'),
    parseTimeWindow('6 AM– 9 AM, 3 PM– 7 PM'),
  )
})

/* ── relative labels ─────────────────────────────────────────────────── */

const now = new Date('2026-08-29T12:00:00Z')
const exact = (iso: string): FeedTime => ({ precision: 'exact', occurredAt: iso, occurredOn: iso.slice(0, 10) })

test('relative labels follow the required ladder', () => {
  assert.equal(relativeLabel(exact('2026-08-29T11:59:30Z'), now), 'Just now')
  assert.equal(relativeLabel(exact('2026-08-29T11:55:00Z'), now), '5m')
  assert.equal(relativeLabel(exact('2026-08-29T09:00:00Z'), now), '3h')
  assert.equal(relativeLabel(exact('2026-07-29T09:00:00Z'), now), '29 Jul')
  assert.equal(relativeLabel(exact('2025-08-29T09:00:00Z'), now), '29 Aug 2025')
})

test('yesterday is the previous estate day, not 24 hours ago', () => {
  /* 20:00 UTC on the 28th is 01:30 IST on the 29th — today in Mudigere,
     yesterday anywhere that reads the timestamp as UTC. */
  assert.equal(relativeLabel({ precision: 'date', occurredOn: '2026-08-28' }, now), 'Yesterday')
  assert.equal(relativeLabel({ precision: 'date', occurredOn: '2026-08-29' }, now), 'Today')
})

test('a date-only record never reports hours ago', () => {
  const label = relativeLabel({ precision: 'date', occurredOn: '2026-08-26' }, now)
  assert.equal(label, '26 Aug')
  assert.doesNotMatch(label, /\dh|\dm/)
})

test('a date-only record never states a time, anywhere', () => {
  const t: FeedTime = { precision: 'date', occurredOn: '2026-08-26' }
  assert.equal(datetimeAttr(t), '2026-08-26')
  assert.doesNotMatch(exactLabel(t, now), /\d{1,2}:\d{2}/)
  assert.doesNotMatch(exactLabel(t, now), /12:00\s?am/i)
  assert.match(exactLabel(t, now), /without a time/)
})

test('a window record shows its period and no single moment', () => {
  const t: FeedTime = { precision: 'window', occurredOn: '2026-08-26', timeWindow: '6am–9am' }
  assert.equal(datetimeAttr(t), '2026-08-26')
  assert.match(exactLabel(t, now), /6am–9am IST/)
})

test('an exact record shows its estate-local clock time', () => {
  const t = exact('2026-07-29T11:25:00Z')
  assert.match(exactLabel(t, now), /4:55 pm IST/)
  assert.equal(datetimeAttr(t), '2026-07-29T11:25:00Z')
})

test('the calendar label drops the year only inside the current estate year', () => {
  assert.equal(calendarLabel('2026-08-29', now), '29 Aug')
  assert.equal(calendarLabel('2025-08-29', now), '29 Aug 2025')
})

/* ── publishing windows ──────────────────────────────────────────────── */

const WINDOWS = parseWindows('06:00-10:00,15:00-19:30')

test('both default windows are parsed', () => {
  assert.equal(WINDOWS.length, 2)
  assert.deepEqual(WINDOWS.map((w) => w.label), ['06:00–10:00', '15:00–19:30'])
})

test('window membership is decided in estate time', () => {
  /* 01:00 UTC = 06:30 IST — inside the morning window. */
  assert.equal(inWindow(WINDOWS, new Date('2026-08-29T01:00:00Z')).open, true)
  /* 11:00 UTC = 16:30 IST — inside the evening window. */
  assert.equal(inWindow(WINDOWS, new Date('2026-08-29T11:00:00Z')).open, true)
  /* 06:00 UTC = 11:30 IST — between them. */
  assert.equal(inWindow(WINDOWS, new Date('2026-08-29T06:00:00Z')).open, false)
  /* 20:00 UTC = 01:30 IST next day — outside both. */
  assert.equal(inWindow(WINDOWS, new Date('2026-08-29T20:00:00Z')).open, false)
})

test('window edges are inclusive at both ends', () => {
  assert.equal(inWindow(WINDOWS, new Date('2026-08-29T00:30:00Z')).open, true)  // 06:00 IST
  assert.equal(inWindow(WINDOWS, new Date('2026-08-29T04:30:00Z')).open, true)  // 10:00 IST
  assert.equal(inWindow(WINDOWS, new Date('2026-08-29T04:31:00Z')).open, false) // 10:01 IST
  assert.equal(inWindow(WINDOWS, new Date('2026-08-29T14:00:00Z')).open, true)  // 19:30 IST
  assert.equal(inWindow(WINDOWS, new Date('2026-08-29T14:01:00Z')).open, false) // 19:31 IST
})

test('windows are configurable, and nonsense is discarded rather than assumed', () => {
  assert.equal(parseWindows('09:00-11:00').length, 1)
  assert.equal(parseWindows('11:00-09:00').length, 0)
  assert.equal(parseWindows('not a window').length, 0)
})
