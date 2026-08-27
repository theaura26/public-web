import type { Metadata } from 'next'
import { guardComingSoon, comingSoonMetadata } from '@/lib/coming-soon'

export const metadata: Metadata = {
  title: 'Regenerative Coffee',
  description:
    'Coffee that leaves the land better than it found it. Biodynamic, transparent, flavourful — one estate, one harvest, nine lots. Sampigekhan Estate, Mudigere.',
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
  /* Not live yet — tell crawlers to skip these URLs in case any were
     already seen while the section was briefly reachable. */
  ...comingSoonMetadata,
}

export default function RegenerativeCoffeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /* Held back from launch. 404s in every deployed environment — production
     AND Vercel preview — while staying reachable under `next dev`, so the
     section can keep being built against the live design system. Remove
     this call to ship it. */
  guardComingSoon()
  return <>{children}</>
}
