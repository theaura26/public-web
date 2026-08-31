import { CHAPTERS, chapterHref } from './chapters'
import { CATEGORIES, notesIn } from './field-notes'

/* The site's structure, in one place.
 *
 * The navigation, the coming-soon stub routes and the sitemap are all
 * generated from this, so they cannot drift apart. Adding a page here is
 * what makes it appear in the menu AND gives it a URL that resolves;
 * removing `soon` is what turns the stub into the real thing.
 *
 * `soon: true` means the item is part of the structure but has no page
 * written yet. It still gets a URL — a stub renders there — because a
 * menu item that goes nowhere is worse than one that goes somewhere
 * honest.
 */

export type NavLeaf = {
  label: string
  href: string
  /** Set beside the label where the label alone is not enough — a
      translation, or the thing the word actually means. Shown on the
      section index; the menu lists labels only. */
  note?: string
  /** No page written yet. Renders a stub at `href`. */
  soon?: boolean
  /** Named in the structure, but with no page at all — not even a stub.
      Rendered as plain text rather than a link, and kept out of
      generateStaticParams and the sitemap. Use for something that is
      announced before it is a place: a sanctuary that does not open for
      another year has nothing to say yet, and a stub saying so is a
      page nobody needs. */
  disabled?: boolean
  /** The tier beneath this one, revealed on hover. A parent with
      children is a subject; its children are variants of it — the
      seasons of a crop, the parts of a place. */
  children?: NavLeaf[]
}

export type NavSection = {
  id: string
  label: string
  /** Hidden from the section row. Still routed, still in the sitemap —
      Now is reached through the Live indicator instead of a tab. */
  offTabs?: boolean
  /** The section's own landing page, when it has one. */
  href?: string
  /** One line under the section name in the menu. */
  note?: string
  items: NavLeaf[]
}

export const SECTIONS: NavSection[] = [
  {
    id: 'life',
    label: 'Regenerative Life',
    /* No landing page. The section is eight chapters, and an index in
       front of them was a page whose only content was the menu the
       reader had just used. `sectionFor` still marks the tab on a
       chapter page — it matches the leaves before it looks at the
       section, and every chapter is a leaf. */
    note: 'The estate in eight chapters.',
    /* Generated from lib/chapters.ts so the menu, the index page and the
       eleven pages cannot come to disagree about what the chapters are.
       No children: each chapter is one page, and where it has a fuller
       treatment elsewhere on the site the page links out to it. */
    /* chapterHref, not a built path: five of the nine ARE pages the site
       already had — The Reason is /reason, RTA is /rta — and the menu
       sends a reader to the real one rather than to a shorter retelling
       of it under /regenerative-life. */
    items: CHAPTERS.map((c) => ({
      label: c.label,
      href: chapterHref(c),
      note: c.subtitle,
    })),
  },

  {
    id: 'notes',
    label: 'Field Notes',
    href: '/field-notes',
    note: 'What the estate has learned, written down.',
    /* Generated from lib/field-notes.ts, which files every note under a
       Regenerative Life chapter. This list used to be maintained by hand
       beside that one and had already drifted from it — /areca and
       /pepper were listed here as live children while the taxonomy had
       them as unwritten. Two lists of the same thing is one list too
       many. */
    items: [
      ...CATEGORIES.map((c) => ({
        label: c.label,
        href: `/field-notes/${c.id}`,
        children: notesIn(c.id).map((n) => ({
          label: n.title,
          href: n.href,
          soon: n.status === 'soon',
        })),
      })),
      { label: 'View all', href: '/field-notes' },
    ],
  },
  {
    id: 'shop',
    label: 'From Aura',
    href: '/from-aura',
    note: 'What the land produced, and what it is doing now.',
    /* By product, as it was. The page groups the same things by who is
       buying — the land, the atelier, the trade desk — and that reading
       works on a page with room to explain it. In a menu a reader is
       looking for a thing, not a relationship, so the menu lists things.
       lib/from-aura.ts holds the page’s grouping. */
    items: [
      {
        label: 'Coffee',
        href: '/from-aura/coffee',
        soon: true,
        children: [
          { label: '2025–26 Lots', href: '/from-aura/coffee-25-26', soon: true },
          { label: 'No.1 Experimental Coffee in India', href: '/from-aura/coffee-experimental', soon: true },
          { label: 'Pre-book 2026–27', href: '/from-aura/coffee-26-27', soon: true },
          { label: 'Book Block & Zone', href: '/from-aura/coffee-blocks-and-zones', soon: true },
        ],
      },
      {
        label: 'Tea',
        href: '/from-aura/tea',
        soon: true,
        children: [
          { label: '27/28 — pre-book', href: '/from-aura/tea-27-28', soon: true },
        ],
      },
      /* Pepper, areca and the farm goods were three headings for one
         thing: what the land grows besides the two crops the estate is
         named for. Their season variants came off with them — the menu
         renders two tiers, and a crop’s years are a third. They belong
         on the crop’s own page. */
      {
        label: 'From the Farm',
        href: '/from-aura/from-the-farm',
        soon: true,
        children: [
          { label: 'Pepper', href: '/from-aura/pepper', soon: true },
          { label: 'Areca nut', href: '/from-aura/areca', soon: true },
          { label: 'Avocado', href: '/from-aura/avocado', soon: true },
          { label: 'Cardamom', href: '/from-aura/cardamom', soon: true },
          { label: 'Soapnut', href: '/from-aura/soapnut', soon: true },
          { label: 'Honey', href: '/from-aura/honey', soon: true },
        ],
      },
      {
        label: 'Objects & Editions',
        href: '/from-aura/objects',
        soon: true,
        children: [
          { label: 'Art', href: '/from-aura/art', soon: true },
          { label: 'Fashion', href: '/from-aura/fashion', soon: true },
          { label: 'Stationery', href: '/from-aura/stationery', soon: true },
        ],
      },
      {
        label: 'Experiences',
        href: '/from-aura/experiences',
        soon: true,
        children: [
          { label: 'Artist residencies', href: '/residency' },
          { label: 'Farm tours', href: '/from-aura/farm-tours', soon: true },
          { label: 'Harvest tours', href: '/from-aura/harvest-tours', soon: true },
        ],
      },
      { label: 'View all', href: '/from-aura' },
    ],
  },
  {
    id: 'now',
    label: 'Now',
    offTabs: true,
    href: '/now',
    note: 'Mudigere, as it is today.',
    /* No items. Now is not an index any more — it is the Aura Live feed
       itself, generated from the estate record on a schedule. It used to
       list thirteen subjects, none of which were ever written, and a
       reader clicking "what is happening today" wants the feed rather
       than a menu in front of it. */
    items: [],
  },
]

/** Every stub URL under a given prefix, for generateStaticParams. */
function flatten(items: NavLeaf[]): NavLeaf[] {
  return items.flatMap((i) => (i.children ? [i, ...i.children] : [i]))
}

/** Every item in the site, parents and children alike. */
export const ALL_LEAVES: NavLeaf[] = SECTIONS.flatMap((s) => flatten(s.items))

export function stubSlugs(prefix: string): string[] {
  return ALL_LEAVES
    .filter((i) => i.soon && !i.disabled && i.href.startsWith(`${prefix}/`))
    .map((i) => i.href.slice(prefix.length + 1))
}

/** The label a stub URL should announce. */
export function labelFor(href: string): string | null {
  for (const s of SECTIONS) {
    for (const i of s.items) {
      if (i.href === href) return i.label
      for (const c of i.children ?? []) if (c.href === href) return `${i.label} — ${c.label}`
    }
  }
  return null
}

/** Which section a path belongs to, for marking the menu. */
export function sectionFor(pathname: string): string | null {
  let best: { id: string; len: number } | null = null
  for (const s of SECTIONS) {
    for (const i of flatten(s.items)) {
      if (pathname === i.href || pathname.startsWith(`${i.href}/`)) {
        if (!best || i.href.length > best.len) best = { id: s.id, len: i.href.length }
      }
    }
    if (s.href && (pathname === s.href || pathname.startsWith(`${s.href}/`))) {
      if (!best || s.href.length > best.len) best = { id: s.id, len: s.href.length }
    }
  }
  return best?.id ?? null
}

/** The sections that appear as tabs. */
export const TABS = SECTIONS.filter((s) => !s.offTabs)
