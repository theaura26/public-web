import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Our Coffee Story',
  description:
    'Six lots, one harvest. The same Arabica Sln.9 and Sln.795 at 3,600 ft under a four-story canopy — six fermentation methods, six cups. Anaerobic Natural, Dry Osmosis, Red Honey, Banana Wash, Solera Maceration, Solera Wash.',
  alternates: { canonical: '/coffee' },
  openGraph: {
    type: 'article',
    title: 'Our Coffee Story — Aura',
    description:
      'Six lots from one harvest. Terroir expressed through technique.',
    images: ['/journals/coffee/aura-our-coffee-story.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Coffee Story — Aura',
    description:
      'Six lots from one harvest. Terroir expressed through technique.',
    images: ['/journals/coffee/aura-our-coffee-story.jpg'],
  },
}

export default function CoffeeLayout({ children }: { children: ReactNode }) {
  return children
}
