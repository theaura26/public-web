import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Fermentation',
  description:
    'Three fermentation disciplines on one estate: coffee, pepper and cow dung. pH every fifteen minutes, temperature three times a day, and a number that ends it.',
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
