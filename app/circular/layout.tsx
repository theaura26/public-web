import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* Page-specific metadata layout — /circular/page.tsx composes the
   article kit; this layout carries the title/description so the journal
   is distinct in search and when shared. */
export const metadata: Metadata = {
  title: 'Circular Intelligence',
  description:
    'Nature produces no waste, only relationships. How the herd’s dung and urine become 154,000 litres of Jeevamrit a year, tested before it touches soil.',
  alternates: { canonical: '/circular' },
  openGraph: {
    title: 'Circular Intelligence',
    description:
      'Compost is a biological communication network — how a landscape keeps its loop closed.',
    type: 'article',
    images: [{ url: '/aura-mudigere-landscape.jpg', width: 1600, height: 900, alt: 'Aura — compost as circular intelligence' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-mudigere-landscape.jpg'] },
}

export default function CircularLayout({ children }: { children: ReactNode }) {
  return children
}
