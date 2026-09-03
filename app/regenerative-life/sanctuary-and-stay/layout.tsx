import type { Metadata } from 'next'

export const metadata: Metadata = {
  /* Title is a bare string — the root layout's title.template
     ('%s — Aura') appends the brand suffix. Including '— Aura' here
     produced 'Sanctuary & Stay — Aura — Aura' in the rendered <title>. */
  title: 'Sanctuary & Stay',
  description:
    'Aura Sanctuary — the land in rhythm. A 1000-year regenerative ecosystem across Mudigere, Ohara, and coming valleys in Munduk and Punakha.',
  alternates: { canonical: '/regenerative-life/sanctuary-and-stay' },
  openGraph: {
    type: 'article',
    title: 'Sanctuary & Stay — Aura',
    description: 'The land in rhythm. Mudigere, Ohara, and the valleys coming next.',
    images: [{ url: '/aura-sanctuary.jpg', width: 1600, height: 900, alt: 'Aura Sanctuary — the land in rhythm' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-sanctuary.jpg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
