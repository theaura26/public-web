import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SubjectPage from '@/components/SubjectPage'
import { PILLARS, pillarBySlug } from '@/lib/pillars'

/* Natural Intelligence and the two pillars it is practised as.
 *
 * Same arrangement as /regenerative-life/[slug]: the prose is data, and
 * one route renders it. `dynamicParams = false` keeps anything not in
 * lib/pillars.ts from resolving.
 */

export const dynamicParams = false

export function generateStaticParams() {
  return PILLARS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const p = pillarBySlug(slug)
  if (!p) return { title: 'The Reason — Aura' }
  return {
    title: `${p.label} — The Reason`,
    description: p.lede,
    alternates: { canonical: `/reason/${p.slug}` },
    openGraph: { type: 'article', title: `${p.label} — Aura`, description: p.lede },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = pillarBySlug(slug)
  if (!p) notFound()
  const i = PILLARS.findIndex((x) => x.id === p.id)
  return (
    <SubjectPage
      subject={p}
      eyebrow={`The Reason · ${String(i + 1).padStart(2, '0')} of ${PILLARS.length}`}
      prev={PILLARS[(i - 1 + PILLARS.length) % PILLARS.length]}
      next={PILLARS[(i + 1) % PILLARS.length]}
      basePath="/reason"
      allLabel="The Reason"
      allHref="/reason"
    />
  )
}
