import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Flowering Understory',
  description: 'Coffee flowers for about three days a year. What feeds everything else for the other fifty-one weeks is the flowering ground layer, and six invasive plants are taking it.',
  alternates: { canonical: '/pollinators' },
  openGraph: {
    type: 'article',
    title: 'The Flowering Understory — Aura',
    description: 'Coffee flowers for about three days a year. What feeds everything else for the other fifty-one weeks is the flowering ground layer, and six invasive plants are taking it.',
    images: [{ url: '/pollinators/images/aura-the-flowering-understory-01.webp', width: 1920, height: 1080, alt: 'The Flowering Understory — Aura' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-placeholder.svg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
