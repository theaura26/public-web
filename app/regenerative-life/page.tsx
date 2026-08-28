import type { Metadata } from 'next'
import SectionIndex from '@/components/SectionIndex'

export const metadata: Metadata = {
  title: 'The Regenerative Life',
  description: 'The nine disciplines the estate is farmed by.',
  /* Without this the root layout's canonical is inherited, and an index
     page declares itself a duplicate of the homepage. */
  alternates: { canonical: '/regenerative-life' },
}

export default function Page() {
  return <SectionIndex id="life" />
}
