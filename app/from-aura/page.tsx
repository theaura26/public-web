import type { Metadata } from 'next'
import SectionIndex from '@/components/SectionIndex'

export const metadata: Metadata = {
  title: 'From Aura — Aura',
  description: 'What the land produced, and what it is doing now.',
}

export default function Page() {
  return <SectionIndex id="shop" />
}
