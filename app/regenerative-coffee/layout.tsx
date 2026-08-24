import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regenerative Coffee',
  description:
    'Coffee that leaves the land better than it found it. Biodynamic, transparent, flavourful — one estate, one harvest, six lots. Sampigekhan Estate, Mudigere.',
  alternates: { canonical: '/regenerative-coffee' },
  openGraph: {
    title: 'Aura — Regenerative Coffee',
    description:
      'Coffee that leaves the land better than it found it. One remarkable circle.',
    images: ['/journals/coffee/aura-our-coffee-story.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura — Regenerative Coffee',
    description:
      'Coffee that leaves the land better than it found it. One remarkable circle.',
    images: ['/journals/coffee/aura-our-coffee-story.jpg'],
  },
}

export default function RegenerativeCoffeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
