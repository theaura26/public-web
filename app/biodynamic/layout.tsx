import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Biodynamic',
  description:
    'Not a technique. A worldview. BD 500–508, Jeevamrit, Panchgavya, Beejamrit — Steiner discipline alongside Vedic agricultural science, with 52 Malnad Gidda cattle as the engine.',
  alternates: { canonical: '/biodynamic' },
  openGraph: {
    type: 'article',
    title: 'Biodynamic — Aura',
    description:
      'The herd is biological infrastructure. Two ancient farming intelligences on one estate.',
    images: ['/journals/biodynamic/aura-biodynamic.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biodynamic — Aura',
    description:
      'The herd is biological infrastructure. Two ancient farming intelligences on one estate.',
    images: ['/journals/biodynamic/aura-biodynamic.jpg'],
  },
}

export default function BiodynamicLayout({ children }: { children: ReactNode }) {
  return children
}
