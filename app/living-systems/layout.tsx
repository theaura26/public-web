import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Living Systems',
  description:
    'A forest that produces crops. 150 acres of four-story polyculture in the Western Ghats — canopy, mid-canopy, primary crop, understorey — read as a single living dataset with 52 Malnad Gidda cattle, beehives, and nine streams of continuous data.',
  alternates: { canonical: '/living-systems' },
  openGraph: {
    type: 'article',
    title: 'Living Systems — Aura',
    description:
      'Four canopy stories, one organism. The estate as a living dataset.',
    images: ['/journals/living-systems/aura-living-systems.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Living Systems — Aura',
    description:
      'Four canopy stories, one organism. The estate as a living dataset.',
    images: ['/journals/living-systems/aura-living-systems.jpg'],
  },
}

export default function LivingSystemsLayout({ children }: { children: ReactNode }) {
  return children
}
