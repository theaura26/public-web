import type { Metadata } from 'next'
import { comingSoonMetadata, guardComingSoon } from '@/lib/coming-soon'

export const metadata: Metadata = {
  /* Title is a bare string — the root layout's title.template
     ('%s — Aura') appends the brand suffix. Including '— Aura' here
     produced 'Sanctuary — Aura — Aura' in the rendered <title>. */
  title: 'Sanctuary',
  description:
    'Aura Sanctuary — the land in rhythm. A 1000-year regenerative ecosystem across Mudigere, Ohara, and coming valleys in Munduk and Daylesford.',
  alternates: { canonical: '/sanctuary' },
  openGraph: {
    type: 'article',
    title: 'Sanctuary — Aura',
    description: 'The land in rhythm. Mudigere, Ohara, and the valleys coming next.',
    images: [{ url: '/aura-sanctuary.jpg', width: 1600, height: 900, alt: 'Aura Sanctuary — the land in rhythm' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-sanctuary.jpg'] },
  ...comingSoonMetadata,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  guardComingSoon()
  return children
}
