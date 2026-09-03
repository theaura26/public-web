import type { Metadata } from 'next'

export const metadata: Metadata = {
  /* Bare string — the root layout's title.template appends the brand. */
  title: 'Sanctuaries',
  description:
    'Four valleys in two hemispheres. Mudigere in the Western Ghats and Ohara north of Kyoto are open and working; Munduk in Bali and Punakha in Bhutan are still being listened to.',
  alternates: { canonical: '/sanctuaries' },
  openGraph: {
    type: 'article',
    title: 'Sanctuaries — Aura',
    description:
      'Two working valleys and two being listened to. A sanctuary is a working piece of land first, and hospitality that sits inside an estate already running.',
    images: [
      {
        url: '/aura-mudigere.jpg',
        width: 1600,
        height: 900,
        alt: 'Mudigere — the Aura sanctuary in the Western Ghats',
      },
    ],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-mudigere.jpg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
