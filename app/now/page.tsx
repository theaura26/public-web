import type { Metadata } from 'next'
import SectionIndex from '@/components/SectionIndex'

export const metadata: Metadata = {
  title: 'Now',
  description: 'Mudigere, as it is today.',
  alternates: { canonical: '/now' },
}

export default function Page() {
  return <SectionIndex id="now" />
}
