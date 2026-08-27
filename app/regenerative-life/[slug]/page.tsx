import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SubjectPage from '@/components/SubjectPage'
import { DISCIPLINES, disciplineBySlug } from '@/lib/disciplines'

/* The nine disciplines, one route.
 *
 * A file each would be nine copies of one page differing only in their
 * prose, and the prose is data — see lib/disciplines.ts, which the
 * Remarkable Circle reads too, so the ring and the site cannot come to
 * disagree about what the nine are. `dynamicParams = false` keeps
 * anything not on the ring from resolving.
 */

export const dynamicParams = false

export function generateStaticParams() {
  return DISCIPLINES.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const d = disciplineBySlug(slug)
  if (!d) return { title: 'The Regenerative Life — Aura' }
  return {
    title: `${d.label} — The Regenerative Life`,
    description: d.lede,
    alternates: { canonical: `/regenerative-life/${d.slug}` },
    openGraph: { type: 'article', title: `${d.label} — Aura`, description: d.lede },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const d = disciplineBySlug(slug)
  if (!d) notFound()
  /* The other eight, in ring order starting from this one — so a reader
     leaves along the circle rather than back to an index. */
  const i = DISCIPLINES.indexOf(d)
  const siblings = [...DISCIPLINES.slice(i + 1), ...DISCIPLINES.slice(0, i)].map((x) => ({
    href: `/regenerative-life/${x.slug}`,
    title: x.label,
    description: x.lede,
    status: 'live' as const,
  }))

  return (
    <SubjectPage
      subject={{ ...d, siblings, siblingsLabel: 'The rest of the Regenerative Life' }}
      basePath="/regenerative-life"
    />
  )
}
