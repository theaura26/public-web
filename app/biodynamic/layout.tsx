import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'A Living Organism',
  description:
    'A worldview worked as method. BD 500 to 508, Jeevamrit, Panchgavya and Beejamrit, made on the estate from a herd of about fifty and tested before use.',
  alternates: { canonical: '/biodynamic' },
  openGraph: {
    type: 'article',
    title: 'A Living Organism — Aura',
    description:
      'The herd is biological infrastructure. Two ancient farming intelligences on one estate.',
    images: ['/journals/biodynamic/aura-biodynamic.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A Living Organism — Aura',
    description:
      'The herd is biological infrastructure. Two ancient farming intelligences on one estate.',
    images: ['/journals/biodynamic/aura-biodynamic.jpg'],
  },
}

export default function BiodynamicLayout({ children }: { children: ReactNode }) {
  return children
}
