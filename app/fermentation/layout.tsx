import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Controlled Decay',
  description:
    'Desired microbial activity, held to a number — coffee, pepper and cow dung, each stopped when the reading says so.',
  alternates: { canonical: '/fermentation' },
  openGraph: {
    type: 'article',
    title: 'Fermentation — Aura',
    description:
      'Patience made visible. The slow work, in the dark, recorded with integrity.',
    images: ['/journals/fermentation/aura-fermentation.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fermentation — Aura',
    description:
      'Patience made visible. The slow work, in the dark, recorded with integrity.',
    images: ['/journals/fermentation/aura-fermentation.jpg'],
  },
}

export default function FermentationLayout({ children }: { children: ReactNode }) {
  return children
}
