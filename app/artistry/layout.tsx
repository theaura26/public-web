import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* Page-specific metadata layout — /artistry/page.tsx is a client
   component ('use client'), so it can’t export `metadata` itself.
   Without this layout the page inherited the root layout’s default
   title ('Aura — The 1000-Year Idea'), making it invisible in
   search results and indistinguishable from the home page. */
export const metadata: Metadata = {
  title: 'Artistry — A space to make',
  description:
    'A space for creators to make. Six studios cut from the Aura estate — ceramics, textile, joinery, field recording, type, and code — and what leaves them.',
  alternates: { canonical: '/artistry' },
  openGraph: {
    title: 'Artistry — A space to make',
    description:
      'Six studios cut from the Aura estate, where creators come to make what only this ground allows.',
    type: 'article',
    images: [{ url: '/aura-artistry.jpg', width: 1600, height: 900, alt: 'Aura artistry — the studios where creators come to make' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-artistry.jpg'] },
}

export default function ArtistryLayout({ children }: { children: ReactNode }) {
  return children
}
