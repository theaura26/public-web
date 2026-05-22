import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'The Land',
  description:
    'Land is ancestry. 150 acres in the Western Ghats — laterite soil, monsoon rhythm, four-story canopy — in dialogue with a second estate in Ohara, Kyoto.',
  alternates: { canonical: '/land' },
  openGraph: {
    type: 'article',
    title: 'The Land — Aura',
    description:
      'Mudigere and Ohara, in dialogue. The East-East axis at the heart of the estate.',
    images: ['/journals/land/aura-the-land.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Land — Aura',
    description:
      'Mudigere and Ohara, in dialogue. The East-East axis at the heart of the estate.',
    images: ['/journals/land/aura-the-land.jpg'],
  },
}

export default function LandLayout({ children }: { children: ReactNode }) {
  return children
}
