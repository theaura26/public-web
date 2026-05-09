import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Vedic Farming — Knowledge Older Than The Rulebook — Aura',
  description:
    'Vrikshayurveda in practice. Jeevamrit, Panchgavya, Beejamrit, Kunapjal, Matka Khad. Five-cow tonics fermented in clay. The ancestral layer beneath the Steiner layer — older than the word organic.',
  openGraph: {
    title: 'Vedic Farming — Knowledge older than the institutions that study it.',
    description:
      'Vrikshayurveda, microbial inoculants, mycorrhizal networks. How Aura builds the land.',
    type: 'article',
  },
}

export default function VedicLayout({ children }: { children: ReactNode }) {
  return children
}
