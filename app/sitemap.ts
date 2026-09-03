import type { MetadataRoute } from 'next'
import { ACTIVE_JOURNALS } from '@/lib/journals'
import { SECTIONS, ALL_LEAVES } from '@/lib/site-nav'
import { CATEGORIES } from '@/lib/field-notes'

/* Public pages the navigation does not carry. Contact lives in the
   menu’s corner rather than in a section list; the coffee microsite has
   its own sub-nav; /brand is linked from within pages. All
   are indexable, so all belong here — a page being absent from the menu
   is not a reason to hide it from search.

   /mudigere-estate is deliberately absent: it is noindex. */
const OFF_MENU = [
  '/contact',
  /* The four valleys on one page: what a sanctuary is for, which two are
     open and why the other two are closed. A different page from the
     Sanctuary & Stay chapter under /regenerative-life, which the menu
     carries as one of the eight. Listed here because the section lists
     do not reach this one. */
  '/sanctuaries',
  /* Privacy is reached from the footer rather than the menu. It is
     index:true, so it belongs here. */
  '/privacy',
  '/brand',
  /* The Atelier is linked from the footer under the brand rather than
     from the menu, so ALL_LEAVES does not carry it. It is index:true. */
  '/atelier',
  '/regenerative-coffee',
  '/regenerative-coffee/biodynamic',
  '/regenerative-coffee/transparency',
  '/regenerative-coffee/flavour',
  '/regenerative-coffee/experience',
]

/* The sitemap is derived, not maintained.
 *
 * Two sources, both already the truth for something else: lib/journals.ts
 * says what is published, and lib/site-nav.ts says what the site's
 * structure is. Adding a page to either registers it here, which is the
 * only way a hand-kept list of URLs stays correct for longer than a week.
 *
 * Pages marked `soon` are deliberately absent. They render a stub that
 * says so and carry `robots: noindex`, and a sitemap is a claim that a
 * URL is worth indexing — listing a placeholder would make that claim
 * falsely and spend crawl budget on nothing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://theaura.life'
  const now = new Date()

  const entry = (href: string, priority: number) => ({
    url: `${base}${href}`,
    lastModified: now,
    /* Everything on this site is written and then left alone, except the
       live feed, which the scheduled job rewrites. */
    changeFrequency: (href === '/now' ? 'daily' : 'monthly') as 'daily' | 'monthly',
    priority,
  })

  /* Section landing pages — the five destinations the menu is built on. */
  const sections = SECTIONS.filter((s) => s.href).map((s) => entry(s.href as string, 0.8))

  /* Every written page named anywhere in the navigation. `soon` items are
     filtered out, and /mudigere is promoted below rather than listed at
     the default weight. */
  const navPages = ALL_LEAVES
    .filter((i) => !i.soon)
    .map((i) => i.href)
    .filter((href) => href !== '/mudigere')

  const journals = ACTIVE_JOURNALS.map((j) => j.href)

  /* Field Notes categories that are written. The menu shows a wider set
     of category names than lib/field-notes has pages for; only the
     written ones are claimed here. */
  const categories = CATEGORIES.map((c) => `/field-notes/${c.id}`)

  /* One entry per URL. A note cross-listed in three categories is still
     one page, and the coffee microsite’s pages appear in the nav and in
     journals both. */
  const seen = new Set<string>(['/', '/mudigere', ...sections.map((s) => s.url.replace(base, ''))])
  const pages: MetadataRoute.Sitemap = []
  for (const href of [...navPages, ...journals, ...categories, ...OFF_MENU]) {
    if (seen.has(href)) continue
    seen.add(href)
    pages.push(entry(href, 0.7))
  }

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    /* The estate — a flagship destination, public and indexable
       (app/mudigere/layout.tsx is index:true). /mudigere-estate stays
       private: it is noindex and deliberately not listed here. */
    { url: `${base}/mudigere`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    ...sections,
    ...pages,
  ]
}
