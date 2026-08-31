import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Our Bean Story',
  description:
    'Six lots, one harvest. The same Arabica at 3,600 ft under a four-storey canopy, put through six fermentation methods — and the six cups that come out.',
  alternates: { canonical: '/coffee' },
  openGraph: {
    type: 'article',
    title: 'Our Bean Story — Aura',
    description:
      'Six lots from one harvest. Terroir expressed through technique.',
    images: ['/journals/coffee/aura-our-coffee-story.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Bean Story — Aura',
    description:
      'Six lots from one harvest. Terroir expressed through technique.',
    images: ['/journals/coffee/aura-our-coffee-story.jpg'],
  },
}

export default function CoffeeLayout({ children }: { children: ReactNode }) {
  return children
}
