import type { Metadata } from 'next'

export const metadata: Metadata = {
  /* Bare string — the root layout's title.template appends the brand. */
  title: 'Sanctuaries',
  description:
    'Places safe enough to think in generations. Four valleys in two hemispheres where mind, body and soul stay in one piece — Mudigere and Ohara open and working, Munduk and Punakha still being listened to.',
  alternates: { canonical: '/sanctuaries' },
  openGraph: {
    type: 'article',
    title: 'Sanctuaries — Aura',
    description:
      'A sanctuary is a place safe enough to think in generations, and to make something nobody has made yet. Two working valleys, and two still being listened to.',
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
