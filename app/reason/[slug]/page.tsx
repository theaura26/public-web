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
  return (
    <SubjectPage
      subject={p}
      basePath="/reason"
    />
  )
}
