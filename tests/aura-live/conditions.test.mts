import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rainCaption } from '../../lib/aura-live/conditions'

/* The rain line read "since June — rain on all but 3 days" off a series
   that began on 7 July.

   The forecast endpoint returns null for the far end of its 92-day
   window. Nulls are dropped from the series because a gap cannot be
   plotted, and the shortened array was then counted as the season — so
   the denominator silently became "days we happen to have" while the
   sentence still said "since June". Five dry days out of 96 was
   published as three out of 60, and 1253 mm of monsoon as 598.

   These hold the line to what it can actually see. */

test('a whole record may say "since June"', () => {
  const c = rainCaption({
    seasonDays: 96, seasonWetDays: 91, seasonSpanDays: 96,
    seasonFrom: '2026-06-01', seasonTo: '2026-09-04',
  })
  assert.equal(c, 'since June — over 1 mm on all but 5 days')
})

test('a record with a hole in it names the window it actually covers', () => {
  const c = rainCaption({
    seasonDays: 60, seasonWetDays: 57, seasonSpanDays: 96,
    seasonFrom: '2026-07-07', seasonTo: '2026-09-04',
  })
  assert.ok(!/since June/.test(c), 'it must not claim a month it has no reading for')
  assert.equal(c, '7 Jul–4 Sep — over 1 mm on all but 3 days')
})

test('the threshold is stated, not hidden inside the word "rain"', () => {
  const c = rainCaption({
    seasonDays: 96, seasonWetDays: 91, seasonSpanDays: 96,
    seasonFrom: '2026-06-01', seasonTo: '2026-09-04',
  })
  assert.match(c, /over 1 mm/, 'a 0.9 mm day is not dry to anyone standing in it')
})

test('a season with no dry day says so without an "all but 0"', () => {
  const c = rainCaption({
    seasonDays: 96, seasonWetDays: 96, seasonSpanDays: 96,
    seasonFrom: '2026-06-01', seasonTo: '2026-09-04',
  })
  assert.equal(c, 'since June — over 1 mm every day')
})

test('one dry day is a day, not days', () => {
  const c = rainCaption({
    seasonDays: 96, seasonWetDays: 95, seasonSpanDays: 96,
    seasonFrom: '2026-06-01', seasonTo: '2026-09-04',
  })
  assert.match(c, /all but 1 day$/)
})
