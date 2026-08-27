import type { Metadata } from 'next'
import SectionIndex from '@/components/SectionIndex'

export const metadata: Metadata = {
  title: 'The Regenerative Life',
  description: 'The nine disciplines the estate is farmed by.',
}

export default function Page() {
  return <SectionIndex id="life" />
}
