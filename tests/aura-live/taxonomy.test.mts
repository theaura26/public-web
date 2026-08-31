import { test } from 'node:test'
import assert from 'node:assert/strict'
import { FEED_CATEGORIES, CATEGORY_LABEL, CATEGORY_BLURB, categoryHref } from '../../lib/aura-live/taxonomy'
import { SECTIONS } from '../../lib/site-nav'

/* The feed's subjects stand on their own.
 *
 * They used to be declared twice — once as the thirteen items of the Now
 * section, once here — and these tests were what stopped the two copies
 * drifting. That section is gone: /now is the feed itself rather than an
 * index in front of it, so there is no second list to drift from and
 * every category links to /now.
 *
 * What still needs guarding is the taxonomy's own coherence: every
 * category is labelled, described, and points somewhere real.
 */

test('every category has a label', () => {
  for (const category of FEED_CATEGORIES) {
    assert.ok(CATEGORY_LABEL[category]?.length > 1, `${category} has no label`)
  }
})

test('no two categories share a label', () => {
  const labels = FEED_CATEGORIES.map((c) => CATEGORY_LABEL[c])
  assert.equal(new Set(labels).size, labels.length, 'duplicate category label')
})

test('every category points at the feed', () => {
  /* Now is the feed, not an index of subjects — there is no per-subject
     page to link to, and categoryHref is the one place that changes if
     subject pages are ever written. */
  for (const category of FEED_CATEGORIES) {
    assert.equal(categoryHref(category), '/now', `${category} links elsewhere`)
  }
})

test('the Now section is reachable and carries no stale subject list', () => {
  const now = SECTIONS.find((s) => s.id === 'now')
  assert.ok(now, 'the site should have a Now section')
  assert.equal(now?.href, '/now')
  assert.equal(
    (now?.items ?? []).filter((i) => i.href.startsWith('/now/')).length,
    0,
    'the Now section should not list subject pages — /now is the feed',
  )
})

test('every category is described for the editorial policy', () => {
  for (const category of FEED_CATEGORIES) {
    assert.ok(CATEGORY_BLURB[category]?.length > 20, `${category} has no blurb`)
  }
})
