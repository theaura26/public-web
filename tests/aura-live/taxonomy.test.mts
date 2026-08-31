import { test } from 'node:test'
import assert from 'node:assert/strict'
import { FEED_CATEGORIES, CATEGORY_LABEL, CATEGORY_BLURB, categoryHref } from '../../lib/aura-live/taxonomy'
import { SECTIONS } from '../../lib/site-nav'

/* The feed's subjects are the site's subjects.
 *
 * They are declared twice — once in the navigation, once in the feed —
 * because each needs them for a different reason, and this is the test
 * that stops the two copies drifting. If somebody adds a subject to the
 * Now section and not here, the feed silently has nowhere to file that
 * kind of event; if they add it here and not there, the entry links to a
 * page that does not exist.
 */

const now = SECTIONS.find((s) => s.id === 'now')
const navSubjects = (now?.items ?? []).filter((i) => i.href.startsWith('/now/'))

test('the Now section is where the taxonomy comes from', () => {
  assert.ok(now, 'the site should have a Now section')
  assert.ok(navSubjects.length > 0)
})

test('every feed category is a Now subject, in the same order', () => {
  assert.deepEqual(
    FEED_CATEGORIES.map((c) => categoryHref(c)),
    navSubjects.map((i) => i.href),
  )
})

test('every feed category uses the navigation’s own label', () => {
  for (const [i, category] of FEED_CATEGORIES.entries()) {
    assert.equal(CATEGORY_LABEL[category], navSubjects[i].label, `label drift on ${category}`)
  }
})

test('every category is described for the editorial policy', () => {
  for (const category of FEED_CATEGORIES) {
    assert.ok(CATEGORY_BLURB[category]?.length > 20, `${category} has no blurb`)
  }
})
