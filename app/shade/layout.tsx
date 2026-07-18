import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* Page-specific metadata layout — /shade/page.tsx composes the article
   kit; this layout carries the title/description so the journal is
   distinct in search and when shared. Mirrors lib/journals.ts. */
export const metadata: Metadata = {
  title: 'The Light Instrument',
  description:
    'Aura reads light as a material — shade whiskering measured in lux and hours, an old canopy craft cut to prescription and validated against its own numbers.',
  alternates: { canonical: '/shade' },
  openGraph: {
    title: 'The Light Instrument — Aura',
    description:
      'Shade whiskering, measured in lux. An old canopy craft, cut to prescription and validated against its own numbers.',
    type: 'article',
    images: [{ url: '/aura-land.jpg', width: 1600, height: 900, alt: 'Aura — light read as a material under the canopy' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-land.jpg'] },
}

export default function ShadeLayout({ children }: { children: ReactNode }) {
  return children
}
