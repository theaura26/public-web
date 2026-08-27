import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DisciplinePage from '@/components/DisciplinePage'
import { DISCIPLINES, disciplineBySlug } from '@/lib/disciplines'

/* The nine disciplines, one route.
 *
 * A file each would be nine copies of the same page differing only in
 * their prose, and the prose is data — see lib/disciplines.ts, which the
 * Remarkable Circle reads too. `dynamicParams = false` keeps anything
 * not on the ring from resolving.
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
    openGraph: {
      type: 'article',
      title: `${d.label} — Aura`,
      description: d.lede,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const d = disciplineBySlug(slug)
  if (!d) notFound()
  return <DisciplinePage d={d} />
}
