import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Larder',
  description: 'Coffee flowers for about three days a year. What feeds everything else for the other fifty-one weeks is the flowering ground layer, and six invasive plants are taking it.',
  alternates: { canonical: '/pollinators' },
  openGraph: {
    type: 'article',
    title: 'The Larder — Aura',
    description: 'Coffee flowers for about three days a year. What feeds everything else for the other fifty-one weeks is the flowering ground layer, and six invasive plants are taking it.',
    images: [{ url: '/aura-placeholder.svg', width: 1600, height: 900, alt: 'The Larder — Aura' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-placeholder.svg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
