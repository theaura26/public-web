import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SubjectPage from '@/components/SubjectPage'
import { CHAPTERS, CHAPTER_PAGES, chapterBySlug, chapterHref } from '@/lib/chapters'

/* The chapters that own a page here, on one route.
 *
 * Five of the eight are pages the site already had and keep their own
 * files; this route serves the three composed from lib/chapters.ts.
 * A file each would be three copies of one page differing only in their
 * prose, and the prose is data — see lib/chapters.ts, which composes the
 * chapters from the audited entries in lib/disciplines.ts.
 * `dynamicParams = false` keeps anything not a chapter from resolving.
 */

/** One card image per chapter, chosen for the subject. */
const OG: Record<string, string> = {
  'the-plantation': '/aura-agroculture.jpg',
  'vedic-and-biodynamic': '/aura-biodynamic.jpg',
  'aura-intelligence': '/aura-land.jpg',
}

export const dynamicParams = false

export function generateStaticParams() {
  return CHAPTER_PAGES().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const d = chapterBySlug(slug)
  if (!d || d.href) return { title: 'The Regenerative Life — Aura' }
  return {
    title: `${d.label} — The Regenerative Life`,
    description: d.lede,
    alternates: { canonical: `/regenerative-life/${d.slug}` },
    /* Declaring openGraph here replaces the root layout's block, so the
       image has to be restated or the card shares with none. */
    openGraph: {
      type: 'article',
      title: `${d.label} — Aura`,
      description: d.lede,
      url: `/regenerative-life/${d.slug}`,
      images: [OG[d.slug] ?? '/og-hello.jpg'],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const d = chapterBySlug(slug)
  /* Chapters that are an existing page have no route here. */
  if (!d || d.href) notFound()
  /* The other ten, in reading order starting from the one after this —
     so a reader carries on through the sequence rather than going back
     to an index. */
  const i = CHAPTERS.indexOf(d)
  const siblings = [...CHAPTERS.slice(i + 1), ...CHAPTERS.slice(0, i)].map((x) => ({
    href: chapterHref(x),
    title: x.label,
    /* The card is the chapter's own photograph and its name. The lede
       under it made every card a paragraph, and eight of those read as a
       contents page rather than as a row of doors. */
    img: x.card ?? (x.hero?.mediaType === 'video' ? x.hero.poster : x.hero?.src),
    status: 'live' as const,
  }))

  return (
    <SubjectPage
      subject={{ ...d, siblings, variant: i }}
      basePath="/regenerative-life"
    />
  )
}
