import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  /* Root layout's title.template appends '— Aura'; suffix removed to
     prevent double-up. */
  title: 'Vedic Farming — Knowledge Older Than The Rulebook',
  description:
    'Vrikshayurveda in practice. Jeevamrit, Panchgavya, Beejamrit, Kunapjal and Matka Khad — five-cow tonics fermented in clay, made on the estate.',
  alternates: { canonical: '/vedic' },
  openGraph: {
    title: 'Vedic Farming — Knowledge older than the institutions that study it.',
    description:
      'Vrikshayurveda, microbial inoculants, mycorrhizal networks. How Aura builds the land.',
    type: 'article',
    images: [{ url: '/aura-vedic.jpg', width: 1600, height: 900, alt: 'Aura Vedic farming — ancient agricultural science in practice' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-vedic.jpg'] },
}

export default function VedicLayout({ children }: { children: ReactNode }) {
  return children
}
