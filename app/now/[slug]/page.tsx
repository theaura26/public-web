import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ComingSoon from '@/components/ComingSoon'
import { stubSlugs, labelFor } from '@/lib/site-nav'

/* Stubs for the parts of Now that are in the structure but not
   yet written. One route rather than a file each: the list lives in
   lib/site-nav.ts, and `dynamicParams = false` means anything not on
   that list still 404s rather than quietly rendering a placeholder. */

const PREFIX = '/now'
const SECTION = 'Now'

export const dynamicParams = false

export function generateStaticParams() {
  return stubSlugs(PREFIX).map((slug) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const label = labelFor(`${PREFIX}/${slug}`)
  return {
    title: label ? `${label} — ${SECTION}` : SECTION,
    description: `${label ?? SECTION} — not yet written.`,
    robots: { index: false, follow: true },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const label = labelFor(`${PREFIX}/${slug}`)
  if (!label) notFound()
  return <ComingSoon title={label} section={SECTION} sectionHref={PREFIX} />
}
