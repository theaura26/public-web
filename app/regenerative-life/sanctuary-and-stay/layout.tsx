import type { Metadata } from 'next'

export const metadata: Metadata = {
  /* Held back. The page is written and renders, and the menu names it
     under a Coming Soon marker; it stays out of search until it is
     published. Drop this line and the `soon` flag in lib/chapters.ts
     together. */
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  /* Title is a bare string — the root layout's title.template
     ('%s — Aura') appends the brand suffix. Including '— Aura' here
     produced 'Sanctuary — Aura — Aura' in the rendered <title>. */
  title: 'Sanctuary',
  description:
    'Aura Sanctuary — the land in rhythm. A 1000-year regenerative ecosystem across Mudigere, Ohara, and coming valleys in Munduk and Punakha.',
  alternates: { canonical: '/regenerative-life/sanctuary-and-stay' },
  openGraph: {
    type: 'article',
    title: 'Sanctuary — Aura',
    description: 'The land in rhythm. Mudigere, Ohara, and the valleys coming next.',
    images: [{ url: '/aura-sanctuary.jpg', width: 1600, height: 900, alt: 'Aura Sanctuary — the land in rhythm' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-sanctuary.jpg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
