import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* Page-specific metadata layout — /circular/page.tsx composes the
   article kit; this layout carries the title/description so the journal
   is distinct in search and when shared. */
export const metadata: Metadata = {
  title: 'Circular Intelligence',
  description:
    'Circular intelligence, told through compost. Nature produces no waste — only relationships. How manure becomes a biological network that rebuilds soil, water, carbon and resilience, and why Aura composts to restore relationships rather than add nutrients. Evidence-first; honest about what the science is still settling.',
  alternates: { canonical: '/circular' },
  openGraph: {
    title: 'Circular Intelligence',
    description:
      'Compost is not fertiliser. It is a biological communication network — how a landscape keeps the loop closed.',
    type: 'article',
    images: [{ url: '/aura-mudigere-landscape.jpg', width: 1600, height: 900, alt: 'Aura — compost as circular intelligence' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-mudigere-landscape.jpg'] },
}

export default function CircularLayout({ children }: { children: ReactNode }) {
  return children
}
