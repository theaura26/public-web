import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Fermentation',
  description:
    'Three fermentation disciplines, one estate. Coffee, pepper, and cow dung — pH every fifteen minutes, temperature three times daily, Brix start to end. Every lot a tracked individual, not an average.',
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
