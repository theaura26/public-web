import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ComingSoon from '@/components/ComingSoon'
import { stubSlugs, labelFor } from '@/lib/site-nav'

/* Parts of The Reason that are named but not yet written. */

const PREFIX = '/reason'
const SECTION = 'The Reason'

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
  return <ComingSoon title={label} section={SECTION} sectionHref="/reason" />
}
